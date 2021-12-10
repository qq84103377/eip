import { formatDate } from '@utils'
import { getOs, getCurrentBrowser  } from '@utils/systemTool'
import API from '@api'
import { queryPageItem } from './pagepath'

export function analyse(pageEvent, name, isDisable=false) {
  if (isDisable) return
  let key = window.location.hash.split("?")[0].replace(/(#\/)|(\?)/g, '')
  let page = queryPageItem(key)
  let pageJourney = localStorage.pageJourney ? JSON.parse(localStorage.pageJourney) : []
  let enterTime = pageJourney[0] ? pageJourney[0].enterTime : new Date().getTime()
  let now = new Date().getTime()
  let browser = getCurrentBrowser()
  const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
  let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`

  let params = {
    lastPage : pageJourney[0] ? pageJourney[0].pageName : '', // 上一页名称
    lastPageUrl : pageJourney[0] ? pageJourney[0].pathname : '', // 上一页url
    lastPageEvent : pageJourney[0] ? pageJourney[0].pageEvent : '', // 上一页操作
    page : (name || page.name) || '首页', // 当前页名称
    pageUrl : page.link, // 当前页url
    pageRemainTime : now - enterTime, // 当前页停留时间
    pageEvent : pageEvent || '进入页面', // 当前页操作
    deviceId : getOs(), //0：PC; 1：APP; 2：微信
    username : localStorage.userName, // 用户名
    triggerTime : formatDate(now), // 当前时间
    menuNumber: localStorage.curMenuNumber || '1', // 导航栏id
    userAgent: browser.split('.')[0],
    token: localStorage.jsessionid || '',
    fdId: JSON.parse(sessionStorage.getItem(sessionKey)).profile.sub
  }

  if (pageJourney.length > 2) {
    pageJourney.pop()
  }
  pageJourney.unshift({
    pathname: page.link || '',
    pageName: (name || page.name) || '首页',
    enterTime: enterTime,
    pageEvent: pageEvent || '进入页面'
  })
  localStorage.setItem('pageJourney', JSON.stringify(pageJourney))
  API.analyse.analyseApi(params).then((res) => {
    console.log('eventlisten-success', res)
  }).catch((error) => {
    console.log('eventlisten-err', error)
  })
}
