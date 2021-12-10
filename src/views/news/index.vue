<template>
  <section class="news-wrap">
    <div class="news-wrap__recommend">
      <div class="news-wrap__recommend__header">
        <div class="news-wrap__recommend__header__left-title">
          <el-badge slot="reference" :value="newsInfoNum" :max="99" class="badge" @click.native="clickTopTitle">
              <div style="position: relative;cursor: pointer;" @click.stop="clickTopTitle"><i class="iconEIP icon_news"></i> {{ $t("publicMsg.rNews") }}</div>
          </el-badge>
          <div class="pop__count__main" @click="clickTopTitle" v-if="showNewsInfoTips">
            <div class="pop__count__main__item">
              <span>{{$t("homeMsg.rtw")}} {{newsReadInfoData.read || 0}}{{$i18n.locale === 'zh-CN' ? '条' : ''}} | {{$t("homeMsg.unread")}} {{newsInfoUnreadNum}}{{$i18n.locale === 'zh-CN' ? '条' : ''}} | {{newsInfoReadPercent}}</span>
            </div>
            <div class="pop__count__main__close">
              <img @click.stop="clickedCloseNewsInfo = false" class="close-btn" src="../../assets/images/icon_close.png">
            </div>
          </div>
        </div>
        <div class="news-wrap__recommend__header__right">
<!--          <el-radio-group v-model="readType" @change="changeList">-->
<!--            <el-radio-button label="1">全部</el-radio-button>-->
<!--            <el-radio-button :label="false">未读</el-radio-button>-->
<!--            <el-radio-button :label="true">已读</el-radio-button>-->
<!--          </el-radio-group>-->
          <el-tabs v-model="readType">
            <el-tab-pane :disabled="!canClickTab" :label="$t('publicMsg.all')" name="1"></el-tab-pane>
            <el-tab-pane :disabled="!canClickTab" :label="$t('homeMsg.unread')" name="false"></el-tab-pane>
            <el-tab-pane :disabled="!canClickTab" :label="$t('homeMsg.read')" name="true"></el-tab-pane>
          </el-tabs>
          <div class="more-btn aic" @click="viewMore(7)">{{ $t("publicMsg.more") }} <i
                  class="iconEIP icon_more"></i></div>
        </div>
      </div>
      <div class="news-wrap__recommend__body">
        <div class="news-wrap__recommend__body__banner">
          <el-carousel ref="carousel-a" :interval="5000" arrow="always" indicator-position="none" height="456px" @change="handleChangeA">
            <el-carousel-item v-if="banner.length" v-for="(item,index) in swiper" :key="index">
              <img @click="viewLink(item)" @error="handleError" class="banner-img" :src="handleSrc(item)" alt="">
              <i v-if="item.isEipVideo" style="cursor: pointer" class="iconEIP icon_new_play" @click="viewLink(item)"></i>
            </el-carousel-item>
            <el-carousel-item v-if="!banner.length">
              <img class="banner-img" src="../../assets/images/default_img_2@1x.jpg">
            </el-carousel-item>
          </el-carousel>
          <div class="swiper-indicator">
            <div class="swiper-indicator__text">
              {{ swiper.length ? curBannerIndexA + 1 : 0 }}/{{ swiper.length }} {{swiper[curBannerIndexA]?swiper[curBannerIndexA].text:''}}
            </div>
          </div>
        </div>
        <div class="news-wrap__recommend__body__list" v-if="newsList.length">
          <div v-for="(item,index) in newsList" :key="index" class="list-item lh57">
            <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :class="!item.showNewIcon?'ellipsis visited':'ellipsis'" :title="item.eipDocSubject || item.docSubject">
