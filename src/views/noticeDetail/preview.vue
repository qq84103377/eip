<template>
  <section class="preview-wrap" style="height: 100vh;overflow-y: auto">
    <iframe class="iframe" id="rms-ctn" :src="url"></iframe>
  </section>
</template>

<script>
  import API from '@api'
  import Base64 from "../../utils/encryption/base64";
  import CryptoJS from '@utils/crypto'
  export default {
    name: "preview",
    data(){
      return {
        url: '',
      }
    },
    created() {
      this.getUserName()
    },
    methods: {
      handleUrl(){
        let params = ''
        try{
          params = decodeURIComponent(this.$route.query.params)
        }catch(v){
          params = ''
        }
        const base64Str = Base64.decode(params)
        const sign = this.handleCrypto(base64Str.toLowerCase(), '12345678')
        if(sign === this.$route.query.signture){
          const application = this.getQueryString(base64Str, 'application')
          const extension = this.getQueryString(base64Str, 'extension')
          const fileid = this.getQueryString(base64Str, 'fileid')
          const mode = this.getQueryString(base64Str, 'mode')
          let urlPara = `application=${application}&extension=${extension}&fileid=${fileid}&mode=${mode}&userid=${localStorage.profileName}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`
          const signture = this.handleCrypto(urlPara.toLowerCase(), '12345678')
          const newBase64Str = Base64.encode(urlPara)
          this.url = `/preview/page/DocOnline.html?params=${encodeURIComponent(newBase64Str)}&signture=${encodeURIComponent(signture)}&inFrame=1`
        }else{
          this.url = `/preview/page/DocOnline.html?params=&signture=`
        }
      },
      getUserName(){
        API.setting.getOaUser().then(async ({data}) => {
          if (data) {
            if (data.code === 200) {
              localStorage.setItem('userName', data.data.username)
            }
          }
          this.handleUrl()
          // this.url = `/preview/page/DocOnline.html${this.$route.fullPath.substr(8)}`
        }).catch(err => {
        })
      },
      handleCrypto(message,secret) {
        var hash = CryptoJS.HmacSHA1(message, secret);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        return hashInBase64;
      },
      getQueryString(str, name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = str.match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .preview-wrap{
    -webkit-overflow-scrolling: touch;
  }
  .iframe{
    width: 100%;
    height: 100vh;
    border: none;
  }
</style>
