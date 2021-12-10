import Vue from "vue"
import VueRouter from "vue-router"
import Login from "@views/login"
import OidcCallback from '@views/login/OidcCallback.vue'
import OidcCallbackError from '@views/login/OidcCallbackError.vue'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'
import store from '@store'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 路由定义使用说明:
// 1. 代码中路由统一使用name属性跳转.
// 2. 开放path属性用做简短路由, 比如: '/a1', 访问地址: www.renren.io/#/a1
const routes = [
  {
    path: '/',
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "@views/Home.vue"),
    redirect: '/home',
    children: [
      {
        path: "/home",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "homePage" */ "@views/home/index1.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/noPermission",
        name: "noPermission",
        component: () =>
          import(/* webpackChunkName: "noPermission" */ "@views/error/noPermission.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/news",
        name: "news",
        component: () =>
          import(/* webpackChunkName: "news" */ "@views/news/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/workbench",
        name: "workbench",
        component: () =>
          import(/* webpackChunkName: "culture" */ "@views/workbench/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/culture",
        name: "culture",
        component: () =>
          import(/* webpackChunkName: "culture" */ "@views/culture/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/newsList",
        name: "newsList",
        component: () =>
          import(/* webpackChunkName: "newsList" */ "@views/newsList/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/noticeList",
        name: "noticeList",
        component: () =>
          import(/* webpackChunkName: "noticeList" */ "@views/noticeList/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/specialList",
        name: "specialList",
        component: () =>
          import(/* webpackChunkName: "specialList" */ "@views/specialList/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/cultureDetail",
        name: "cultureDetail",
        component: () =>
          import(/* webpackChunkName: "cultureDetail" */ "@views/culture/detail.vue"),
        meta: {
          hideHeader: true
        }
      },
      {
        path: "/setting",
        name: "setting",
        redirect: '/myInfo',
        component: () =>
          import(/* webpackChunkName: "setting" */ "@views/setting/index.vue"),
        meta: {
          isShowNav: true
        },
        children: [
          {
            path: "/myInfo",
            name: "myInfo",
            component: () =>
              import(/* webpackChunkName: "myInfo" */ "@views/setting/myInfo.vue"),
            meta: {
              isShowNav: true
            }
          },
          {
            path: "/pwdSecurity",
            name: "pwdSecurity",
            component: () =>
              import(/* webpackChunkName: "pwdSecurity" */ "@views/setting/pwdSecurity.vue"),
            meta: {
              isShowNav: true
            }
          },
          {
            path: "/myCollect",
            name: "myCollect",
            component: () =>
              import(/* webpackChunkName: "myCollect" */ "@views/setting/myCollect.vue"),
            meta: {
              isShowNav: true
            }
          }
        ]
      },
      {
        path: "/aoyuanren",
        name: "aoyuanren",
        component: () =>
          import(/* webpackChunkName: "aoyuanren" */ "@views/aoyuanren/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/service",
        name: "service",
        component: () =>
          import(/* webpackChunkName: "service" */ "@views/service/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/addressList",
        name: "addressList",
        component: () =>
          import(/* webpackChunkName: "addressList" */ "@views/addressList/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/addressListTestNormal",
        name: "addressListTestNormal",
        component: () =>
          import(/* webpackChunkName: "addressListTest" */ "@views/addressList/test-normal.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/_addressList",
        name: "_addressList",
        component: () =>
          import(/* webpackChunkName: "_addressList" */ "@views/addressList/_index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/encryption",
        name: "encryption",
        component: () =>
          import(/* webpackChunkName: "encryption" */ "@views/encryption/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/meetingList",
        name: "meetingList",
        component: () =>
          import(/* webpackChunkName: "meetingList" */ "@views/meetingList/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/publication",
        name: "publication",
        component: () =>
          import(/* webpackChunkName: "publication" */ "@views/publication/index.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/publicationDetail",
        name: "publicationDetail",
        component: () =>
          import(/* webpackChunkName: "publicationDetail" */ "@views/publication/detail.vue"),
        meta: {
          isShowNav: true
        }
      },
      {
        path: "/blank",
        name: "blank",
        component: () =>
          import(/* webpackChunkName: "blank" */ "@views/blank/index.vue"),
        meta: {
          hideHeader: true
        }
      }
    ]
  },
  {
    path: "/noticeDetail",
    name: "noticeDetail",
    component: () =>
      import(/* webpackChunkName: "noticeDetail" */ "@views/noticeDetail/index.vue"),
    meta: {
      hideHeader: true
    }
  },
  {
    path: "/preview",
    name: "preview",
    component: () =>
      import(/* webpackChunkName: "preview" */ "@views/noticeDetail/preview.vue"),
    meta: {
      hideHeader: true
    }
  },
  {
    path: "/meetingDetail",
    name: "meetingDetail",
    component: () =>
      import(/* webpackChunkName: "meetingDetail" */ "@views/meetingDetail/index.vue"),
    meta: {
      hideHeader: true
    }
  },
  {
    path: '/oidc-callback', // Needs to match redirectUri in you oidcSettings
    name: 'oidcCallback',
    component: OidcCallback,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/detail",
    name: "detail",
    component: () =>
      import(/* webpackChunkName: "detail" */ "@views/detail/index.vue"),
    meta: {
      hideHeader: true
    }
  },
  {
    path: '/oidc-callback-error', // Needs to match redirect_uri in you oidcSettings
    name: 'oidcCallbackError',
    component: OidcCallbackError,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: '/404',
    name: '404',
    desc: '404未找到',
    component: () =>
      import(/* webpackChunkName: "404" */ "@views/error/404")
  },
  {
    path: '*',
    redirect: {
      name: 'home'
    }
  }
]

const createRouter = () => new VueRouter({
  routes,
  scrollBehavior() {
    return {x: 0, y: 0}
  },
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach(vuexOidcCreateRouterMiddleware(store, 'oidc'))

export default router
