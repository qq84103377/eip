/**
 * 请求地址统一处理／组装
 * @param {*} urlName 接口url名称
 */
export default function (actionName,proxy = '/proxyApi') {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  // if(type === 'admin'){
  //   return (process.env.NODE_ENV !== 'production' ? '/proxyAdmin' : window.SITE_CONFIG.adminURL) + actionName
  // }else if(type === 'frpms'){
  //   return (process.env.NODE_ENV !== 'production' ? '/frpms/' : process.env.VUE_APP_RMS) + actionName
  // }else{

    let url = ''
    switch (proxy) {
        case "/proxyApi":
            url = window.SITE_CONFIG.baseUrl
            break
        case "/ay-oa-api":
            url = process.env.VUE_APP_AYOA
            break
        case "/frpms":
            url = process.env.VUE_APP_RMS
            break
    }
    // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
    return (process.env.NODE_ENV !== 'production' ? proxy : url) + actionName

    // return (process.env.NODE_ENV !== 'production' ? type : (type==='/ay-oa-api'?process.env.VUE_APP_AYOA:window.SITE_CONFIG.baseUrl)) + actionName
  // }
}
