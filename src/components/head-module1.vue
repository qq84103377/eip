<template>
  <div class="head-module">
    <div>
      <div class="head-info">
        <img class="log-icon" src="@assets/images/login_logo.png" alt="" @click="goIndex">
        <div class="head-right-main">
          <div :class="['head-seach', {'intColor':isFocus}]">
            <el-input clearable @keyup.enter="handleClickSearch" v-model="seachValue" class="head-seach-ipt" type="text" maxlength="50" :placeholder="$t('homeMsg.seach')" @focus="isFocus = true" @blur="isFocus = false"></el-input>
            <span class="head-seach-btn" @click="handleClickSearch"></span>
          </div>
          <div class="head-sc" @click="handleClickService">{{ $t("homeMsg.sc") }}</div>
<!--          <span @click="openAdmin" class="ml20" style="cursor: pointer">管理后台</span>-->

          <div class="head-user-info" @click="openAdmin">{{ $t("homeMsg.bm") }}</div>
          <div class="head-user-info" @click="viewOa">{{ $t("homeMsg.oa") }}</div>
          <div class="head-language">
            <el-popover
                    placement="bottom"
                    width="120px"
                    popper-class="lg-box"
                    trigger="hover">
              <div class="lg-item" @click="handleClickChangeLg('zh-CN')">中文</div>
              <div class="lg-item" @click="handleClickChangeLg('en-US')">English</div>
              <span slot="reference">{{ $t("homeMsg.lg") }}</span>
            </el-popover>
          </div>
          <div class="head-user-info" @click="goMyInfo"><img @error="handleError" class="user-img" :src="headImg"><span class="user-name">{{ userName }}</span></div>
          <div class="head-logout" @click="handleClickLogout">{{ $t("homeMsg.logout") }}</div>
        </div>
      </div>
    </div>
    <div v-show="isShowNav" class="nav-menu">
<!--      <div class="nav-main-wrap">-->
        <div class="nav-main">
          <div v-for="item in navMain" :key="item.id" :class="['nm-item', {'active': item.id === isActiveId }]" @click="handleClickMainNav(item)">{{ navMainFormat(item.id) }}</div>
        </div>
