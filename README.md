# eip

##### 项目描述
基于vue2.x/cli4.0搭建的vue+webpack+element-ui


#### 接口地址配置
1. 本地开发配置 .env 默认开启代理

```
  NODE_ENV: '"development"'
```
2. vue.config.js  设置代理接口地址

```
devServer: {
    open: false, // 是否打开浏览器
    host: "localhost",
    port: "8080", // 代理端口
    // https: false,
    hotOnly: true, // 热更新
    proxy: {
      "/proxyApi": {
        target: "http://eip.aoyuan.net/gateway/eip/api/app", // 目标代理接口地址
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          "^/proxyApi": "/"
        }
      }
    }
  }
```
3. public\config.json 发布生产接口设置

```
  // api接口请求地址
  "axiosConfig": {
    "baseURL": "http://eip.aoyuan.net/",
    "oaURL": "http://ayoa.aoyuan.net"
  }
```


###  Development  (初始项目)

```bash
# 第一次运行项目，没有node_modules 依赖 需要执行
$ npm install

# build watching file changes and run demos
$ npm run dev
```


####  chromedriver 下载地址指向国内镜像（若install下载卡在这执行下面命令）

```
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```


###  项目结构
如开发目录为：

```
├─ public // 不打包文件
│    ├─ confing.json // 设置请求接口地址
│    ├─ favicon.ico  // 网站图标   
│    └─ index.html  // 网站首页
├─ src  // 项目文件
│    ├─ App.vue
│    ├─ api  // 放置接口配置文件
│    │    ├─ index.js          // 接口入口配置模块
│    │    ├─ request.js        // 接口请求封装
│    │    ├─ requestParam.js   // 接口请求参数封装
│    │    ├─ requestUrl.js     // 接口请求Url封装
│    │    └─ modules
│    │           ├─ analyse.js  // 埋点接口
│    │           ├─ home.js     // 首页接口
│    │           ├─ login.js    // 登录接口
│    │           └─ setting.js  // 个人设置接口
│    ├─ assets  // 样式、图片、字体、中英文存放文件夹
│    │    ├─ images     // 图片
│    │    ├─ languages  // 中英文切换
│    │    └─ scss       // 样式
│    ├─ components  //公共组件存放文件夹
│    │    ├─ date-panel.vue   // 会议日期组件
│    │    └─ head-module.vue  // 网站顶部组件
│    ├─ element-ui   // ui按需引入
│    │    └─ index.js
│    ├─ plugins  // 插件
│    ├─ router  // 路由配置
│    │    └─ index.js
│    ├─ store  // 存储数据
│    │    ├─ index.js
│    │    └─ modules
│    │           └─ user.js
│    ├─ utils  // 存放公共js
│    │    ├─ analyse.js   // 埋点js
│    │    ├─ index.js
│    │    ├─ pagepath.js  // 埋点对应页面
│    │    └─ validate.js  // 表单验证js
│    ├─ views  // 存放页面
│    │    ├─ aoyuanren   // 奥园人
│    │    │    └─ index.vue
│    │    ├─ culture   // 企业文化
│    │    │    ├─ detail.vue
│    │    │    └─ index.vue
│    │    ├─ error   // 错误页
│    │    │    ├─ 404.vue
│    │    │    └─ noPermission.vue
│    │    ├─ home   // 首页
│    │    │    └─ index.vue
│    │    ├─ login   // 登录页
│    │    │    └─ index.vue
│    │    ├─ news   // 新闻中心
│    │    │    └─ index.vue
│    │    ├─ newsList   // 新闻列表
│    │    │    └─ index.vue
│    │    ├─ noticeList   // 通知列表
│    │    │    └─ index.vue
│    │    ├─ setting   // 个人设置
│    │    │    └─ index.vue
│    │    ├─ specialList   // 专题
│    │    │    └─ index.vue
│    │    └─ workbench  // 工作台
│    │         └─ index.vue
│    ├─ App.vue  // 公共vue
│    └─ main.js
├─ postcss.config.js // 页面响应式配置
└─ vue.config.js // 项目配置

```

### 接口调用方式

```
// ajaxJsonPost  json格式请求
// @param  params请求参数
API.moduleName.apiName(params).then(res => {
  if (res.data.code === 200) {
     // 请求成功的内容
  } else {
    this.$message.error(res.data.message)
  }
}).catch(() => {});

```



### 获取字典值得方法
```
// 在<template></template>  返回的是字典值数组
{{$root.dict['字典码']}}
// 或缩写
$root.dict['字典码']

// 在export default {}内
this.$root.dict['字典码']
// 或缩写
this.$root.dict['字典码']

//根据真实值获取显示值 ，codeT为真实值
{{codeT|labelMapper($root.dict['字典码'])}}

```