<!--              <span class="orange" @click="viewCate(item.fdTemplateName)">[{{item.fdTemplateName}}]</span>-->
              {{ item.eipDocSubject || item.docSubject }}</a>
              <i v-if="item.isEipVideo" class="iconEIP icon_video"></i>
              <i v-else-if="item.showNewIcon" class="iconEIP icon_unread"></i>
              <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
            </div>
            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
          </div>
        </div>
        <div class="news-wrap__recommend__body__list" style="justify-content: center" v-else-if="!newsList.length && !rcdLoading">
          <div class="news-none">
            <img src="@/assets/images/news-none.png" class="icon-news-none" alt="">
            <div class="fs14" style="color: #666" v-if="readType==='1'">您本周还未阅读新闻</div>
            <div class="fs14" style="color: #666" v-if="readType==='true'">抱歉！您本周还未阅读新闻</div>
            <div class="fs14" style="color: #666" v-if="readType==='false'">恭喜您！您本周不存在未读新闻</div>
          </div>
        </div>
        <div class="news-wrap__recommend__body__list pdt10" v-else>
          <div v-for="a in 10" :key="a" class="list-item lh57">
            <div :class="['list-item__ctn','skeleton-rcd',{loading: rcdLoading}]"></div>
            <div :class="['list-item__date','skeleton-rcd',{loading: rcdLoading}]"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="news-wrap__banner">
      <el-carousel ref="carousel-b" arrow="never" :interval="5000" indicator-position="none" @change="handleChangeB">
        <el-carousel-item v-for="(item,index) in banner" :key="index">
          <img @click="viewBannerLink(item.url)" class="banner-img" :src="item.image" alt="">
        </el-carousel-item>
      </el-carousel>
      <div class="news-wrap__banner__indicator">
        <div v-for="(item,index) in banner" :key="index" :class="{active: curBannerIndexB === index}" @click="changeCarousel(index)">{{ index+1
          }}
        </div>
      </div>
    </div>
    <div class="news-wrap__main">
      <div class="news-wrap__main__left">
        <!--视频新闻-->
        <div class="right-item">
          <div class="right-item__header">
            <div class="aic"><i class="iconEIP icon_college mr5"></i> {{ $t("publicMsg.video") }}</div>
            <div class="more-btn aic" @click="handleClickMore('video')">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
          </div>
          <div v-if="videoData.id" class="right-item__body" @click="handleClickItem('video',videoData.id)">
            <div class="right-item__img">
              <i class="icon_new_play iconVideo"></i>
              <img :src="videoData.image" alt="" class="right-item__cover-img">
            </div>
            <div class="right-item-info">
              <div class="right-item-info__title">
                <div class="right-item-info__title__top">{{videoData.title}}</div>
                <div class="right-item-info__title__summary">{{videoData.summary}}</div>
              </div>
              <div class="right-item-info__bottom">
                <div class="right-item-info__b-left">
                  <!-- <div class="b-left-author">{{ $t("publicMsg.publisher") }}：{{videoData.summary}}</div>
                  <div class="b-left-author" v-if="videoData.author">{{ $t("publicMsg.writer") }}：{{videoData.author}}</div> -->
                  <div>{{ $t('newsListMsg.time') }}：{{videoData.publishTime}}</div>
                </div>
                <div class="right-item-info__b-right"><i class="iconEIP icon_new_bowse"></i>{{videoData.readCount}}</div>
              </div>
            </div>
          </div>
          <div v-else class="right-item__body">
            <div class="right-item__img">
              <div :class="{loading: videoLoading}" style="height: 100%;background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);list-style: none;background-size: 400% 100%;background-position: 100% 50%;"></div>
            </div>
            <div class="right-item-info">
              <div class="right-item-info__title">
                <div :class="['skeleton',{loading: videoLoading}]"></div>
                <div :class="['skeleton',{loading: videoLoading}]"></div>
                <div :class="['skeleton',{loading: videoLoading}]"></div>
              </div>
              <div class="right-item-info__bottom">
                <div class="right-item-info__b-left">
                  <div :class="['skeleton',{loading: videoLoading}]"></div>
                  <div :class="['skeleton',{loading: videoLoading}]"></div>
                </div>
                <div :class="['right-item-info__b-right', 'skeleton',{loading: videoLoading}]"></div>
              </div>
            </div>
          </div>
        </div>
        <!--奥园荣誉-->
        <div class="group-list">
          <div class="group-list__header">
            <div class="aic"><i class="iconEIP icon_honor mr5"></i> {{ $t("newsMsg.glory") }}</div>
            <div class="more-btn aic" @click="viewMore(3)">{{ $t("publicMsg.more") }} <i
                    class="iconEIP icon_more"></i></div>
          </div>
          <div class="group-list__body" v-if="groupGloryList.length">
            <div v-for="(item,index) in groupGloryList" :key="index" class="list-item">
              <div class="list-item__ctn">
<!--                <span class="orange" @click.stop="viewMore(3)">[奥园荣誉]</span>-->
                <a @click="handleRead(item)" target="_blank" :class="!item.showNewIcon? 'ellipsis mw737 visited' : 'ellipsis mw737'" :title="item.docSubject">{{ item.docSubject }}</a>
                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
              </div>
              <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
            </div>
          </div>
          <div class="group-list__body" v-else>
            <div v-for="a in 6" :key="a" class="list-item">
              <div :class="['list-item__ctn','skeleton-news',{loading: gloryLoading}]"></div>
              <div :class="['list-item__date','skeleton-news',{loading: gloryLoading}]"></div>
            </div>
          </div>
        </div>
        <!--奥园党建-->
        <div class="group-list">
          <div class="group-list__header">
            <div class="aic"><i class="iconEIP icon_party mr5"></i> {{ $t("newsMsg.dnews") }}</div>
            <div class="more-btn aic" @click="viewMore(2)">{{ $t("publicMsg.more") }} <i
                    class="iconEIP icon_more"></i></div>
          </div>
          <div class="group-list__body" v-if="partyNewsList.length">
            <div v-for="(item,index) in partyNewsList" :key="index" class="list-item">
              <div class="list-item__ctn">
