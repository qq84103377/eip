import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取分类新闻列表
export function getNewsCategoryPage (params) {
  return request({
    url: requestUrl(`/news/newsCategoryPage`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取推荐新闻列表
export function getNewsRecomendPage (params) {
  return request({
    url: requestUrl(`/news/newsRecomendPage`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取新闻中心轮播图
export function getCarousel (params) {
  return request({
    url: requestUrl(`/news/carousel`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取新闻已读未读数量
export function getNewsReadInfo (params) {
  return request({
    url: requestUrl(`/news/newsReadInfo`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取新闻中心长条横幅
export function getEipBanner (params) {
  return request({
    url: requestUrl(`/eipBanner`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取奥园人推荐列表
export function getAoyuanPeopleList (params) {
  return request({
    url: requestUrl(`/eipNewsAoYuanPeople`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取创意画册列表
export function getPictureList (params) {
  return request({
    url: requestUrl(`/eipNewsPicture`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取推荐视频列表
export function getVideoList (params) {
  return request({
    url: requestUrl(`/eipNewsVideo`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取雇主品牌列表
// export function followUp (params,categoryId) {
//   return request({
//     url: requestUrl(`/business/followUp/${categoryId}`),
//     method: 'get',
//     params: requestParam(params, 'get')
//   })
// }


// 获取雇主品牌列表
export function employerBrand (params) {
  return request({
    url: requestUrl(`/news/tagNews`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}



// 获取优惠购房列表
export function discountHomebuyersByPage (params,categoryId) {
  return request({
    url: requestUrl(`/business/discountHomebuyersByPage/${categoryId}`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取媒体看奥园列表
export function getMediaPerspective (params) {
  return request({
    url: requestUrl(`/news/mediaPerspective`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取媒体看奥园详情
export function mediaPerspectiveDetail (id) {
  return request({
    url: requestUrl(`/news/${id}/mediaPerspectiveDetail`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