### 附件上传组件应用方法
```
// 在<template></template>  插入组件（引入页面）
// ref:组件名称唯一值
// v-model：绑定的表单字段fileData
// defaultList：[]类型，上传附件的默认值
// getFileUrl：这个是子组件返回调用的函数名称，固定的不要修改
// getAttachs：父组件与子组件通信的函数，方法写在父组件
// keyName：绑定的表单字段fileData
// uploadType： 上传控件类型  1：单图片上传，2：多图片上传，3：文件上传
// filesize：上传文件大小限制
// multiple: 是否支持多文件选择上传（不填默认值为false），false 不支持  true 支持
// filetype：上传文件的后缀名称 ： 值为'all' 是不限制文件后缀名
// limit：上传文件个数限制
<upload-file  ref="attachs1" v-model="ruleForm.fileData" :defaultList="" @getFileUrl="getAttachs" :keyName="fileData" :uploadType="uploadType" :filesize="size" :limit="limit" :filetype="filetype"></upload-file>

//<script>标签里
import uploadFile from "@/components/upload/uploadFile";

//export default {}的
    components:{
        uploadFile
    },
    methods:{
        getAttachs(key, data) {
             this.$set(this.ruleForm,key,data);
        }
    }
```

### 页面跳转方式
```
// 类似a标签写法
// name 就是配置的路由名称
// params  {}是传送到跳转链接的参数
<router-link :to="{name:'demo-formDemo',params: {'activityId':activityId,'activityType': activityType}}">商品管理</router-link>

//  js中的写法
 this.$router.push({
     name: "demo-formDemo",
     params: {'activityId':activityId,'activityType': activityType}
 });


```
目标链接中获取传过来的参数params

```
// 根据实际情况把获取到的值给data中的参数赋值
  var activityId = this.$route.params.activityId;
```

### 删除标签页的方法

```
this.$store.commit("common/delMainTabsName", this.$store.state.common.mainTabsActiveName);
```

### 组件引入方式
```
//父页面js引入   命名统一规范  insert + 功能命名（第一个字母大写）   
// import和components的命名需要一样
import insertOrder from "../components/orderFilter"
export default {
  components: {addOrder},
  methods: {
    // 调用子组件方法
    orderOpen(){
      this.orderVisible = true;
      this.$nextTick(()=>{
        //  this.refs.refOrder获取子组件
        this.refs.refOrder.init();
      });
    },
    // 获取到的子组件参数值
    setFuntion(data){
    }
  }
}

// 父页面插入方式 标签名称是 <insert-"上面命名名称小写">
// ref是标签的唯一id 必须设置，调用需要 命名规范 ref+功能命名（第一个字母大写）
// orderVisible 是做显示隐藏设置  命名规范 功能命名+Visible
// callBlack 子组件返回调用父组件的方法

 <insert-order ref="refOrder" v-if="orderVisible" @callBlack="setFuntion"></insert-order>

// 子组件
export default {
  data(){
    return{
      dataForm:{}
    }
  },
  methods: {
    // 把获取到的数据存回父页面
    // this.$emit("callBlack",this.dataForm);  第一个参数为父页面属性绑定的函数名，第2个参数为需要存的值
    setDate(data){
      this.$emit("callBlack",this.dataForm);
    }
  }
}
```

### 表单样式规范
1. 表单列名称不能换行，需要设置好文字显示区域宽度
2. 如果表单单个输入项一行的，输入框的样式名需为input_mini

```
//label-width为所有左侧标签的宽度，如果特殊情况不需要时在<el-form-item>单独设置
// 单独设置表单输入项的宽度，需要添加属性 style="width:150px"  大小根据实际情况
// 如果是在行内多个表单项时 <el-input>不添加样式名称就自适应宽度，如果el-select需要设置100%，添加class="w100"

<el-form :model="ruleForm" ref="addForm" label-suffix="：" label-width="130px">
       <el-form-item label="条件名称：" class="mb-0"" prop="ruleName" :rules="[rules.isRequired]">
          <el-input v-model="ruleForm.ruleName" clearable class="input_mini"></el-input>
        </el-form-item>
     <el-select v-model="item.operatorHidden" placeholder="请选择" style="width:150px">
        <el-option label="包含（任意一个）" value="0"></el-option>
     </el-select>
</el-form>
```
### 新标签页面路由打开
##### 用到的情景
1. 新标签页面打开时返回时不需要重新刷新页面
2. 需要路由设置的路径

src\router\index.js 中配置路径时meta:{}isNewTab:true,例子 
```
{ path: '/good-brand-edit', component: _import('modules/good/components/brand-add-or-update'), name: 'good-brand-edit', meta: { title: '品牌信息', isTab: true,isNewTab:true } }
```
在页面初始化中，方法调用放在mounted(){}里只加载一次，activated()方法里会每次进入页面都会调用

```
export default {
  data() {
    return {}
  },
  activated () {
    //每次进入页面都会调用
  },
  mounted() {
    // 第一次页面进入调用 
  }
}

```