<!--                <span class="orange" @click.stop="viewMore(2)">[奥园党建]</span>-->
                <a @click="handleRead(item)" target="_blank" :class="!item.showNewIcon? 'ellipsis mw737 visited' : 'ellipsis mw737'" :title="item.docSubject">{{ item.docSubject }}</a>
                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
              </div>
              <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
            </div>
          </div>
          <div class="group-list__body" v-else>
            <div v-for="a in 6" :key="a" class="list-item">
              <div :class="['list-item__ctn','skeleton-news',{loading: partyLoading}]"></div>
              <div :class="['list-item__date','skeleton-news',{loading: partyLoading}]"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="news-wrap__main__right">
        <!--集团宣传片-->
        <div class="right-item">
          <div class="right-item__header">
            <div class="aic"><i class="iconEIP icon_video mr5"></i> {{ $t("publicMsg.ad") }}</div>
            <div class="more-btn aic" @click="handleClickMore('picture')">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
          </div>
          <div v-if="pictureData.id" class="right-item__body" @click="handleClickItem('picture',pictureData.id)">
            <div class="right-item__img">
              <i class="icon_new_play iconVideo"></i>
              <img :src="pictureData.image" alt="" class="right-item__cover-img">
            </div>
            <div class="right-item-info">
              <div class="right-item-info__title">
                <div class="right-item-info__title__top">{{pictureData.title}}</div>
                <div class="right-item-info__title__summary">{{pictureData.summary}}</div>
              </div>
              <div class="right-item-info__bottom">
                <div class="right-item-info__b-left">
                  <!-- <div class="b-left-author">{{ $t("publicMsg.publisher") }}：{{pictureData.publisher}}</div>
                  <div class="b-left-author" v-if="pictureData.author">{{ $t("publicMsg.writer") }}：{{pictureData.author}}</div> -->
                  <div>{{ $t('newsListMsg.time') }}：{{pictureData.publishTime}}</div>
                </div>
                <div class="right-item-info__b-right"><i class="iconEIP icon_new_bowse"></i>{{pictureData.readCount}}</div>
              </div>
            </div>
          </div>
          <div v-else class="right-item__body">
            <div class="right-item__img">
              <div :class="{loading: propLoading}" style="height: 100%;background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);list-style: none;background-size: 400% 100%;background-position: 100% 50%;"></div>
            </div>
            <div class="right-item-info">
              <div class="right-item-info__title">
                <div :class="['skeleton',{loading: propLoading}]"></div>
                <div :class="['skeleton',{loading: propLoading}]"></div>
                <div :class="['skeleton',{loading: propLoading}]"></div>
              </div>
              <div class="right-item-info__bottom">
                <div class="right-item-info__b-left">
                  <div :class="['skeleton',{loading: propLoading}]"></div>
                  <div :class="['skeleton',{loading: propLoading}]"></div>
                </div>
                <div :class="['right-item-info__b-right', 'skeleton',{loading: propLoading}]"></div>
              </div>
            </div>
          </div>
        </div>
        <!--媒体看奥园-->
        <div class="group-list">
          <div class="group-list__header">
            <div class="aic"><i class="iconEIP icon_look mr5"></i> {{ $t("newsMsg.watch") }}</div>
            <div class="more-btn aic" @click="viewMore(1)">{{ $t("publicMsg.more") }} <i
                    class="iconEIP icon_more"></i></div>
          </div>
          <div class="group-list__body" v-if="watchNewsList.length">
            <div v-for="(item,index) in watchNewsList" :key="index" class="list-item">
              <div class="list-item__ctn">
                <a @click="viewMediaDetail(item)" target="_blank" :class="!item.showNewIcon? 'ellipsis mw737 visited' : 'ellipsis mw737'" :title="item.eipDocSubject || item.docSubject">{{ item.eipDocSubject || item.docSubject }}</a>
                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
              </div>
              <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
            </div>
          </div>
          <div class="group-list__body" v-else>
            <div v-for="a in 6" :key="a" class="list-item">
              <div :class="['list-item__ctn','skeleton-news',{loading: mediaLoading}]"></div>
              <div :class="['list-item__date','skeleton-news',{loading: mediaLoading}]"></div>
            </div>
          </div>
        </div>
        <!--        企业大学-->
        <div class="group-list">
          <div class="group-list__header">
            <div class="aic"><i class="iconEIP icon_college mr5"></i> {{ $t("newsMsg.college") }}</div>
            <div class="more-btn aic" @click="viewMore(4)">{{ $t("publicMsg.more") }} <i
                    class="iconEIP icon_more"></i></div>
          </div>
          <div class="group-list__body" v-if="collegeNewsList.length">
            <div v-for="(item,index) in collegeNewsList" :key="index" class="list-item">
              <div class="list-item__ctn">
