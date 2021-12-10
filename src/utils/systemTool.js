// 获取用户的操作系统
export function getOs () {
  let sUserAgent = navigator.userAgent.toLocaleLowerCase()
  let platform = navigator.platform.toLocaleLowerCase()
  let isWin = (platform === 'win32') || (platform === 'windows')
  let isMac = (platform === 'mac68k') || (platform === 'macppc') || (platform === 'macintosh') || (platform === 'macintel')
  if (isMac) return 'Mac'
  let isUnix = (platform === 'x11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  let isLinux = (String(platform).indexOf('linux') > -1)
  if (isLinux) return 'Linux'
  if (isWin) {
    let isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
    if (isWin2K) return '电脑（Win2000）'
    let isWinXP = sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
    if (isWinXP) return '电脑（WinXP）'
    let isWin2003 = sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
    if (isWin2003) return '电脑Win2003'
    let isWinVista = sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
    if (isWinVista) return '电脑（WinVista）'
    let isWin7 = sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
    if (isWin7) return '电脑（Win7）'
    let isWin10 = sUserAgent.indexOf("windows nt 10") > -1 || sUserAgent.indexOf("Windows 10") > -1
    if (isWin10) return "电脑（Win10）"
  }
  if (sUserAgent.indexOf('android') > -1) return 'Android'
  if (sUserAgent.indexOf('iphone') > -1) return 'iPhone'
  if (sUserAgent.indexOf('symbianos') > -1) return 'SymbianOS'
  if (sUserAgent.indexOf('windows phone') > -1) return 'Windows Phone'
  if (sUserAgent.indexOf('ipad') > -1) return 'iPad'
  if (sUserAgent.indexOf('ipod') > -1) return 'iPod'
  return 'others'
}
// 获取用户的浏览器
export function getCurrentBrowser () {
  let ua = navigator.userAgent.toLocaleLowerCase()
  let browserType = null
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = 'IE ' + (ua.match(/rv:([\d.]+)\) like gecko/)[1] || ua.match(/msie ([\d.]+)/)[1])
  } else if (ua.match(/edge/) != null) {
    browserType = 'Edge ' + ua.match(/edge\/([\d.]+)/)[1]
  } else if (ua.match(/firefox/) != null) {
    browserType = 'firefox '+ ua.match(/firefox\/([\d.]+)/)[1]
  } else if (ua.match(/ucbrowser/) != null) {
    browserType = 'UC '+ ua.match(/firefox\/([\d.]+)/)[1]
  } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
    browserType = 'opera '+ (ua.match(/opera\/([\d.]+)/) || ua.match(/opr\/([\d.]+)/))[1]
  } else if (ua.match(/bidubrowser/) != null) {
    browserType = 'baidu '+ ua.match(/bidubrowser\/([\d.]+)/)[1]
  } else if (ua.match(/metasr/) != null) {
    browserType = 'sougou'
  } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowser/) != null) {
    browserType = 'QQ '+ (ua.match(/tencenttraveler\/([\d.]+)/) || ua.match(/qqbrowser\/([\d.]+)/))[1]
  } else if (ua.match(/maxthon/) != null) {
    browserType = 'maxthon '+ ua.match(/maxthon\/([\d.]+)/)[1]
  } else if (ua.match(/chrome/) != null) {
    // let is360 = _mime('type', 'application/vnd.chromium.remoting-viewer')
    if (navigator.mimeTypes && navigator.mimeTypes.length === 4) {
      browserType = 'chrome '+ ua.match(/chrome\/([\d.]+)/)[1]
    } else {
      browserType = '360 '+ ua.match(/chrome\/([\d.]+)/)[1]
    }
  } else if (ua.match(/safari/) != null) {
    browserType = 'Safari '+ ua.match(/version\/([\d.]+).*safari/)[1]
  } else {
    browserType = 'others'
  }
  return browserType
}

// function _mime (option, value) {
//   console.log(navigator.mimeTypes)
//   let mimeTypes = navigator.mimeTypes
//   for (let mt in mimeTypes) {
//     if (mimeTypes[mt][option] === value) {
//       return true
//     }
//   }
//   return false
// }
