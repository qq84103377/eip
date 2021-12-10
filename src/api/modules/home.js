import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取首页信息第一级
export function getFirstIndex (params) {
  return request({
    url: requestUrl('/homePage/firstIndex'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取用户待办事项
export function getUserTask (params) {
  return request({
    url: requestUrl('/homePage/userTask'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取主页轮播图
export function getCarousels (params) {
  return request({
    url: requestUrl(`/homePage/carousel`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取用户会议信息
export function getMeetting (params) {
  return request({
    url: requestUrl('/meeting/meetingList'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取用户会议列表提示
export function getMeetingByMonth (params) {
  return request({
    url: requestUrl('/meeting/meetingByMonth'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取新闻栏信息
export function getNews (params) {
  return request({
    url: requestUrl('/homePage/news'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取应用列表
export function getShortcut (params) {
  return request({
    url: requestUrl('/shortcut'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取奥园人
export function getAoYuanPeople (params) {
  return request({
    url: requestUrl(`/homePage/aoYuanPeople/${params.pageId}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取服务咨询列表
export function getServiceList (params) {
  return request({
    url: requestUrl(`/homePage/aoYuanPeople`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取专题推荐列表
export function getSpecialList (params) {
  return request({
    url: requestUrl(`/eipNewsSpecial`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取专题分类列表
export function getSpecialCate (params) {
  return request({
    url: requestUrl(`/eipNewsSpecial/categories`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取专题推荐详情
export function getSpecialDetail (params) {
  return request({
    url: requestUrl(`/eipNewsSpecial/${params.id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取奥园人推荐详情
export function getAoyuanPeopleDetail (params) {
  return request({
    url: requestUrl(`/eipNewsAoYuanPeople/${params.id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取创意画册详情
export function getPictureDetail (params) {
  return request({
    url: requestUrl(`/eipNewsPicture/${params.id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取推荐视频详情
export function getVideoDetail (params) {
  return request({
    url: requestUrl(`/eipNewsVideo/${params.id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
// 获取通知公告列表
export function getNotification (params) {
  return request({
    url: requestUrl(`/notification`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取会议纪要列表
export function getMeetingList (params) {
  return request({
    url: requestUrl(`/meeting/meetingMinutes`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取服务咨询
export function adviceDtos (params) {
  return request({
    url: requestUrl(`/advice/Advices`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 优惠购房列表
export function discountHomebuyers (params,categoryId) {
  return request({
    url: requestUrl(`/business/discountHomebuyers/${categoryId}`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
//专题推荐外部链接记录阅读数
export function recordRead (id) {
  return request({
    url: requestUrl(`/eipNewsSpecial/${id}/recordRead`),
    method: 'post',
    // data: requestParam(params, 'post', false, 'json'),
  })
}

// 获取通讯录机构列表
export function mailOrgList (params) {
  return request({
    url: requestUrl(`/org/mailOrgTree`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 根据通讯录机构获取账号数据
export function orgUserList (params) {
  return request({
    url: requestUrl(`/org/usersByOrgCode`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// VIP用户获取左侧树状图初始化列表
export function mailOrgTreeForVip () {
  return request({
    url: requestUrl(`/org/mailOrgTreeForVip`),
    method: 'get',
  })
}
// VIP用户获取左侧树状图懒加载层级列表
export function orgPartList (params) {
  return request({
    url: requestUrl(`/org/orgPartList`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// VIP用户获取右侧用户列表
export function usersByOrgCodeForVip (params) {
  return request({
    url: requestUrl(`/org/usersByOrgCodeForVip`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 判断机构是否可以点击加载子级列表
export function isOrgCanHit (params) {
  return request({
    url: requestUrl(`/org/isOrgCanHit`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取通知公告详情
export function noticeDetail (id) {
  return request({
    url: requestUrl(`/notification/detail/${id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 获取通讯录机构列表---------验证数据用
export function __mailOrgList (params) {
  return request({
    url: requestUrl(`/orgService_SSO/mailOrgTree`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 根据通讯录机构获取账号数据---------验证数据用
export function __orgUserList (params) {
  return request({
    url: requestUrl(`/orgService_SSO/usersByOrgCode`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// VIP用户获取左侧树状图懒加载层级列表---------验证数据用
export function __orgPartList (params) {
  return request({
    url: requestUrl(`/orgService_SSO/orgPartList`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取用户权限
export function userPermission (params) {
  return request({
    url: requestUrl(`/eipPermission/userPermission`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取会议类型
export function getMeetingType (params) {
  return request({
    url: requestUrl(`/notification/meetingType`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 会议纪要查阅人员列表
export function noticeLookin (params) {
  return request({
    url: requestUrl(`/notification/lookIn`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 明源账号加密
export function desEncrypt (params) {
  return request({
    url: requestUrl(`/dESEncrypt/encrypt`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取明源账号启用状态
export function MYUserStatus (params) {
  return request({
    url: requestUrl(`/notification/mYUserStatus`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
//通知公告附件下载记录次数
export function recordDocHits (params) {
  return request({
    url: requestUrl(`/docHits/recordDocHits`),
    method: 'post',
    data: requestParam(params, 'post', true, 'json'),
  })
}

// 获取友情链接和二维码配置
export function getLinkQrCode (params) {
  return request({
    url: requestUrl(`/linkQrCode`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取火炬回款数据
export function getHjReturn (params) {
  return request({
    url: requestUrl(`/hj/return`),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 火炬回款7天不提醒
export function hjReturnNoPrompt (params) {
  return request({
    url: requestUrl(`/hj/returnNoPrompt`),
    method: 'put',
    params: requestParam(params, 'get')
  })
}
