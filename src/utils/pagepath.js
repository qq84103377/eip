const PAGEPATH = {
  login:{
    name:'登录',
    link:'/login.html',
    road:'login',
  },
  home:{
    name:'首页',
    link:'/home.html',
    road:'index',
  },
  noPermission: {
    name:'无访问权限页',
    link:'/noPermission.html',
    road:'noPermission'
  },
  news: {
    name:'新闻中心',
    link:'/news.html',
    road:'news'
  },
  culture:{
    name:'企业文化',
    link:'/culture.html',
    road:'culture'
  },
  newsList:{
    name:'新闻列表',
    link:'/newsList.html',
    road:'newsList'
  },
  noticeList:{
    name:'通知列表',
    link:'/noticeList.html',
    road:'noticeList'
  },
  specialList:{
    name:'专题列表',
    link:'/specialList.html',
    road:'specialList'
  },
  cultureDetail:{
    name:'企业文化详情',
    link:'/cultureDetail.html',
    road:'cultureDetail'
  },
  setting:{
    name:'设置',
    link:'/setting.html',
    road:'setting'
  },
  myInfo:{
    name:'个人信息',
    link:'/myInfo.html',
    road:'myInfo'
  },
  pwdSecurity:{
    name:'密码安全',
    link:'/pwdSecurity.html',
    road:'pwdSecurity'
  },
  myCollect:{
    name:'我的收藏',
    link:'/myCollect.html',
    road:'myCollect'
  },
  aoyuanren:{
    name:'奥园人',
    link:'/aoyuanren.html',
    road:'aoyuanren'
  },
  workbench:{
    name:'我的工作台',
    link:'/workbench.html',
    road:'workbench'
  },
  service:{
    name:'服务咨询',
    link:'/service.html',
    road:'service'
  },
  detail:{
    name:'奥园人推荐详情',
    link:'/detail.html',
    road:'detail'
  },
  addressList:{
    name:'通讯录',
    link:'/addressList.html',
    road:'addressList'
  },
  _addressList:{
    name:'通讯录',
    link:'/_addressList.html',
    road:'_addressList'
  },
  encryption:{
    name:'RMS加密工具',
    link:'/encryption.html',
    road:'encryption'
  },
  noticeDetail:{
    name:'通知公告详情',
    link:'/noticeDetail.html',
    road:'noticeDetail'
  },
  meetingDetail:{
    name:'会议纪要详情',
    link:'/meetingDetail.html',
    road:'meetingDetail'
  }
}

function queryPagePath(key) {
  if (PAGEPATH[key]) {
    let _road = PAGEPATH[key]['road'].split('-')
    return _road.map(item => {
      return PAGEPATH[item]
    })
  }
  return []
}

export default queryPagePath

export function queryPageItem(key) {
  if (PAGEPATH[key]) {
    return PAGEPATH[key]
  }
  return {}
}
