import axios from 'axios'
import router from '@/router'
import API from '@api'
import { JSEncrypt } from 'jsencrypt'
import { Message } from 'element-ui';
let refreshFlag = false  //防止多次获取jsessionId

// 创建axios实例
const service = axios.create({
  timeout: 1000 * 60,
  withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  if(sessionStorage.length === 0){
    config.headers['Authorization'] = ''
  }
  config.headers['token'] = localStorage.getItem('jsessionid')
  // config.headers['Range'] =  'bytes=0-'
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  // if(response.status === 401){ //网络状态码401
  //   // location.reload()
  //   return
  // }
  if (response.data) {
    if (response.data.code === 401) { // 401, token失效
      refreshJsessionId()

      // router.push({ name: 'login' })
    } else if (response.data.code === 4001) { // 没权限|| ip被禁
      router.push({ name: 'noPermission' })
    } else if (response.data.code === 500) {
      // router.push({ name: 'login' })
      Message.error(response.data.msg || '未知异常')
    }
  }
  return response
}, error => {
  try {
    if (error.response.status === 401) {
      let locale = localStorage.locale || '', opened = sessionStorage.opened || ''
      localStorage.clear()
      localStorage.locale = locale
      sessionStorage.clear()
      sessionStorage.opened = opened
      location.reload()
    }
    if(error.response.data.code === 400) {
      Message.error(error.response.data.message || '未知异常')
    }
  }catch(e) {

  }

  return Promise.reject(error)
})

function encryptedData(data){
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1tAUwuzjoFlD802CD5wSWPbF2
/WsPVwGATbp7rNc1xRFf58gkbIarUdShU5i9LSrRpjAy+bH1kSKUSdItu7cscbMr
tofesNqtDlT9nLyokRWG9Pf4StjPhAYLyCKW+cFmARwORdS8HCHksrHY6YlWrey4
8ZGYDkWvItAho8qimwIDAQAB
-----END PUBLIC KEY-----`
  let encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(data)
}

function refreshJsessionId() {
  if(!refreshFlag){
    refreshFlag = true
    localStorage.removeItem('jsessionid')
    const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
    let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`
    API.login.login(encryptedData(JSON.parse(sessionStorage.getItem(sessionKey)).profile.name)).then(res => {
      refreshFlag = false
      if(res.data.code === 200){
        // document.cookie = `jsessionid=${res.data.data.token.jsessionid};`
        localStorage.setItem('jsessionid',res.data.data.token.jsessionid)
      }
    }).catch(err => {
      refreshFlag = false
    })
  }
}


export default service