<!--      </div>-->

      <div class="nav-sub">
        <div v-for="value in navSub" :key="value.id" v-analyse="{pageEvent:'点击'+value.name, name: value.name, isDisable: value.disable }" :class="['ns-item', {'active': value.id === isActiveSid }]" @click="handleClickSubNav(value.id)">
          <el-popover
                  v-if="value.showTip && path === '/news' && false"
                  popper-class="pop__count"
                  placement="right"
                  :visible-arrow="false"
                  trigger="hover">
            <el-badge slot="reference" :value="newsInfoNum" :max="99" class="badge">
              <span>{{ navSubFormat(value.id) }}</span>
            </el-badge>
            <div class="pop__count__main" v-if="newsInfoUnreadNum">
              <div class="pop__count__main__item"><span>本周已读{{newsInfoReadedNum}},未读{{newsInfoUnreadNum}}，阅读进度{{newsInfoReadedPercent}}%</span></div>
            </div>
          </el-popover>
          <span v-else>{{ navSubFormat(value.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { analyse } from '@utils/analyse'
import Bus from '@utils/bus'
import smallPhotoUrl from '@assets/images/home_avatar_default.png'
import API from '@api'
import { mapState } from 'vuex'

export default {
  name: 'HeadModule',
  props: {
    isShowNav: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      headImg: '',
      defaultImg: smallPhotoUrl,
      seachValue: '',
      isActiveId: 1,
      isActiveSid: null,
      isFocus: false,
      disable: false,
      newsReadInfoData: {},
      navMain: [
        {
          name: this.$t("publicMsg.home"),
          id: 1
        },
        {
          name: this.$t("homeMsg.ay"),
          id: 2
        },
        {
          name: this.$t("homeMsg.reg"),
          id: 3
        },
        {
          name: this.$t("homeMsg.creg"),
          id: 4
        },
        {
          name: this.$t("homeMsg.iig"),
          id: 5
        },
        {
          name: this.$t("homeMsg.hlg"),
          id: 6
        },
        {
          name: this.$t("homeMsg.cig"),
          id: 7
        },
        {
          name: this.$t("homeMsg.ctg"),
          id: 8
        },
        {
          name: this.$t("homeMsg.amg"),
          id: 9
        },
        {
          name: this.$t("homeMsg.ucg"),
          id: 10
        },
        {
          name: this.$t("homeMsg.abv"),
          id: 11
        }
      ],
      navSub: [
        {
          name: this.$t("homeMsg.new"),
          showTip: true,
          id: 1,
          disable: true
        },
        {
          name: this.$t("homeMsg.mw"),
          id: 2,
          disable: true
        },
        {
          name: this.$t("homeMsg.ayhj"),
          id: 3,
          disable: false
        },
        {
          name: this.$t("homeMsg.email"),
          id: 4,
          disable: false
        },
        {
          name: this.$t("homeMsg.ab"),
          id: 5,
          disable: false
        },
        {
          name: this.$t("homeMsg.cc"),
          id: 6,
          disable: true
        },
        {
          name: this.$t("homeMsg.kc"),
          id: 7,
          disable: false
        },
        {
          name: this.$t("homeMsg.self"),
          id: 8,
          disable: false
        },
      ],
    }
  },
  computed: {
    path(){
      return this.$route.path
    },
    newsInfoNum() {
      let num = '';
      if ( this.newsReadInfoData && this.newsReadInfoData.unread != undefined && this.newsReadInfoData.unread > 0 ) {
        let unread = this.newsReadInfoData.unread;
        num = unread;
      }
      return num;
    },
    newsInfoUnreadNum() {
      let num = 0;
      if ( this.newsReadInfoData && this.newsReadInfoData.unread != undefined ) {
        let unread = this.newsReadInfoData.unread;
        num = unread;
      }
      return num;
    },
    newsInfoReadedNum() {
      let num = 0;
      if ( this.newsReadInfoData && this.newsReadInfoData.read != undefined ) {
        let read = this.newsReadInfoData.read;
        num = read;
      }
      return num;
    },
    newsInfoReadedPercent() {
      let read = 0;
      let unread = 0;
      if ( this.newsReadInfoData && this.newsReadInfoData.read != undefined ) {
        read = this.newsReadInfoData.read;
      }
      if ( this.newsReadInfoData && this.newsReadInfoData.unread != undefined ) {
        unread = this.newsReadInfoData.unread;
      }
      let total = unread + read;
      if ( total > 0 && read > 0 ) {
        return (Math.round(read / total * 10000) / 100);
      }
      return 0;
    },
    userName() {
      return this.$i18n.locale === 'en-US' ? `${this.$t("homeMsg.username")}`: `${this.$store.getters.name} ${this.$t("homeMsg.username")}`
    },
    navMainFormat(id) {
      return (id) => {
        let name = ''
        switch (id) {
        case 1:
          name = this.$t("publicMsg.home")
          break
        case 2:
          name = this.$t("homeMsg.ay")
          break
        case 3:
          name = this.$t("homeMsg.reg")
          break
        case 4:
          name = this.$t("homeMsg.creg")
          break
        case 5:
          name = this.$t("homeMsg.iig")
          break
        case 6:
          name = this.$t("homeMsg.hlg")
          break
        case 7:
          name = this.$t("homeMsg.cig")
          break
        case 8:
          name = this.$t("homeMsg.ctg")
          break
        case 9:
          name = this.$t("homeMsg.amg")
          break
        case 10:
          name = this.$t("homeMsg.ucg")
          break
        case 11:
          name = this.$t("homeMsg.abv")
          break
        }
        return name
      }
    },
    navSubFormat(id) {
      return (id) => {
        let name = ''
        switch (id) {
        case 1:
          name = this.$t("homeMsg.new")
          break
        case 2:
          name = this.$t("homeMsg.mw")
          break
        case 3:
          name = this.$t("homeMsg.ayhj")
          break
        case 4:
          name = this.$t("homeMsg.email")
          break
        case 5:
          name = this.$t("homeMsg.ab")
          break
        case 6:
          name = this.$t("homeMsg.cc")
          break
        case 7:
          name = this.$t("homeMsg.kc")
          break
        case 8:
          name = this.$t("homeMsg.self")
          break
        }
        return name
      }
    },
    ...mapState({
      mailwhitelist (state) {
        return state.user.permission.mailwhitelist;
      }
    }),
  },
  watch: {
    '$route.path': function (val) {
      if (val == '/home') {
        this.disable = true
      } else {
        this.disable = false
      }
      this.isActiveSid = Number(this.$route.query.sid) || null
      this.isActiveId = Number(this.$route.query.id) || 1
    }
  },
  created() {
    this.isActiveId = Number(this.$route.query.id) || 1
    this.isActiveSid = Number(this.$route.query.sid) || null
    this.getUserInfo()
    // this.$store.getters.name
    // this.smallPhotoUrl  = window.SITE_CONFIG.oaUrl+localStorage.getItem('smallPhotoUrl') || smallPhotoUrl
    // this.getNewsReadInfo()
    // Bus.$on('updateNum', () => {
    //   this.newsReadInfoData.unread--
    //   this.newsReadInfoData.read++
    // })
  },
  mounted(){
  },
  methods: {
    openAdmin(){
      window.open('/admin')
    },
    handleError(e) {
      e.target.src = this.defaultImg
    },
    getUserInfo(){
      API.setting.getOaUser().then(async ({data}) => {
        if (data) {
          if (data.code === 200) {
            this.$store.commit('user/SET_NAME', data.data.username)
            this.$store.commit('user/SET_SMALLPHOTOURL', data.data.smallPhotoUrl)
            localStorage.setItem('userName', data.data.username)
            localStorage.setItem('dep', data.data.dep)
            localStorage.setItem('smallPhotoUrl', data.data.smallPhotoUrl)
            this.headImg = process.env.VUE_APP_OA_URL + data.data.smallPhotoUrl + '&_t=' + new Date().getTime()
            localStorage.removeItem('pageJourney')
            if (data.data.orgPageCode == 0) {
              // this.$message.error(this.$t('publicMsg.loginError'))
            } else {
              // this.$message.success(this.$t('publicMsg.loginsuccess'))
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
    },
    //获取新闻已读未读数量
    getNewsReadInfo() {
      let params = {};
      API.news.getNewsReadInfo(params).then((res) => {
        if (res.data.code === 200 && res.data.data) {
          this.newsReadInfoData = res.data.data;
        }
      });
    },
    viewOa(){
      window.open(process.env.VUE_APP_OA_URL, '_blank')
    },
    // 回到首页
    goIndex () {
      this.isActiveSid = ''
      if(this.$route.path && this.$route.path === '/home') {
        // this.$router.push({ name: 'home'})
        // this.$router.go(0)
        this.$router.push({ name: 'home', query: { id:1 }})
      } else {
        // this.$router.push({ name: 'home'})
        this.$router.push({ name: 'home', query: { id:1 }})
      }
    },
    // 跳转个人信息页
    goMyInfo() {
      this.isActiveSid = ''
      this.isActiveId = 1
      this.$router.push({ name: 'setting'})
    },
    // 退出登录
    handleClickLogout() {
      this.$confirm(this.$t('publicMsg.logoutBoxTips'), this.$t('publicMsg.warning'), {
        cancelButtonText: this.$t('publicMsg.cancel'),
        confirmButtonText: this.$t('publicMsg.ok'),
        type: 'warning',
      }).then(() => {
        document.cookie = `JSESSIONID='';domain=.aoyuan.net;`
        document.cookie = `ssoToken='';domain=.aoyuan.net;`
        let locale = localStorage.locale || '', opened = sessionStorage.opened || ''
        localStorage.clear()
        localStorage.locale = locale
        sessionStorage.clear()
        sessionStorage.opened = opened
        location.href = process.env.VUE_APP_LOGINOUT_URL

        return
        this.$store.dispatch('user/logout').then((data) => {
          if (data) {
            if (data.data.code === 200) {
              this.$message.success(this.$t('publicMsg.logoutsuccess'))
              this.$router.push({ name: 'login'})
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          this.$router.push({ name: 'login'})
          this.$message.error(error.msg)
        })
      })
    },
    // 服务咨询
    handleClickService() {
      this.$router.push({ name: 'service', query: {id: this.$route.query.id || 1}})
    },
    // 切换语言
    handleClickChangeLg(type) {
      this.isShowLgBox = false
      this.$i18n.locale = type
      localStorage.setItem('locale', type)
      // let params = {
      //   lang: type
      // }
      // API.setting.setLang(params).then(res => {})
      // document.cookie = `j_lang=${type}` // 设置cookie
    },
    // 搜索
    handleClickSearch () {
      if(this.seachValue === ''){
        return this.$message.error(this.$t('homeMsg.seach'))
      }
      window.open(`${process.env.VUE_APP_OA_URL}/sys/ftsearch/searchBuilder.do?method=search#&queryString=${this.seachValue}&newLUI=true&searchAll=true`, '_blank')
    },
    // 跳转到菜单导航对应路由
    handleClickMainNav(item) {
      this.isActiveSid = ''
      let id = this.isActiveId = item.id
      let that = this
      // 方式多次上报埋点
      setTimeout(function() {
        if (!that.disable) {
          let pageEvent = '点击'+ item.name
          let name = item.name + (item.id != 1 ? '首页':'')
          analyse(pageEvent)
        } else {
          that.disable = false
        }
      }, 100)
      this.$router.push({ name: 'home', query: { id }})
    },
    // 二级菜单跳转链接
    handleClickSubNav(id) {
      switch (id) {
      case 1 : // 新闻中心
        this.isActiveSid = id
        this.$router.push({ name: 'news', query: { id: this.isActiveId, sid: id } })
        break
      case 2 : // 我的工作台
        this.isActiveSid = id
        this.$router.push({ name: 'workbench', query: { id: this.isActiveId, sid: id }})
        break
      case 3 : // 奥园火炬
        window.open(`${process.env.VUE_APP_HJ}`, '_blank')
        break
        case 4 : // 我的邮箱
          window.open(`https://mail.aoyuan.net/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fmail.aoyuan.net%2fowa`, '_blank')
          break
        case 5 : // 通讯录
          // window.open(`${window.SITE_CONFIG.oaUrl}/km/review/treeoacontacts/`, '_blank')
          console.log(this.mailwhitelist,'=4=4=4=44=4=4');
          this.$router.push({ name: this.mailwhitelist ? '_addressList' : 'addressList', query: { id: this.isActiveId, sid: id } })
          break
        case 6 : // 企业文化
          this.isActiveSid = id
          this.$router.push({ name: 'culture', query: { id: this.isActiveId, sid: id } })
          break
      case 7 : // 知识中心
        window.open(`https://km.aoyuan.net/default.aspx`, '_blank')
        break
      case 8 : // 我的自助
        window.open(window.SITE_CONFIG.staticUrls.selfUrl.url, '_blank')
        break
      }
    }
  }
}
</script>
<style lang="scss">
  .pop__count{
    z-index: -10;
    min-width: auto;
    height: 40px;
    padding: 0 0;
    border: none;
    box-shadow: none;
    background: transparent;
    &__main{
      /*width: auto;*/
      height: 40px;
      background: url('../assets/images/news_tips_bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 0 18px;
      &__item{
        span{
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          color: #FA9F1F;
        }
      }
    }
  }
  .el-popover.lg-box {
    width: 120px;
    height: 130px;
    background: #fff;
    box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.09);
    padding: 0;
    border: none;
    .lg-item {
      width: 100%;
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: 14px;
      color: #666;
      position: relative;
      cursor: pointer;
      &:first-child {
        border-bottom: 1px solid #E8E8E8;
      }
      // &:first-child::before {
      //   content: '';
      //   position: absolute;
      //   width: 0;
      //   height: 0;
      //   border-left: 10px solid transparent;
      //   border-right: 10px solid transparent;
      //   border-bottom: 10px solid #fff;
      //   top: -10px;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      &:hover {
        background: #F2FBF7;
      }
    }
  }
  .head-module {
    .el-badge{
      outline: none;
    }
    .el-badge__content{
      right: 0;
    }
    .head-info {
      /*width: 1600px;*/
      /*margin: 0 auto;*/
      height: 84px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 160px;
      box-sizing: border-box;
      background: #fff;
      .log-icon {
        width: 110px;
        height: 60px;
        cursor: pointer;
      }
      .head-right-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        color: #222;
        .head-user-info {
          display: flex;
          align-items: center;
          margin-right: 30px;
          cursor: pointer;
          .user-img {
            width: 24px;
            height: 24px;
          }
          .user-name {
            display: inline-block;
            margin-left: 8px;
          }
        }
        .head-logout {
          margin-right: 30px;
          padding: 1px 10px 2px 10px;
          box-sizing: border-box;
          border-radius: 2px;
          background: #f5f5f5;
          text-align: center;
          cursor: pointer;
        }
        .head-sc {
          margin: auto 30px auto 40px;
          position: relative;
          cursor: pointer;
          &::before {
            width: 16px;
            height: 16px;
            content: '';
            position: absolute;
            top: 50%;
            left: -24px;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            background: url("../assets/images/home_questions.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .head-language {
          margin: auto 56px auto 30px;
          position: relative;
          cursor: pointer;
          display: inline-block;
          span::before {
            width: 16px;
            height: 16px;
            content: '';
            position: absolute;
            top: 50%;
            left: -24px;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            background: url("../assets/images/home_language.png") no-repeat;
            background-size: 100% 100%;
          }
          .lg-box {
            width: 120px;
            height: 130px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -145px;
            background: #fff;
            box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.09);
            .lg-item {
              width: 100%;
              height: 65px;
              line-height: 65px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-bottom: 1px solid #E8E8E8;
              position: relative;
              &:first-child::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #fff;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
              }
              &:last-child {
                border-bottom: none;
              }
              &:hover {
                background: #F2FBF7;
              }
            }
          }
        }
        .head-seach {
          width: 311px;
          height: 35px;
          border-radius: 3px;
          border:1px solid rgba(214,214,214,1);
          border-right-color: #006E38;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.intColor {
            border-color: #006E38;
          }
          input::-webkit-input-placeholder {  	/* WebKit browsers */
            color: #C8C8C8;
          }
          input:-moz-placeholder {            	/* Mozilla Firefox 4 to 18 */
            color: #C8C8C8;
          }
          input::-moz-placeholder {           	/* Mozilla Firefox 19+ */
            color: #C8C8C8;
          }
          input:-ms-input-placeholder {       	/* Internet Explorer 10+ */
            color: #C8C8C8;
          }
          .head-seach-ipt {
            padding-left: 10px;
            height: 100%;
            input{
              line-height: 35px;
              height: 100%;
              border: none;
            }
          }
          .head-seach-btn {
            width: 35px;
            height: 35px;
            display: inline-block;
            background: url("../assets/images/home_search.png") no-repeat center center #006E38;
            background-size: 18px 18px;
          }
        }
      }
    }
    .nav-menu {
      width: 100%;
      /*height: 100px;*/
      .nav-main-wrap{
        background: #006E38;
        width: 100%;
      }
      .nav-main {
        /*margin: 0 auto;*/
        padding: 0 160px;
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #006E38;
        font-size: 18px;
        color: #fff;
        font-weight: 500;
        .nm-item {
          white-space: nowrap;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          height: 56px;
          line-height: 14px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background: #3EB370;
          }
          &.active {
            background: #3EB370;
          }
        }
      }
      .nav-sub {
        margin: 0 auto;
        width: 1600px;
        height: 44px;
        display: flex;
        align-items: center;
        background: #F7F8F8;
        font-size: 16px;
        color: #333333;
      }
      .ns-item {
          flex: 0 0 177.77px;
          height: 17px;
          line-height: 17px;
          text-align: center;
          cursor: pointer;
          border-right: 1px solid #E7E6E6;
          box-sizing: border-box;
          &:hover {
            color: #006E38;
          }
          &.active {
            color: #006E38;
            position: relative;
            &::after {
              content: '';
              width: 65px;
              height: 3px;
              background: #006E38;
              position: absolute;
              left: 50%;
              bottom: -8px;
              transform: translateX(-50%);
              -webkit-transform: translateX(-50%);
            }
          }
          &:last-child {
            border-right: none;
          }
        }
    }
  }
</style>
