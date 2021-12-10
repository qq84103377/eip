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
        <div class="notice-detail__body__title">中国奥园集团</div>
        <div class="notice-detail__body__ctn" v-show="rmsUrl">
          <iframe @load="handleLoad" id="rms-ctn" style="width: 100%;height:1260px" :src="rmsUrl" frameborder="0" scrolling="no"></iframe>
        </div>
        <div v-if="detailInfo.attachmentForms.mainAtt && detailInfo.attachmentForms.mainAtt.attachments && detailInfo.attachmentForms.mainAtt.attachments.length" class="notice-detail__body__attachment mt44 mb22"><i class="iconEIP icon_attachment"></i>文档附件
          <span @click="downloadApp" style="display: flex;align-items: center;cursor: pointer" class="fs16" v-if="detailInfo.attachmentForms.mainAtt && detailInfo.attachmentForms.mainAtt.attachments && detailInfo.attachmentForms.mainAtt.attachments.length"><span
                  class="ml20" style="color: red">(如需打开下载后的加密文件，请提前安装RMS工具)</span>
            <i class="el-icon-download ml6"></i>
        </span></div>
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
        <div class="notice-detail__body__attachment mt44 mb22"><i class="iconEIP icon_news_nav1"></i>基本信息</div>
        <table class="tb_normal" width="100%">
          <tbody>
          <tr>
            <td class="td_normal_title" width="15%">标题</td>
            <td width="85%" colspan="3">{{detailInfo.docSubject}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">拟稿人</td>
            <td width="35%">{{detailInfo.docAuthorName}}</td>
            <td class="td_normal_title" width="15%">拟稿日期</td>
            <td width="35%">{{detailInfo.docCreateTime}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">紧急程度</td>
            <td width="35%">{{detailInfo.fdUrgencyName}}</td>
            <td class="td_normal_title" width="15%">密级等级</td>
            <td width="35%">{{detailInfo.fdSecretName}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">所属类别</td>
            <td width="35%">{{detailInfo.fdTemplateName}}</td>
            <td class="td_normal_title" width="15%">文件编号</td>
            <td width="35%">{{detailInfo.fdFileNo}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">发文单位</td>
            <td width="35%">{{detailInfo.docDeptName}}</td>
            <td class="td_normal_title" width="15%">录入单位</td>
            <td width="35%">{{detailInfo.fdMainDeptName}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">主送单位</td>
            <td width="35%">{{detailInfo.fdSendDeptNames}}</td>
            <td class="td_normal_title" width="15%">抄送单位</td>
            <td width="35%">{{detailInfo.fdCopyDeptNames}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">签发人</td>
            <td width="35%">{{detailInfo.fdIssuerName}}</td>
            <td class="td_normal_title" width="15%">创建人</td>
            <td width="35%">{{detailInfo.docCreatorName}}</td>
          </tr>
          <tr>
            <td class="td_normal_title" width="15%">辅类别
            </td>
            <td width="35%" colspan="3">{{detailInfo.docPropertyNames}}</td>
          </tr>
          <!-- 标签机制 -->
          <tr>
            <td class="td_normal_title" width="15%" nowrap="">
              标签
            </td>
            <td colspan="3">{{detailInfo.sysTagMainForm.fdTagNames}}</td>
          </tr>
          <!-- 标签机制 -->
          </tbody>
        </table>

        <div v-if="isMeeting">
          <div class="notice-detail__body__attachment mt44 mb22"><i class="iconEIP icon_news_nav1"></i>会议纪要阅读人数列表 <span style="color: #999">（已阅人数{{readCount}}人）</span></div>
          <div class="notice-detail__body__search">
            <el-input placeholder="请输入公司/部门/姓名进行搜索" @keyup.enter.native="pageIndex=1;noticeLookin()" v-model="keyword" clearable></el-input>
            <el-button type="primary" @click="pageIndex=1;noticeLookin()">查询</el-button>
          </div>

          <el-table
                  header-row-class-name="fs16"
                  v-loading="listLoading"
                  :data="readList"
                  style="width: 100%">
            <el-table-column
                    label="序号"
                    width="80"
                    align="center">
              <template slot-scope="scope"><span class="fs16" style="text-align: center">{{scope.$index + 1}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="company"
                    label="公司">
              <template slot-scope="scope"><span class="fs16" style="text-align: center">{{scope.row.company}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="dept"
                    label="部门">
              <template slot-scope="scope"><span class="fs16" style="text-align: center">{{scope.row.dept}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="姓名">
              <template slot-scope="scope"><span class="fs16" style="text-align: center">{{scope.row.userName}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="readTime"
                    label="查看时间">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.readTime * 1 | formatDate('yyyy.MM.dd hh:mm:ss') }}</div>
              </template>
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

      </div>
    </section>

    <i class="el-icon-loading loading-tip" v-if="downLoading"></i>
  </div>
</template>

<script>
  import API from '@api'
  import request from '@/api/request'
  import { analyse } from '@utils/analyse'
  import CryptoJS from '@utils/crypto'
  import Base64 from '../../utils/encryption/base64'

  export default {
    name: "index",
    data() {
      return {
        readCount: 0,
        listLoading: false,
        detailInfo: {sysTagMainForm: {}, attachmentForms: {}},
        rmsUrl: '',
        loading: true,
        downloadTip: false,
        downLoading: false,
        domShow: false,
        keyword: '',
        readList: [],
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        isMeeting: false,
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
      getUserName(){
        API.setting.getOaUser().then(async ({data}) => {
          if (data) {
            if (data.code === 200) {
              localStorage.setItem('userName', data.data.username)
            }
          }
          this.getDetail()
        }).catch(err => {
          this.getDetail()
        })
      },
      noticeLookin(){
        this.listLoading = true
        let params = {
          orderby: '',
          keyWord: this.keyword,
          // ordertype: 'down',
          pageno: this.pageIndex,
          rowsize: this.pageSize,
          fdId: this.$route.query.id
        }
        API.home.noticeLookin(params).then(res => {
          this.listLoading = false
          if(res.data.code === 200) {
            this.readList = res.data.data.list || []
            this.totalCount = res.data.data.totalrows || 0
            this.readCount = res.data.data.readCount || 0
          }
        }).catch(_ => {
          this.listLoading = false
        })
      },
      // 修改每页显示数量
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.noticeLookin()
      },
      // 切换页码
      handleCurrentChange(pageIndex) {
        this.pageIndex = pageIndex
        this.noticeLookin()
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
      downloadApp(){
        window.open(process.env.VUE_APP_RMS_TOOL)
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

            const urlPara = `application=oa&extension=${type}&fileid=${item.fdId}&mode=download&userid=${localStorage.profileName}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`
            const signture = this.handleCrypto(urlPara.toLowerCase(), '12345678')
            const base64Str = Base64.encode(`application=oa&extension=${type}&fileid=${item.fdId}&mode=download&userid=${localStorage.profileName}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`)

             // window.open(`/preview/page/DocOnline.html?params=${encodeURIComponent(base64Str)}&signture=${encodeURIComponent(signture)}`, '_blank')
            let routeUrl = this.$router.resolve(`/preview?params=${encodeURIComponent(base64Str)}&signture=${encodeURIComponent(signture)}`)
           window.open(routeUrl.href, '_blank');
          }else if (['.png','.jpg'].indexOf(type) > -1) {
            window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=readDownload&fdId=${item.fdId}&open=1`, '_blank')
          }
          else{
            //不可以加密的office文件使用OA预览
            window.open(`${process.env.VUE_APP_OA_URL}/sys/attachment/sys_att_main/sysAttMain.do?method=view&fdId=${item.fdId}`, '_blank')
          }
        }
      },
      handleCrypto(message,secret) {
        var hash = CryptoJS.HmacSHA1(message, secret);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        return hashInBase64;
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
            this.isMeeting = !!res.data.data.meetingTypeName
            if(this.isMeeting) this.noticeLookin()
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
                const urlPara = `application=oa&extension=${type}&fileid=${this.detailInfo.attachmentForms.editOnline.attachments[0].fdId}&mode=download&userid=${localStorage.profileName}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`
                const signture = this.handleCrypto(urlPara.toLowerCase(), '12345678')
                const base64Str = Base64.encode(`application=oa&extension=${type}&fileid=${this.detailInfo.attachmentForms.editOnline.attachments[0].fdId}&mode=download&userid=${localStorage.profileName}&username=${encodeURIComponent(localStorage.profileName + '-' + localStorage.userName)}`)

                this.rmsUrl = `/preview/page/DocOnline.html?params=${encodeURIComponent(base64Str)}&signture=${encodeURIComponent(signture)}&inFrame=1`
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
          this.domShow = true
        })
      },
      handleLoad(){
        var iframe = document.getElementById("rms-ctn")
        // var win = iframe.contentDocument.body.scrollHeight;  // 通过contentWindow获取ifame子页面的window窗体对象。(不允许跨域名访问)
        // console.log(win,'=3=3=3=3=3');
      }
    },
    created() {
      // if(localStorage.userName){
      //   this.getDetail()
      // }else{
        this.getUserName()
      // }
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
        line-height: 80px;
      }

      &__ctn {
        margin-bottom: 56px;
        overflow: hidden;
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
<style lang="scss">
  .notice-detail{
    .el-table__header {
      width: 100% !important;
    }

    .el-table__body {
      width: 100% !important;
    }
  }
</style>
