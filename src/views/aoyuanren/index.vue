<template>
  <div class="aoyuanren">
    <div class="aoyuanren-nav">
        <span style="cursor: pointer;" @click="$router.push('/home?id=1')">{{ $t("publicMsg.home") }}</span>
        <span class="aoyuanren-split"> > </span>
        <span style="cursor: pointer;" @click="handleJump">{{ $route.query.from=='news'? $t('newsListMsg.new') : $t('homeMsg.cc') }}</span>
        <span class="aoyuanren-split"> > </span>
        <span ref="pageName" style="color: #999">{{ formatTabName() }}</span>
    </div>
    <div class="aoyuanren-main">
      <div class="aoyuanren-header">{{ formatTabName() }}</div>
      <div class="aoyuanren-list" v-if="aoyuanPeopleList.length">
        <div v-for="(item, index) in aoyuanPeopleList" :key="index" class="aoyuanren-list-item" @click="handleClickItem(item.id)">
          <div class="aoyuanren-list-item-img">
            <img :src="item.image" alt="" class="ayr-li-cover-img">
          </div>
          <div class="right-item-info">
            <div class="right-item-info__title">
              <div class="right-item-info__title__top"><img v-if="item.isTop" class="top-tap" src="@/assets/images/top-tag.png" alt=""><span>{{item.title}}</span></div>
              <div class="right-item-info__title__summary" v-if="item.summary">{{item.summary}}</div>
            </div>
            <div class="right-item-info__bottom">
              <div class="right-item-info__b-left">
                <!-- <div class="b-left-author">{{ $t("publicMsg.publisher") }}：{{item.publisher}}</div>
                <div class="b-left-author" v-if="item.author">{{ $t("publicMsg.writer") }}：{{item.author}}</div> -->
                <div>{{ $t('newsListMsg.time') }}：{{item.publishTime}}</div>
              </div>
              <div class="right-item-info__b-right"><i class="iconEIP icon_new_bowse"></i>{{item.readCount}}</div>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="aoyuanren-list" style="justify-content: center" v-else>内容信息为空，需要管理员后台新增内容</div>-->
      <el-pagination
              background
              class="pagination"
              :current-page="pageIndex"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="totalCount"
              @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import API from '@api'
import { analyse } from '@utils/analyse'
export default {
  name: "Aoyuanren",
  data() {
    return {
      aoyuanPeopleList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
    }
  },
  computed: {
    formatTabName () {
      return () => {
        let type = this.$route.query.type
        let tabName = ''
        if (type === 'picture') {
          tabName = this.$t("publicMsg.ad")
        } else if(type === 'video') {
          tabName = this.$t('publicMsg.video')
        } else {
          tabName = this.$t('publicMsg.aoyuanren')
        }
        return tabName
      }
    }
  },
  mounted() {
    let type = this.$route.query.type
    if(type === 'people'){
      this.getAoyuanPeopleList('getAoyuanPeopleList')
    }else if(type === 'picture'){
      this.getAoyuanPeopleList('getPictureList')
    }else if(type === 'video'){
      this.getAoyuanPeopleList('getVideoList')
    }
    analyse('进入页面', this.getPageName())
  },
  methods:{
    handleJump(){
      this.$router.push(`/news?id=${this.$route.query.id}&sid=1`)
    },
    //切换分页
    handleCurrentChange(pageIndex) {
      this.pageIndex = pageIndex
      let type = this.$route.query.type
      if(type === 'people'){
        this.getAoyuanPeopleList('getAoyuanPeopleList')
      }else if(type === 'picture'){
        this.getAoyuanPeopleList('getPictureList')
      }else if(type === 'video'){
        this.getAoyuanPeopleList('getVideoList')
      }
    },
    // 查看页面详情
    handleClickItem(id) {
     const routeUrl = this.$router.resolve({ name: 'detail', query: {type: this.$route.query.type, id}})
      window.open(routeUrl.href, '_blank');
    },
    // 获取页面名称
    getPageName() {
      let type = this.$route.query.type
      if(type === 'people'){
        return '奥园人'
      }else if (type === 'picture'){
        return '集团宣传片'
      }else if (type === 'video'){
        return '视频新闻'
      }
    },
    getAoyuanPeopleList(method){
      let params = {
        PageNo: this.pageIndex,
        Rowsize: this.pageSize,
      }
      API.news[method](params).then(res => {
        if(res.data.code === 200) {
          this.aoyuanPeopleList = res.data.data.items || []
          this.totalCount = res.data.data.totalCount
        }
      })
    },
  }
}
</script>

<style lang="scss">
  .aoyuanren {
    padding-bottom: 20px;
    &-nav {
      height: 60px;
      line-height: 60px;
      text-align: left;
      font-size: 16px;
      color: #333;
    }
    &-split {
      color: #ccc;
      margin: 0 8px;
    }
    &-main {
      width: 100%;
      background: #fff;
      border-radius: 5px;
      padding: 0 24px;
      box-sizing: border-box;
    }
    &-header {
      height: 76px;
      line-height: 76px;
      border-bottom: 1px solid #EEEEEE;
      text-align: left;
      font-size: 20px;
      color: #4C4C4C;
    }
    .aoyuanren-list {
      width: 100%;
      padding: 20px 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .aoyuanren-list-item {
        display: flex;
        margin-right: 20px;
        margin-bottom: 40px;
        cursor: pointer;
        width: 750px;
        &:nth-child(2n) {
          margin-right: 0;
          margin-left: 20px;
        }
        .aoyuanren-list-item-img {
          position: relative;
          width: 356px;
          height: 200px;
        }
        .ayr-li-cover-img {
          width: 356px;
          height: 200px;
        }
        .right-item-info {
          flex: 1;
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          max-width: 386px;
          &__title {
            font-size: 18px;
            color: #333;
            font-weight: bold;
            &__top {
              display: flex;
              align-items: center;
              .top-tap{
                width: 36px;
                flex: 0 0 36px;
                height: 20px;
                margin-right: 5px;
              }
              span{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            &:hover {
              color: #006E38;
            }
            &__summary {
              word-break: break-all;
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
            font-size: 16px;
            color: #7A7A7A;
            .b-left-author {
              margin-bottom: 6px;
            }
          }
          &__b-right {
            font-size: 14px;
            color: #999999;
            .icon_new_bowse{
              margin-right: 5px;
            }
          }
        }
      }
    }
    .pagination{
      padding: 10px;
      text-align: right;
    }
  }
</style>
