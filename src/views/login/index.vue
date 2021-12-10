<template>
    <section class="login-wrap">
      <div class="login-top">
        <img class="log-icon" src="@assets/images/login_logo.png" alt="">
        <div class="lt-right">
          <span class="ch-btn" @click="handleSwitchStyle('zh-CN')">中文</span>
          <span>|</span>
          <span class="en-btn" @click="handleSwitchStyle('en-US')">English</span>
        </div>
      </div>
      <div class="login-bg">

        <el-carousel :interval="5000" style="width: 100%;position: absolute;height: 100%;left: 0;top: 0;" arrow="never" indicator-position="none">
          <el-carousel-item v-for="(item,index) in loginBg" :key="index">
            <img style="width: 100%;height: 100%;" :src="item.image" alt="">
          </el-carousel-item>
        </el-carousel>

        <div class="login-box">
          <div class="login-title">{{ $t("loginMsg.signInTheSystem") }}</div>
          <el-form ref="dataForm" :model="dataForm" :rules="dataRule" status-icon @keyup.enter.native="dataFormSubmit()">
            <el-form-item required prop="userName" class="mb28">
              <div class="login-ipt userName"><el-input v-model.trim="dataForm.userName" type="text" minlength="1" maxlength="50" :placeholder="$t('loginMsg.username')"></el-input></div>
            </el-form-item>
            <el-form-item prop="password">
              <el-popover
                      placement="bottom-start"
                      trigger="manual"
                      content="大写锁定已打开"
                      v-model="capTip">
                <div slot="reference" class="login-ipt password"><el-input ref="pwdInput" @blur="capTip=false" @keyup.native="handleCap" v-model.trim="dataForm.password" minlength="6" maxlength="100" type="password" :placeholder="$t('loginMsg.password')"></el-input></div>
              </el-popover>
            </el-form-item>
            <el-form-item v-show="isShowCaptcha" prop="captcha">
                <div class="code-ipt">
                  <el-input v-model="dataForm.captcha" auto-complete="off" clearable></el-input>
                  <img class="code-img" :placeholder="$t('loginMsg.captcha')" :src="codeImgUrl" :alt="$t('loginMsg.captchaAlt')" @click="getCodeImg" />
                </div>
            </el-form-item>
            <el-form-item style="text-align: right;">
              <a class="forgot-password" href="https://um.aoyuan.net/Account/ResetPwd?account=" target="_blank">{{ $t("loginMsg.forgotPassword") }}</a>
            </el-form-item>
            <div class="login-btn-submit" @click="dataFormSubmit">{{ $t("loginMsg.login") }}</div>
<!--            <div v-show="isShowTips" class="login-tips">{{ $i18n.locale === 'en-US' ? systemTipsEn : systemTipsZh }}</div>-->
            <div v-show="isShowTips" class="login-tips">{{ systemTipsZh }}</div>
            <div class="login-more-btn">
              <a class="email-btn" href="https://mail.aoyuan.net" target="_blank">{{ $t("loginMsg.loginEmail") }}</a>
              <span>|</span>
              <a class="account-btn" href="https://um.aoyuan.net/" target="_blank">{{ $t("loginMsg.selfService") }}</a>
            </div>
          </el-form>
        </div>
      </div>
    </section>
</template>

<script>
  import axios from 'axios'
import API from '@api'
import { validateName } from '@utils/validate'
import { getOs, getCurrentBrowser  } from '@utils/systemTool'
import {desEncrypt} from '@utils/encryption'
import { JSEncrypt } from 'jsencrypt'
  import {getUUID} from '@/utils'

