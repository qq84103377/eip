<template>
    <section class="home-page-wrap">
        <div class="home-page-wrap__left">
            <div class="home-page-wrap__left__news">
                <div class="home-page-wrap__left__news-header">
                    <div><i class="iconEIP icon_news"></i> {{ newsTitle() }}</div>
                    <div class="more-btn aic" @click="viewMoreNews">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                </div>
                <div class="home-page-wrap__left__news-body">
                    <div class="home-page-wrap__left__news-body__banner">
                        <el-carousel ref="carouselRef" :interval="5000" indicator-position="none" arrow="always" @change="handleChange">
                            <el-carousel-item v-if="banner.length" v-for="(item, index) in banner" :key="index" @click="goToNewsDetail(item)">
                                <div style="width: 100%;height: 100%;cursor: pointer" @click="goToNewsDetail(item)"><img class="banner-img" :src="OA_URL + item.image" alt=""></div>
                                <i v-if="item.hasVideo" class="iconEIP icon_new_play" @click="goToNewsDetail(item)"></i>
                            </el-carousel-item>
                            <el-carousel-item v-if="!banner.length">
                                <img class="banner-img" src="../../assets/images/swipe_placeholder.png">
                            </el-carousel-item>
                        </el-carousel>
                        <div class="swiper-indicator">
<!--                            <i style="cursor: pointer" class="iconEIP icon_arrow_left" @click="toggleBanner('prev')"></i>-->
                            <div class="swiper-indicator__text">
                                {{ banner.length ? currentBannerIndex + 1 : 0 }}/{{ banner.length }} {{ banner[currentBannerIndex] ? banner[currentBannerIndex].text:'' }}
                            </div>
                            <div class="swiper-indicator__circle">
                                <div @click="toggleBanner(index)" :class="['swiper-indicator__circle__item',{active:currentBannerIndex==index}]" v-for="(item,index) in banner" :key="index"></div>
                            </div>
<!--                            <i style="cursor: pointer" class="iconEIP icon_arrow_right" @click="toggleBanner('next')"></i>-->
                        </div>
                    </div>
                    <div class="home-page-wrap__left__news-body__list" v-if="newsList.length">
                        <div v-for="(item, index) in newsList" :key="index" class="list-item">
                            <div class="list-item__ctn"><a target="_blank" :href="newsLink(item)" class="ellipsis" :title="item.docSubject">{{ item.docSubject }}</a> <i v-if="item.showNewIcon === 'false' ? false: true" class="iconEIP icon_new_tag"></i></div>
                            <div class="list-item__date">{{ newsDate(item.docPublishTime) }}</div>
                        </div>
                    </div>
                    <div class="home-page-wrap__left__news-body__list" v-else>
                        <div v-for="item in 8" :key="item" class="list-item">
                            <div class="list-item__ctn skeleton"></div>
                            <div class="list-item__date skeleton"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-page-wrap__left__notice">
                <div class="home-page-wrap__left__notice-header">
                    <div class="notice-tab">
                        <div v-for="(item,index) in noticeTabList" :key="index"
                             :class="['notice-tab__item',{active:item.active}]" @click="toggleNotice(item, index)">{{ noticeTabListName(index) }}
                        </div>
                    </div>
                    <div class="more-btn aic" @click="hanldeClickNoticeMore">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                </div>
                <div class="home-page-wrap__left__notice-body">
                    <!--会议纪要-->
                    <div v-show="noticeId===1">
                        <div v-for="(item,index) in meetingList" :key="index" class="list-item">
                            <div class="list-item__ctn lh50">
