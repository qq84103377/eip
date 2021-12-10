import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取企业文化轮播图
export function getCultureSwipe (params) {
  return request({
    url: requestUrl(`/corporateCulture/carousels/${params.pageId}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取企业文化新闻
export function getCultureNews (params) {
  return request({
    url: requestUrl(`/corporateCulture/partyNews/${params.cateId}`),
    method: 'get',
    params: requestParam({rowSize:params.rowSize}, 'get')
  })
}
