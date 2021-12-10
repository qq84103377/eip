<template>
  <div id="app">

    <el-dialog
            class="version-tip"
            title="温馨提示"
            :visible.sync="versionShow">
      <div class="version-tip__body">
        <img src="@/assets/images/version-tip.png" alt="">
        <div>您当前浏览器版本过低，可能会影响新门户的正常使用，</div>
        <div>建议您更新浏览器版本（IE11以上），或更换其他浏览器。</div>
      </div>
    </el-dialog>

    <el-dialog
            class="pwd-tip"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :visible.sync="pwdShow">
      <div class="pwd-tip__body">
        <img src="@/assets/images/pwd-tips.png" alt="">
        <div>您好，您的OA密码将在<span style="color: red">{{expiredDays}}</span>天后过期，</div>
        <div>为确保您后续正常使用，请及时重置密码。</div>
      </div>
      <div class="pwd-tip__footer">
        <el-button class="btn" type="primary" @click="editPwd">重置密码</el-button>
        <el-button class="btn" @click="pwdShow = false">关闭</el-button>
      </div>
    </el-dialog>


    <router-view />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {formatDate} from "./utils";

  export default {
    data(){
      return {
        versionShow: false,
        pwdShow: false,
        currentTime: new Date(formatDate(new Date().getTime(), 'yyyy/MM/dd')).getTime()
      }
    },
    watch: {
      pwdExpired() {
        //调试用
        // this.pwdShow = (this.pwdExpired) ? (this.pwdExpired - new Date('2021/9/18 11:50:00').getTime()) <= (60 * 60 * 24 * 1000 * 15) : false
        this.pwdShow = (this.pwdExpired && this.pwdReqCount < 2) ? (this.pwdExpired - this.currentTime) <= (60 * 60 * 24 * 1000 * 15) : false
      }
    },
    computed: {
      ...mapState({
        pwdExpired (state) {
          return state.user.pwdExpired;
        },
        pwdReqCount (state) {
          return state.user.pwdReqCount;
        },
      }),
      expiredDays() {
        console.log(this.pwdExpired,this.currentTime,'expiredDaysexpiredDaysexpiredDays');
        return this.pwdExpired && (this.pwdReqCount < 2) && (this.pwdExpired > this.currentTime) ? Math.floor((this.pwdExpired - this.currentTime) / (60 * 60 * 24 * 1000))  : 0
      },
      // pwdShow: {
      //   get(){
      //     if(this.pwdExpired) {
      //       return (this.pwdExpired - new Date().getTime()) <= (60 * 60 * 24 * 1000 * 15)
      //     }else {
      //       return false
      //     }
      //   },
      //   set(v) {
      //     this.$store.commit('user/SET_PWD_EXPIRED', '')
      //   }
      // },
    },
    mounted() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1; //判断是否IE<11浏览器
      if(isIE && !isIE11){
        console.log('请使用ie11版本浏览器');
        this.versionShow = true
        // alert('请使用ie11版本浏览器')
      }
    },
    methods: {
      editPwd() {
        document.cookie = `JSESSIONID='';domain=.aoyuan.net;`
        document.cookie = `ssoToken='';domain=.aoyuan.net;`
        let locale = localStorage.locale || '', opened = sessionStorage.opened || ''
        localStorage.clear()
        localStorage.locale = locale
        sessionStorage.clear()
        sessionStorage.opened = opened
        location.href = process.env.VUE_APP_RESET_PWD_URL
      }
    }
  }
</script>
<style lang="scss">
  @import "@/assets/style/reset.scss";
  @import "@/assets/style/icon.scss";
  @import "@/assets/style/common.scss";
#app {
  font-family: "PingFang SC", "Lantinghei SC", "Helvetica Neue", Arial, "Microsoft YaHei", "WenQuanYi Micro Hei", "Heiti SC", "Segoe UI",  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  .version-tip{
    &__body{
      padding: 78px 0;
      img{
        width: 280px;
        height: 175px;
        margin-bottom: 22px;
      }
      font-size: 18px;
    }
  }
  .pwd-tip{
    .el-dialog{
      width: 557px;
      position: absolute;
      margin-top: 0 !important;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 0;
    }
    &__body{
      img{
        width: 100%;
        height: 140px;
        margin-bottom: 35px;
      }
      color: #333;
      font-size: 18px;
    }
    &__footer{
      margin-top: 30px;
      padding-bottom: 47px;
      .btn{
        width: 102px;
      }
    }
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.el-pagination__editor .el-input__inner  {
  line-height: 1.458vw !important;
}
</style>
