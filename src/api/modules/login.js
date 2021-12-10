import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取验证码
export function captcha (uuid) {
  return requestUrl(`/Captcha?temp=${uuid}`,'admin')
}

// 登录
export function login (params) {
  return request({
    url: requestUrl('/login/login_v3?userName=' + params),
    method: 'post',
    // data: requestParam(params, 'post', false, 'json'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}

// 退出
export function logout () {
  return request({
    url: requestUrl('/login/logout'),
    method: 'post',
    data: requestParam()
  })
}

// 获取jsessionId
export function getjsessionId () {
  return request({
    url: requestUrl(`/login/sessionId`),
    method: 'get',
    // params: requestParam(params, 'get')
  })
}

//临时用
export function redisCache () {
  return request({
    url: requestUrl(`/login/redisCache`),
    method: 'get',
    // params: requestParam(params, 'get')
  })
}
