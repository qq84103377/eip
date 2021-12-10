<template>
  <div class="head-module">
    <div class="head-info">
      <img class="log-icon" src="@assets/images/login_logo.png" alt="" @click="goIndex">
      <div class="head-right-main">
        <div class="head-user-info" @click="goMyInfo"><img class="user-img" :src="smallPhotoUrl" alt=""><span class="user-name">{{ userName }}</span></div>
        <div class="head-logout" @click="handleClickLogout">{{ $t("homeMsg.logout") }}</div>
        <div class="head-sc" @click="handleClickService">{{ $t("homeMsg.sc") }}</div>
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
        <div :class="['head-seach', {'intColor':isFocus}]">
          <input @keyup.enter="handleClickSearch" v-model="seachValue" class="head-seach-ipt" type="text" maxlength="50" :placeholder="$t('homeMsg.seach')" @focus="isFocus = true" @blur="isFocus = false">
          <span class="head-seach-btn" @click="handleClickSearch"></span>
        </div>
      </div>
    </div>
    <div v-show="isShowNav" class="nav-menu">
      <div class="nav-main">
        <div v-for="item in navMain" :key="item.id" :class="['nm-item', {'active': item.id === isActiveId }]" @click="handleClickMainNav(item)">{{ navMainFormat(item.id) }}</div>
      </div>
      <div class="nav-sub">
        <div v-for="value in navSub" :key="value.id" v-analyse="{pageEvent:'点击'+value.name, name: value.name, isDisable: value.disable }" :class="['ns-item', {'active': value.id === isActiveSid }]" @click="handleClickSubNav(value.id)">{{ navSubFormat(value.id) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { analyse } from '@utils/analyse'
import smallPhotoUrl from '@assets/images/home_avatar_default.png'
import API from '@api'
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
      smallPhotoUrl: '',
      seachValue: '',
      isActiveId: 1,
      isActiveSid: null,
      isFocus: false,
      disable: false,
      navMain: [
        {
          name: this.$t("publicMsg.home"),
          id: 1
        },
        {
          name: this.$t("homeMsg.reg"),
          id: 2
        },
        {
          name: this.$t("homeMsg.creg"),
          id: 3
        },
        {
          name: this.$t("homeMsg.iig"),
          id: 4
        },
        {
          name: this.$t("homeMsg.hlg"),
          id: 5
        },
        {
          name: this.$t("homeMsg.cig"),
          id: 6
        },
        {
          name: this.$t("homeMsg.ctg"),
          id: 7
        },
        {
          name: this.$t("homeMsg.amg"),
          id: 8
        },
        {
          name: this.$t("homeMsg.ucg"),
          id: 9
        }
      ],
      navSub: [
        {
          name: this.$t("homeMsg.new"),
          id: 1,
          disable: true
        },
        {
          name: this.$t("homeMsg.ayhj"),
          id: 2,
          disable: false
        },
        {
          name: this.$t("homeMsg.mw"),
          id: 3,
          disable: true
        },
        {
          name: this.$t("homeMsg.kc"),
          id: 4,
          disable: false
        },
        {
          name: this.$t("homeMsg.cc"),
          id: 5,
          disable: true
        },
        {
          name: this.$t("homeMsg.ab"),
          id: 6,
          disable: false
        }
      ]
    }
  },
  computed: {
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
          name = this.$t("homeMsg.reg")
          break
        case 3:
          name = this.$t("homeMsg.creg")
          break
        case 4:
          name = this.$t("homeMsg.iig")
          break
        case 5:
          name = this.$t("homeMsg.hlg")
          break
        case 6:
          name = this.$t("homeMsg.cig")
          break
        case 7:
          name = this.$t("homeMsg.ctg")
          break
        case 8:
          name = this.$t("homeMsg.amg")
          break
        case 9:
          name = this.$t("homeMsg.ucg")
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
          name = this.$t("homeMsg.ayhj")
          break
        case 3:
          name = this.$t("homeMsg.mw")
          break
        case 4:
          name = this.$t("homeMsg.kc")
          break
        case 5:
          name = this.$t("homeMsg.cc")
          break
        case 6:
          name = this.$t("homeMsg.ab")
          break
        }
        return name
      }
    }
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
    this.smallPhotoUrl  = window.SITE_CONFIG.oaUrl+localStorage.getItem('smallPhotoUrl') || smallPhotoUrl
  },
  methods: {
    viewOa(){
      window.open(`http://ayoa.aoyuan.net/sys/portal/page.jsp`, '_blank')
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
      this.$router.push({ name: 'service'})
    },
    // 切换语言
    handleClickChangeLg(type) {
      this.isShowLgBox = false
      this.$i18n.locale = type
      localStorage.setItem('locale', type)
      let params = {
        lang: type
      }
      API.setting.setLang(params).then(res => {})
      // document.cookie = `j_lang=${type}` // 设置cookie
    },
    // 搜索
    handleClickSearch () {
      window.open(`${window.SITE_CONFIG.oaUrl}/sys/ftsearch/searchBuilder.do?method=search#&queryString=${this.seachValue}&newLUI=true&searchAll=true`, '_blank')
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
      this.isActiveSid = id
      switch (id) {
      case 1 : // 新闻中心
        this.$router.push({ name: 'news', query: { id: this.isActiveId, sid: id } })
        break
      case 2 : // 奥园火炬
        window.open('https://ayhj.aoyuan.net/login.html', '_blank')
        break
      case 3 : // 我的工作台
        this.$router.push({ name: 'workbench', query: { id: this.isActiveId, sid: id }})
        break
      case 4 : // 知识中心
        window.open(`${window.SITE_CONFIG.oaUrl}/sys/portal/page.jsp?pageId=15e5b0d87803ac9b8414bbf486db8f70`, '_blank')
        break
      case 5 : // 企业文化
        this.$router.push({ name: 'culture', query: { id: this.isActiveId, sid: id } })
        break
      case 6 : // 通讯录
        window.open(`${window.SITE_CONFIG.oaUrl}/km/review/treeoacontacts/`, '_blank')
        break
      }
    }
  }
}
</script>
<style lang="scss">
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
      font-size: 12px;
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
    width: 100%;
    .head-info {
      height: 94px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px 0 38px;
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
        font-size: 12px;
        color: #666;
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
          margin: auto 30px;
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
              font-size: 12px;
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
          line-height: 35px;
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
      height: 100px;
      .nav-main {
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #006E38;
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        .nm-item {
          flex: 1;
          height: 56px;
          line-height: 56px;
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
        width: 100%;
        height: 44px;
        display: flex;
        align-items: center;
        background: #F7F8F8;
        font-size: 12px;
        color: #333333;
      }
      .ns-item {
          flex: 0 0 213.5px;
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
              width: 48px;
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
