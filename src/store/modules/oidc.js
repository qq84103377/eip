import {vuexOidcCreateStoreModule} from "vuex-oidc";
import {oidcSettings} from "../../config/oidc";
import {WebStorageStateStore} from "oidc-client";
import request from "../../api/request";

export default {
  ...vuexOidcCreateStoreModule(
    //oidcSettings,
    // NOTE: If you do not want to use localStorage for tokens, in stead of just passing oidcSettings, you can
    // spread your oidcSettings and define a userStore of your choice
    {
      ...oidcSettings,
      userStore: new WebStorageStateStore({store: window.sessionStorage})
    },
    // Optional OIDC store settings
    {
      namespaced: true,
      dispatchEventsOnWindow: true
    },
    // Optional OIDC event listeners
    {
      userLoaded: (user) => {
        request.defaults.headers.common["Authorization"] = "Bearer " + user.access_token;
        document.cookie = `ssoToken=${user.access_token};domain=.aoyuan.net;`
        console.log('OIDC user is loaded:', user)
      },
      userUnloaded: () => console.log('OIDC user is unloaded'),
      accessTokenExpiring: () => console.log('Access token will expire'),
      accessTokenExpired: () => console.log('Access token did expire',new Date()),
      silentRenewError: () => console.log('OIDC user is unloaded'),
      userSignedOut: () => console.log('OIDC user is signed out'),
      oidcError: (payload) => console.log('OIDC error', payload),
      automaticSilentRenewError: (payload) => console.log('OIDC automaticSilentRenewError', payload)
    }
  )
}
