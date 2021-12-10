<template>
  <div class="outer" v-loading="!domShow">
    <section v-if="domShow" class="notice-detail">
      <div class="notice-detail__header">
        <div class="notice-detail__nav">
          <span class="nav-item" @click="$router.push('/home?id=1')">{{ $t('publicMsg.home') }}</span>
          <span class="nav-item">{{navMainFormat($route.query.mid * 1)}}</span>
          <!--          <span class="nav-item">通知公告</span>-->
        </div>
        <div class="notice-detail-close" @click="handleClose">{{ $t('detail.close') }}</div>
      </div>
      <div class="notice-detail__body" v-loading="loading">
        <div class="notice-detail__body__title">关于XX项目启动会的会议纪要</div>
        <div class="notice-detail__body__date">
          2021-06-21 发布： <span style="color: #006e38" class="mr5">端口多</span>撰稿人： <span style="color: #006e38">几号肉</span>
        </div>
        <div class="notice-detail__body__ctn">
          sadsadsadsadadsad
        </div>
        <div v-if="detailInfo.attachmentForms.mainAtt && detailInfo.attachmentForms.mainAtt.attachments && detailInfo.attachmentForms.mainAtt.attachments.length">
          <div :key="index" v-for="(item,index) in detailInfo.attachmentForms.mainAtt.attachments"
               class="notice-detail__body__attachment" style="color: #999;display: block;text-align:left"><i
                  :class="['iconEIP mr5', handleIcon(item)]"></i><span class="attachment-name fs14 mb10"
                                                                   @click="preview(item)">{{item.fdFileName}}</span>
                        <span class="fs14 mr5">({{(item.fdSize / 1024).toFixed(2)}}kb)</span>
            <i v-if="handleType(item,['.zip','.rar'])" class="iconEIP icon_book" @click="preview(item)"></i>
            <i v-if="handleType(item,['.ppt', '.xls', '.doc','.zip','.rar'])" class="iconEIP icon_download" @click="download(item)"></i>
            <span v-if="handleType(item,['.ppt', '.xls', '.doc','.zip','.rar'])" class="fs14">下载次数:{{item.downloadSum}}</span>
          </div>
        </div>
        <div class="notice-detail__body__attachment mt44 mb22"><i class="iconEIP icon_news_nav1"></i>会议纪要阅读人数列表 <span style="color: #999">（已阅人数32人）</span></div>
        <div class="notice-detail__body__search">
          <el-input placeholder="搜索" v-model="keyword" clearable></el-input>
          <el-button type="primary">查询</el-button>
        </div>

        <el-table
                :data="readList"
                style="width: 100%">
          <el-table-column
                  label="序号"
                  align="center"
                  width="80">
            <template slot-scope="scope"><span style="text-align: center">{{scope.$index + 1}}</span></template>
          </el-table-column>
          <el-table-column
                  prop="company"
                  label="公司">
          </el-table-column>
          <el-table-column
                  prop="department"
                  label="部门">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名">
          </el-table-column>
          <el-table-column
                  prop="date"
                  label="查看时间">
          </el-table-column>
        </el-table>

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
    </section>

    <i class="el-icon-loading loading-tip" v-if="downLoading"></i>
  </div>
</template>

