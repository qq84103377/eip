import Vue from "vue"
import App from "./App.vue"
import router from "@router"
import store from "@store"
// import store from './store/store'
import '@/element-ui'
import '@/assets/style/index.scss'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import en from '@assets/languages/en'
import zh from '@assets/languages/zh'
import { analyse } from '@utils/analyse'
import * as filters from '@utils'
import axios from "axios"

import  "babel-polyfill"

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', async function (el, binding) {//指令名称为：real-img
  let imgURL = binding.value;//获取图片地址
  // if (imgURL) {
  //   let exist = await imageIsExist(imgURL);
  //   if (exist) {
      el.setAttribute('src', imgURL);
  //   }
  // }
  el.onerror = function () {
    el.src = require('./assets/images/default_img_2@1x.jpg')
  }
})

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function(url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.onload = function () {
      if (this.complete == true){
        resolve(true);
        img = null;
      }
    }
    img.onerror = function () {
      resolve(false);
      img = null;
    }
    img.src = url;
  })
}

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 获取config.json的url
getBaseApi()

// 需要设置同步 兼容火狐
async function getBaseApi() {
  await getProApi()
  Vue.use(VueI18n)
  const messages = {
    en: {
      ...en,
      ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
    },
    zh: {
      ...zh,
      ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
    }
  }
  const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'zh-CN', // 定义默认语言为中文
    messages
  })
  ElementLocale.i18n((key, value) => i18n.t(key, value))
  Vue.config.productionTip = false

  router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token') || ''
    next()
    // document.cookie = `j_lang=${localStorage.getItem('locale') || 'zh-CN'};domain=ayoa.aoyuan.net;` // 设置cookie
    if(token) {
      // document.cookie = `JSESSIONID=${token};domain=.aoyuan.net;` // 设置cookie
    }
    return
    if (to.path == '/login') {
      if (token) {
        next('/home')
      } else {
        next()
      }
    } else {
      if (!token) {
        next('/login')
      } else {
        next()
      }
    }
  })

  // 自定义埋点指令
  Vue.directive('analyse', {
    inserted: function (el, binding, vnode) {
      el.onclick = function() {
        analyse(binding.value.pageEvent, binding.value.name, binding.value.isDisable)
      }
    }
  })
  // Vue.config.devtools = true // 调试模式
  new Vue({
    router,
    // store,
    store,
    i18n,
    render: h => h(App)
  }).$mount("#app")
}
function getProApi () {

  window.SITE_CONFIG = {}
  if (process.env.NODE_ENV === 'production') {
    return axios.get("/config.json")
      .then(res => {
        let baseURL = res.data.axiosConfig.baseURL
        // window.SITE_CONFIG.baseUrl =  baseURL + (baseURL.substr(baseURL.length-1, 1) == '/' ? 'gateway/eip/api/app': '/gateway/eip/api/app')
        window.SITE_CONFIG.baseUrl =  baseURL + 'gateway/eip/api/app'
        window.SITE_CONFIG.oaUrl =  res.data.axiosConfig.oaURL
        window.SITE_CONFIG.adminURL =  res.data.axiosConfig.adminURL
        window.SITE_CONFIG.docCategoryIds = res.data.docCategoryIds
        window.SITE_CONFIG.staticUrls = res.data.staticUrls
        store.commit('common/SET_BASEURL', window.SITE_CONFIG.baseUrl)
      })
  } else {
    axios.get("/config.json")
      .then(res => {
        window.SITE_CONFIG.docCategoryIds = res.data.docCategoryIds
        window.SITE_CONFIG.staticUrls = res.data.staticUrls
        window.SITE_CONFIG.oaUrl =  'http://ayoa.aoyuan.net'
      })
  }
}