<!--                                <span class="ellipsis mw1000" :title="item.fdName">{{ item.fdName }}</span>-->
                                <span class="orange" @click.stop="goOaMeetingCate">[会议纪要]</span>
                                <a target="_blank" :href="goOaNotice(item.href)" class="ellipsis mw1000" :title="item.fdName">{{ item.fdName }}</a>
                                <i v-if="item.showNewIcon" class="iconEIP icon_new_tag"></i>
                            </div>
                            <div class="list-item__date">{{ item.docCreateTime * 1 | formatDate('yyyy.MM.dd') }}</div>
                        </div>
                    </div>
                    <!--通知公告-->
                    <div v-show="noticeId!==1">
                        <div v-for="(item,index) in noticeData" :key="index" class="list-item">
                            <div class="list-item__ctn lh50">
                                <span class="orange" @click.stop="viewOaCate(item.cateId)">[{{item.cateName}}]</span>
                                <a target="_blank" :href="oaNoticeLink(item.href)" class="ellipsis mw1000" :title="item.docSubject">{{ item.docSubject }}</a>
                                <i v-if="item.showNewIcon === 'false' ? false: true" class="iconEIP icon_new_tag"></i>
                            </div>
<!--                            <div class="list-item__ctn lh50">-->
<!--                                <span class="ellipsis mw1000" :title="item.docSubject">-->
<!--                                    <span class="orange" @click.stop="viewOaCate(item.cateId)">[{{item.cateName}}]</span>-->
<!--                                    {{ item.docSubject }}-->
<!--                                </span>-->
<!--                            </div>-->
                            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aic h591">
                <div class="home-page-wrap__left__quick-app">
                    <div class="home-page-wrap__left__quick-app__header">
                        <div><i class="iconEIP icon_cate"></i> {{ $t("homeMsg.quickApp") }}</div>
<!--                        <div class="more-btn aic">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>-->
                    </div>
                    <div class="home-page-wrap__left__quick-app__body">
                        <div :title="item.name" v-for="(item, index) in quickApp" :key="index" class="app-item" @click="viewLink(item)">
                            <div class="icon">
                                <img v-if="item.icon.indexOf('http') === -1" :src="`./icon/${item.icon}`" alt="">
                                <img v-else :src="`${item.icon}`" alt="">
                            </div>
                            <div class="list-overflow">{{ language === 'en-US' ? item.englishName : item.name }}</div>
                        </div>
                    </div>
                </div>
                <div class="home-page-wrap__left__special">
                    <div class="home-page-wrap__left__special-header">
                        <div><i class="iconEIP icon_special"></i> {{ $t("homeMsg.special") }}</div>
                        <div class="more-btn aic" @click="$router.push('/specialList')">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="home-page-wrap__left__special-body">
                        <el-carousel style="width: 100%;height: 100%;cursor: pointer" :interval="5000" arrow="never">
                            <el-carousel-item v-for="(item,index) in specialList" :key="index">
                                <img @click="viewSpecial(item.id)" style="width: 100%;height: 100%;" :src="item.image" alt="">
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-page-wrap__right">
            <div class="home-page-wrap__right__process">
                <div class="home-page-wrap__right__process-header">
                    <div class="process-tab">
                        <div v-for="(item,index) in processTabList" :key="index" :class="['process-tab__item',{active: item.active}]" @click="toggleProcess(item)">
                            <div>{{ processTabListName(index) }}</div>
                            <div class="num">{{ item.num }}</div>
                        </div>
                    </div>
                    <div class="more-btn aic" @click="viewWorkBench">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                </div>
                <div class="home-page-wrap__right__process-body">
                    <div class="list-item fs14">
                        <div class="list-item__ctn lh32">{{ $t("homeMsg.title") }}</div>
                        <div class="list-item__date fs14">{{ $t("homeMsg.rtime") }}</div>
                    </div>
                    <div v-for="(item,index) in processList" :key="index" class="list-item fs14">
                        <div class="list-item__ctn lh40"><a target="_blank" :href="newsLink(item)" class="ellipsis mw270" :title="item.fdSubject">{{ item.fdSubject }}</a></div>
                        <div class="list-item__date">{{ item.fdCreateTime * 1 | formatDate('yyyy.MM.dd') }}</div>
                    </div>
                </div>
            </div>
            <div class="home-page-wrap__right__meeting">
                <div class="home-page-wrap__right__meeting-header">
                  <div><i class="iconEIP icon_meetings"></i> {{ $t("homeMsg.meetingInfo") }}</div>
                  <div class="more-btn aic" @click="handleClickMettingMore">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                </div>
                <div class="home-page-wrap__right__meeting-body">
                  <div class="mb20">
                    <DatePanel v-model="meetingDate" :metting-sel="mettingListTips" @change="onChangeDate"></DatePanel>
                  </div>
                  <div v-for="(item, index) in meetingData" :key="index" class="list-item fs14" @click="goOaMeetting(item.href)">
                    <div class="list-item__ctn lh32"><span :class="['ellipsis mw280',{red: handleRed(item)}]" :title="item.title">{{ item.title }}</span></div>
                    <div class="list-item__date mw100 ellipsis" :title="item.fdPlaceName" style="color:#333333">{{ item.fdPlaceName }}</div>
                  </div>
                </div>
            </div>
            <div class="home-page-wrap__right__honor">
                <div class="home-page-wrap__right__honor-header">
                  <div><i class="iconEIP icon_honor"></i> {{ $t("homeMsg.aoyuanren") }}</div>
                  <div class="more-btn aic" @click="goOaAoYuanRen">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
                </div>
                <div class="home-page-wrap__right__honor-body" @click="goOaAoYuanRen">
                  <img :src="OA_URL+aoyuanPeopleData.image" alt="">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import DatePanel from '@components/date-panel.vue'
