import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取奥园人列表
export function getAyPeople (params) {
  return request({
    url: requestUrl(`/ayPeople`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取最新奥园人
export function getNewAyPeople (params) {
  return request({
    url: requestUrl(`/ayPeople/new`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取奥园人文章内容
export function ayPeopleDetail (params) {
  return request({
    url: requestUrl(`/ayPeopleDetail`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取奥园人投稿订阅配置
export function ayPeopleSetting (params) {
  return request({
    url: requestUrl(`/ayPeopleSetting`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取奥园人刊物上下期
export function getAypeopleAround (id,params) {
  return request({
    url: requestUrl(`/ayPeopleDetail/${id}/around`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
//奥园人点赞
export function doLike (id) {
  return request({
    url: requestUrl(`/ayPeopleDetail/${id}/like`),
    method: 'post',
    // data: requestParam(params, 'post', false, 'json'),
  })
}
//获取企业刊物
export function getOrgMagazine (params) {
  return request({
    url: requestUrl(`/orgMagazine`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
