
const state = {
  baseUrl: ''
}

const mutations = {
  SET_BASEURL: (state, url) => {
    state.baseUrl = url
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}