import { formatDate } from '@utils'
import { analyse } from '@utils/analyse'
import API from '@api'
export default {
  name: "Index",
  components: {
    DatePanel
  },
  data() {
    return {
      banner: [],
      currentBannerIndex: 0,
      noticeTabList: [
        {name: '通知公告', active: true},
        {name: '会议纪要', active: false},
        {name: '人事任免', active: false},
        {name: '管理制度', active: false},
      ],
      noticeId: 0,
      processTabList: [
        {name: '待办', active: true, num: 0, value: 'todo'},
        {name: '待阅', active: false, num: 0, value: 'toview'},
        {name: '已办', active: false, num: 0, value: 'tododone'},
        {name: '已阅', active: false, num: 0, value: 'toviewdone'},
      ],
      noticeData: [],
      meetingDate: new Date(),
      meetingData: [],
      mettingListTips: [],
      newsList: [],
      quickApp: [],
      processList: [],
      activeType: 'todo',
      aoyuanPeopleData: {},
      specialList: [],
      meetingList: [], //会议纪要列表
        categoryIds: [[],
            [
                '15ea8fcaee30216a77e2f1a49dda8c07','',
                '15ea90e6fe248e66401202b464ab2a37,15ea90f9a85c94752d49f8f4a678ccb4,15f03fe118f164c093d5bde433496916,15f03ff8f088534fcdee42a4f53bf833,15f040088455c646232acb147999aa45,15fb3752329600db4386ae44ac7ae9cd,15fb375e5a399d626179ae04b40bf88b,160c435dfe53bce9fbde8c946148e6eb,16d1fc0ff4b9aecda4106de4c2498146',
                '15ea90c31477db82539a5604e28b46ae,15ea9092daaacb02cd5b9fa4bfb8a45f,15f03fd55f01e31d0fe30b94f5896d2a,15f03feb230efcf8f37f6e841058c741,15f03ffff83c9937d64570c44b48b626,15fb3749601715c13d92f854f299aea1,15fb37577bfdfbced7db1ff4d2caeaa3,160c434bb6084e40ff0aa354cea8dcbc,16d1fc0467bd10dc5aa639e469ab6c4a',
            ],
                ['15ea901c3417b08ab1bf868433eb63a2','','15ea90f9a85c94752d49f8f4a678ccb4','15ea9092daaacb02cd5b9fa4bfb8a45f'],
                ['15ea902208284dcd3c119504956be925','','15f03fe118f164c093d5bde433496916','15f03fd55f01e31d0fe30b94f5896d2a'],
            ['15fb370da1fe0dee87713a249778d798','','15fb375e5a399d626179ae04b40bf88b','15fb37577bfdfbced7db1ff4d2caeaa3'],
            ['15ea90277ce7db70b7ac80e4749a0044','','15f03ff8f088534fcdee42a4f53bf833','15f03feb230efcf8f37f6e841058c741'],
            ['15fb3709b462cbafcabf10b4ba789f6e','','15fb3752329600db4386ae44ac7ae9cd','15fb3749601715c13d92f854f299aea1'],
            ['15ea902e5030a11a9fcb1574d19bdaab','','15f040088455c646232acb147999aa45','15f03ffff83c9937d64570c44b48b626'],
                ['160c4343879a09497fe07f744b88a761','','160c435dfe53bce9fbde8c946148e6eb','160c434bb6084e40ff0aa354cea8dcbc'],
                ['16d1fbfb4d337ec6b724a4b42b5adfc9','','16d1fc0ff4b9aecda4106de4c2498146','16d1fc0467bd10dc5aa639e469ab6c4a'],
        ],
    }
  },
  computed: {
      language(){
        return this.$i18n.locale
      },
    noticeTabListName(index) {
      return (index) => {
        let name = ''
        switch (index) {
        case 0:
          name = this.$t("publicMsg.notice")
          break
        case 1:
          name = this.$t("publicMsg.minutes")
          break
        case 2:
          name = this.$t("publicMsg.personnel")
          break
        case 3:
          name = this.$t("publicMsg.system")
          break
        }
        return name
      }
    },
    processTabListName(index) {
      return (index) => {
        let name = ''
        switch (index) {
        case 0:
          name = this.$t("publicMsg.pending")
          break
        case 1:
          name = this.$t("publicMsg.unread")
          break
        case 2:
          name = this.$t("publicMsg.done")
          break
        case 3:
          name = this.$t("publicMsg.read")
          break
        }
        return name
      }
    },
    orginationCode() {
      let code = ''
      switch (Number(this.$route.query.id || 1)) {
      case 1:
        code = ''
        break
      case 2:
        code = '15e99750f2cb62d8de6a7ae43f4b2af1'
        break
      case 3:
        code = '15e9974c06682ef7d6297d84fad9a74e'
        break
      case 4:
        code = '15e99750e156127a49b9cf640ef99963'
        break
      case 5:
        code = '15e9974580180c5b529b58f47be9a2eb'
        break
      case 6:
        code = '1602465e054e23734b501af4db380f44'
        break
      case 7:
        code = '15e99755b092b044eccaafb4d3e81f6f'
        break
      case 8:
        code = '15e9974b2bfa3093427805f43938ca6a'
        break
      case 9:
        code = '170d2b97339f4eaf93ddba51b88c38a3'
        break
      }
      return code
    },
    OA_URL() {
      return window.SITE_CONFIG.oaUrl
    },
    DataType() {
      return this.processTabList.find(v => v.active).value
    },
    currentCateId(){
      return this.categoryIds[[1,2,3,4,5,6,7,8,9].includes(this.$route.query.id || 0) ? this.$route.query.id : 1][this.noticeId]
    },
  },
  watch: {
    '$route.query.id': function (val) {
      this.groupTabIndex = val
      this.getNewsInfo()
      this.getCarousels()
        this.getNotices()
    }
  },
  mounted () {
    // this.getUserTask()
    this.getNewsInfo()
    this.getCarousels()
      //通知公告
    this.getNotices()
    this.getMeettingInfo()
    this.getShortcut()
    this.getProcessReport()
    this.getProcess()
    this.getAoYuanPeople()
    this.getSpecialList()

    // 埋点
    analyse()
  },
  methods: {
      newsTitle(){
        const index = this.$route.query.id || 0
        if([1,2,3,4,5,6,7,8,9].includes(index)){
          return this.$t(`publicMsg.homeNews${index}`)
        }else{
          return this.$t(`publicMsg.homeNews1`)
        }
      },
      handleRed(item){
          return ['待审'].includes(item.fdStatus) && (item.start > new Date().getTime())
      },
      viewMoreNews(){
          this.$router.push(`/news?id=${this.$route.query.id || 1}&sid=1`)
      },
      viewSpecial(id){
        let routeUrl = this.$router.resolve(`/detail?type=special&id=${id}`)
          window.open(routeUrl.href, '_blank');
      },
    getSpecialList(){
        let params = {
            RecommendHomePage: true,
            CategoryId: '',
            PageNo: 1,
            RowSize: 5,
        }
        API.home.getSpecialList(params).then(res => {
            if (res.data.code === 200) {
                this.specialList = res.data.data.items || {}
            }
        })
    },
      getMeetingList(){
          let params = {
              Orderby: 'docCreateTime',
              DocStatus: '30',
              JPath: '/myHandleSummary',
              Ordertype: 'down',
              Pageno: 1,
              Rowsize: 9,
          }
        API.home.getMeetingList(params).then(res => {
            if (res.data.code === 200) {
                this.meetingList = res.data.data.list || []
            }
        })
    },
    viewWorkBench() {
      this.$router.push(`/workbench?id=1&sid=3&dataType=${this.DataType}`)
    },
    getProcessReport() {
      API.workbench.getProcessReport().then(res => {
        if (res.data.code === 200) {
            //待办todo，已办tododone，待阅toview，已阅toviewdone
          const {toView, toViewDone, todo, todoDone} = res.data.data
          this.processTabList[0].num = todo
          this.processTabList[1].num = toView
          this.processTabList[2].num = todoDone
          this.processTabList[3].num = toViewDone
        }
      })
    },
    getAoYuanPeople() {
      let params = {
        pageId: '15f045e38b044f93375bc194f46ac135'
      }
      API.home.getAoYuanPeople(params).then(res => {
        if (res.data.code === 200) {
          this.aoyuanPeopleData = res.data.data || {}
        }
      })
    },
    getProcess() {
      let params = {
        DataType: this.DataType,
        Type: ['todo','tododone'].includes(this.DataType)?'13':'2',
        Orderby: 'fdCreateTime',
        Ordertype: 'down',
        Pageno: 1,
        Rowsize: 7
      }
      API.workbench.getProcess(params).then(res => {
        if (res.data.code === 200) {
          this.processList = res.data.data.list || []
        }
      })
    },
    viewLink(item) {
        if(item.link && item.link.includes('http')){
            window.open(item.link, '_blank')
        }else{
            window.open(window.SITE_CONFIG.oaUrl + item.link, '_blank')
        }
    },
    getShortcut() {
      let params = {
        groupName: 'HomeShortcut'
      }
      API.home.getShortcut(params).then(res => {
        if (res.data.code === 200) {
          this.quickApp = res.data.data || []
        }
      })
    },
    getCarousels() {
      let params = {
        DocStatus: '30',
        FdDepartment: this.orginationCode,
        J_path: '/allNews',
        Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
        Ordertype: 'down',
        Pageno: '1',
        Rowsize: '5',
        FdIsPicNews: '1',
        token: localStorage.getItem('token') || ''
      }
      API.home.getCarousels(params).then(res => {
        if (res.data.code === 200) {
          console.log(res)
          this.banner = res.data.data || []
        }
      })
    },
    //左右箭头切换轮播图
    toggleBanner(idx) {
      this.$refs['carouselRef'].setActiveItem(idx)
    },
    handleChange(index) {
      this.currentBannerIndex = index
    },
    toggleNotice(item, index) {
      if (item.active) return
      this.noticeTabList.forEach(v => {
        v.active = false
      })
      item.active = true
      this.noticeId = index
        if(index !== 1){
            this.getNotices()
        }else{
            this.getMeetingList()
        }
    },
    toggleProcess(item) {
      if (item.active) return
      this.processTabList.forEach(v => {
        v.active = false
      })
      item.active = true
      this.getProcess()
    },
    // 获取公告信息
    getNotices() {
        let params = {
            Orderby: 'docPublishTime',
            HomePage: '1',
            DocCategory: this.currentCateId,
            DocStatus: '30',
            JPath: '/docCategory',
            Ordertype: 'down',
            PageNo: 1,
            RowSize: 9,
        }
        API.home.getNotification(params).then(res => {
            if (res.data.code === 200) {
                this.noticeData = res.data.data.list || []
            }
        })
    },
    viewOaCate(id){
        window.open(`${window.SITE_CONFIG.oaUrl}/km/smissive/#j_path=%2FdocCategory&docCategory=${id}`, '_blank')
    },
      oaNoticeLink(href){
          return `${window.SITE_CONFIG.oaUrl}${href}`
      },
      //跳转OA会议纪要分类
      goOaMeetingCate(){
          window.open(`http://ayoa.aoyuan.net/km/imeeting/#j_path=%2FmyHandleSummary`, '_blank')
      },
    // 跳转到旧oa通知公告
    goOaNotice(url) {
        return `${window.SITE_CONFIG.oaUrl}${url}`
    },
    // 改变会议日期
    onChangeDate(date) {
      this.getMeettingInfo(date)
    },
    // 获取会议信息
    getMeettingInfo(date) {
      date = date || this.meetingDate
      let params = {
        StartTime: formatDate(date, 'yyyy-MM-dd'),
        EndTime: formatDate(date.getTime()+(24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        Pageno: 1,
        Rowsize: 5
      }
      API.home.getMeetting(params).then(res => {
        if (res.data.code === 200) {
          this.meetingData = res.data.data
          this.getMeetingByMonth(date)
        }
      })
    },
    // 获取会议列表提示信息
    getMeetingByMonth(time) {
      let params = {
        time: formatDate(time, 'yyyy-MM-dd')
      }
      API.home.getMeetingByMonth(params).then(res => {
        if (res.data.code === 200) {
          this.mettingListTips = res.data.data
        }
      })
    },
    // 获取新闻栏信息
    getNewsInfo() {
      let params = {
        DocStatus: '30',
        FdDepartment: this.orginationCode,
        J_path: '/allNews',
        Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
        Ordertype: 'down',
        Pageno: '1',
        Rowsize: '8',
        token: localStorage.getItem('token') || ''
      }
      API.home.getNews(params).then(res => {
        if (res.data.code === 200) {
          this.newsList = res.data.data.list || []
        }
      })
    },
    //跳转OA新闻详情
    goToNewsDetail(item) {
      window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank')
    },
    newsLink(item) {
      return `${window.SITE_CONFIG.oaUrl}${item.href}`
    },
    newsDate (time) {
      return formatDate(Number(time), 'yyyy.MM.dd')
    },

    getFirstIndex() {
      API.home.getFirstIndex().then(res => {
        // if (res.data.code === 200) {

        // }
      })
    },
    getUserTask() {
      API.home.getUserTask().then(res => {
        // if (res.data.code === 200) {}
      })
    },
    // 通知公告更多
    hanldeClickNoticeMore() {
      this.$router.push({ name: 'noticeList', query: { id: this.$route.query.id || 1, noticeId: this.noticeId, depId: this.$route.query.id || 1 } })
    },
    // 会议信息更多
    handleClickMettingMore() {
      window.open(`${window.SITE_CONFIG.oaUrl}/km/imeeting/index.jsp?j_module=true`, '_blank')
    },
    // 跳转到旧oa会议信息
    goOaMeetting(url) {
      window.open(`${window.SITE_CONFIG.oaUrl}${url}`, '_blank')
    },
    // 奥园人更多
    goOaAoYuanRen() {
      window.open(this.aoyuanPeopleData.href, '_blank')
      // this.$router.push(`/aoyuanren?type=${type}`)
    }
  }
}
</script>

<style lang="scss" scoped>
    .home-page-wrap {
        display: flex;
        padding: 10px 30px;
        background: #fff;
        /*min-height: 1622px;*/

        &__left {
            flex: 1;

            &__news {
                height: 390px;
                margin-bottom: 26px;
                &-header {
                    line-height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 18px;
                    border-bottom: 1px solid #e8e8e8;
                    margin-bottom: 14px;
                }

                &-body {
                    display: flex;

                    &__banner {
                        flex: 0 0 563px;
                        height: 320px;
                        margin-right: 20px;
                        position: relative;


                        .icon_new_play{
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .banner-img {
                            width: 100%;
                            height: 100%;
                            cursor: pointer;
                        }
                        .icon_new_play{
                            cursor: pointer;
                        }

                        .swiper-indicator {
                            position: absolute;
                            background: rgba(0, 0, 0, .7);
                            width: 100%;
                            height: 54px;
                            left: 0;
                            bottom: 0;
                            font-size: 12px;
                            color: #fff;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 0 16px;
                            z-index: 9;

                            .icon_arrow_left,.icon_arrow_right{
                                flex: 0 0 14px;
                            }
                            &__text {
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin: 0 10px;
                            }
                            &__circle{
                                display: flex;
                                align-items: center;
                                margin-top: 7px;
                                &__item{
                                    cursor: pointer;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 50%;
                                    margin-right: 6px;
                                    background: rgba(255,255,255,.5);
                                    &.active{
                                        width: 24px;
                                        border-radius: 7px;
                                        background: #006E38;
                                    }
                                }
                            }
                        }
                    }

                    &__list {
                        flex: 1;
                    }
                }
            }

            &__notice {
                margin-bottom: 26px;
                height: 540px;
                &-header {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 13px;
                    border-bottom: 1px solid #e8e8e8;

                    .notice-tab {
                        display: flex;

                        &__item {
                            flex: 0 0 160px;
                            font-size: 18px;
                            color: #999;
                            text-align: center;
                            height: 40px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                            cursor: pointer;
                            &:hover{
                                color: #006E38;
                            }

                            &.active {
                                background: url(https://img04.aomygod.com/fontend/2020824/imgs/icon_tab_select.png) no-repeat;
                                background-size: contain;
                                color: #fff;
                            }
                        }
                    }
                }
            }

            &__quick-app {
                height: 100%;
                flex: 1;
                border: 1px solid #e8e8e8;


                &__header {
                    line-height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 18px;
                    border-bottom: 1px solid #e8e8e8;
                    padding: 0 14px;
                }

                &__body {
                    /*display: flex;*/
                    flex-wrap: wrap;
                    padding: 33px 0;
                    overflow-y: auto;
                    height: calc(100% - 52px);
                  text-align: left;
                    scrollbar-width: none; /* firefox */
                    -ms-overflow-style: none; /* IE 10+ */
                    &::-webkit-scrollbar {
                        display: none; /* Chrome Safari */
                    }
                    .app-item {
                      text-align: center;
                      display: inline-block;
                        flex: 0 0 132px;
                        width: 132px;
                        color: #4C4C4C;
                        font-size: 14px;
                        margin-bottom: 40px;
                        /*display: flex;*/
                        flex-direction: column;
                        align-items: center;
                        cursor: pointer;

                        .list-overflow{
                            width: 132px;
                        }
                        .icon {
                            width: 58px;
                            height: 58px;
                          margin: 0 auto 15px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }

            &__special {
                flex: 1;
                margin-left: 30px;
                height: 100%;
                border: 1px solid #e8e8e8;

                &-header {
                    line-height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 18px;
                    border-bottom: 1px solid #e8e8e8;
                    padding: 0 14px;
                }

                &-body {
                    padding: 14px;
                    height: calc(100% - 52px);
                    img {
                        width: 100%;
                        height: 510px;
                    }

                }
            }
        }

        &__right {
            flex: 0 0 428px;
            margin-left: 30px;
            &__process{
                height: 390px;
                border: 1px solid #e8e8e8;
                padding: 0 14px;
                &-header{
                    height: 65px;
                    border-bottom: 1px solid #e8e8e8;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .process-tab{
                        display: flex;
                        height: 100%;
                        &__item{
                            margin-left: 10px;
                            cursor: pointer;
                            height: 100%;
                            flex: 0 0 70px;
                            font-size: 12px;
                            color: #999;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            border-bottom: 2px solid transparent;
                            &:first-child{
                                margin-left: 0;
                            }
                            .num{
                                color: #333;
                                font-size: 26px;
                                font-weight: bold;
                            }
                            &.active{
                                color: #006E38;
                                border-color: #006E38;
                                .num{
                                    color: #006E38;
                                }
                            }
                        }
                    }
                }
                &-body{
                    margin-top: 14px;
                }
            }
            &__meeting {
              margin-top: 26px;
              height: 540px;
              border: 1px solid #e8e8e8;
              padding: 0 14px;
              &-header {
                height: 52px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e8e8e8;
                font-size: 18px;
                color: #333;
              }
            }
            &__honor {
              margin-top: 26px;
              height: 591px;
              border: 1px solid #e8e8e8;
              padding: 0 14px;
              &-header {
                height: 52px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e8e8e8;
                font-size: 18px;
                color: #333;
              }
              &-body {
                cursor: pointer;
                img {
                  width: 400px;
                  height: 510px;
                  border-radius: 3px;
                  margin-top: 14px;
                }
              }
            }
        }

        .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #333;
            &__ctn {
                line-height: 40px;
                display: flex;
                align-items: center;
              &.skeleton{
                width: 520px;
                height: 20px;
                background: #f4f4f4;
                margin-bottom: 20px;
              }
                a{
                    color: #333;
                    &:visited{
                        color: #999;
                    }
                }
                .ellipsis{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    max-width: 670px;
                }
                .new-tag {
                    color: #F07E69;
                    font-size: 12px;
                    border: 1px solid #F07E69;
                    border-radius: 2px;
                    padding: 0 4px;
                    vertical-align: top;
                    margin-left: 8px;
                    height: 16px;
                    line-height: 16px;
                }

                .orange {
                    color: #F07E69;
                    white-space: nowrap;
                    cursor: pointer;
                }
            }
            .lh50 {
              line-height: 50px;
            }
            &__date {
                font-size: 14px;
                color: #999;
                margin-left: 10px;
                &.ellipsis{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    max-width: 670px;
                }
              &.skeleton{
                width: 100px;
                height: 20px;
                background: #f4f4f4;
                margin-bottom: 20px;
              }
            }
        }
        .more-btn {
            font-size: 12px;
            color: #999;
            cursor: pointer;
        }
        .mw1000{
            max-width: 1100px !important;
        }
        .mw270{
            max-width: 270px !important;
        }
        .mw100{
            max-width: 100px !important;
        }
        .mw280{
            max-width: 280px !important;
        }
        .h591{
            height: 591px;
        }
        .red{
            color: red;
        }
    }
</style>
<style lang="scss">
    .home-page-wrap__left__special-body{
        .el-carousel__indicator.is-active{
            .el-carousel__button{
                width: 20px;
                border-radius: 5px;
            }
        }
        .el-carousel__button{
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
    }
    .home-page-wrap__left__news-body{
        .el-carousel__arrow--left{
            left: 0;
            border-radius: 0;
            height: 64px;
            width: 36px;
            .el-icon-arrow-left{
                font-size: 30px;
            }
        }
        .el-carousel__arrow--right{
            right: 0;
            border-radius: 0;
            height: 64px;
            width: 36px;
            .el-icon-arrow-right{
                font-size: 30px;
            }
        }
    }
</style>
