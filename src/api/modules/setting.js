import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取个人信息
export function getOaUser (params) {
  return request({
    url: requestUrl('/user/oaUser'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 校验手机号是否一致
export function checkMobilePhone (fdid, params) {
  return request({
    url: requestUrl('/user/aoMobilePhone/'+fdid),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 校验手机号是否唯一
export function validateMobileUnique (fdid, params) {
  return request({
    url: requestUrl('/user/validateOaMobileUnique/'+fdid),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 修改个人信息
export function updateOaUser (params) {
  return request({
    url: requestUrl('/user/oaUser'),
    method: 'put',
    data: requestParam(params, 'post', true, 'json'),
  })
}

// 获取密码问题列表
export function getPasswordProblems (params) {
  return request({
    url: requestUrl('/user/passwordProblems'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 设置密码问题
export function setProblems (params) {
  return request({
    url: requestUrl('/user/passwordProblems'),
    method: 'put',
    data: requestParam(params, 'post', true, 'json'),
  })
}
// 修改密码
export function setPwd (params) {
  return request({
    url: requestUrl('/user/password'),
    method: 'put',
    data: requestParam(params, 'post', true, 'json'),
  })
}
// 获取我的收藏树状图
export function getCollectTree (params) {
  return request({
    url: requestUrl(`/userFavorites/favoritesTree/${params.parentId}`),
    method: 'get',
    params: requestParam({token:params.token}, 'get')
  })
}
// 更新个人分类
export function updateCate (params) {
  return request({
    url: requestUrl(`/userFavorites/category?${requestParam(params, 'post', true, 'form')}`),
    method: 'put',
    // data: requestParam(params, 'post', false, 'form'),
  })
}
// 新增个人分类
export function addCate (params) {
  return request({
    url: requestUrl(`/userFavorites/category/${params.parentId}?${requestParam({token: params.token, categoryName: params.categoryName}, 'post', true, 'form')}`),
    method: 'post',
    // data: requestParam({token:params.token,categoryName:params.categoryName}, 'post', false, 'form')
  })
}
// 删除个人分类
export function delCate (params) {
  return request({
    url: requestUrl(`/userFavorites/category/${params.categoryId}`),
    method: 'delete',
    params: requestParam({token:params.token}, 'get', false)
  })
}
// 切换系统语言
export function setLang (params) {
  return request({
    url: requestUrl(`/user/userLang?lang=${params.lang}`),
    method: 'put',
    // data: requestParam(params, 'post', false, 'json'),
  })
}

//获取密码过期时间
export function passwordExpiredDate (params) {
  return request({
    url: requestUrl(`/user/passwordExpiredDate`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
//获取用户火炬权限
export function checkHjPermission (params) {
  return request({
    url: requestUrl(`/hj/checkPermission`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
