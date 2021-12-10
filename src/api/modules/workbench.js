import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取单双休
export function getSystemScript (params) {
  return request({
    url: requestUrl('/systemScript/script'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取流程列表
export function getProcess (params) {
  return request({
    url: requestUrl('/process'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取流程列表
export function _getProcess (params) {
  return request({
    url: requestUrl('/api/findSysNotifyTodos','/ay-oa-api'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 流程统计
export function getProcessReport (params) {
  return request({
    url: requestUrl('/process/report'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 流程统计V2
export function getProcessReportAll (params) {
  return request({
    url: requestUrl('/process/reportAll'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 设置星标
export function updateProcessStar (params) {
  return request({
    url: requestUrl('/process/star'),
    method: 'put',
    data: requestParam(params, 'post', true, 'json'),
  })
}

// 获取快捷应用分组
export function getGroups (params) {
  return request({
    url: requestUrl('/shortcut/groups'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 查询快捷应用，并根据类型分组
export function getShortcutType (params) {
  return request({
    url: requestUrl(`/shortcut/shortcutType`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取应用分类列表
export function getClassifies (params) {
  return request({
    url: requestUrl('/shortcut/classifies'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 根据分类获取应用列表
export function getByClassify (classifyId, params) {
  return request({
    url: requestUrl(`/shortcut/byClassify/${classifyId}`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 根据分类获取应用列表
export function getByClassifyV2 (classifyId, params) {
  return request({
    url: requestUrl(`/shortcut/byClassifyAsync_v2/${classifyId}`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取用户应用
export function getShortcut (params) {
  return request({
    url: requestUrl('/shortcut'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 设置应用
export function setShortcut (params) {
  return request({
    url: requestUrl('/shortcut'),
    method: 'put',
    data: requestParam(params, 'post', true, 'json'),
  })
}
// 一键待阅
export function autoToRead (params) {
  return request({
    url: requestUrl('/process/oneClickProcessing'),
    method: 'put',
    // data: requestParam(params, 'post', true, 'json'),
    params: requestParam(params, 'get')
  })
}

