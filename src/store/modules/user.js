import * as types from '../mutation-types'
import API from '@/api'
import { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token') || '',
  name: localStorage.getItem('userName') || '',
  smallPhotoUrl: localStorage.getItem('smallPhotoUrl') || '',
  avatar: '',
  introduction: '',
  roles: [],
  permission: {},
  pwdExpired: '',
  pwdReqCount: 0
}

const mutations = {
  [types.SET_TOKEN]: (state, token) => {
    state.token = token
  },
  [types.SET_INTRODUCTION]: (state, introduction) => {
    state.introduction = introduction
  },
  [types.SET_NAME]: (state, name) => {
    state.name = name
  },
  [types.SET_SMALLPHOTOURL]: (state, url) => {
    state.smallPhotoUrl = url
  },
  [types.SET_AVATAR]: (state, avatar) => {
    state.avatar = avatar
  },
  [types.SET_ROLES]: (state, roles) => {
    state.roles = roles
  },
  [types.UPDATE_USER_PERMISSION]: (state, permission) => {
    state.permission = permission
  },
  [types.SET_PWD_EXPIRED]: (state, pwdExpired) => {
    state.pwdExpired = pwdExpired
  },
  [types.SET_PWD_REQUEST_COUNT]: (state, pwdReqCount) => {
    state.pwdReqCount = pwdReqCount
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      API.login.login(userInfo).then(response => {
        const { data } = response.data
        if (data) {
          // commit(types.SET_TOKEN, data.token)
          // commit(types.SET_NAME, data.userName)
          // localStorage.setItem('token', data.token)
          // document.cookie = `JSESSIONID=${localStorage.getItem('token')};domain=.aoyuan.net;` // 设置cookie
          // // document.cookie = `j_lang=${localStorage.getItem('locale') || 'zh-CN'};domain=ayoa.aoyuan.net;` // 设置cookie
          // localStorage.setItem('userName', data.userName)
          // localStorage.setItem('smallPhotoUrl', data.smallPhotoUrl)
          // localStorage.removeItem('pageJourney')
        }
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      API.login.getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, introduction } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      API.login.logout(state.token).then((res) => {
        commit(types.SET_TOKEN, '')
        commit(types.SET_ROLES, [])
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        resetRouter()
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
