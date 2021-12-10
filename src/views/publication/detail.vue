<template>
  <section class="publication-detail">
    <div class="publication-detail__body">
      <div class="publication-detail__body__nav">
        <span style="color: #333" @click="$router.push('/')">首页</span>
        <span class="split"> > </span>
        <span @click="$router.push('/publication')">《奥园人》</span>
      </div>
      <div class="publication-detail__body__ctn" v-loading="isLoading">
        <div class="publication-detail__body__ctn__header">
          <div class="date">
            <div class="mr5">第{{detailInfo.number}}期</div>
            <div class="ml6 fs16 grey">{{detailInfo.publishStartTime | formatDateConnect(detailInfo.publishEndTime,'yyyy年MM月')}}</div>
          </div>
          <div class="search">
            <div class="fs12">{{$t('publication.menuSearch')}}:</div>
            <el-input clearable v-model="keyWord" class="search-input" :placeholder="$t('publication.enterKeyword')"></el-input>
            <el-button type="primary" @click="getDetail()">{{$t('publication.search')}}</el-button>
          </div>
          <div class="nav">
            <div @click="togglePublication(true)">{{$t('publication.lastterm')}}</div>
            <div @click="togglePublication(false)">{{$t('publication.nextterm')}}</div>
            <div @click="$router.push('/publication')">{{$t('publication.backtolist')}}</div>
          </div>
        </div>
        <div class="main-wrap">
          <div class="main-wrap__left">
            <div v-for="(item,idx) in detailInfo.detail" :key="idx">
              <div @click="clickMenuParent(item)" :class="['menu-item',{active: item.id === menuIdx}, {highLight: item.isHighLight}]"><div>{{item.title}}</div><i @click.stop="handleFold(item)" style="color: #aaa" v-if="item.children && item.children.length" :class="item.open ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></div>
              <div v-show="item.open">
                <div v-for="(c,cidx) in item.children" :key="cidx">
                  <div @click="clickMenuParent(c)" :class="['menu-child',{active: c.id === menuIdx}, {highLight: c.isHighLight}]">
                    <div style="text-indent:10px">
                      {{c.title}}
                    </div>
                    <i @click.stop="handleFold(c)" style="color: #aaa" v-if="c.children && c.children.length" :class="c.open ? 'el-icon-arrow-down' : 'el-icon-arrow-up'">
                    </i>
                  </div>
                  <div v-show="c.open">
                    <div @click="clickThirdLevel(t)" v-for="(t,tidx) in c.children" :key="tidx" :class="['menu-child',{active: t.id === menuIdx}, {highLight: t.isHighLight}]">
                      <div style="text-indent:20px">
                        {{t.title}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="main-wrap__right">
            <div v-if="menuIdx === 0" class="cover-wrap">
              <div class="fav-wrap">
                <div class="fav-num">{{detailInfo.likeCount >= 100000 ? '10万+' : (detailInfo.likeCount || 0)}}</div>
                <div @click="doLike" :class="['circle', {active: true}]"></div>
              </div>
              <img class="cover-img" :src="detailInfo.image" alt="">
              <div class="read-btn" @click="toggleArticle(2)">{{$t('publication.startreading')}}</div>
            </div>
            <div v-else class="page-wrap">
              <div class="fav-wrap">
                <div class="fav-num">{{detailInfo.likeCount >= 100000 ? '10万+' : (detailInfo.likeCount || 0)}}</div>
                <div @click="doLike" :class="['circle', {active: 1}]"></div>
              </div>
              <div class="page-wrap__banner">
                <el-carousel ref="carousel" :autoplay="true" indicator-position="none" arrow="never" @change="changeBanner">
                  <el-carousel-item v-if="article.image.length" v-for="(item, index) in article.image" :key="index">
                    <div style="width: 100%;height: 100%;cursor: pointer" @click=""><img @error="handleError" class="banner-img" :src="item.url"></div>
                  </el-carousel-item>
                  <el-carousel-item v-if="!article.image.length">
                    <img class="banner-img" src="../../assets/images/default_img_2@1x.jpg">
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="swiper-indicator">
                <div @click="changeCarousel(index)" v-for="(item, index) in article.image" :key="index" :class="['swiper-indicator__item',{active: bannerIdx == index}]">{{index + 1}}</div>
              </div>

              <div class="page-wrap__title">
                <i @click="toggleArticle(1)" :class="['el-icon-arrow-left',{disabled: handleArrowDisabled(1)}]"></i>
                <div class="page-wrap__title__center">
                  <div class="main-title">{{article.title}}</div>
                  <div class="creator" v-if="article.isShowAuthror == 1">文|{{article.authrorDepartment}} {{article.authror}}</div>
                </div>
                <i @click="toggleArticle(2)" :class="['el-icon-arrow-right',{disabled: handleArrowDisabled(2)}]"></i>
              </div>
              <div class="page-wrap__content">
                <el-scrollbar style="height:100%">
                  <div class="html-wrap" style="padding: 0 20px;" v-html="article.content"></div>
                </el-scrollbar>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import API from '@api'
  import { formatDate, formatDateConnect } from '@utils'
  export default {
    data(){
      return {
        menuList: [
          {name: '封面', id: 0},
          {name: '看守雨', id:1, children: [{name: '传承·创新·蜕变', id: 2},{name: '撒范德萨范德萨', id:3},]},
          {name: '咨询',id: 4, children: [{name: '传承·创新·蜕变',id:5},{name: '撒范德萨范德萨撒范德萨范德萨撒范德萨范德萨撒范德萨范德萨',id:6},]},
          {name: '热点',id:7, children: [{name: '传承·创新·蜕变',id:8, children: [{name: '讲述的就是',id:9},{name:'viiv效率科学',id:10}]},{name: '撒范德萨范德萨',id:11},]},
          {name: '专题1:社会主义',id:12, children: [{name: '传承·创新·蜕变',id:13},{name: '撒范德萨范德萨',id:14},]},
          {name: '专题2:舞动起来',id:15, children: [{name: '传承·创新·蜕变',id:16},{name: '撒范德萨范德萨',id:17},]},
          {name: '专题3:匠心独运',id:18, children: [{name: '传承·创新·蜕变',id:19},{name: '撒范德萨范德萨',id:20},]},
        ],
        menuIdx: 0,
        banner: [
          {src: 'https://eip.aoyuan.net/file/api/file-management/files/20210823b6a6841501614de68ee58ae220234574.jpg'},
          {src: 'https://eip.aoyuan.net/file/api/file-management/files/2021010895f1fb4cbdb0476884c22908cde58c4a.jpg'},
        ],
        bannerIdx: 0,
        keyWord: '',
        detailInfo: {detail: []},
        flattenArr: [],
        isLoading: false,
      }
    },
    computed: {
      article(){
        const item = this.flattenArr.find(v => v.id === this.menuIdx)
        return item ? item.article : {image: []}
      }
    },
    created(){
      this.getDetail()
    },
    methods: {
      doLike(){
        API.publication.doLike(this.$route.query.id).then(res => {
          if(res.data.code === 200) {
            this.detailInfo.likeCount += 10
          }
        }).catch(err => {
          this.$message.error(err.response.data.message)
        })
      },
      togglePublication(isPrevious){
        this.isLoading = true
        this.keyWord = ''
        API.publication.getAypeopleAround(this.$route.query.id,{isPrevious}).then(res => {
          this.isLoading = false
          if(res.data.code === 200) {
            this.$router.replace(`/publicationDetail?id=${res.data.data}`)
            this.getDetail(res.data.data)
          }
        }).catch(err => {
          this.isLoading = false
          // this.$message.error(err.response.data.message)
        })
      },
      handleArrowDisabled(type){
        const idx = this.flattenArr.findIndex(v => v.id === this.menuIdx)
        if(type === 1) {
          //上一个
          return idx <= 0
        }else{
          //下一个
          return idx >= (this.flattenArr.length - 1)
        }
      },
      toggleArticle(type){
        const idx = this.flattenArr.findIndex(v => v.id === this.menuIdx)
        if(type === 1) {
          //上一个
          if(idx > 0) {
            this.menuIdx = this.flattenArr[idx - 1].id
          }
        }else{
          //下一个
          if(idx < (this.flattenArr.length - 1)){
            this.menuIdx = this.flattenArr[idx + 1].id
          }
        }

      },
      flatten(arr, parent) {
        for (let i = 0; i < arr.length; i++) {
          this.flattenArr.push(arr[i])
          if(parent){
            this.$set(arr[i], 'parentId', parent.id)
          }
          if(arr[i].isHighLight && parent) {
            //如果子级有高亮,则把父级展开
            this.$set(parent, 'open', true)
            // debugger
            const idx = this.detailInfo.detail.findIndex(v => v.id === parent.parentId)
            if(idx > -1) this.$set(this.detailInfo.detail[idx], 'open', true)
          }
          if(arr[i].children){
            this.flatten(arr[i].children, arr[i])
          }
        }
      },
      //切换轮播图
      changeCarousel(idx) {
        this.$refs['carousel'].setActiveItem(idx)
      },
      getDetail(id){
        const detailId = id || this.$route.query.id
        this.flattenArr = []
        this.isLoading = true
        API.publication.ayPeopleDetail({id: detailId, keyWord: this.keyWord}).then(res => {
          this.isLoading = false
          this.menuIdx = 0
          if(res.data.code === 200) {
            this.detailInfo = res.data.data || {detail: []}
            if(this.detailInfo.detail) {
              this.detailInfo.detail.splice(0, 0, {id: 0, title: '封面', article: {}})
            }else{
              this.$set(this.detailInfo, 'detail', [])
            }
            this.flatten(this.detailInfo.detail)
          }
        }).catch(err => {
          this.isLoading = false
          this.$message.error(err.response.data.message)
        })
      },
      handleError(e) {
        e.target.src = require('../../assets/images/default_img_2@1x.jpg')
      },
      changeBanner(index) {
        this.bannerIdx = index
      },
      clickMenuParent(item){
        this.menuIdx = item.id
      },
      handleFold(item){
        if(item.children && item.children.length) {
          this.$set(item,'open', !item.open)
        }
      },
      clickThirdLevel(item){
        this.menuIdx = item.id
      }
    }
  }
</script>

<style lang="scss" scoped>
  .publication-detail{
    &__body{
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
      &__ctn{
        background: #fff;
        width: 1350px;
        margin: 0 auto;
        padding: 43px 74px;
        &__header{
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #222;
          .date{
            display: flex;
            align-items: center;
            font-size: 20px;
          }
          .grey{
            color: #666;
          }
          .search{
            display: flex;
            align-items: center;
            &-input{
              width: 226px;
              margin: 0 16px;
            }
          }
          .nav{
            display: flex;
            align-items: center;
            div{
              cursor: pointer;
              font-size: 14px;
              color: #666;
              border-radius: 3px;
              border: 1px solid #E8E8E8;
              margin-left: 10px;
              line-height: 28px;
              padding: 0 10px;
            }
          }
        }
        .main-wrap{
          margin-top: 46px;
          display: flex;
          justify-content: space-between;
          &__left{
            width: 294px;
            flex: 0 0 294px;
            .menu-item,.menu-child{
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              background: #006E38;
              min-height: 60px;
              width: 100%;
              text-align: left;
              border-bottom: 1px solid #fff;
              color: #fff;
              font-size: 16px;
              padding: 20px 18px 20px 56px;
              &.highLight{
                border: 3px solid red;
              }
            }
            .menu-item.active{
              background: rgba(0, 110, 56, 0.71);
              color: #fff;
            }
            .menu-child{
              background: #fff;
              color: #333;
              border-bottom: 1px solid #EFEFEF;
              &.active{
                background: #F7FAF9;
                color: #006E38;
              }
            }
          }
          &__right{
            .cover-wrap{
              width: 638px;
              height: 806px;
              position: relative;
              .cover-img{
                width: 100%;
                height: 100%;
              }
              .read-btn{
                position: absolute;
                right: 0;
                top: 0;
                border-radius: 0 0 0 26px;
                background: #006E38;
                color: #fff;
                font-size: 16px;
                line-height: 43px;
                width: 112px;
                text-align: center;
                cursor: pointer;
              }
            }
            .page-wrap{
              position: relative;
              width: 886px;
              border: 1px solid #C6C6C6;
              padding: 32px 38px 60px;
              &__banner{
                height: 460px;
                width: 100%;
                background: #ECECEC;
                padding: 17px;
                .banner-img {
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
              }
              .swiper-indicator{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 10px;
                &__item{
                  cursor: pointer;
                  width: 22px;
                  line-height: 22px;
                  text-align: center;
                  font-size: 16px;
                  background: #EAEAEA;
                  color: #666;
                  border-radius: 2px;
                  margin-right: 10px;
                  &.active{
                    background: #006E38;
                    color: #fff;
                  }
                }
              }
              &__title{
                margin-top: 18px;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-icon-arrow-left,.el-icon-arrow-right{
                  font-size: 46px;
                  color: #006E38;
                  font-weight: bold;
                  cursor: pointer;
                  &.disabled{
                    cursor: not-allowed;
                  }
                }
                &__center{
                  flex: 0 0 677px;
                  width: 677px;
                  .main-title{
                    color: #222;
                    font-size: 22px;
                    text-align: center;
                    padding-bottom: 18px;
                    margin-bottom: 13px;
                    border-bottom: 1px solid #999;
                  }
                  .creator{
                    font-size: 16px;
                    color: #999;
                    text-align: center;
                  }
                }
              }
              &__content{
                font-size: 16px;
                width: 677px;
                /*height: 753px;*/
                overflow-x: hidden;
                /*overflow-y: scroll;*/
                margin: 0 auto;

              }
            }
            .fav-wrap{
              position: absolute;
              right: 30px;
              bottom: 10px;
              text-align: center;
              .fav-num{
                color: #3a3a3a;
                font-size: 22px;
              }
              .circle{
                cursor: pointer;
                margin: 5px auto 0;
                border-radius: 50%;
                width: 49px;
                height: 49px;
                box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.13);
                background: #fff url("../../assets/images/icon_like_normal.png") no-repeat center center;
                background-size: 28px 24px;
                &.active{
                  background: #fff url("../../assets/images/icon_like_active.png") no-repeat center center;
                  background-size: 28px 24px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .publication-detail{
    .el-scrollbar__wrap{
      width: 100%;
      max-height: 753px;
      margin-bottom: 0 !important;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
    .el-scrollbar__bar.is-horizontal{
      display: none;
    }
    .html-wrap{
      img {
        max-width: 100% !important;
      }
    }
  }

</style>
