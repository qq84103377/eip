import { queryPageItem } from './pagepath'

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 将时间戳转化为日期格式
 * @params {timestamp} data 时间戳
 * @params {string} fmt 日期格式 "yyyy-MM-dd hh:mm:ss"
 * @returns {string} 格式化后的日期格式 '2020-03-04 11:22:33'
 */
export function formatDate (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  date = new Date(date)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * 两个时间连接展示
 * @params {timestamp} startdate 时间戳
 * @params {timestamp} enddate 时间戳
 * @params {string} fmt 日期格式 "yyyy-MM-dd hh:mm:ss"
 * @params {string} 两个时间连接符号
 * @returns {string} 格式化后的日期格式 '2020-03-04 11:22:33'
 */
 export function formatDateConnect (startdate, enddate, fmt = 'yyyy-MM-dd hh:mm:ss', connectchar = '-') {
  let datestr = formatDate(startdate, fmt)
  if(enddate != 0 && enddate > startdate){
    if(new Date(startdate).getFullYear() == new Date(enddate).getFullYear()){
      fmt = fmt.substr(fmt.indexOf('M'),fmt.length)
    }
    datestr += connectchar + formatDate(enddate, fmt)
  }
  return datestr
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 埋点相关
 */
export function setPageJourney() {
  let key = window.location.hash.split("?")[0].replace(/(#\/)|(\?)/g, '')
  let page = queryPageItem(key)
  let pageJourney = localStorage.pageJourney ? JSON.parse(localStorage.pageJourney) : []
  let now = new Date().getTime()

  if (pageJourney.length > 2) {
    pageJourney.pop()
  }
  pageJourney.unshift({
    pathname: page.link || '',
    pageName: page.name ? page.name : '',
    enterTime: now,
    pageEvent: '进入页面'
  })
  localStorage.setItem('pageJourney', JSON.stringify(pageJourney))
}

/**
 * 数组对象去重
 */
export function removeDuplicates(array) {
  let obj = {}
  return array = array.reduce((cur, next) => {
    obj[next.id] ? "" : obj[next.id] = true && cur.push(next)
    return cur
  }, [])
}
