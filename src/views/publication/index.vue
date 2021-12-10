<template>
  <section class="publication-wrap">
    <div class="publication-wrap__banner">
      <el-carousel ref="carousel" :interval="5000" indicator-position="none" arrow="never" @change="handleChange">
        <el-carousel-item v-if="banner.length" v-for="(item, index) in banner" :key="index" @click="">
          <div style="width: 100%;height: 100%;cursor: pointer" @click=""><img @error="handleError" class="banner-img" :src="item.image"></div>
        </el-carousel-item>
        <el-carousel-item v-if="!banner.length">
          <img class="banner-img" src="../../assets/images/default_img_2@1x.jpg">
        </el-carousel-item>
      </el-carousel>
      <div class="swiper-indicator">
        <div class="swiper-indicator__circle">
          <div @click="toggleBanner(index)" :class="['swiper-indicator__circle__item',{active:curBannerIndex==index}]" v-for="(item,index) in banner" :key="index"></div>
        </div>
      </div>
    </div>

    <div class="publication-wrap__body">
      <div class="publication-wrap__body__nav">
        <span style="color: #333" @click="$router.push('/')">首页</span>
        <span class="split"> > </span>
        <span>奥园刊物</span>
      </div>
      <div class="publication-wrap__body__main">
        <div class="tab">
          <div @click="tabIndex = 0" :class="['tab-item', {active: tabIndex === 0}]">《{{$t('publication.aoyuanren')}}》</div>
          <div @click="tabIndex = 1" :class="['tab-item', {active: tabIndex === 1}]">{{$t('publication.publication')}}</div>
        </div>
        <div class="content-main">
          <div v-show="tabIndex === 0">
            <div class="year-list">
              <div style="white-space: nowrap">{{$t('publication.viewbyyear')}}:</div>
              <div class="year-scroll">
                <i @click="selectYear(1)" :class="['el-icon-arrow-left',{disabled: yearHit === 0}]"></i>
                <div class="year-scroll__inner">
                  <div ref="scroll-area" style="display: flex;align-items: center">
                    <div @click="toggleYear(idx)" :class="['year-item',{active: yearCurrentIdx === idx}]" v-for="(item,idx) in yearList" :key="item.name">{{item.name}}</div>
                  </div>
                </div>
                <i @click="selectYear(2)" :class="['el-icon-arrow-right',{disabled: -(yearList.length - 11) >= yearHit}]"></i>
              </div>
            </div>
            <div class="filter-form">
              <div class="mr15">{{$t('publication.searchbycontent')}}:</div>
              <el-input class="title-input" v-model="aoyuanrenFilterForm.title" clearable :placeholder="$t('publication.placeholder')"></el-input>
              <div class="mr15">{{$t('publication.searchbytime')}}:</div>
              <el-date-picker
                      class="date-picker"
                      v-model="aoyuanrenFilterForm.startTime"
                      :placeholder="$t('newsListMsg.stime')"
                      type="date">
              </el-date-picker>
              <span class="m10">{{$t('newsListMsg.to')}}</span>
              <el-date-picker
                      class="date-picker"
                      v-model="aoyuanrenFilterForm.endTime"
                      :placeholder="$t('newsListMsg.etime')"
                      type="date">
              </el-date-picker>
              <el-button class="search-btn" type="primary" @click="aoyuanrenPageIndex=1;getAyPeople()">{{$t('publication.search')}}</el-button>
            </div>

            <div class="new-public">
              <div class="new-public__banner" @click="viewDetail(newPublication)">
                <img :src="newPublication.newImage" alt="">
                <div class="new-public__banner__desc">
                  <div class="new-public__banner__desc__title">{{newPublication.newTitle}}</div>
                  <div class="new-public__banner__desc__remark">{{newPublication.newIntroduction}}</div>
                  <div class="new-public__banner__desc__btn">{{$t('publication.detail')}}>></div>
                </div>
              </div>
              <div class="new-public__cover" @click="viewDetail(newPublication)">
                <div class="new-public__cover__title">
                  <div class="new-tag">NEW</div>
                  <div>{{$t('publication.newPublication')}}</div>
                </div>
                <div class="new-public__cover__desc">
                  <img :src="newPublication.image" alt="">
                  <div class="new-public__cover__desc__right">
                    <div class="fs18 main-title">{{newPublication.title}}</div>
                    <div class="fs16" style="color: #666">
                      <div>第{{newPublication.number}}期</div>
                      <!-- <div>{{newPublication.publishStartTime | formatDate('yyyy年MM月')}}</div> -->
                      <div>{{newPublication.publishStartTime | formatDateConnect(newPublication.publishEndTime,'yyyy/MM')}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="public-list">
              <div @click="viewDetail(item)" class="public-list__item" v-for="item in aoyuanrenList" :key="item.id">
                <img :src="item.image" alt="">
                <div class="public-list__item__title">
                  <!-- <div class="mb10">第{{item.number}}期 {{item.publishStartTime | formatDate('yyyy年MM月')}}</div> -->
                  <div class="mb10" style="display: flex;justify-content: space-between;align-items: baseline"><div>第{{item.number}}期</div><div>{{item.publishStartTime | formatDateConnect(item.publishEndTime,'yyyy/MM')}}</div></div>
                  <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;font-weight: bold;">{{item.title}}</div>
                </div>
              </div>
            </div>

            <el-pagination
                    background
                    style="text-align: right"
                    class="pagination"
                    :current-page="aoyuanrenPageIndex"
                    :page-size="aoyuanrenPageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="aoyuanrenTotalCount"
                    @current-change="handleCurrentChange($event,1)">
            </el-pagination>
          </div>
          <div v-show="tabIndex === 1">
            <div class="filter-form" style="margin-top: 0;">
              <div class="mr15">{{$t('publication.searchbycontent')}}:</div>
              <el-input class="title-input" v-model="publicationFilterForm.title" clearable :placeholder="$t('publication.placeholder')"></el-input>
              <div class="mr15">{{$t('publication.searchbytime')}}:</div>
              <el-date-picker
                      class="date-picker"
                      v-model="publicationFilterForm.startTime"
                      :placeholder="$t('newsListMsg.stime')"
                      type="date">
              </el-date-picker>
              <span class="m10">{{$t('newsListMsg.to')}}</span>
              <el-date-picker
                      class="date-picker"
                      v-model="publicationFilterForm.endTime"
                      :placeholder="$t('newsListMsg.etime')"
                      type="date">
              </el-date-picker>
              <el-button class="search-btn" type="primary" @click="publicationPageIndex=1;getPublication()">{{$t('publication.search')}}</el-button>
            </div>
            <div class="public-list">
              <div @click="viewPdf(item)" class="public-list__item" v-for="item in publicationList" :key="item.id">
                <img :src="item.image" alt="">
                <div class="public-list__item__title">
                  <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;font-weight: bold;">{{item.title}}</div>
                  <div class="mb10">{{item.publishStartTime | formatDate('yyyy年MM月')}}</div>
                </div>
              </div>
            </div>

            <el-pagination
                    background
                    style="text-align: right"
                    class="pagination"
                    :current-page="publicationPageIndex"
                    :page-size="publicationPageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="publicationTotalCount"
                    @current-change="handleCurrentChange($event,2)">
            </el-pagination>
          </div>
          <div class="contribute-wrap">
            <div class="contribute-wrap__title">{{$t('publication.contribute')}}</div>
            <div style="white-space: pre-wrap;">{{setting.contribution}}</div>
            <div class="contribute-wrap__title">{{$t('publication.subscribe')}}</div>
            <div style="white-space: pre-wrap;">{{setting.subscribe}}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import API from '@api'
  import { formatDate } from '@utils'
  export default {
    name: "index",
    data(){
      return {
        aoyuanrenPageSize: 10,
        aoyuanrenPageIndex: 1,
        aoyuanrenTotalCount: 0,
        publicationPageSize: 10,
        publicationPageIndex: 1,
        publicationTotalCount: 0,
        banner: [],
        curBannerIndex: 0,
        tabIndex: 0,
        yearList: [],
        yearItemWidth: 0,
        yearHit: 0,
        aoyuanrenFilterForm: {
          title: '', startTime: '', endTime: ''
        },
        publicationFilterForm: {
          title: '', startTime: '', endTime: ''
        },
        yearCurrentIdx: 0,
        newPublication: {},
        aoyuanrenList: [],
        publicationList: [],
        setting: {},
      }
    },
    mounted(){
      this.yearItemWidth = this.$refs['scroll-area'].children[0].clientWidth
      window.addEventListener('resize',this.handleResize)
    },
    destroyed() {
      window.removeEventListener('resize',this.handleResize)
    },
    created(){
      let curYear = new Date().getFullYear()
      const forTimes = curYear - 2000
      this.yearList = []
      for (let i = 0; i <= forTimes; i++) {
        this.yearList.push({name: curYear})
        curYear--
      }
      this.getAyPeople()
      this.getCarousels()
      this.getNewAypeople()
      this.getPublication()
      this.ayPeopleSetting()
    },
    methods: {
      getCarousels() {
        let params = {
          location: 4
        }
        API.news.getEipBanner(params).then(res => {
          if(res.data.code === 200) {
            this.banner = res.data.data || []
          }
        })
      },
      viewPdf(item){
        let prefixUrl = `${location.origin}/pdf/web/viewer.html?file=`
        window.open(prefixUrl + encodeURIComponent(item.fileUrl), '_blank')
      },
      ayPeopleSetting(){
        API.publication.ayPeopleSetting({}).then(res => {
          if(res.data.code === 200) {
            this.setting = res.data.data || {}
          }
        })
      },
      getNewAypeople(){
        API.publication.getNewAyPeople({}).then(res => {
          if(res.data.code === 200) {
            this.newPublication = res.data.data || {}
          }
        })
      },
      getPublication(){
        let params = {
          pageNo: this.publicationPageIndex,
          rowSize: this.publicationPageSize,
          title: this.publicationFilterForm.title,
          publishBeginTime: this.publicationFilterForm.startTime ? formatDate(new Date(this.publicationFilterForm.startTime)) : '',
          publishEndTime: this.publicationFilterForm.endTime ? formatDate(new Date(this.publicationFilterForm.endTime)) : '',
        }
        API.publication.getOrgMagazine(params).then(res => {
          if(res.data.code === 200) {
            this.publicationList = res.data.data.items || []
            this.publicationTotalCount = res.data.data.totalCount
          }
        })
      },
      getAyPeople(){
        let params = {
          year: this.yearList[this.yearCurrentIdx].name,
          title: this.aoyuanrenFilterForm.title,
          publishBeginTime: this.aoyuanrenFilterForm.startTime ? formatDate(new Date(this.aoyuanrenFilterForm.startTime)) : '',
          publishEndTime: this.aoyuanrenFilterForm.endTime ? formatDate(new Date(this.aoyuanrenFilterForm.endTime)) : '',
          pageNo: this.aoyuanrenPageIndex,
          rowSize: this.aoyuanrenPageSize,
        }
        API.publication.getAyPeople(params).then(res => {
          if(res.data.code === 200) {
            this.aoyuanrenList = res.data.data.items || []
            this.aoyuanrenTotalCount = res.data.data.totalCount
          }
        })
      },
      viewDetail(item){
        if(item.fileUrl){
          //直接预览Pdf
          let prefixUrl = `${location.origin}/pdf/web/viewer.html?file=`
          window.open(prefixUrl + encodeURIComponent(item.fileUrl), '_blank')
        }else{
          this.$router.push(`/publicationDetail?id=${item.id}`)
        }
      },
      toggleYear(idx){
        this.yearCurrentIdx = idx
        this.aoyuanrenPageIndex = 1
        this.getAyPeople()
      },
      handleResize(){
        this.yearItemWidth = this.$refs['scroll-area'].children[0].clientWidth
        this.$refs['scroll-area'].style.transform = `translateX(${this.yearItemWidth * this.yearHit}px)`
      },
      handleError(e) {
        e.target.src = require('../../assets/images/default_img_2@1x.jpg')
      },
      handleChange(index) {
        this.curBannerIndex = index
      },
      //大轮播图左右箭头切换
      toggleBanner(idx) {
        this.$refs['carousel'].setActiveItem(idx)
      },
      selectYear(type){
        if(type === 1) {
          if(this.yearHit === 0) return
          this.yearHit++
        }else{
          if(-(this.yearList.length - 11) >= this.yearHit) return
          this.yearHit--
        }
        this.$refs['scroll-area'].style.transform = `translateX(${this.yearItemWidth * this.yearHit}px)`
      },
      handleCurrentChange(aoyuanrenPageIndex, type) {
        if(type === 1) {
          this.aoyuanrenPageIndex = aoyuanrenPageIndex
          this.getAyPeople()
        }else{
          this.publicationPageIndex = aoyuanrenPageIndex
          this.getPublication()
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .publication-wrap{
    max-width: 100% !important;
    &__banner{
      height: 460px;
      width: 1600px;
      margin: 0 auto;
      position: relative;

      .swiper-indicator {
        position: absolute;
        // background: rgba(0, 0, 0, .7);
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
    .banner-img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    &__body{
      width: 1600px;
      margin: 0 auto;
      &__nav{
        text-align: left;
        font-size: 14px;
        color: #999;
        padding: 20px 0 13px;
        .split{
          margin: 0 14px;
        }
        span{
          cursor: pointer;
        }
      }

      &__main{
        background: #fff;
        width: 1350px;
        margin: 0 auto;
        .tab{
          height: 63px;
          border-bottom: 1px solid #dedede;
          font-size: 16px;
          color: #666;
          display: flex;
          align-items: center;
          padding-left: 40px;
          &-item{
            margin-right: 44px;
            line-height: 63px;
            cursor: pointer;
            &.active{
              color: #006E38;
              position: relative;
              &::before{
                content: '';
                width: 30px;
                height: 3px;
                background: #006E38;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
        }
        .content-main{
          padding: 33px 65px;
          .year-list{
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #222;
            .year-scroll{
              display: flex;
              align-items: center;
              margin-left: 17px;
              width: 865px;
              i{
                color: #006E38;
                font-weight: bold;
                cursor: pointer;
                &.disabled{
                  cursor: not-allowed;
                }
              }
              .year-item{
                padding: 0 21px;
                cursor: pointer;
                &.active{
                  color: #006e38;
                }
              }
              &__inner{
                width: 93%;
                flex: 0 0 93%;
                overflow: hidden;
                display: flex;
                align-items: center;
              }
            }
          }
          .filter-form{
            margin-top: 30px;
            font-size: 14px;
            color: #222;
            display: flex;
            align-items: center;
            .title-input{
              width: 226px;
              margin-right: 60px;
            }
            .date-picker{
              width: 178px;
            }
            .search-btn{
              margin-left: 30px;
            }
            .m10{
              margin: 0 10px;
            }
            .mr15{
              margin-right: 15px;
            }
          }

          .new-public{
            margin-top: 58px;
            display: flex;
            align-items: center;
            height: 323px;
            justify-content: space-between;
            word-break: break-all;
            &__banner{
              flex: 0 0 780px;
              width: 780px;
              display: flex;
              align-items: center;
              height: 100%;
              cursor: pointer;
              img{
                width: 480px;
                flex: 0 0 480px;
                height: 100%;
              }
              &__desc{
                flex: 1;
                padding: 40px 26px;
                background: #F6F6F6;
                height: 100%;
                text-align: left;
                &__title{
                  font-size: 20px;
                  font-weight: bold;
                  color: #222;
                  margin-bottom: 16px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  width: 245px;
                  /*position: relative;*/
                  /*overflow: hidden;*/
                  /*line-height: 24px;*/
                  /*max-height: 48px;*/
                  /*&::after {*/
                  /*  content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;*/
                  /*  background: -webkit-linear-gradient(left, transparent, #fff 55%);*/
                  /*  background: -o-linear-gradient(right, transparent, #fff 55%);*/
                  /*  background: -moz-linear-gradient(right, transparent, #fff 55%);*/
                  /*  background: linear-gradient(to right, transparent, #fff 55%);*/
                  /*}*/
                }
                &__remark{
                  font-size: 16px;
                  color: #7a7a7a;
                  margin-bottom: 16px;
                }
                &__btn{
                  font-size: 16px;
                  color: #006e38;
                }
              }
            }
            &__cover{
              cursor: pointer;
              box-shadow: 0 5px 14px 0 rgba(0, 0, 0, 0.03);
              border: 1px solid #EEEEEE;
              width: 392px;
              flex: 0 0 392px;
              height: 100%;
              &__title{
                padding: 30px 30px;
                font-size: 22px;
                font-weight: bold;
                color: #222;
                display: flex;
                align-items: center;
                .new-tag{
                  font-size: 12px;
                  background: #f02f14;
                  color: #fff;
                  padding: 3px;
                  margin-right: 10px;
                  font-weight: normal;
                }
              }
              &__desc{
                padding: 0 30px;
                display: flex;
                align-items: center;
                height: 200px;
                img{
                  width: 160px;
                  height: 100%;
                  flex: 0 0 160px;
                  margin-right: 20px;
                }
                &__right{
                  flex: 1;
                  height: 100%;
                  text-align: left;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  .main-title{
                    font-weight:bold;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    width: 170px;
                  }
                }
              }
            }
          }

          .public-list{
            display: flex;
            flex-wrap: wrap;
            margin-top: 75px;
            &__item{
              width: 210px;
              height: 347px;
              margin-right: 42px;
              margin-bottom: 38px;
              box-shadow: 0 5px 16px 0 rgba(0, 0, 0, 0.06);
              border: 1px solid #F0F0F0;
              cursor: pointer;
              &:nth-child(5n){
                margin-right: 0;
              }
              img{
                width: 100%;
                height: 264px;
              }
              &__title{
                padding: 13px 18px;
                font-size: 15px;
                color: #222;
              }
            }
          }

          .contribute-wrap{
            border-top: 1px solid #E5E5E5;
            margin-top: 60px;
            font-size: 16px;
            text-align: left;
            color: #666;
            &__title{
              color: #006E38;
              font-size: 18px;
              margin-top: 40px;
              margin-bottom: 17px;
            }
          }
        }
      }
    }
  }
</style>
