<template>
  <div style="background: #f4f4f4;">
    <div class="detail">
      <div class="detail-header">
        <div class="detail-nav">
          <span class="nav-item" @click="$router.push('/home?id=1')">{{ $t('publicMsg.home') }}</span>
          <span class="nav-item">{{ formatTabName() }}</span>
        </div>
        <div class="detail-close" @click="handleClose">{{ $t('detail.close') }}</div>
      </div>
      <div class="detail-main">
        <div class="detail-card">
          <div class="detail-title">
            <div class="title-text"><img v-if="detailData.isTop" class="top-tap" src="@/assets/images/top-tag.png" alt=""><span>{{detailData.title}}</span></div>
            <div class="title-tag">
              <div class="tag-item"><span class="tag-label">{{ $t('detail.date') }}：</span>{{detailData.publishTime || detailData.pubDate}}</div>
              <div class="tag-item" v-if="detailData.publisher"><span class="tag-label">{{ $t('detail.publisher') }}：</span>{{detailData.publisher}}</div>
              <div class="tag-item" v-if="detailData.author"><span class="tag-label">{{ $t('detail.author') }}：</span>{{detailData.author}}</div>
              <div class="tag-item"><span class="tag-label">{{ $t('detail.read') }}：</span>{{detailData.readCount || detailData.docHits}}</div>
            </div>
          </div>
          <div class="detail-content" v-html="detailData.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { analyse } from '@utils/analyse'
  import API from '@api'
  import request from "../../api/request";
  import requestUrl from "../../api/requestUrl";
  import axios from 'axios'
  import {watermark_show} from '@utils/watermask'

  export default {
    name: "Detail",
    data() {
      return {
        detailData: {}
      }
    },
    computed: {
      formatTabName () {
        return () => {
          let type = this.$route.query.type
          console.log(type)
          let tabName = ''
          if (type == 'picture') {
            tabName = this.$t("publicMsg.catalog")
          } else if(type === 'video') {
            tabName = this.$t('publicMsg.video')
          } else if(type === 'special') {
            tabName = this.$t('publicMsg.special')
          }else if(type === 'media') {
            //媒体看奥园
            tabName = this.$t('newsMsg.watch')
          } else {
            tabName = this.$t('publicMsg.aoyuanren')
          }
          return tabName
        }
      }
    },
    created() {
      const type = this.$route.query.type
      if(type === 'special') {
        this.getSpecialDetail('getSpecialDetail')
      }else if (type === 'people'){
        this.getSpecialDetail('getAoyuanPeopleDetail')
      }else if (type === 'picture'){
        this.getSpecialDetail('getPictureDetail')
      }else if (type === 'video'){
        this.getSpecialDetail('getVideoDetail')
      }else if (type === 'media'){
        // this.getSpecialDetail('getVideoDetail')
        this.mediaPerspectiveDetail()
      }
    },
    mounted() {
      analyse()

      watermark_show({
        watermark_txt: localStorage.profileName + '-' + localStorage.userName,
        watermark_x: 50,// 水印起始位置x轴坐标
        watermark_y: 50,// 水印起始位置Y轴坐标
        watermark_cols: 50,// 水印列数
        watermark_rows: 50,// 水印行数
        watermark_x_space: 220,// 水印x轴间隔
        watermark_y_space: 130,// 水印y轴间隔
        watermark_angle: 30,// 水印倾斜度数
        watermark_alpha: 0.2,// 水印透明度
        watermark_dom: document.getElementsByClassName('detail')[0]
      });
    },
    methods:{
      handleClose(){
        window.close()
      },
      mediaPerspectiveDetail(){
        API.news.mediaPerspectiveDetail(this.$route.query.id).then(res => {
          if (res.data.code === 200) {
            let div = document.createElement('div')
            div.innerHTML = res.data.data.content
            let img = div.querySelectorAll('img')
            for (let i = 0; i < img.length; i++) {
              if(img[i].outerHTML.indexOf('http') === -1){
                img[i].src = img[i].src.replace(location.origin,'https://www.aoyuan.com.cn')
              }
            }
            res.data.data.content = div.outerHTML
            this.detailData = res.data.data
          }else{
          }
        })
      },
      getSpecialDetail(method){
        API.home[method]({id: this.$route.query.id}).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.detailData = res.data.data
          }else{
          }
        })
      }
    }
  }
</script>

<style lang="scss" scope>
  .detail {
    margin: 0 auto;
    width: 1200px;
    .detail-header {
      width: 100%;
      height: 42px;
      /*background: #fff;*/
      /*padding: 0 160px;*/
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail-nav {
        font-size: 16px;
        .nav-item {
          color: #333;
          cursor: pointer;
          &:last-child {
            color: #999;
            cursor: default;
          }
          &::after {
            content: '';
            width: 12px;
            height: 12px;
            margin: 0 8px;
            display: inline-block;
            background: url('../../assets/images/icon_more.png') no-repeat;
            background-size: 12px 12px;
            position: relative;
            top: 2px;
          }
          &:last-child::after {
            width: 0;
            height: 0;
            background: none;
          }
        }
      }
      .detail-close {
        width: 60px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #D7D7D7;
        cursor: pointer;
      }
    }
    .detail-main {
      width: 100%;
      min-height: 640px;
      padding-bottom: 20px;
      box-sizing: border-box;
      /*background: linear-gradient(180deg, #F0E5C9 1%, #F4F4F4 100%);*/
      .detail-card {
        width: 100%;
        min-height: 900px;
        padding: 44px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 5px;
        text-align: left;
        .detail-title {
          width: 100%;
          height: 101px;
          text-align: center;
          border-bottom: 1px solid #E8E8E8;
          .title-text {
            font-size: 24px;
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            .top-tap{
              width: 36px;
              flex: 0 0 36px;
              height: 20px;
              margin-right: 5px;
            }
          }
          .title-tag {
            font-size: 16px;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            .tag-item {
              margin-right: 18px;
              color: #666;
              &:last-child {
                margin-right: 0;
              }
              .tag-label {
                color: #999;
              }
            }
          }
        }
        .detail-content {
          margin-top: 40px;
          font-size: 18px;
          line-height: 34px;
          color: #666;
          img{
            max-width: 100%;
          }
        }
      }
    }
    .video-js{
      width: 100%;
      height: 500px;
    }
  }
</style>
