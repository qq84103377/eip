import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 埋点
export function analyseApi (params) {
  return request({
    url: requestUrl('/frontLog/save'),
    method: 'post',
    data: requestParam(params, 'post', false, 'json')
  })
}