<!--                <span class="orange" @click.stop="viewMore(4)">[企业大学]</span>-->
                <a @click="handleRead(item)" target="_blank" :class="!item.showNewIcon? 'ellipsis mw737 visited' : 'ellipsis mw737'" :title="item.docSubject">{{ item.docSubject }}</a>
                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
              </div>
              <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
            </div>
          </div>
          <div class="group-list__body" v-else>
            <div v-for="a in 6" :key="a" class="list-item">
              <div :class="['list-item__ctn','skeleton-news',{loading: collegeLoading}]"></div>
              <div :class="['list-item__date','skeleton-news',{loading: collegeLoading}]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import API from '@api'
  import { analyse } from '@utils/analyse'
  import Bus from '@utils/bus'
  export default {
    name: "Index",
    data() {
      return {
        readType: '1',
        curBannerIndexA: 0,
        clickedCloseNewsInfo: true,
        curBannerIndexB: 0,
        recomendList: [], // 推荐新闻
        groupNewsList: [], //集团新闻
        partyNewsList: [], //奥园党建
        collegeNewsList: [], //企业大学
        followList: [], //雇主品牌
        watchNewsList: [],  // 媒体看奥园
        groupGloryList: [],  // 集团荣耀
        banner: [],
        swiper: [],
        newsList: [],
        aoyuanPeopleData: {},
        pictureData: {},
        videoData: {},
        newsReadInfoData: {},
        rcdLoading: true,
        videoLoading: false,
        propLoading: false,
        gloryLoading: false,
        mediaLoading: false,
        partyLoading: false,
        collegeLoading: false,
        isGetHomeData: false,
        canClickTab: false,
      }
    },
    created() {
      /**
       * 新闻分类ID
       * 党建介绍：15fc7cdfb67bdd9bb3188d04a28b90c6
       * 企业大学：16951aef596dc2ea47f2b064bf997565
       * 集团新闻：15ea7ba8183a6afc980bb6c4d639bfb3
       * 奥园党建：15f053c140f7f9b00ed3bfe455b903a2
       */
      //推荐新闻
      // this.getRecomendList()
      //集团新闻
      // this.getCateNewsList(this.cateGroupId, 'groupNewsList')
      this.getNewsInfo()
      //媒体看奥园
      this.getCateNewsList(this.cateWatchId, 'watchNewsList', 'mediaLoading')
      // this.getMediaPerspective()
      //奥园党建
      this.getCateNewsList(this.cateDnewsId, 'partyNewsList', 'partyLoading')
      //集团荣耀
      this.getCateNewsList(this.cateGloryId, 'groupGloryList', 'gloryLoading')
      //企业大学
      this.getCateNewsList(this.cateCollegeId, 'collegeNewsList', 'collegeLoading')
      this.getCarousel()
      this.getEipBanner()
      //奥园人推荐列表
      // this.getAoyuanPeopleList()
      //集团宣传片列表
      this.getPictureList()
      //推荐视频列表
      this.getVideoList()
      //雇主品牌列表
      // this.getFollowUp()
      // 埋点
      analyse();
    },
    computed: {
      OA_URL(){
        return process.env.VUE_APP_OA_URL
      },
      docCategoryIds() {
        return window.SITE_CONFIG.docCategoryIds
      },
      cateWatchId() {
        return this.docCategoryIds.watch.catId
      },
      cateDnewsId() {
        return this.docCategoryIds.dnews.catId
      },
      cateGloryId() {
        return this.docCategoryIds.glory.catId
      },
      cateCollegeId() {
        return this.docCategoryIds.college.catId
      },
      cateGroupId() {
        return this.docCategoryIds.groupNews.catId
      },
      orginationCode() {
        let code = ''
        switch (Number(this.$route.query.id || 1)) {
          case 1:
            code = ''
            break
          case 2:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).jtzb
            break
          case 3:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).dc
            break
          case 4:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).sy
            break
          case 5:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).gj
            break
          case 6:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).jk
            break
          case 7:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).zb
            break
          case 8:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).wl
            break
          case 9:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).kj
            break
          case 10:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).cs
            break
          case 11:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).mg
            break
        }
        return code
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
        showNewsInfoTips() {
          let show = false;
          if ( this.clickedCloseNewsInfo ) {
            show = true;
          }
          return show;
        },
        newsInfoReadPercent() {
          let total = 0
          let percent = ''
          if ( this.newsReadInfoData ) {
            total = (this.newsReadInfoData.read || 0) + this.newsInfoUnreadNum
          }
          if ( total == 0 ) {
            percent = 100
          } else {
            percent = ((this.newsReadInfoData.read || 0) / total * 100).toFixed(0)
          }
          return this.$t("homeMsg.rp") + percent + '%'
        }
    },
    watch:{
      readType(){
          this.newsList = []
          this.getNewsInfo(1)
      }
    },
    methods: {
      handleError(e) {
        e.target.src = require('../../assets/images/default_img_2@1x.jpg')
      },
      handleSrc(item){
        if(item.image.indexOf('http') > -1) {
          return item.eipImage || item.image
        }else{
          return this.OA_URL + (item.eipImage || item.image)
        }
      },
      getMediaPerspective(){
        this.mediaLoading = true
        let params = {
          PageNo: 1,
          RowSize: 6
        }
        API.news.getMediaPerspective(params).then(res => {
          this.mediaLoading = false
          if (res.data.code === 200) {
            this.watchNewsList = res.data.data.items || []
          }
        }).catch(_ => {
          this.mediaLoading = false
        })
      },
      // changeList(){
      //   this.newsList = []
      //   this.getNewsInfo()
      // },
      handleRead(item){
          if(item.showNewIcon){
              item.showNewIcon = false;
              this.newsReadInfoData.unread--
              this.newsReadInfoData.read++
          }

        if ( item.isEipVideo != undefined && item.isEipVideo && item.videoId != undefined ) {
          // eip视频新闻
          let id = item.videoId
          let type = 'video'
          let routeUrl = this.$router.resolve({ name: 'detail', query: {type, id}})
          window.open(routeUrl.href, '_blank');
        }else{
          if(item.href.indexOf('http') > -1){
            //返回完整路径
            window.open(item.href, '_blank');
          }else{
            window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank');
          }
        }
      },
      // 获取新闻栏信息
      getNewsInfo(isClickTab) {
          this.rcdLoading = true
        let params = {
          DocStatus: '30',
          FdDepartment: this.isGetHomeData ? '' : this.orginationCode,
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: '10',
          token: localStorage.getItem('token') || ''
        }
        if(this.readType !== '1'){
          params.isThisWeekRead = this.readType
        }
        API.home.getNews(params).then(res => {
          this.rcdLoading = false
          if (res.data.code === 200) {
            this.newsList = res.data.data.list || []
            this.canClickTab = true
            if(!this.newsList.length && this.readType === '1' && !this.isGetHomeData){
              //该集团推荐新闻为空,则获取首页推荐新闻
              this.isGetHomeData = true
              this.getNewsInfo()
            }else{
              if(!isClickTab) this.getNewsReadInfo(params.FdDepartment)
            }
          }
        }).catch(_ => {
          this.canClickTab = true
          this.rcdLoading = false
        })
      },
      viewCate(name){
        switch (name) {
          case '集团新闻':
            this.viewMore(5)
                break
          case '奥园荣誉':
            this.viewMore(3)
                break
          case '媒体看新闻':
            this.viewMore(1)
                break
          case '奥园党建':
            this.viewMore(2)
                break
          case '企业大学':
            this.viewMore(4)
                break
        }
      },
      viewMoreFollow(){
          window.open(this.OA_URL + '/km/doc/?categoryId=15f05303eb24fd664fc09e54b9c873d0#j_path=%2FdocCategory&docCategory=15f05303eb24fd664fc09e54b9c873d0', '_blank')
      },
      getFollowUp(){
        API.news.followUp({rowSize: 15}, '15f05303eb24fd664fc09e54b9c873d0').then(res => {
          if (res.data.code === 200) {
            this.followList = res.data.data || []
          }
        })
      },
      viewBannerLink(url){
        if(url){
          if(url.includes('http')){
            window.open(url, '_blank')
          }else{
            window.open(this.OA_URL + url, '_blank')
          }
        }
      },
      viewLink(item){
        if(item.showNewIcon){
          item.showNewIcon = false;
          this.newsReadInfoData.unread--
          this.newsReadInfoData.read++

          const idx = this.newsList.findIndex(v => v.fdId === item.fdId)
          if(idx > -1) this.newsList[idx].showNewIcon = false
        }
        if(item.isEipVideo && item.videoId) {
          let routeUrl =this.$router.resolve(`/detail?type=video&id=${item.videoId}`)
          window.open(routeUrl.href, '_blank');
        }else{
          if(item.href.indexOf('http') > -1){
            window.open(`${item.href}`, '_blank')
          }else{
            window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
          }
        }
      },
      clickTopTitle() {
        this.clickedCloseNewsInfo = !this.clickedCloseNewsInfo
      },
      // getCarousel(){
      //   let params = {
      //     DocStatus: '30',
      //     FdIsBanner: '1',
      //     J_path: '/allNews',
      //     Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
      //     Ordertype: 'down',
      //     Pageno: 1,
      //     Rowsize: 6,
      //   }
      //   API.news.getCarousel(params).then(res => {
      //     if(res.data.code === 200) {
      //       this.swiper = res.data.data || []
      //     }
      //   })
      // },
      getCarousel(bol) {
        let params = {
          DocStatus: '30',
          FdDepartment: bol ? '' : this.orginationCode,
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: '5',
          FdIsPicNews: '1',
          token: localStorage.getItem('token') || ''
        }
        if(params.FdDepartment == ''){
            params['IsHomePage'] = true
        }
        API.home.getCarousels(params).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            this.swiper = res.data.data || []
            if(!this.swiper.length && !bol){
              this.getCarousel(1)
            }
          }
        })
      },
      getAoyuanPeopleList(){
        let params = {
          PageNo: 1,
          Rowsize: 1,
        }
        API.news.getAoyuanPeopleList(params).then(res => {
          if(res.data.code === 200 && res.data.data.items && res.data.data.items.length) {
            this.aoyuanPeopleData = res.data.data.items[0]
          }
        })
      },
      getVideoList(){
          this.videoLoading = true
        let params = {
          PageNo: 1,
          Rowsize: 1,
        }
        API.news.getVideoList(params).then(res => {
          this.videoLoading = false
          if(res.data.code === 200 && res.data.data.items && res.data.data.items.length) {
            this.videoData = res.data.data.items[0]
          }
        }).catch(_ => {
          this.videoLoading = false
        })
      },
      getPictureList(){
        this.propLoading = true
        let params = {
          PageNo: 1,
          Rowsize: 1,
        }
        API.news.getPictureList(params).then(res => {
          this.propLoading = false
          if(res.data.code === 200 && res.data.data.items && res.data.data.items.length) {
            this.pictureData = res.data.data.items[0]
          }
        }).catch(_ => {
          this.propLoading = false
        })
      },
      getEipBanner(){
        let params = {
          location: 2
        }
        API.news.getEipBanner(params).then(res => {
          if(res.data.code === 200) {
            this.banner = res.data.data || []
          }
        })
      },
      //大轮播图左右箭头切换
      toggleBanner(idx) {
        this.$refs['carousel-a'].setActiveItem(idx)
      },
      //切换轮播图
      changeCarousel(idx) {
        this.$refs['carousel-b'].setActiveItem(idx)
      },
      //获取推荐新闻
      getRecomendList() {
        /**
         * 新闻分类ID 党建介绍：15fc7cdfb67bdd9bb3188d04a28b90c6 企业大学：16951aef596dc2ea47f2b064bf997565 集团新闻：15ea7ba8183a6afc980bb6c4d639bfb3 奥园党建：15f053c140f7f9b00ed3bfe455b903a2
         * @type {{Orderby: string, Rowsize: string, DocStatus: string, DocSubject: string, Ordertype: string, DocPublishTime: string, FdDepartment: string, Pageno: string, DocCategory: string, FdImportance: string, J_path: string, token: string}}
         */
        let params = {
          // DocCategory: '',
          DocPublishTime: '',
          DocStatus: '30',
          DocSubject: '',
          FdDepartment: '',
          FdImportance: '',
          FdIsTop: 1,
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: '12',
          token: localStorage.getItem('token') || ''
        }
        API.news.getNewsRecomendPage(params).then(res => {
          if(res.data.code === 200) {
            this.recomendList = res.data.data.list || []
            // this.recomendList = [{docSubject: 'sdadasd'}]
          }
        })
      },
      //获取分类新闻
      getCateNewsList(DocCategory, listType, loading) {
        /**
         * 新闻分类ID 党建介绍：15fc7cdfb67bdd9bb3188d04a28b90c6 企业大学：16951aef596dc2ea47f2b064bf997565 集团新闻：15ea7ba8183a6afc980bb6c4d639bfb3 奥园党建：15f053c140f7f9b00ed3bfe455b903a2
         * @type {{Orderby: string, Rowsize: string, DocStatus: string, DocSubject: string, Ordertype: string, DocPublishTime: string, FdDepartment: string, Pageno: string, DocCategory: string, FdImportance: string, J_path: string, token: string}}
         */
        this[loading] = true
        let params = {
          DocCategory,
          DocPublishTime: '',
          DocStatus: '30',
          DocSubject: '',
          FdDepartment: '',
          FdImportance: '',
          J_path: '/docCategory',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: listType === 'groupNewsList' ? '8' : '6',
          token: localStorage.getItem('token') || ''
        }
        API.news.getNewsCategoryPage(params).then(res => {
          this[loading] = false
          if(res.data.code === 200) {
            this[listType] = res.data.data.list || []
          }
        }).catch(_ => {
          this[loading] = false
        })
      },
      handleChangeA(index) {
        this.curBannerIndexA = index
      },
      handleChangeB(index) {
        this.curBannerIndexB = index
      },
      //跳转媒体看奥园详情
      viewMediaDetail(item) {
        if ( item && item.showNewIcon ) {
          item.showNewIcon = false
        }
        if(item.href.indexOf('http') > -1) {
          window.open(item.href, '_blank')
        }else{
          window.open(this.OA_URL + item.href, '_blank')
        }
      },
      //跳转OA雇主品牌详情
      viewFollowDetail(item) {
        if(item.href.indexOf('http') > -1) {
          return item.href
        }else{
          return `${process.env.VUE_APP_OA_URL}${item.href}`
        }
        // window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank')
      },
      //跳转新闻列表
      viewMore(type) {
        this.$router.push(`/newsList?type=${type}&from=news&id=${this.$route.query.id}&sid=1`)
        // let routeData = this.$router.resolve(`/newsList?type=${type}&from=news&id=${this.$route.query.id}&sid=1`);
        // window.open(routeData.href, '_blank');
      },
      // 跳转到详情
      handleClickItem(type, id) {
        let routeUrl = this.$router.resolve({ name: 'detail', query: {type, id}})
        window.open(routeUrl.href, '_blank');
      },
      //跳转奥园人
      handleClickMore(type) {
        this.$router.push(`/aoyuanren?type=${type}&from=news&id=${this.$route.query.id}&sid=1`)
        // let routeData = this.$router.resolve(`/aoyuanren?type=${type}&from=news&id=${this.$route.query.id}&sid=1`);
        // window.open(routeData.href, '_blank');
      },
      //获取新闻已读未读数量
      getNewsReadInfo(fdDepartment) {
        let params = {
          fdDepartment
        };
        API.news.getNewsReadInfo(params).then((res) => {
          if (
            res.data.code === 200 &&
            res.data.data
          ) {
            // Bus.$emit('updateNum',res.data.data)
              this.newsReadInfoData = res.data.data;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .news-wrap {
    background: #fff;
    padding: 10px 30px;

    .icon-news-none{
      width: 265px;
      height: 165px;
    }
    &__recommend {
      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e8e8e8;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        &__left {
          flex: 1;
          display: flex;
          align-items: center;
          &-title {
            line-height: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            font-size: 18px;
          }
        }
        &__right {
          display: flex;
          flex: 0 0 770px;
          align-items: center;
          justify-content: space-between;
        }
      }

      &__body {
        display: flex;

        &__banner {
          flex: 0 0 748px;
          height: 420px;
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

          .swiper-indicator {
            position: absolute;
            background: rgba(0, 0, 0, .7);
            width: 100%;
            height: 48px;
            left: 0;
            bottom: 0;
            font-size: 18px;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 30px;
            z-index: 9;

            .icon_arrow_left, .icon_arrow_right {
              height: 24px;
              width: 24px;
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
          display: flex;
          flex-direction: column;
        }
      }
    }

    &__banner {
      margin: 30px 0;
      position: relative;
      height: 138px;


      .banner-img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      &__indicator {
        position: absolute;
        z-index: 9;
        right: 5px;
        bottom: 5px;
        display: flex;
        font-size: 14px;
        color: #fff;

        > div {
          cursor: pointer;
          width: 33px;
          line-height: 15px;
          text-align: center;
          background: url(https://img04.aomygod.com/fontend/2020825/imgs/icon_news_banner_default.png) no-repeat;
          background-size: contain;

          &.active {
            background: url(https://img04.aomygod.com/fontend/2020825/imgs/icon_news_banner_select.png) no-repeat;
            background-size: contain;
            color: #336997;
          }
        }
      }
    }

    &__main {
      display: flex;

      &__left {
        flex: 1;
        .right-item {
          border: 1px solid #e8e8e8;
          padding: 0 14px;
          box-sizing: border-box;
          margin-bottom: 30px;
          height: 280px;

          &:last-child {
            margin-bottom: 0;
          }

          &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 52px;
              font-size: 18px;
            border-bottom: 1px solid #e8e8e8;
          }

          &__body {
            padding: 14px 0 6px;
            display: flex;
            cursor: pointer;
          }

          &__img {
            position: relative;
            width: 356px;
            height: 200px;
            margin-bottom: 10px;
          }

          &__cover-img {
            width: 356px;
            height: 200px;
          }

          .right-item-info {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;
            flex: 1;

            &__title {
              font-size: 18px;
              color: #333;
              font-weight: bold;
              &__top {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .skeleton{
                height: 20px;
                margin-bottom: 12px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
              &__summary {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                height: 96px;
                line-height: 24px;
                overflow: hidden;
                margin-top: 20px;
                font-size: 16px;
                color: #7A7A7A;
                font-weight: normal;
              }
            }
            &__bottom {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-bottom: 10px;
            }

            &__b-left {
              font-size: 18px;
              color: #7A7A7A;

              .b-left-author {
                margin-bottom: 6px;
              }
              .skeleton{
                width: 98px;
                height: 20px;
                margin-top: 12px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
            }

            &__b-right {
              font-size: 18px;
              display: flex;
              align-items: center;
              color: #999999;
              &.skeleton{
                height: 20px;
                width: 48px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
              .icon_new_bowse{
                margin-right: 5px;
              }
            }
          }
        }

        .group-list {
          border: 1px solid #e8e8e8;
          padding: 0 14px;
          margin-bottom: 30px;
          height: 302px;

          &:last-child {
            margin-bottom: 0;
          }

          &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 52px;
            border-bottom: 1px solid #e8e8e8;
              font-size: 18px;
          }

          &__body {
            padding: 14px 0 6px;
          }
        }
      }

      &__right {
        flex: 1;
        margin-left: 30px;
        .group-list {
          border: 1px solid #e8e8e8;
          padding: 0 14px;
          margin-bottom: 30px;
          height: 302px;

          &:last-child {
            margin-bottom: 0;
          }

          &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 52px;
            border-bottom: 1px solid #e8e8e8;
              font-size: 18px;
          }

          &__body {
            padding: 14px 0 6px;
          }
        }

        .right-item {
          border: 1px solid #e8e8e8;
          padding: 0 14px;
          box-sizing: border-box;
          margin-bottom: 30px;
          height: 280px;

          &:last-child {
            margin-bottom: 0;
          }

          &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 52px;
              font-size: 18px;
            border-bottom: 1px solid #e8e8e8;
          }

          &__body {
            padding: 14px 0 6px;
            display: flex;
            cursor: pointer;
          }

          &__img {
            position: relative;
            width: 356px;
            height: 200px;
            margin-bottom: 10px;
          }

          &__cover-img {
            width: 356px;
            height: 200px;
          }

          .right-item-info {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;
            flex: 1;

            &__title {
              font-size: 18px;
              color: #333;
              font-weight: bold;
              &__top {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .skeleton{
                height: 20px;
                margin-bottom: 12px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
              &__summary {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                word-break: break-all;
                line-height: 24px;
                height: 96px;
                overflow: hidden;
                margin-top: 20px;
                font-size: 16px;
                color: #7A7A7A;
                font-weight: normal;
              }
            }

            &__bottom {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-bottom: 10px;
            }

            &__b-left {
              font-size: 18px;
              color: #7A7A7A;

              .b-left-author {
                margin-bottom: 6px;
              }
              .skeleton{
                width: 98px;
                height: 20px;
                margin-top: 12px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
            }

            &__b-right {
              font-size: 18px;
              display: flex;
              align-items: center;
              color: #999999;
              &.skeleton{
                height: 20px;
                width: 48px;
                background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                list-style: none;
                background-size: 400% 100%;
                background-position: 100% 50%;
              }
              .icon_new_bowse{
                margin-right: 5px;
              }
            }
          }
        }
      }
    }

    .list-item {
      /*cursor: pointer;*/
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      color: #333;
      a{
        cursor: pointer;
      }
      &.lh57 {
        line-height: 44px;
      }

      &__ctn {
        line-height: 35px;
        display: flex;
        align-items: center;
        text-align: left;
        .icon_video{
          margin-left: 10px;
        }
        &.skeleton-rcd{
          width: 500px;
          height: 27px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        &.skeleton-news{
          width: 500px;
          height: 25px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        a{
          color: #333;
          /*&.visited{*/
          /*  color: #999;*/
          /*}*/
          .orange {
            color: #F07E69;
            white-space: nowrap;
            cursor: pointer;
          }
        }
        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 590px;

          &.mw737 {
            max-width: 540px;
          }
        }

        .new-tag {
          color: #F07E69;
          font-size: 14px;
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
          cursor: pointer;
        }
      }

      &__date {
        font-size: 18px;
        color: #999;
        margin-left: 10px;
        &.skeleton-rcd{
          width: 100px;
          height: 27px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        &.skeleton-news{
          width: 100px;
          height: 25px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
      }
    }

    .more-btn {
      font-size: 14px;
      color: #999;
      cursor: pointer;
    }

    .loading{
      animation: skeleton-loading 1.4s ease infinite;
    }
    @keyframes skeleton-loading {
      0% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0 50%;
      }
    }
  }
</style>
<style lang="scss">
    .news-wrap{
      .el-tabs__nav-wrap::after{
        display: none;
      }
        .el-badge__content{
            top: 15px;
            right: 0;
            cursor: pointer;
        }
        .pop__count{
            z-index: -10;
            min-width: auto;
            height: 40px;
            padding: 0 0;
            border: none;
            box-shadow: none;
            &__main{
                width: auto;
                height: 40px;
                display: flex;
                justify-content: flex-start;
                background: none;
                &__item{
                    background: url('../../assets/images/news_tips_bg.png') no-repeat;
                    background-size: 100% 100%;
                    padding: 0 18px 0 20px;
                    height: 40px;
                    line-height: 40px;
                    span{
                        font-size: 16px;
                        height: 40px;
                        line-height: 40px;
                        color: #FA9F1F;
                    }
                }
              &__close{
                cursor: pointer;
                width: 20px;
                position: relative;
                .close-btn {
                  width: 20px;
                  height: 20px;
                  position: absolute;
                  left: -18px;
                  top: -10px;
                }
              }
            }
        }

    }
  .news-wrap__recommend__body__banner{
    margin-top: 12px;
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