export default {
  name: "Login",
  data () {
    return {
      dataForm: {
        userName: '',
        password: '',
        captcha: ''
      },
      isShowCaptcha: false,
      isShowTips: false,
      codeImgUrl: '',
      systemTipsZh: '系统提示： 用户名或密码不正确，还有4次登录尝试机会',
      systemTipsEn: 'System prompt: the user name or password is incorrect, there are 4 login attempts',
      loginBg: [],
      uuid: '',
      jSessionId: '',
      capTip: false,
    }
  },
  computed: {
    dataRule() {
      return {
        userName: [{ required: true, message: this.$t('loginMsg.rule.username'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('loginMsg.rule.password'), trigger: 'blur' }],
        captcha: this.isShowCaptcha && [{ required: true, message: this.$t('loginMsg.rule.captcha'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEipBanner()
    this.getJSessionId()
    this.getCodeImg()

  },
  methods: {
    handleCap(evt){
      this.capTip = evt.getModifierState("CapsLock")
    },
    // 获取验证码
    getCodeImg () {
      this.uuid = getUUID()
      this.codeImgUrl = API.login.captcha(this.uuid)
    },
    getJSessionId(){
      // axios.get(`${(process.env.NODE_ENV !== 'production' ? '/ayoa' : 'http://ayoa.aoyuan.net:8080')}/resource/js/session.jsp?_=1603789246575&s_ajax=true`).then(res => {
      //   try{
      //     this.jSessionId = eval(`${res.data};getSessionId()`)
      //   }catch{}
      // })
      API.login.getjsessionId().then(res => {
        if(res.data.code === 200) {
          try{
            this.jSessionId = eval(`${res.data.data};getSessionId()`)
            window._jSessionId = this.jSessionId
          }catch{}
        }
      })
    },
    getEipBanner() {
      let params = {
        location: 1
      }
      API.news.getEipBanner(params).then(res => {
        if(res.data.code === 200) {
          this.loginBg = res.data.data || []
        }
      })
    },
    handleSwitchStyle (type) {
      this.$i18n.locale = type
      localStorage.setItem('locale', type)
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if(this.dataForm.userName) {
            if (validateName(this.dataForm.userName)) return this.$message.error(this.$t('loginMsg.rule.name'))
          } else {
            return this.$message.error(this.$t('loginMsg.rule.username'))
          }
          // let params = {
          //   deviceId : getOs() || '',
          //   userAgent: getCurrentBrowser().split('.')[0] || '',
          //   username: this.dataForm.userName,
          //   password: this.dataForm.password,
          //   lang: localStorage.getItem('locale') || 'zh-CN',
          //   captcha: this.dataForm.captcha
          // }
          let params = {
            'j_username': this.dataForm.userName,
            'j_password': desEncrypt(this.dataForm.password),
            'password': this.encryptedData(this.dataForm.password),
            'jSessionId': this.jSessionId,
            'device': getOs() || '',
            'webBrowser': getCurrentBrowser().split('.')[0] || '',
            'temp': this.uuid,
            'captcha': this.dataForm.captcha
          }
          this.$store.dispatch('user/login', params).then(async (data) => {
            if(data.code === 200){
              if(data.data.apiCookie){
                document.cookie = `${data.data.apiCookie[0]}${process.env.NODE_ENV === 'production' ? ';domain=.aoyuan.net;' : ''}` // 设置cookie
                if(data.data.apiCookie2[0]){
                  document.cookie = `${data.data.apiCookie2[0]}${process.env.NODE_ENV === 'production' ? ';domain=.aoyuan.net;' : ''}` // 设置cookie
                }
                localStorage.setItem('token',this.getCookie(data.data.apiCookie[0]))
                this.getUserInfo()
              }else{

                if(data.data.status === 'errorPwd'){
                  this.dataForm.password = ''
                  this.$refs['pwdInput'].focus()
                  this.isShowCaptcha = data.data.errorPwdCount >= 2
                  if(data.data.errorPwdCount < 5) {
                    this.systemTipsZh = `系统提示： ${data.data.message}，还有${5 - data.data.errorPwdCount}次登录尝试机会`
                    // this.systemTipsEn = `System prompt: ${data.data.message === '验证码错误' ? 'verification code is incorrect' : 'the user name or password is incorrect'}, there are ${5 - data.data.errorPwdCount} login attempts`
                  }else{
                    this.systemTipsZh = `系统提示： ${data.data.message}`
                    // this.systemTipsEn = `System prompt: ${data.data.message === '验证码错误' ? 'verification code is incorrect' : 'the user name or password is incorrect'}, there are ${5 - data.data.errorPwdCount} login attempts`
                  }
                }else if(data.data.status === 'errorCap'){
                  this.isShowCaptcha = true
                  this.systemTipsZh = `系统提示： ${data.data.message}`
                }
                else{
                  this.systemTipsZh = `系统提示： ${data.data.message}`
                }
                this.isShowTips = true
                this.getCodeImg()
              }

            }else{
              this.$message.error(data.message)
              this.getJSessionId()
              this.getCodeImg()
            }
          }).catch((error) => {
            this.$message.error(error.message)
            this.getJSessionId()
            this.getCodeImg()
          })
        }
      })
    },
    getCookie(strCookie) {
      // var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if('JSESSIONID' == arr[0]){
          return arr[1];
        }
      }
      return "";
    },
    getUserInfo(){
      API.setting.getOaUser().then(async ({data}) => {
        if (data) {
          if (data.code === 200) {
            this.$store.commit('user/SET_NAME', data.data.username)
            localStorage.setItem('userName', data.data.username)
            localStorage.setItem('smallPhotoUrl', data.data.smallPhotoUrl)
            localStorage.removeItem('pageJourney')
            if (data.data.orgPageCode == 0) {
              this.$message.error(this.$t('publicMsg.loginError'))
            } else {
              this.$message.success(this.$t('publicMsg.loginsuccess'))
              if(data.data.orgPageCode == 4){
                await this.setEn()
              }
              console.log(321);
              this.$router.replace({ name: 'home', query: { id: data.data.orgPageCode } })
            }
          } else if (data.code === 401) {
            this.isShowTips = true
          } else {
            this.isShowTips = true
            this.$message.error(data.message)
          }
        } else {
          this.$message.error(data.message)
        }

      }).catch(res => {
        this.$message.error(res.data.message)
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

<style lang="scss">
  .login-wrap {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    .mgb28 {
      margin-bottom: 28px;
    }
    .login-top {
      width: 100%;
      flex: 0 0 96px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px 0 38px;
      box-sizing: border-box;
      font-size: 14px;
      .log-icon {
        width: 110px;
        height: 60px;
      }
      .lt-right {
        .ch-btn, .en-btn {
          color: #666666;
          cursor: pointer;
          display: inline-block;
        }
        .ch-btn {
          padding-right: 14px;
        }
        .en-btn {
          padding-left: 14px;
        }
      }
    }
    .login-bg {
      flex: 1;
      width: 100%;
      /*background: url("../../assets/images/login_bg.png") no-repeat;*/
      /*background-size: 100% 100%;*/
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      position: relative;
      .login-box {
        z-index: 9;
        margin-top: 160px;
        margin-right: 17%;
        width: 488px;
        height: auto;
        background: rgba(244, 248, 250, 0.94);
        border-radius: 2px;
        border:1px solid rgba(255,255,255,0.74);
        padding: 36px 50px;
        box-sizing: border-box;
        .mb28{
          margin-bottom: 28px;
        }
        .login-title {
          font-size: 24px;
          color: #222;
          font-weight: 500;
          margin-bottom: 38px;
          text-align: left;
        }
        input::-webkit-input-placeholder {  	/* WebKit browsers */
          color: #fff;
          font-size: 16px;
        }
        input:-moz-placeholder {            	/* Mozilla Firefox 4 to 18 */
          color: #fff;
          font-size: 16px;
        }
        input::-moz-placeholder {           	/* Mozilla Firefox 19+ */
          color: #fff;
          font-size: 16px;
        }
        input:-ms-input-placeholder, textarea:-ms-input-placeholder {       	/* Internet Explorer 10+ */
          color: #fff !important;
          font-size: 16px;
        }
        .login-ipt {
          width: 388px;
          height: 54px;
          border-radius: 4px;
          background:rgba(255,255,255,0.24);
          font-size: 16px;
          color: #fff;
          position: relative;
          &::after {
            width: 22px;
            height: 22px;
            content: '';
            position: absolute;
            left: 8px;
            top: 48%;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
          }
          &.userName::after {
            background: url("../../assets/images/login_icon_user.png") no-repeat;
            background-size: 100% 100%;
          }
          &.password::after {
            background: url("../../assets/images/login_icon_code.png") no-repeat;
            background-size: 100% 100%;
          }
          input {
            width: 388px;
            height: 54px;
            padding-left: 40px;
            box-sizing: border-box;
            background-color:transparent;
            border:1px solid rgba(91,109,117,1);
            border-left-color: rgba(255,255,255,0.52);
            border-bottom-color: rgba(255,255,255,0.52);
            font-size: 16px;
            color: #222;
          }
        }
        .code-ipt {
          width: 222px;
          height: 40px;
          border-radius: 4px;
          background:rgba(255,255,255,0.24);
          font-size: 16px;
          color: #fff;
          position: relative;
          display: flex;
          &::after {
            width: 22px;
            height: 22px;
            content: '';
            position: absolute;
            left: 8px;
            top: 48%;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            background: url("../../assets/images/login_icon_captcha.png") no-repeat;
            background-size: 100% 100%;
          }
          input {
            width: 222px;
            height: 40px;
            padding-left: 40px;
            box-sizing: border-box;
            background-color:transparent;
            border:1px solid rgba(91,109,117,1);
            border-left-color: rgba(255,255,255,0.52);
            border-bottom-color: rgba(255,255,255,0.52);
            font-size: 16px;
            color: #222;
          }
          .code-img {
            width: 130px;
            height: 40px;
            margin-left: 20px;
          }
        }
        .forgot-password {
          font-size: 16px;
          color: #666;
          line-height: none;
          display: inline-block;
          font-weight: bold;
        }
        .login-btn-submit {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
          color: #fff;
          background-color: #006E38;
          border-radius:4px;
          margin-bottom: none;
          cursor: pointer;
        }
        .login-tips {
          background: #FEEBEB;
          color: #FF726F;
          font-size: 12px;
          /*height: 36px;*/
          /*line-height: 24px;*/
          position: relative;
          border-radius:4px;
          border:1px solid rgba(250,204,198,1);
          padding: 5px;
          text-align: left;
          box-sizing: border-box;
          margin-top: 20px;
          display: flex;
          align-items: flex-start;
          &::before {
            width: 18px;
            flex: 0 0 18px;
            height: 18px;
            content: '';
            margin-right: 10px;
            /*position: absolute;*/
            /*left: 16px;*/
            /*top: 50%;*/
            /*<!--transform: translateY(-50%);-->*/
            /*<!-- -webkit-transform: translateY(-50%);-->*/
            background: url("../../assets/images/gantanhao-quan.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .login-more-btn {
          width: 100%;
          font-size: 16px;
          margin-top: 38px;
          color: #666;
          font-weight: bold;
          a {
            color: #666;
          }
          .email-btn {
            padding-right: 10px;
          }
          .account-btn {
            padding-left: 10px;
          }
        }
      }
    }
  }
</style>
