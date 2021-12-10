<template>
  <section class="special-list">
    <div class="special-list__nav">
      <span @click="$router.push('/home?id=1')">{{ $t("publicMsg.home") }}</span>
      <span class="split"> > </span>
      <span ref="pageName" style="color: #ccc">{{ $t("specialListMsg.special") }}</span>
    </div>
    <div class="special-list__body">
      <div class="special-list__body__tab">
        <div class="special-list__body__tab__header">
          <i class="iconEIP icon_cate"></i> {{ $t("specialListMsg.nav") }}
        </div>
        <div v-analyse="{pageEvent:`点击全部专题`, name: `全部专题列表页面`}"
             :class="['special-list__body__tab__item',{active:cateId===''}]" @click="toggleTab('')">
          <!--          <i-->
          <!--                class="iconEIP icon_special_nav1"></i> -->
          全部专题
        </div>
        <div v-for="item in cateList" :key="item.id" v-analyse="{pageEvent:`点击${item.name}`}"
             :class="['special-list__body__tab__item list-overflow',{active:cateId==item.id}]" :title="item.name" @click="toggleTab(item.id)">
          <!--          <i-->
          <!--                class="iconEIP icon_special_nav1"></i>-->
          {{ item.name }}
        </div>
      </div>


      <div class="special-list__body__main">
        <div class="special-list__body__main__filter">
            <div>
                <el-form :inline="true" class="demo-form-inline" @keyup.enter.native="handleSearch">
                    <el-form-item class="form-item" :label="$t('newsListMsg.time')+':'">
                      <el-date-picker
                              v-model="filterForm.startTime"
                              :placeholder="$t('newsListMsg.stime')"
                              type="date">
                      </el-date-picker>
                      <span class="m10">{{$t('newsListMsg.to')}}</span>
                      <el-date-picker
                              v-model="filterForm.endTime"
                              :placeholder="$t('newsListMsg.etime')"
                              type="date">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item class="form-item" :label="$t('newsListMsg.title')+':'">
                        <el-input clearable v-model="filterForm.keyword" :placeholder="$t('newsListMsg.kplaceholder')"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item">
                        <el-button type="primary" @click="handleSearch">{{ $t('newsListMsg.search') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="display: flex;align-items: center;cursor: pointer" @click="toggleLayout"><i
                    :class="['iconEIP mr5',layout?'icon_toggle_list':'icon_toggle_summary']"></i> {{
                layout?$t('newsListMsg.list') : $t('newsListMsg.abstract') }}
            </div>
        </div>
        <div class="special-list__body__main__ctn">
          <div v-show="layout" style="width: 100%;">
            <el-table
                    ref="table"
                    v-loading="listLoading"
                    :show-header="layout"
                    :cell-style="{height: layout?'2.8vw':'5.5vw'}"
                    :data="specialList"
                    header-row-class-name="fs16"
                    :header-cell-style="{background:'#FAFAFA'}"
                    style="width: 100%"
                    @row-click="viewItemDetail"
                    @sort-change="sortList">
              <div slot="empty" class="empty-wrap">
                <img src="@/assets/images/address-none.png" alt="">
                <div>暂无数据</div>
              </div>
                <el-table-column
                        :label="$t('newsListMsg.no')"
                        width="80"
                        align="center">
                    <template slot-scope="scope">
                        <div class="fs16">{{ scope.$index + 1 }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        :label="$t('newsListMsg.title')">
                    <template slot-scope="scope">
                        <div class="table-title fs16" style="cursor: pointer;" :title="scope.row.title">{{ scope.row.title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        width="80"
                        :label="$t('newsListMsg.author')"
                        align="center">
                    <template slot-scope="scope">
                        <div>
                            <div class="fs16">{{ scope.row.publisher }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        width="170"
                        sortable="custom"
                        prop="time"
                        :label="$t('newsListMsg.time')"
                        align="center">
                    <template slot-scope="scope">
                        <div>
                            <div class="fs16">{{ scope.row.publishTime.replace(/-/g,".") }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        width="125"
                        sortable="custom"
                        prop="click"
                        :label="$t('newsListMsg.clickr')"
                        align="center">
                    <template slot-scope="scope">
                        <span class="fs16" style="color: #B4A36B">{{ scope.row.readCount }}</span>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div v-show="!layout" @click="viewItemDetail(item)" v-for="item in specialList" :key="item.id" class="item-group">
            <div class="item-group__img-wrap"><img :src="item.image" alt=""></div>
            <div class="item-group__title list-overflow" :title="item.title">{{ item.title }}</div>
          </div>
        </div>
<!--        <div class="special-list__body__main__ctn" style="justify-content: center" v-else>内容信息为空，需要管理员后台新增内容</div>-->
        <el-pagination
                background
                class="pagination"
                :current-page="pageIndex"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalCount"
                @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
  import API from '@api'
  import {formatDate} from '@utils'
  import {analyse} from '@utils/analyse'

  export default {
    name: "Index",
    data() {
      return {
        cateId: this.$route.query.cateId || '',
        filterForm: {keyword: '', startTime: '', endTime: ''},
        requestParams: {keyword: '', startTime: '', endTime: ''},
        specialList: [],
        cateList: [],
        pageIndex: 1,
        pageSize: 12,
        totalCount: 0,
        layout: true, //false 摘要 true 列表
        orderby: '',
        orderType: 'down',
        listLoading: false,
      }
    },
    mounted() {
      this.getSpecialCate()
      this.getSpecialList()
      analyse('进入页面')
    },
    methods: {
      viewItemDetail(item){
        if(item.externalUrl && item.externalUrl.includes('http')){
          //外部链接
          API.home.recordRead(item.id)
          window.open(item.externalUrl, '_blank')
        }else{
          let routeUrl =this.$router.resolve(`/detail?type=special&id=${item.id}`)
          window.open(routeUrl.href, '_blank');
        }
      },
      toggleTab(id){
        if(this.cateId === id) return
        this.filterForm = {keyword: '', startTime: '', endTime: ''}
        this.requestParams = {keyword: '', startTime: '', endTime: ''}
        this.cateId = id
        this.pageIndex = 1
        this.getSpecialList()
      },
      // 切换摘要&列表
      toggleLayout() {
        this.layout = !this.layout
      },
      handleSearch() {
        this.requestParams.keyword = this.filterForm.keyword
        this.requestParams.startTime = this.filterForm.startTime
        this.requestParams.endTime = this.filterForm.endTime
        this.pageIndex = 1
        this.getSpecialList()
      },
      // 切换页码
      handleCurrentChange(pageIndex) {
        this.filterForm.keyword = this.requestParams.keyword
        this.filterForm.startTime = this.requestParams.startTime
        this.filterForm.endTime = this.requestParams.endTime
        this.pageIndex = pageIndex
        this.getSpecialList()
      },
      // 排序
      sortList({ column, prop, order }) {
        console.log(column + prop + order)
        if(prop === 'time') {
            //时间排序
            this.orderby = ''
            if(order === 'ascending') {
                //升序
                this.orderType = 'up'
                this.orderby = 'PublishTime asc'
            } else if(order === 'descending') {
                //降序
                this.orderType = 'down'
                this.orderby = 'PublishTime desc'
            }
        } else if(prop === 'click') {
            //点击率排序
            this.orderby = ''
            if(order === 'ascending') {
                //升序
                this.orderType = 'up'
                this.orderby = 'ReadCount asc'
            }else if(order === 'descending') {
                //降序
                this.orderType = 'down'
                this.orderby = 'ReadCount desc'
            }
        }
        this.getSpecialList()
      },
      // 获取页面名称
      getPageName() {
        return this.$refs.pageName.innerText + '列表页面'
      },
      //获取专题推荐列表
      getSpecialList() {
        this.listLoading = true
        let start = ""
        let end = ""
        if (this.requestParams.startTime && this.requestParams.endTime) {
            start = this.requestParams.startTime
            end = this.requestParams.endTime
            start = formatDate(start, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
            end = formatDate(end, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
        }
        let keyWord = ""
        if ( this.requestParams.keyword ) {
          keyWord = this.requestParams.keyword
        }
        let params = {
          // RecommendHomePage: true,
          CategoryId: this.cateId,
          PageNo: this.pageIndex,
          RowSize: this.pageSize,
          KeyWord: keyWord,
          StartTime: start,
          EndTime: end,
          Sorting: this.orderby,
        }
        API.home.getSpecialList(params).then(res => {
          this.listLoading = false
          if (res.data.code === 200) {
            this.totalCount = res.data.data.totalCount
            this.specialList = res.data.data.items || {}
          }else{
            this.totalCount = 0
            this.specialList = []
          }
        }).catch(err => {
          this.totalCount = 0
          this.specialList = []
        })
      },
      //获取专题分类
      getSpecialCate() {
        API.home.getSpecialCate().then(res => {
          if (res.data.code === 200) {
            this.cateList = res.data.data || []
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .special-list {
    padding: 20px 0;
    //display: flex;
    //flex-direction: column;
    /*height: 100%;*/

    &__nav {
      line-height: 20px;
      font-size: 16px;
      text-align: left;
      color: #333;
      margin-bottom: 20px;

      .split {
        color: #ccc;
        margin: 0 8px;
      }
    }

    &__body {
      /*flex: 1;*/
      display: flex;
      padding-bottom: 20px;
      /*height: calc(100% - 40px);*/

      &__tab {
        /*scrollbar-width: none; !* firefox *!*/
        /*-ms-overflow-style: none; !* IE 10+ *!*/
        /*&::-webkit-scrollbar {*/
        /*  display: none; !* Chrome Safari *!*/
        /*}*/
        /*overflow-y: auto;*/
        padding: 0 16px;
        box-sizing: border-box;
        background: #fff;
        flex: 0 0 260px;
        margin-right: 20px;
        border-radius: 5px;
        font-size: 20px;
        color: #4c4c4c;

        &__header {
          line-height: 60px;
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 20px;
          text-align: left;
        }

        &__item {
          line-height: 80px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          padding-left: 50px;
          box-sizing: border-box;
          width: 228px;

          &.active {
            color: #006E38;
            background: #F2FBF7;
          }
        }
      }

      &__main {
        /*scrollbar-width: none; !* firefox *!*/
        /*-ms-overflow-style: none; !* IE 10+ *!*/
        /*&::-webkit-scrollbar {*/
        /*  display: none; !* Chrome Safari *!*/
        /*}*/
        /*overflow-y: auto;*/
        flex: 1;
        min-width: 500px;
        border-radius: 5px;
        /*padding: 0 24px;*/
        &__filter {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            background: #ffffff;
            color: #666;
            height: 86px;
            padding: 0 12px;
            border-bottom: 1px solid #e8e8e8;
            .form-item {
                margin-bottom: 0;
                .m10{
                  margin: 0 10px;
                }
                .w100 {
                    width: 100px;
                }
            }
        }
        &__ctn {
          display: flex;
          flex-wrap: wrap;
          background: #fff;
          padding: 24px 0;

          .empty-wrap{
            text-align: center;
            img{
              width: 177px;
              height: 125px;
              margin-top: 36px;
            }

            font-size: 16px;
            color: #999;
          }

          .item-group {
            flex: 0 0 400px;
            width: 400px;
            max-width: 400px;
            font-size: 18px;
            margin: 0 12px 24px;
            cursor: pointer;

            &:hover {
              box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
            }

            &__img-wrap{
              width: 100%;
              height: 225px;
              img {
                width: 100%;
                height: 100%;
              }
            }

            &__title {
              line-height: 59px;
              text-align: center;
            }
          }
        }
      }
    }

    .pagination {
      text-align: right;
      padding: 20px;
      background: #fff;
    }
  }

</style>