<script>
  import API from '@api'
  import request from '@/api/request'
  import { analyse } from '@utils/analyse'

  export default {
    name: "index",
    data() {
      return {
        keyword: '',
        detailInfo: {sysTagMainForm: {}, attachmentForms: {}},
        rmsUrl: '',
        loading: true,
        downloadTip: false,
        downLoading: false,
        domShow: false,
        readList: [{company: '时间和大受打击', department: '多商家开口就是看到', name: '记得食', date: '2020-07-12 11:00'}],
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
      }
    },
    computed: {
      navMainFormat(id) {
        return (id) => {
          let name = ''
          switch (id) {
            case 1:
              name = this.$t("homeMsg.zb")
              break
            case 2:
              name = this.$t("homeMsg.zb")
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
      noticeTabListName(index) {
        return (index) => {
          let name = ''
          switch (index) {
            case 0:
              name = this.$t("publicMsg.all")
              break
            case 1:
              name = this.$t("publicMsg.notice")
              break
            case 2:
              name = this.$t("publicMsg.minutes")
              break
            case 3:
              name = this.$t("publicMsg.personnel")
              break
            case 4:
              name = this.$t("publicMsg.system")
              break
          }
          return name
        }
      },
    },
    methods: {
      noticeLookin(){
        let params = {
          orderby: '',
          keyWord: this.keyword,
          ordertype: 'down',
          pageno: this.pageIndex,
          rowsize: this.pageSize,
          fdId: this.$route.query.id
        }
        API.home.noticeLookin(params).then(res => {

        })
      },
      // 修改每页显示数量
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
      },
      // 切换页码
      handleCurrentChange(pageIndex) {
        this.pageIndex = pageIndex
      },
      handleIcon(item){
        let idx = item.fdFileName.lastIndexOf('.')
        let extension = ''
        if (idx > -1) {
          extension = item.fdFileName.substr(idx + 1).toLowerCase()
        }
        let type = 'icon_general'
        switch (extension) {
          case "docx":
            type = 'icon_word'
            break;
          case "doc":
            type = 'icon_word'
            break;
          case "xlsx":
            type = 'icon_excel'
            break;
          case "xls":
            type = 'icon_excel'
            break;
          case "pptx":
            type = 'icon_ppt'
            break;
          case "ppt":
            type = 'icon_ppt'
            break;
          case "pdf":
            type = 'icon_pdf'
            break;
          case "jpg":
            type = 'icon_pic'
            break;
          case "png":
            type = 'icon_pic'
            break;
        }
        return type
      },
      getExtension(item) {
        var filename = item.fdFileName;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var type = '.pdf';
        if (index2 > 0) {
          type = filename.substring(index1, index2).toLowerCase();
        }
        return type
      },
      handleType(item,arr) {
        var filename = item.fdFileName;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var type = '.pdf';
        if (index2 > 0) {
          type = filename.substring(index1, index2).toLowerCase();
        }
        return arr.indexOf(type) === -1
      },
      notDownload(item) {
        var filename = item.fdFileName;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var type = '.pdf';
        if (index2 > 0) {
          type = filename.substring(index1, index2).toLowerCase();
        }
        return ['.doc'].indexOf(type) > -1
      },
      preview(item) {
        if(this.handleType(item,['.zip','.rar'])){
          var filename = item.fdFileName;
          var index1 = filename.lastIndexOf(".");
          var index2 = filename.length;
          var type = '.pdf';
          if (index2 > 0) {
            type = filename.substring(index1, index2).toLowerCase();
          }
          if(['.docx','.pptx','.xlsx','.pdf'].indexOf(type) > -1){
            //可以加密的文件使用本地的加密预览
            window.open(`/preview/page/DocOnline.html?extension=${type}&fileid=${item.fdId}&userid=${localStorage.profileName}&&signture=zxcvbnm&mode=download&application=oa&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`, '_blank')
          }else if (['.png','.jpg'].indexOf(type) > -1) {
            window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=readDownload&fdId=${item.fdId}&open=1`, '_blank')
          }
          else{
            //不可以加密的office文件使用OA预览
            window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=view&fdId=${item.fdId}`, '_blank')
          }
          //https://ayoa1.aoyuan.net/sys/attachment/sys_att_main/sysAttMain.do?method=view&fdId=178a296d8c2783e11aad35541a7a95f4
          //https://ayoa.aoyuan.net/km/smissive/km_smissive_main/kmSmissiveMain.do?method=view&fdId=178905219c7b5a72101b5a14f018f218
          // window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=view&fdId=${item.fdId}`, '_blank')
        }
      },
      hideDownload(){
        //4月1日前的不能下载
        return new Date('2021-04-02').getTime() < new Date(this.detailInfo.docCreateTime)
      },
      download(item) {
        // if(this.hideDownload()){
        if (this.handleType(item,['.png', '.jpg', '.ppt', '.xls', '.doc','.zip','.rar'])) {
          this.downLoading = true
          //可以加密下载
          // let params = `application=oa&userId=${localStorage.profileName || ''}&userName=${localStorage.profileName || ''}&fileId=${item.fdId}&isWaterMark=true`
          let requestBody = {
            'extension': this.getExtension(item),
            'owner': (localStorage.profileName + '-' + localStorage.userName) || '',
            'userRights': [
              {
                'userAccount': `${localStorage.profileName || ''}@aoyuan.net`,
                'hasViewRight': true,
                'hasPrintRight': false,
                'hasEditRight': false,
                'hasExtractRight': false,
                'hasExportRight': false
              }
            ],
            "isWaterMark": true
          }
          let idx = item.fdFileName.lastIndexOf('.')
          API.frpms.noticeDownload(item.fdId, requestBody).then(res => {
            //增加下载次数
            this.recordDocHits(item)

            this.downLoading = false
            let blob = new Blob([res.data]);
            // 获取heads中的filename文件名
            let downloadElement = document.createElement('a');
            let name = item.fdFileName
            if (this.getExtension(item) === '.pdf') {
              name = item.fdFileName.substr(0, idx) + '.ppdf'
            }
            if (navigator.userAgent.indexOf("Trident") > -1) {
              window.navigator.msSaveBlob(blob, name);
            }else{
              // 创建下载的链接
              let href = window.URL.createObjectURL(blob);
              downloadElement.href = href;
              // 下载后文件名

              downloadElement.download = name;

              document.body.appendChild(downloadElement);
              // 点击下载
              downloadElement.click();
              // 下载完成移除元素
              document.body.removeChild(downloadElement);
              // 释放掉blob对象
              window.URL.revokeObjectURL(href);
            }

          }).catch(_ => {
            this.downLoading = false
          })
        }
        else if (!this.handleType(item,['.png', '.jpg'])) {
          //图片下载
          window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=download&fdId=${item.fdId}&downloadType=manual&downloadFlag=${new Date().getTime()}`)
          //增加下载次数
          this.recordDocHits(item)
        }
        else {
          //普通下载
          // window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=download&fdId=${item.fdId}&downloadType=manual&downloadFlag=${new Date().getTime()}`)
        }
        // }
      },
      recordDocHits(item){
        let params = {
          docId: item.fdId,
          docType: 1,
        }
        API.home.recordDocHits(params).then(res => {
          if(res.data.code === 200 && res.data.data){
            item.downloadSum++
          }
        })
      },
      handleClose() {
        window.close()
      },
      getDetail() {
        API.home.noticeDetail(this.$route.query.id).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            if (res.data.data.attachmentForms.mainOnline) {
              //生产环境editOnline有可能替换成mainOnline
              res.data.data.attachmentForms.editOnline = res.data.data.attachmentForms.mainOnline
            }
            if (!res.data.data.attachmentForms.editOnline) {
              res.data.data.attachmentForms.editOnline = {attachments: []}
            }
            this.detailInfo = res.data.data
            if (this.detailInfo.attachmentForms.editOnline && this.detailInfo.attachmentForms.editOnline.attachments && this.detailInfo.attachmentForms.editOnline.attachments.length) {
              var item = this.detailInfo.attachmentForms.editOnline.attachments[0];
              var filename = item.fdFileName;
              var index1 = filename.lastIndexOf(".");
              var index2 = filename.length;
              var type = '.pdf';
              if (index2 > 0) {
                type = filename.substring(index1, index2).toLowerCase();
              }
              console.log(type)

              if (['.png', '.jpg', '.ppt', '.xls', '.doc'].indexOf(type) === -1) {
                this.domShow = true
                this.rmsUrl = `/preview/page/DocOnline.html?extension=${type}&fileid=${this.detailInfo.attachmentForms.editOnline.attachments[0].fdId}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}&&signture=zxcvbnm&mode=download&application=oa&userid=${localStorage.profileName}&inFrame=1`
                // this.rmsUrl = `${process.env.VUE_APP_RMS}/page/DocOnline.html?extension=${type}&fileid=${this.detailInfo.attachmentForms.editOnline.attachments[0].fdId}&userid=${localStorage.profileName}&&signture=zxcvbnm&mode=download&application=oa&username=${localStorage.profileName}`
                // setTimeout(_ => {
                //   //为了解决部分浏览器iframe加载白屏,需要调整窗口尺寸就可以
                //   document.getElementById('rms-ctn').style.width = '98.9%'
                // }, 200)
              }else{
                window.open(`${process.env.VUE_APP_OA_URL}/km/smissive/km_smissive_main/kmSmissiveMain.do?method=view&fdId=${this.$route.query.id}`,'_self')
              }

              // this.rmsUrl = `https://ayoa.aoyuan.net/sys/attachment/sys_att_main/sysAttMain.do?method=view&fdId=${this.detailInfo.attachmentForms.editOnline.attachments[0].fdId}`
            }else{
              //没有正文文档
              this.domShow = true
            }
          }
        }).catch(_ => {
          this.loading = false
        })
      },
    },
    created() {
      this.getDetail()
      analyse('进入页面')
    }
  }
