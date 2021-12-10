<template>
  <div class="workbench">
    <div class="workbench__body">
      <div class="workbench__body__left">
        <div class="workbench__body__left__header"><i class="iconEIP icon_personal"></i> {{
          $t("workbenchMsg.information") }}
        </div>
        <div class="workbench__body__left__info">
          <img @click="editHeadImg" class="workbench__body__left__info_img" @error="handleError"
               :src="userInfo.mediumPhotoUrl">
          <div class="workbench__body__left__info_name">{{ (userInfo.fdNo || '')+ ' ' }} <span
                  :title="userInfo.username">{{userInfo.username.length>5?userInfo.username.substr(0,5)+'...':userInfo.username}}</span>
          </div>
          <div class="workbench__body__left__info_department">{{ userInfo.dep }}</div>
        </div>
        <div :class="['workbench__body__left__week',{en: $i18n.locale ==='en-US'}]">
          <!--            <div class="workbench__body__left__week_cir">-->
          <!--              <span class="workbench__body__left__week_title">{{ weekFormat(ds) }}</span>-->
          <!--            </div>-->
          <div class="workbench__body__left__week_tips">
            <div id="p1" v-if="systemScript"></div>
            <template v-else>
              <template v-if="ds === 0">
                <div>{{ $t("workbenchMsg.stips") }}</div>
                <div>{{ $t("workbenchMsg.satips") }}</div>
              </template>
              <template v-else>
                <div>{{ $t("workbenchMsg.dtips") }}</div>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="workbench__body__main">
        <div class="wb-main-header">
          <div class="wb-main-tab">
            <el-badge :value="todoNum" slot="reference" class="badge">
              <span :class="['wb-main-tab-item', {'tab-active': activeType === 'todo'}]"
                    @click="handleClickTab('todo')">{{ $t("publicMsg.pending") }}</span>
            </el-badge>
            <el-badge :value="toviewNum" slot="reference" class="badge">
              <span :class="['wb-main-tab-item', {'tab-active': activeType === 'toview'}]"
                    @click="handleClickTab('toview')">{{ $t("publicMsg.unread") }}</span>
            </el-badge>
            <el-badge :value="0" hidden slot="reference" class="badge">
              <span :class="['wb-main-tab-item', {'tab-active': activeType === 'tododone'}]"
                    @click="handleClickTab('tododone')">{{ $t("publicMsg.done") }}</span>
            </el-badge>
            <el-badge :value="0" hidden slot="reference" class="badge">
              <span :class="['wb-main-tab-item', {'tab-active': activeType === 'toviewdone'}]"
                    @click="handleClickTab('toviewdone')">{{ $t("publicMsg.read") }}</span>
            </el-badge>
          </div>
          <div class="wb-main-btn">
<!--            <el-form :inline="true" class="demo-form-inline">-->
<!--              <el-form-item class="form-item">-->
                <el-input @keyup.enter.native="handleClickSearch" v-model="keyword" clearable :placeholder="$t('workbenchMsg.kplaceholder')"></el-input>
<!--              </el-form-item>-->
<!--              <el-form-item class="form-item">-->
                <el-button type="primary" @click="handleClickSearch">{{ $t("workbenchMsg.search") }}</el-button>
                <el-button v-show="activeType === 'toview' && toviewNum != 0" type="primary" @click="autoToRead">{{ $t("workbenchMsg.autoToRead") }}</el-button>
                <el-button type="primary" @click="handleClickAdd">{{ $t("workbenchMsg.newprocess") }}</el-button>
                <el-button type="primary" @click="handleClickSend">{{ $t("workbenchMsg.issuedprocess") }}</el-button>
<!--              </el-form-item>-->
<!--            </el-form>-->
            <!--              <span class="wb-main-btn-item" @click="handleClickAdd">{{ $t("workbenchMsg.newprocess") }}</span>-->
            <!--              <span class="wb-main-btn-item" @click="handleClickSend">{{ $t("workbenchMsg.issuedprocess") }}</span>-->
          </div>
        </div>
        <div class="workbench__body__main__tab">
          <div @click="toggleTab(m)" v-if="!((m.value === 'MY' && activeType !== 'todo') && (m.value === 'MY' && activeType !== 'tododone'))" v-for="m in meetingTypeList" :key="m.label"
               :class="['workbench__body__main__tab__item',{'is-active': meetingType === m.value}]" :title="$i18n.locale === 'en-US' ? m.en :m.label">
            <span style="position: relative;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{$i18n.locale === 'en-US' ? m.en :m.label}}</span>
            <span v-if="m.dot" class="dot"></span>
          </div>
        </div>
        <div class="workbench__body__main__table">
