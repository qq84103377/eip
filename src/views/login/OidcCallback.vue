<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import API from '@api'
import { JSEncrypt } from 'jsencrypt'
import { formatDate } from '@utils'

export default {
  name: 'OidcCallback',
  created () {
    this.oidcSignInCallback()
      .then((redirectPath) => {
        console.log(redirectPath,'redirectPathredirectPathredirectPathredirectPathredirectPath');
        const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
        let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`
        let userAccount = ''
        // if(localStorage.profileName && localStorage.profileName != 'undefined'){
        //   //如果有存账号则不通过session取值
        //   userAccount = localStorage.profileName
        // }else{
          //如果localstorage没有账号,则通过session取值并储存
          localStorage.setItem('profileName',JSON.parse(sessionStorage.getItem(sessionKey)).profile.name)
          userAccount = JSON.parse(sessionStorage.getItem(sessionKey)).profile.name
        // }
        console.log(JSON.parse(sessionStorage.getItem(sessionKey)).profile.name,'登录用户名',new Date());
        API.login.login(this.encryptedData(userAccount)).then(res => {
          if(res.data.code === 200){
            // this.$message({
            //   message:this.$t('publicMsg.loginsuccess'),
            //   type: 'success',
            //   duration: 1000,
            // })
            document.cookie = `JSESSIONID=${res.data.data.token.jsessionid};domain=.aoyuan.net;`
            localStorage.setItem('jsessionid',res.data.data.token.jsessionid)
            // this.getUserInfo(redirectPath)



            this.passwordExpiredDate(userAccount)

            this.$router.push(redirectPath)
          }else{
            //当登录接口报错时重新获取sso信息
            this.$message.error(`登录异常${res.data.message}`)
            let locale = localStorage.locale || '', opened = sessionStorage.opened || ''
            localStorage.clear()
            localStorage.locale = locale
            sessionStorage.clear()
            sessionStorage.opened = opened
            location.reload()
          }
        }).catch(_ => {
          this.$message.error(`登录异常${_}`)
        })
      })
      .catch((err) => {
        console.error(err)
        // window.location.href = `${location.origin}`
        this.$router.push('/home') // 如果注释这行,则刷新页面不会调用首页的接口,但是退出登录重新登录会报错并且不会自动刷新,所以还是要开启这行代码
      })
  },
  methods:{
    ...mapActions('oidc', [
      'oidcSignInCallback'
    ]),
    passwordExpiredDate(account){
      API.setting.passwordExpiredDate({account}).then(res => {
        if(res.data.code === 200) {
          //15天内提醒
          this.$store.commit('user/SET_PWD_EXPIRED', res.data.data.expiredOn)
          this.$store.commit('user/SET_PWD_REQUEST_COUNT', res.data.data.requestCount)
        }
      })
    },
    openHJ(account){
      API.setting.checkHjPermission({account}).then(res => {
        if(res.data.code === 200) {
          if(res.data.data.hasPermission) {
            window.open(`${process.env.VUE_APP_HJ}`,'hj')
          }
        }
      })
    },
    encryptedData(data){
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1tAUwuzjoFlD802CD5wSWPbF2
/WsPVwGATbp7rNc1xRFf58gkbIarUdShU5i9LSrRpjAy+bH1kSKUSdItu7cscbMr
tofesNqtDlT9nLyokRWG9Pf4StjPhAYLyCKW+cFmARwORdS8HCHksrHY6YlWrey4
8ZGYDkWvItAho8qimwIDAQAB
-----END PUBLIC KEY-----`
      let encryptor = new JSEncrypt()
      encryptor.setPublicKey(publicKey)
      return encryptor.encrypt(data)
    },
    getUserInfo(redirectPath){
      API.setting.getOaUser().then(async ({data}) => {
        if (data) {
          if (data.code === 200) {
            this.$store.commit('user/SET_NAME', data.data.username)
            this.$store.commit('user/SET_SMALLPHOTOURL', data.data.smallPhotoUrl)
            localStorage.setItem('userName', data.data.username)
            localStorage.setItem('smallPhotoUrl', data.data.smallPhotoUrl)
            localStorage.removeItem('pageJourney')
            if (data.data.orgPageCode == 0) {
              this.$message.error(this.$t('publicMsg.loginError'))
            } else {

              if(data.data.orgPageCode == 4){
                // await this.setEn()
              }
              console.log(321);
              // this.$router.replace({ name: 'home', query: { id: data.data.orgPageCode } })
            }
          }
        }
      }).catch(err => {
      })
      this.$router.push(redirectPath)

    },
    async setEn(){
      this.$i18n.locale = 'en-US'
      localStorage.setItem('locale', 'en-US')
      let params = {
        lang: 'en-US'
      }
      await API.setting.setLang(params).then(res => {
        console.log(123);
      })
    }
  }
}
</script>
