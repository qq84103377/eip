import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 文件上传
export function uploadFile(params) {
  return request({
    url: requestUrl('/api/v2.0/FRPMS/upload', '/frpms'),
    method: 'post',
    headers: {
      'content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    data: params
  })
}

// 查询文件加密状态
export function encryptStatus(params) {
  return request({
    url: requestUrl('/api/v2.0/FRPMS/Encrypt/status', '/frpms'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取第一级组织数据
export function parentOrg(params) {
  return request({
    url: requestUrl('/api/v2.0/basedata/toporg', '/frpms'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取下一级组织数据
export function childOrg(params) {
  return request({
    url: requestUrl('/api/v2.0/basedata/orgs', '/frpms'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取文件加密模板
export function getTemplate(params) {
  return request({
    url: requestUrl('/api/v2.0/basedata/templates', '/frpms'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取文件加密权限
export function getFilerights(params) {
  return request({
    url: requestUrl('/api/v2.0/basedata/filerights', '/frpms'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 模板加密
export function templateEncrypt(params) {
  return request({
    url: requestUrl(`/api/v2.0/FRPMS/TemplateEncrypt/Async`, '/frpms'),
    method: 'post',
    data: requestParam(params, 'post', false, 'json'),
    headers: {
      'requestId': new Date().getTime() + (Math.random() + '').substr(2),
      'application': 'rmstool',
      'UserId': localStorage.profileName || '',
    },
  })
}

// 自定义加密
export function customEncrypt(params) {
  return request({
    url: requestUrl(`/api/v2.0/FRPMS/Encrypt/Async`, '/frpms'),
    method: 'post',
    data: requestParam(params, 'post', false, 'json'),
    headers: {
      'requestId': new Date().getTime() + (Math.random() + '').substr(2),
      'application': 'rmstool',
      'UserId': localStorage.profileName || '',
    },
  })
}

// 加密文件列表
export function encryptList(params) {
  return request({
    url: requestUrl(`/api/v2.0/RmsFile/filelist`, '/frpms'),
    method: 'post',
    data: requestParam(params, 'post', false, 'json'),
  })
}

// 加密文件列表
export function delEncryptFile(params) {
  return request({
    url: requestUrl(`/api/v2.0/RmsFile/delete`, '/frpms'),
    method: 'post',
    data: requestParam(params, 'post', false, 'json'),
    headers: {
      'application': 'rmstool',
      'userId': localStorage.profileName || '',
    },
  })
}
// 重试加密
export function retry(params) {
  return request({
    url: requestUrl(`/api/v2.0/FRPMS/encrypt/retry`, '/frpms'),
    method: 'post',
    headers: {
      'requestId': new Date().getTime() + (Math.random() + '').substr(2),
      'application': 'rmstool',
      'userId': localStorage.profileName || '',
    },
    data: requestParam(params, 'post', false, 'json'),
  })
}

// 加密文件下载
export function downloadFile(params) {
  return request({
    url: requestUrl(`/api/v2.0/RmsFile/download`, '/frpms'),
    method: 'post',
    headers: {
      'application': 'rmstool',
      'userId': localStorage.profileName || '',
    },
    responseType: "blob",
    data: requestParam(params, 'post', false, 'json'),
  })
}

// 通知公告附件文档加密文件下载
export function noticeDownload(params,requestBody) {
  return request({
    url: requestUrl(`/api/v2.0/FRPMS/Encrypt/sourcefile`, '/frpms'),
    method: 'post',
    headers: {
      'application': 'oa',
      'requestId': new Date().getTime() + (Math.random() + '').substr(2),
      'userId': localStorage.profileName || '',
      'userName': localStorage.profileName || '',
      'fileId': params,
    },
    data: requestParam(requestBody, 'post', false, 'json'),
    responseType: "blob"
  })
}