<!--          明源 && ie && 无权限-->
          <el-table
                  v-loading="listLoading"
                  :element-loading-text="loadingText"
                  :data="list"
                  header-row-class-name="table-header fs18"
                  row-class-name="table-row"
                  :header-cell-style="{background:'#FAFAFA'}"
                  style="width: 100%;overflow-y: auto"
                  @row-click="goOaDetail"
                  @sort-change="sortList">
            <div slot="empty" class="empty-wrap">
              <img src="@/assets/images/address-none.png" alt="">
              <div>暂无数据</div>
            </div>
            <el-table-column
                    :label="$t('workbenchMsg.no')"
                    width="60"
                    align="center">
              <template slot-scope="scope">
                <div class="fs18">{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    :label="$t('workbenchMsg.title')">
              <template slot-scope="scope">
                <div class="table-title fs18" :title="scope.row.fdSubject"><span style="color: red"
                                                                                 v-if="activeType === 'todo' && !listLoading">{{handleLevel(scope.row.fdLevel)}}</span><span
                        style="color: red" v-if="activeType === 'todo' && !listLoading">{{handleUrg(scope.row.isUrging)}}</span>
                  {{scope.row.fdSubject }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                    :label="$t('workbenchMsg.user')"
                    width="100"
                    align="center">
              <template slot-scope="scope">
                <div class="fs18">{{ scope.row.docCreatorName }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    sortable="custom"
                    :label="$t('workbenchMsg.time')"
                    width="180"
                    align="center">
              <template slot-scope="scope">
                <div class="fs18">{{ scope.row.fdCreateTime*1 | formatDate('yyyy.MM.dd') }}</div>
              </template>
            </el-table-column>
          </el-table>
<!--          <div style="width: 100%;" v-if="(MYStatus !== null) || (isMYload && meetingType === 'MY')" v-show="meetingType === 'MY'" v-loading="isMYload">-->
<!--            <iframe @load="MYload" v-if="isIE && desEncryValue" v-show="meetingType === 'MY'" width="100%" style="height: 20vw;" :src="`${MYSOFTURL}/Product/Interface/SSO/Login.aspx?UserCode=${desEncryValue}&PageUrl=/Product/Interface/SSO/PortalUI/Portals/Desk_MyPendingWork_30/Desk_MyPendingWork.aspx`" frameborder="0"></iframe>-->
<!--&lt;!&ndash;            <iframe v-if="isIE" v-show="meetingType === 'MY'" width="100%" style="height: 20vw;" :src="`${MYSOFTURL}/Product/Interface/SSO/PortalUI/Portals/Desk_MyPendingWork_30/Desk_MyPendingWork.aspx`" frameborder="0"></iframe>&ndash;&gt;-->
<!--            <div class="version-tip" v-if="meetingType === 'MY' && !isIE">-->
<!--              <img src="@/assets/images/version-tip.png" alt="">-->
<!--              <div>请使用ie浏览器查看明源待办</div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <el-pagination
                background
                class="table-pg"
                style="text-align: right;padding: 20px 0;"
                :current-page="pageIndex"
                :page-sizes="[10, 15]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div class="app-main">
      <div class="am-header">
        <div class="am-nav">
          <div v-for="item in appNav" v-if="item.id !== 'HomeShortcut'" :key="item.id"
               :class="['am-nav-item', {active:item.id == currAppNavId}]" @click="handleClickNav(item)" :title="$i18n.locale
            === 'en-US'? item.groupName : item.displayName">{{ $i18n.locale
            === 'en-US'? item.groupName : item.displayName }}
          </div>
        </div>
        <div class="am-search">
          <el-input @keyup.enter.native="handleClickSearchApp" v-model="appSearch"
                    :placeholder="$t('workbenchMsg.aplaceholder')" clearable></el-input>
          <el-button class="am-search-btn" type="primary" @click="handleClickSearchApp">{{ $t('workbenchMsg.search')
            }}
          </el-button>
        </div>
      </div>
      <div class="am-body" v-loading="appLoading">
        <div class="am-type">
          <div class="am-type-title">{{ $t('workbenchMsg.application') }}</div>
          <div class="am-type-main">
            <div v-for="item in apps" :key="item.id" class="am-type-item" @click="handleClickLink(item.link)">
              <img class="am-type-img" :src="item.icon.indexOf('http') > -1 ? item.icon : `./icon/${item.icon}`" alt="">
              <span class="am-type-name" :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{ $i18n.locale === 'en-US'? item.englishName : item.name }}</span>
            </div>
          </div>
          <div class="am-type-edit" @click="handleCilckEdit('1')"><i class="iconEIP icon_edit"></i></div>
        </div>
        <div class="am-type">
          <div class="am-type-title">{{ $t('workbenchMsg.report') }}</div>
          <div class="am-type-main">
            <div v-for="item in reports" :key="item.id" class="am-type-item" @click="handleClickLink(item.link)">
              <img class="am-type-img" :src="item.icon.indexOf('http') > -1 ? item.icon : `./icon/${item.icon}`" alt="">
              <span class="am-type-name" :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{ $i18n.locale === 'en-US'? item.englishName : item.name }}</span>
            </div>
          </div>
          <div class="am-type-edit" @click="handleCilckEdit('2')"><i class="iconEIP icon_edit"></i></div>
        </div>
      </div>
    </div>
    <el-dialog
            :close-on-click-modal="false"
            :title="$t('workbenchMsg.sk')"
            :visible.sync="dialogVisible"
            custom-class="dialog-class"
    >
      <div class="dialog-body">
        <div class="db-left">
          <div class="db-left-table">
            <div class="db-left-title">{{ $t('workbenchMsg.lo') }}</div>
            <div class="db-left-main">
              <div v-for="item in classifies" :key="item.id"
                   :class="['db-left-item list-overflow',{'active': categoryId == item.id }]"
                   @click="handleClickCategory(item)" :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{
                $i18n.locale === 'en-US'? item.englishName : item.name }}
              </div>
            </div>
          </div>
          <div class="db-left-table">
            <div class="db-left-title">{{ $t('workbenchMsg.lw') }}</div>
            <div class="db-left-main">
              <el-checkbox-group v-model="defaultAppsSelect" size="small">
                <el-checkbox disabled v-for="item in defaultApps" :key="item.id" :label="item.id" class="checkbox-item">
                  <span :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{ strSplit($i18n.locale === 'en-US'? item.englishName : item.name) }}</span>
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="checkboxApp" size="small" @change="handleChangeApp">
                <el-checkbox v-for="item in classifiyApps" :key="item.id" :label="item.id" class="checkbox-item"><span
                        :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{ strSplit($i18n.locale === 'en-US'? item.englishName : item.name) }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="db-right">
          <div class="db-right-title">
            <span>{{ $t('workbenchMsg.selected') }}</span>
            <span class="db-right-clear" @click="handleClickDelete('all')">{{ $t('workbenchMsg.ca') }}</span>
          </div>
          <div class="db-right-main">
            <div v-for="item in userApps" :key="item.id" class="db-right-item">
              <span class="list-overflow" :title="$i18n.locale === 'en-US'? item.englishName : item.name">{{ $i18n.locale === 'en-US'? item.englishName : item.name }}</span>
              <span class="db-right-clear-icon icon_delete" @click="handleClickDelete(item)"></span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-footer-btn" type="primary"
                   @click="handleClickConfirm">{{ $t('publicMsg.ok') }}</el-button>
        <el-button class="dialog-footer-btn" @click="dialogVisible = false">{{ $t('publicMsg.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {analyse} from '@utils/analyse'
  import img from '@assets/images/me_avatar_default.png'
  import API from '@api'

  export default {
    name: "Workbench",
    data() {
      return {
        meetingType: '',
        meetingTypeList: [
          {label: '全部',en: 'All', value: '', dot: false},
          {label: 'OA',en: 'OA', value: 'EKP', dot: false},
          {label: '人力资源',en: 'Human Resources', value: 'HR', dot: false},
          {label: '成本管理',en: 'Cost Managent', value: 'SAPI_CBGL', dot: false},
          {label: '采招管理',en: 'Purchase Managent', value: 'EAS_CZGL', dot: false},
          {label: '进度管理',en: 'Progress Managent', value: 'SAPI_JDGL', dot: false},
          {label: '通知管理',en: 'Notice Managent', value: 'SAPI_TZYJ', dot: false},
          {label: '金蝶采招',en: 'Pruchase Managent(old)', value: 'EAS_CBCZ', dot: false},
          {label: '费用报销',en: 'Expense Reimbursement', value: 'EAS_FYBX', dot: false},
          {label: '资金管理',en: 'Fund Management', value: 'EAS_ZJGL', dot: false},
          {label: '供应链',en: 'Supply Chain', value: 'EAS_GYL', dot: false},
          {label: '明源',en: 'Sale', value: 'MY', dot: false},
        ],
        appLoading: true,
        defaultImg: img,
        systemScript: true,
        ds: '',
        week: '',
        userInfo: {
          fdNo: '',
          username: '',
          dep: '',
          mediumPhotoUrl: ''
        },
        listLoading: false,
        activeType: this.$route.query.dataType || 'todo',
        sort: {
          orderby: '',
          orderType: ''
        },
        keyword: '',
        requestKeyword: '',
        list: [],
        currAppNavId: '',
        currGroupName: '',
        appNav: [],
        apps: [],
        reports: [],
        appSearch: '',
        dialogVisible: false,
        classifies: [],
        appType: 1,
        classifiyApps: [],
        categoryId: '',
        checkboxApp: [],
        userApps: [],
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        todoNum: 0,
        toviewNum: 0,
        autoToReadClicke: 0,
        timer: null,
        expiresTime: 0,
        defaultApps: [],
        defaultAppsSelect: [],
        desEncryValue: '',
        MYStatus: null, //登录用户的明源启用状态
        MYSOFTURL: process.env.VUE_APP_MYSOFT,
        isIE: false,
        isMYload: true,
      }
    },
    computed: {
      weekFormat(id) {
        return (id) => {
          let name = ''
          if (id) {
            name = this.$t('workbenchMsg.double')
          } else {
            name = this.$t('workbenchMsg.single')
          }
          return name
        }
      },
      loadingText() {
        let text = ""
        if (this.autoToReadClicke == 1) {
          text = this.$t('workbenchMsg.loadingText')
        }
        return text
      }
    },
    created() {

      this.isIE = !!window.ActiveXObject || "ActiveXObject" in window

      this.init()
      this.getProcessReport()
    },
    mounted() {
      window.thisComponent = this

      document.addEventListener('visibilitychange', this.visibilityChange)
    },
    destroyed() {
      clearInterval(this.timer)
      document.removeEventListener('visibilitychange', this.visibilityChange)
    },
    methods: {
      MYload(){
        this.isMYload = false
      },
      desEncrypt() {
        API.home.desEncrypt({pToEncrypt: localStorage.profileName || '', sKey: 'aymysoft'}).then(res => {
          if(res.data.code === 200) {
            this.desEncryValue = encodeURIComponent(res.data.data)
            if(!this.isIE) this.isMYload = false
          }
        }).catch(_ => {
          this.isMYload = false
        })
      },
      MYUserStatus() {
        API.home.MYUserStatus().then(res => {
          if(res.data.code === 200) {
            this.MYStatus = res.data.data
            //账号启用才获取加密
            if(this.MYStatus) {
              this.desEncrypt()
            }else{
              this.isMYload = false
            }
          }
        }).catch(_ => {
          this.isMYload = false
        })
      },
      handleError(e) {
        e.target.src = this.defaultImg
      },
      handleUrg(urg) {
        let name = ''
        if (urg === 1) {
          name = '【催办】'
        }
        return name
      },
      handleLevel(level) {
        let name = ''
        if (level === '1') {
          name = '【紧急】'
        } else if (level === '2') {
          name = '【急】'
        }
        return name
      },
      getProcessReportAll() {
        let params = {dataType: this.activeType, type: ['todo', 'tododone'].includes(this.activeType) ? '13' : '2',}
        this.meetingTypeList = [
          {label: '全部',en: 'All', value: '', dot: false},
          {label: 'OA',en: 'OA', value: 'EKP', dot: false},
          {label: '人力资源',en: 'Human Resources', value: 'HR', dot: false},
          {label: '成本管理',en: 'Cost Managent', value: 'SAPI_CBGL', dot: false},
          {label: '采招管理',en: 'Purchase Managent', value: 'EAS_CZGL', dot: false},
          {label: '进度管理',en: 'Progress Managent', value: 'SAPI_JDGL', dot: false},
          {label: '通知管理',en: 'Notice Managent', value: 'SAPI_TZYJ', dot: false},
          {label: '金蝶采招',en: 'Pruchase Managent(old)', value: 'EAS_CBCZ', dot: false},
          {label: '费用报销',en: 'Expense Reimbursement', value: 'EAS_FYBX', dot: false},
          {label: '资金管理',en: 'Fund Management', value: 'EAS_ZJGL', dot: false},
          {label: '供应链',en: 'Supply Chain', value: 'EAS_GYL', dot: false},
          {label: '明源',en: 'Sale', value: 'MY', dot: false},
        ]
        API.workbench.getProcessReportAll(params).then(res => {
          if (res.data.code === 200) {
            Object.keys(res.data.data).forEach(v => {
              let idx = this.meetingTypeList.findIndex(m => m.value === v && (res.data.data[v] > 0))
              if(idx > -1) this.meetingTypeList[idx].dot = idx >= 0
            })
          }
        }).catch(err => {

        })
      },
      toggleTab(item) {
        if (this.meetingType === item.value) return
        this.meetingType = item.value
        // this.keyword = this.requestKeyword
        this.requestKeyword = ''
        // if(this.meetingType === 'MY') {
        //   if(this.MYStatus === null) {
        //     this.MYUserStatus()
        //   }
        //   this.list = []
        //   this.pageIndex = 1
        // }else{
        this.pageIndex = 1
        this.getProcess()
        // }
      },
      visibilityChange() {
        if (!document.hidden && (this.activeType === 'todo' || this.activeType === 'toview')) {
          console.log('visibilitychange');
          this.getProcess()
          this.getProcessReport()
          this.getProcessReportAll()
        }
      },
      autoToRead() {
        if (this.listLoading) {
          return
        }
        this.autoToReadClicke = 1
        this.listLoading = true
        API.workbench.autoToRead({appName: this.meetingType}).then(res => {
          if (res.data.code === 200) {
            this.list = []
            this.pageIndex = 1
            this.totalCount = 0
            // this.toviewNum = 0
            this.getProcessReport()
            this.getProcessReportAll()
            this.$message.success('操作成功')
          }
          this.autoToReadClicke = 0
          this.listLoading = false
        })
      },
      getProcessReport() {
        API.workbench.getProcessReport().then(res => {
          if (res.data.code === 200) {
            //待办todo，已办tododone，待阅toview，已阅toviewdone
            const {toView, todo} = res.data.data
            this.todoNum = todo > 99 ? '99+' : todo
            this.toviewNum = toView > 99 ? '99+' : toView
          }
        })
      },
      editHeadImg() {
        window.open(`${process.env.VUE_APP_OA_URL}/sys/person/setting.do?setting=sys_zone_person_photo&j_iframe=true&j_aside=false`, '_blank')
      },
      strSplit(str) {
        const maxLength = this.$i18n.locale === 'en-US' ? 24 : 12
        if (str.length > maxLength) {
          return str.substr(0, maxLength) + '...'
        } else {
          return str
        }
      },
      // 初始化
      init() {
        this.getUserInfo()
        this.changeWeek()
        this.getProcess()
        this.getGroups()
        this.getProcessReportAll()
        if (this.activeType === 'todo') {
          const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
          let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`
          this.expiresTime = JSON.parse(sessionStorage.getItem(sessionKey)).expires_at * 1000
          this.timer = setInterval(() => {
            // if (this.expiresTime > new Date().getTime()) {
              this.getProcess(1)
            // }
          }, 30000)
        }
        analyse()
      },
      // 获取个人信息
      getUserInfo() {
        API.setting.getOaUser().then(res => {
          if (res.data.code === 200) {
            res.data.data.mediumPhotoUrl = res.data.data.mediumPhotoUrl ? process.env.VUE_APP_OA_URL + res.data.data.mediumPhotoUrl + '&_t=' + new Date().getTime() : img
            this.userInfo = res.data.data
            // if(this.userInfo.username && this.userInfo.username.length > 5) {
            //   this.userInfo.username = this.userInfo.username.substr(0, 5)+'...'
            // }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(res => {
          this.$message.error(res.data.message)
        })
      },
      // 判断单双休
      changeWeek() {
        API.workbench.getSystemScript().then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.systemScript = true
            eval(res.data.data)
          } else {
            this.systemScript = false
            let d = new Date() //实例化时间函数
            let now = d.getTime() // 获取距 1970 年 1 月 1 日之间的毫秒数
            let n = now - 259200000 // 由于1970.1.1 是星期四，不是星期一，减去后面三天
            let dayIndex = Math.ceil(n / 86400000) - 1
            let weekIndex = Math.ceil(dayIndex / 7)
            let ds = this.ds = weekIndex % 2 // 判断单双周
            if (ds === 0) {
              this.week = '单'
            } else {
              this.week = '双'
            }
          }
        })
      },
      // 切换事务tab
      handleClickTab(type) {
        if (this.activeType === type) return
        this.activeType = type
        if (this.activeType !== 'todo' && this.activeType !== 'tododone' && this.meetingType === 'MY') {
            this.meetingType = ''
        }

        if (this.activeType !== 'todo') {
          clearInterval(this.timer)
        } else {
          this.timer = setInterval(() => {
            // if (this.expiresTime > new Date().getTime()) {
              this.getProcess(1)
            // }
          }, 30000)
        }
        // this.keyword = this.requestKeyword
        this.requestKeyword = ''
        this.pageIndex = 1
        this.getProcess()
        this.getProcessReportAll()
      },
      // 查询事务
      handleClickSearch() {
        this.requestKeyword = this.keyword
        this.pageIndex = 1
        this.getProcess()
        clearInterval(this.timer)
      },
      // 事务api
      getProcess(isPolling) {
        if (this.activeType === 'todo' && isPolling) {
          if(this.meetingType === 'MY') return
          // this.listLoading = true
          // let params1 = {
          //   keyWord: this.requestKeyword,
          //   orderBy: this.sort.orderby,
          //   orderType: this.sort.orderType,
          //   dataType: 1,
          //   userAccount: localStorage.getItem('profileName') || '',
          //   // userAccount: 'zhylei',
          //   pageno: this.pageIndex,
          //   pageSize: this.pageSize,
          //   appName: this.meetingType
          // }
          // //轮询专用
          // API.workbench._getProcess(params1).then(res => {
          //   this.listLoading = false
          //   if(res.data && res.data.data && res.data.data.length){
          //     this.list = res.data.data || []
          //     this.totalCount = res.data.total
          //     this.todoNum = res.data.total
          //   }
          // }).catch(err => {
          //   this.listLoading = false
          //   this.$message.error(err.data.message)
          // })

          //延磊没时间把轮询接口增加字段,只能用原本接口
          this.listLoading = true
          let params = {
            DataType: this.activeType || 'todo',
            Type: ['todo', 'tododone'].includes(this.activeType) ? '13' : '2',
            Keyword: this.requestKeyword,
            Orderby: this.sort.orderby,
            Ordertype: this.sort.orderType,
            Pageno: this.pageIndex,
            Rowsize: this.pageSize,
            appName: this.meetingType
          }
          API.workbench.getProcess(params).then(res => {
            this.listLoading = false
            if (res.data.code === 200) {
              this.list = res.data.data.list
              // this.list = [{fdSubject: 'sadasdad'}]
              this.totalCount = res.data.data.totalrows
              // this.todoNum = res.data.data.totalrows
              this.getProcessReport()
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(err => {
            this.listLoading = false
          })
        } else {
          // if(this.meetingType === 'MY') return
          this.listLoading = true
          let params = {
            DataType: this.activeType || 'todo',
            Type: ['todo', 'tododone'].includes(this.activeType) ? '13' : '2',
            Keyword: this.requestKeyword,
            Orderby: this.sort.orderby,
            Ordertype: this.sort.orderType,
            Pageno: this.pageIndex,
            Rowsize: this.pageSize,
            appName: this.meetingType
          }
          API.workbench.getProcess(params).then(res => {
            this.listLoading = false
            if (res.data.code === 200) {
              this.list = res.data.data.list
              // this.list = [{fdSubject: 'sadasdad'}]
              this.totalCount = res.data.data.totalrows
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(err => {
            this.listLoading = false
          })
        }


      },
      // 跳转到oa
      goOaDetail(item) {
        if (item.fdLink.indexOf('http') > -1) {
          if((item.fdLink.indexOf('pm.aoyuan.net') > -1 || item.fdLink.indexOf('mysofterp.aoyuan.net') > -1 || item.fdLink.indexOf('test-pm.aoyuan.net') > -1 || item.fdLink.indexOf('192.168.209.71') > -1 || item.fdLink.indexOf('testmysoft.aoyuan.net') > -1) && !this.isIE) {
            this.$message({message:'非常抱歉，请使用IE浏览器查看！',customClass: 'ie-tips', type: 'error',showClose: true})
          }else{
            window.open(item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
            // window.open(`${location.origin}/#/blank?redirecturl=`+(item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}`), '_blank')
          }
        } else {
          window.open(item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
          // window.open(`${location.origin}/#/blank?redirecturl=`+item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}``), '_blank')
        }
      },
      // 设置星标
      handleChangeStar(id, value) {
        let params = {
          id,
          star: value ? '0' : '1'
        }
        API.workbench.updateProcessStar(params).then(res => {
          if (res.data.code === 200) {
            this.getProcess()
            clearInterval(this.timer)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
        })
      },
      // 表格排序
      sortList({column, prop, order}) {
        this.sort.orderby = 'fdCreateTime'
        if (order === 'ascending') {
          //升序
          this.sort.orderType = 'up'
        } else if (order === 'descending') {
          //降序
          this.sort.orderType = 'down'
        } else {
          this.sort.orderby = ''
          this.sort.orderType = ''
        }
        this.getProcess()
        clearInterval(this.timer)
      },
      // 新建流程
      handleClickAdd() {
        window.open(`${process.env.VUE_APP_OA_URL}/km/review/km_review_main/kmReviewMain.do?method=add`, '_blank')
      },
      // 已发流程
      handleClickSend() {
        window.open(`${process.env.VUE_APP_OA_URL}/km/review/#j_path=%2FlistCreate&mydoc=create`, '_blank')
      },
      // 更多操作
      handleClickMore() {
        window.open(`${process.env.VUE_APP_OA_URL}/sys/notify/index.jsp?dataType=todo&fdAppName=ekp#cri.list_todo.q=fdAppName:ekp`, '_blank')
      },
      // 获取应用导航列表
      getGroups() {
        API.workbench.getGroups().then(res => {
          if (res.data.code === 200) {
            this.appNav = res.data.data
            this.currAppNavId = this.appNav[1].id
            this.getShortcutType()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 根据分组查询应用
      getShortcutType() {
        this.appLoading = true
        let params = {
          groupName: this.currGroupName || this.appNav[1].groupName,
          name: this.appSearch
        }
        API.workbench.getShortcutType(params).then(res => {
          this.appLoading = false
          if (res.data.code === 200) {
            this.apps = res.data.data.appliction
            this.reports = res.data.data.reports
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(_ => {
          this.appLoading = true
        })
      },
      // 跳转到对应应用
      handleClickLink(link) {
        if (link && link.includes('http')) {
          // window.open(`${location.origin}/#/blank?redirecturl=`+link, '_blank')
          window.open(link, '_blank')
        } else {
          // window.open(`${location.origin}/#/blank?redirecturl=`+process.env.VUE_APP_OA_URL + link, '_blank')
          window.open(process.env.VUE_APP_OA_URL + link, '_blank')
        }
      },
      // 切换应用导航
      handleClickNav(item) {
        this.currAppNavId = item.id
        this.currGroupName = item.groupName
        this.getShortcutType()
      },
      // 查询应用
      handleClickSearchApp() {
        this.getShortcutType()
      },
      // 修改快捷应用
      handleCilckEdit(type) {
        this.dialogVisible = true
        this.appType = type
        this.checkboxApp = []
        this.getClassifies()
        this.getShortcut()
      },
      // 获取用户的应用
      getShortcut() {
        let params = {
          groupName: this.currGroupName || this.appNav[1].groupName,
          name: '',
          type: this.appType,
          groupType: 2
        }
        API.workbench.getShortcut(params).then(res => {
          if (res.data.code === 200) {
            this.userApps = res.data.data
            this.checkboxApp = this.userApps.map(item => item.id)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取应用分类列表
      getClassifies() {
        API.workbench.getClassifies().then(res => {
          if (res.data.code === 200) {
            this.classifies = res.data.data
            let id = res.data.data[0].id
            this.categoryId = id
            this.getByClassify(id)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 根据分类获取应用列表
      getByClassify(id) {
        let params = {
          type: Number(this.appType),
          groupName: this.currGroupName || this.appNav[1].groupName,
        }
        API.workbench.getByClassifyV2(id, params).then(res => {
          if (res.data.code === 200) {
            this.classifiyApps = res.data.data.filter(v => !v.isSystem)
            this.defaultApps = res.data.data.filter(v => v.isSystem)
            this.defaultAppsSelect = res.data.data.filter(v => v.isSystem).map(v => v.id)
            // this.checkboxApp = res.data.data.filter(v => v.isSystem).map(v => v.id)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 选择类目
      handleClickCategory(value) {
        this.categoryId = value.id
        this.getByClassify(value.id)
      },
      // 选择应用
      handleChangeApp() {
        let currArr = []
        let allArr = [...this.classifiyApps, ...this.userApps]
        this.checkboxApp.forEach(id => {
          currArr.push(allArr.find(val => val.id === id))
        })
        this.userApps = currArr
      },
      // 删除快捷键
      handleClickDelete(val) {
        if (!this.userApps || !this.userApps.length) return
        if (val === 'all') {
          this.userApps = []
        } else {
          this.userApps.splice(this.userApps.findIndex(item => item.id === val.id), 1)
        }
        this.checkboxApp = this.userApps.map(item => item.id)
        console.log(this.checkboxApp)
      },
      // 快捷设置
      handleClickConfirm() {
        this.$confirm(this.$t('publicMsg.qaBoxTips'), this.$t('publicMsg.warning'), {
          cancelButtonText: this.$t('publicMsg.cancel'),
          confirmButtonText: this.$t('publicMsg.ok'),
          type: 'warning',
        }).then(() => {
          this.dialogVisible = false
          this.setShortcut()
        }).catch(() => {
        })
      },
      // 设置应用Api
      setShortcut() {
        // let arr1 = this.apps.filter(v => v.groupType === 2)
        // let arr2 = this.reports.filter(v => v.groupType === 2)
        // arr1.push(...arr2)
        // arr1 = arr1.map(v => v.id)
        // arr1.push(...this.checkboxApp)
        // arr1 = Array.from(new Set(arr1))
        let params = {
          groupName: this.currGroupName || this.appNav[1].groupName,
          // shortcutIds: arr1
          shortcutIds: this.checkboxApp,
          type: this.appType
        }
        API.workbench.setShortcut(params).then(res => {
          if (res.data.code === 200) {
            this.getShortcutType()
            this.$message({
              offset: 200,
              dangerouslyUseHTMLString: true,
              iconClass: 'success-info-icon',
              customClass: 'success-info',
              message: `<div class="ml6">${this.$t('publicMsg.sBoxTips')}</div>`
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 修改每页显示数量
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getProcess()
      },
      // 切换页码
      handleCurrentChange(pageIndex) {
        this.keyword = this.requestKeyword
        this.pageIndex = pageIndex
        this.getProcess()
      }
    }
  }
</script>

<style lang="scss">


  .workbench {
    padding: 0;
    display: flex;
    flex-direction: column;
    -ms-overflow-style: scrollbar;

    .el-table::before {
      display: none;
    }

    .success-info {
      min-width: auto;
      padding: 12px 20px;
      background: #fff;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
      border-radius: 3px;
    }

    /*.el-table__body-wrapper::-webkit-scrollbar{*/
    /*  !*width: 0;宽度为0隐藏*!*/
    /*  width: 0;*/
    /*}*/
    /*.el-table__body-wrapper::-webkit-scrollbar-thumb{*/
    /*  border-radius: 2px;*/
    /*  height: 50px;*/
    /*  background: #eee;*/
    /*}*/
    /*.el-table__body-wrapper::-webkit-scrollbar-track{*/
    /*  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    /*  border-radius: 2px;*/
    /*  background: rgba(0,0,0,0.4);*/
    /*}*/
    &__body {
      display: flex;
      min-height: 570px;
      /*max-height: 888px;*/
      &__left {
        background: #fff;
        flex: 0 0 260px;
        margin-right: 20px;
        border-radius: 5px;
        font-size: 20px;
        color: #4c4c4c;

        &__header {
          margin: 0 16px;
          line-height: 60px;
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 20px;
          text-align: left;
        }

        &__info {
          margin-top: 54px;

          &_img {
            width: 80px;
            height: 80px;
            margin-bottom: 22px;
          }

          &_name {
            font-size: 18px;
            color: #4C4C4C;
          }

          &_department {
            font-size: 14px;
            color: #B2B2B2;
          }
        }

        &__week {
          width: 204px;
          height: 217px;
          margin: 70px auto 0;
          background: url('../../assets/images/day_bg.png') no-repeat center center;
          background-size: 100% 100%;
          &.en{
            background: url('../../assets/images/day_bg_en.png') no-repeat center center;
            background-size: 100% 100%;
          }

          &_cir {
            width: 56px;
            height: 56px;
            background: rgba(180, 163, 107, 0.05);
            border-radius: 50%;
            display: inline-block;
            color: #fff;
            text-align: center;
            line-height: 56px;
            position: relative;
            z-index: 10;

            &::before {
              content: '';
              width: 60px;
              height: 30px;
              border: 1px solid #B4A36B;
              background: rgba(180, 163, 107, 0.05);
              border-radius: 60px 60px 0 0;
              position: absolute;
              top: -3px;
              left: -3px;
              border-bottom-color: rgba(255, 255, 255, .8);
              z-index: -1;
            }
          }

          &_title {
            width: 56px;
            height: 56px;
            background: #B4A36B;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            display: inline-block;
            line-height: 56px;
            z-index: 100;
            font-size: 28px;
          }

          &_tips {
            padding: 94px 10px 0;
            /*border: 1px solid #B4A36B;*/
            /*font-size: 16px;*/
            /*color: #4C4C4C;*/
            /*background: rgba(180, 163, 107, 0.05);*/
            /*height: 196px;*/
            /*display: flex;*/
            /*flex-direction: column;*/
            /*align-items: center;*/
            /*justify-content: center;*/
            /*border-radius: 5px;*/
            /*padding: 0 10px;*/
            /*box-sizing: border-box;*/
          }
        }
      }

      &__main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 500px;
        background: #fff;
        border-radius: 5px;
        padding: 24px;
        box-sizing: border-box;
        position: relative;

        .form-item {
          margin-bottom: 0;
        }

        .table-pg {
          flex: 1;
          margin-top: 20px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          /*position: absolute;*/
          /*bottom: 0;*/
          /*right: 20px;*/
        }

        &__filter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #C8C8C8;
          height: 92px;

          .form-item {
            margin-bottom: 0;
          }
        }

        &__tab {
          margin-top: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid #f5f5f5;
          display: flex;

          &__item {
            cursor: pointer;
            width: 105px;
            flex: 1;
            font-size: 14px;
            color: #676767;
            position: relative;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5px;

            .dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
              position: absolute;
              top: 3px;
              right: 8px;
              background: red;
            }

            &.is-active {
              color: #006e38;

              &::before {
                content: '';
                height: 3px;
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                display: block;
                background: #006e38;
              }
            }
          }

          .el-tabs__header {
            margin-bottom: 30px;
          }

          .el-tabs__active-bar {
            display: none;
          }

          .el-tabs__nav-wrap::after {
            height: 1px;
            background: #f5f5f5;
          }
        }

        &__table {
          /*flex: 1;*/
          .empty-wrap {
            text-align: center;

            img {
              width: 177px;
              height: 125px;
              margin-top: 36px;
            }

            font-size: 16px;
            color: #999;
          }

          .version-tip{
            margin-top: 30px;
            img{
              width: 280px;
              height: 175px;
            }
          }
        }

        .table-title {
          &:hover {
            color: #006E38;
          }
        }
      }

      .wb-main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 86px;
        flex: 0 0 86px;
        border-bottom: 1px solid #e8e8e8;

        .wb-main-tab {
          display: flex;
          align-items: center;

          .el-badge {
            display: flex;
          }

          .el-badge__content {
            border: none;
            font-size: 16px;
            right: 40px;
            top: 7px;
            z-index: 99;
          }

          .wb-main-tab-item {
            padding: 7px 41px;
            font-size: 16px;
            color: #666666;
            border: 1px solid #C8C8C8;
            /*border-right: none;*/
            cursor: pointer;

            &:first-child {
              border-radius: 3px 0 0 3px;
            }

            &:last-child {
              border-right: 1px solid #C8C8C8;
              border-radius: 0 3px 3px 0;
            }

            &.tab-active {
              background: #F1FCF7;
              border-color: #006E38;
              border-right: 1px solid #006E38;
              color: #006E38;
            }
          }
        }

        .wb-main-btn {
          font-size: 14px;
          color: #FFFFFF;
          .el-input{
            width: 200px;
            margin-right: 15px;
          }

          &-item {
            display: inline-block;
            width: 88px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            background: #006E38;
            border-radius: 3px;
            cursor: pointer;

            &:first-child {
              margin-right: 24px;
            }
          }
        }
      }
    }

    .table-header {
      width: 100%;
      height: 52px;
      background: #FAFAFA !important;
      box-shadow: 0px 1px 0px 0px #EEEEEE;
    }

    .table-row {
      width: 100%;
      height: 52px;
      cursor: pointer;
    }

    .app-main {
      margin: 20px auto;
      background: #fff;
      width: 100%;
      min-height: 363px;
      border-radius: 5px;
      padding: 10px;
      box-sizing: border-box;

      .am-header {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        font-size: 16px;
        color: #999999;

        .am-nav {
          display: flex;

          &-item {
            width: 120px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              color: #006E38;
            }

            &.active {
              background: url('../../assets/images/icon_tab_select.png') no-repeat;
              background-size: 100% 100%;
              color: #fff;
            }
          }
        }

        .am-search {
          display: flex;
          width: 330px;

          &-btn {
            width: 100px;
            margin-left: 16px;
            margin-right: 10px;
          }
        }
      }

      .am-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .am-type {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 158px;
          padding: 10px 0;

          &:first-child {
            /*height: 144px;*/
            border-bottom: 1px solid #e8e8e8;
          }

          &-title {
            /*line-height: 138px;*/
            width: 193px;
            font-size: 22px;
            font-weight: 500;
            color: #333333;

            &::before {
              content: '';
              width: 3px;
              height: 17px;
              background: #006E38;
              display: inline-block;
              margin-right: 10px;
              position: relative;
              top: 2px;
            }
          }

          &-main {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            max-width: 1625px;
          }

          &-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 96px;
            height: 96px;
            margin-right: 45px;
            margin-bottom: 6px;
            font-size: 16px;
            color: #4C4C4C;
            cursor: pointer;
          }

          &-img {
            width: 58px;
            height: 58px;
            margin-bottom: 9px;
          }

          &-name {
            display: inline-block;
            width: 128px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
          }

          &-edit {
            width: 82px;
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            color: #666666;
            text-align: left;
            cursor: pointer;

            &-btn {
              margin-left: 10px;
              position: relative;
              top: 2px;
            }
          }
        }
      }
    }

    .dialog-class {
      width: 900px;
      height: 700px;
      text-align: left;
      padding: 0 24px;
      box-sizing: border-box;

      .el-dialog__header {
        width: 100%;
        height: 76px;
        line-height: 76px;
        font-size: 20px;
        padding: 0;
        color: #000000;
        position: relative;

        .el-dialog__headerbtn {
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .el-dialog__body {
        border-top: 1px solid #e8e8e8;
        padding: 0;
      }

      .dialog-body {
        margin-top: 24px;
        width: 100%;
        height: 495px;
        display: flex;
        justify-content: space-between;

        .db-left {
          width: 552px;
          height: 495px;
          border: 1px solid #eee;
          display: flex;

          &-table {
            width: 276px;
            height: 100%;

            &:first-child {
              border-right: 1px solid #eee;
            }
          }

          &-title {
            width: 100%;
            height: 52px;
            line-height: 52px;
            background: #FAFAFA;
            padding-left: 14px;
            box-sizing: border-box;
            font-size: 14px;
            color: #4C4C4C;
            border-bottom: 1px solid #eee;
          }

          &-main {
            width: 100%;
            height: 442px;
            overflow-y: auto;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          &-item {
            width: 260px;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            color: #4C4C4C;
            margin: 8px;
            padding-left: 8px;
            box-sizing: border-box;
            cursor: pointer;

            &:hover {
              background: rgba(0, 110, 56, 0.06);
            }
          }

          .active {
            color: #006E38;
            background: rgba(0, 110, 56, 0.06);
            border-radius: 2px;
          }

          .checkbox-item {
            display: block;
            width: 100%;
            height: 52px;
            line-height: 52px;
            padding-left: 16px;
            box-sizing: border-box;
            color: #4C4C4C;
            /*.el-checkbox__input {*/
            /*  margin-right: 5px;*/
            /*}*/
            /*.el-checkbox__label {*/
            /*  color: #4C4C4C;*/
            /*  font-size: 12px;*/
            /*  display: contents;*/
            /*}*/
          }
        }

        .db-right {
          width: 280px;
          height: 495px;
          border: 1px solid #eee;

          &-title {
            width: 100%;
            height: 52px;
            line-height: 52px;
            padding: 0 16px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            background: #FAFAFA;
            font-size: 14px;
            color: #4C4C4C;
            border-bottom: 1px solid #eee;
          }

          &-main {
            width: 100%;
            height: 442px;
            overflow-y: auto;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          &-item {
            width: 280px;
            height: 52px;
            line-height: 52px;
            font-size: 14px;
            color: #4C4C4C;
            padding: 0 16px;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .icon_delete {
              flex: 0 0 16px;
            }
          }

          &-clear {
            color: #006E38;
            cursor: pointer;
          }

          &-clear-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
          }
        }
      }

      .el-dialog__footer {
        width: 100%;
        height: 104px;
        line-height: 104px;
        padding: 0;
        text-align: center;

        .dialog-footer-btn {
          width: 110px;
          height: 36px;
          font-size: 16px;

          &:first-child {
            margin-right: 30px;
          }
        }
      }
    }
  }
  .ie-tips{
    top: 50% !important;
  }
</style>
<style>
  .el-pagination__editor .el-input__inner {
    line-height: 1.458vw !important;
  }
</style>