</script>

<style lang="scss" scoped>
  .outer {
    background: #f4f4f4;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  .mt44 {
    margin-top: 44px;
  }

  .mb22 {
    margin-bottom: 22px;
  }
  .loading-tip{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 9;
    font-size: 30px;
  }
  .notice-detail {
    margin: 0 auto;
    width: 90%;
    min-width: 980px;
    max-width: 1300px;


    &__header {
      width: 100%;
      height: 42px;
      /*background: #fff;*/
      /*padding: 0 160px;*/
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .notice-detail__nav {
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

      .notice-detail-close {
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

    &__body {
      border-radius: 5px;
      background: #fff;
      padding: 0 30px 84px;

      &__title {
        font-size: 22px;
        font-weight: bold;
        color: #333;
        text-align: center;
        padding-top: 30px;
        margin-bottom: 10px;
      }
      &__date {
        font-size: 12px;
        color: #999;
        text-align: center;
        margin-bottom: 46px;
      }

      &__ctn {
        text-align: left;
        line-height: 26px;
        font-size: 16px;
        color: #333;
        padding-bottom: 56px;
        border-bottom: 1px solid #E5E5E5;
      }

      &__attachment {
        display: flex;
        align-items: center;
        font-size: 20px;

        .icon_attachment {
          margin-right: 10px;
        }

        .icon_pdf {
          margin-right: 5px;
          flex: 0 0 16px;
        }

        .attachment-name {
          color: #3F99C1;
          margin-right: 24px;
          cursor: pointer;
          word-break: break-all;
        }

        .icon_book {
          cursor: pointer;
        }
        .icon_download{
          cursor: pointer;
          margin-left: 10px;
        }

        .icon_news_nav1 {
          margin-right: 10px;
          width: 14px;
          height: 15px;
        }
      }

      &__search{
        text-align: left;
        margin-bottom: 14px;
        .el-input{
          width: 235px;
          margin-right: 16px;
        }
      }

      .tb_normal {
        background-color: #ffffff;
        border-collapse: collapse;
        border: 1px #d2d2d2 solid;
        padding: 8px !important;
        text-align: left;
        margin: 0 auto;
      }

      .tb_normal > tbody > tr {
        border-bottom: 1px solid #d2d2d2;
        border-top: 1px solid #d2d2d2;
      }

      .tb_normal > tbody > tr > .td_normal_title {
        background-color: #f6f6f6;
      }

      .tb_normal > tbody > tr > td {
        padding: 6px;
        word-break: break-word;
        border: 1px solid #d2d2d2;
      }
    }
  }
</style>
