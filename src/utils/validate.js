/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  )
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/.test(
    s
  )
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 *  特殊字符
 * @param {*} s
 */
export function noSpecialKey (str) {
  let specialKey =
    "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) != -1) {
      return false
    }
  }
  return true
}

/**
* 身份证
* @param {*}
*/
export function checkIdNum (rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value) {
    if (!reg.test(value)) {
      return callback(new Error('证件号码不正确'))
    } else {
      callback()
    }
  }
}

/**
* 用户名
* @param {*}
*/
export function validateName (value) {
  const reg = /^[A-Za-z0-9]+$/
  return !reg.test(value)
}