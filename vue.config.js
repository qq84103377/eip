const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const path = require("path");
const resolve = dir => path.join(__dirname, dir);
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // gzip 压缩的文件

module.exports = {
  publicPath: "./", // 默认'/'，部署应用包时的基本 URL
  outputDir: "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  configureWebpack: config => {
    const plugins = [];
    if (IS_PROD) {
      // 设置引入 cdn 的资源
      // config.externals = {
      //   vue: "Vue",
      //   "element-ui": "ELEMENT",
      //   "vue-router": "VueRouter",
      //   vuex: "Vuex",
      //   axios: "axios"
      // };
      // 单独打包第三方包
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: "chunk-common",
              chunks: "initial",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            },
            elementUI: {
              name: "chunk-elementui",
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: "all",
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
      // 开启gzip压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
    config.plugins = [...config.plugins, ...plugins];
  },
  chainWebpack: config => {
    //关闭预加载
    config.plugins.delete('prefetch')

    // 修复 热更新HMR
    config.resolve.symlinks(true);
    // 添加别名
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@assets", resolve("src/assets"))
      // .set("@scss", resolve("src/assets/scss"))
      .set("@components", resolve("src/components"))
      .set("@mixins", resolve("src/mixins"))
      .set("@plugins", resolve("src/plugins"))
      .set("@router", resolve("src/router"))
      .set("@store", resolve("src/store"))
      .set("@utils", resolve("src/utils"))
      .set("@views", resolve("src/views"));

    if (IS_PROD) {
      // 引入 cdn 资源
      // const cdn = {
      //   // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      //   css: ["//unpkg.zhimg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
      //   js: [
      //     "//unpkg.zhimg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
      //     "//unpkg.zhimg.com/vue-router@3.0.6/dist/vue-router.min.js",
      //     "//unpkg.zhimg.com/vuex@3.1.1/dist/vuex.min.js",
      //     "//unpkg.zhimg.com/axios@0.19.0/dist/axios.min.js",
      //     "//unpkg.zhimg.com/element-ui@2.10.1/lib/index.js"
      //   ]
      // };
      config.plugin("html").tap(args => {
        // html中添加cdn
        // args[0].cdn = cdn;
        return args;
      });
      // 压缩图片
      config.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
        });

      config.optimization.delete("splitChunks");

      // 打包分析
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static"
        }
      ]);
    }
    return config;
  },

  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        // prependData: `
        //   @import "@scss/mixins.scss";
        //   $src: "${process.env.VUE_APP_BASE_API}";
        //   `
      }
    }
  },
  lintOnSave: IS_PROD ? false : 'warning', // 开启代码检测
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1,
  pwa: {},
  // 代理服务器
  devServer: {
    // overlay: { // 让浏览器 overlay 同时显示警告和错误
    //   warnings: true,
    //   errors: true
    // },
    open: false, // 是否打开浏览器
    host: "localhost",
    port: "8080", // 代理断就
    // https: false,
    hotOnly: true, // 热更新
    proxy: {
      "/proxyApi": {
        target:
          "https://eipuat.aoyuan.net/gateway/eip/api/app", // 目标代理接口地址
          // "http://10.99.12.208:4900/api/app", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/proxyApi": "/"
        }
      },
      "/proxyAdmin": {
        target:
          "http://eipdev.aoyuan.net/gateway/admin/api/app", // 目标代理接口地址
          // "http://10.99.12.208:4900/api/app", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/proxyAdmin": "/"
        }
      },
      "/frpms": {
        target:
          "https://s-test-sp-web01.aoyuan.net:8443", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/frpms": "/"
        }
      },
      "/ay-oa-api": {
        target:
          "https://eipuat.aoyuan.net/oa/ay-oa-api", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/ay-oa-api": "/"
        }
      }
    }
  },
  // pages: {
  //   index: {
  //     entry: 'src/pages/index/main.js',
  //     template: 'src/pages/index.html'
  //   },
  //   silent: {
  //     entry: 'src/pages/silent/main.js',
  //     template: 'src/pages/silent-renew-oidc.html'
  //   }
  // }
};
