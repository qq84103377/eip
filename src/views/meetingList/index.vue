<template>
  <section class="meeting-list-wrap">
    <div class="meeting-list-wrap__filter">
      <el-form :inline="true" class="demo-form-inline" @keyup.enter.native="">
        <el-form-item class="form-item " :label="$t('meetingList.ms')">
          <el-select style="width: 10.5vw;" v-model="filterForm.origin" clearable :placeholder="$t('noticeListMsg.sCompany')">
            <el-option
                    v-for="item in orgList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item " :label="$t('meetingList.mn')">
          <el-input clearable v-model="filterForm.title" :placeholder="$t('noticeListMsg.kplaceholder')"></el-input>
        </el-form-item>
        <el-form-item class="form-item " :label="$t('meetingList.mp')">
          <el-input style="width: 10.5vw;" v-model="filterForm.userName" clearable :placeholder="$t('noticeListMsg.sMName')"></el-input>
        </el-form-item>
        <el-form-item class="form-item " style="width: auto" :label="$t('meetingList.mt')">
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
          <el-button class="btn" type="primary" @click="">{{ $t('noticeListMsg.search') }}</el-button>
        </el-form-item>
<!--        <el-form-item class="form-item">-->
<!--        </el-form-item>-->
      </el-form>
    </div>
    <div class="meeting-list-wrap__table">
      <el-table
              header-row-class-name="fs16"
              :data="list"
              style="width: 100%">
        <div slot="empty" class="empty-wrap">
          <img src="@/assets/images/address-none.png" alt="">
          <div>暂无数据</div>
        </div>
        <el-table-column
                prop="date"
                :label="$t('meetingList.item')"
                width="80">
        </el-table-column>
        <el-table-column
                prop="name"
                width="140"
                :label="$t('meetingList.ms')">
          <template slot-scope="scope">
            <div class="fs16">{{ scope.row.source }}</div>
          </template>
        </el-table-column>
        <el-table-column
                prop="address"
                :label="$t('meetingList.ml')">
        </el-table-column>
        <el-table-column
                prop="address"
                width="90"
                :label="$t('meetingList.host')">
          <template slot-scope="scope">
            <div class="fs16">{{ scope.row.host }}</div>
          </template>
        </el-table-column>
        <el-table-column
                prop="address"
                width="90"
                :label="$t('meetingList.mp')">
          <template slot-scope="scope">
            <div class="fs16">{{ scope.row.host }}</div>
          </template>
        </el-table-column>
        <el-table-column
                prop="address"
                :label="$t('meetingList.department')">
        </el-table-column>
        <el-table-column
                prop="start"
                width="170"
                :label="$t('meetingList.mt')">
          <template slot-scope="scope">
            <div class="fs16">{{ scope.row.start }}</div>
          </template>
        </el-table-column>
        <el-table-column
                prop="end"
                width="170"
                :label="$t('meetingList.end')">
          <template slot-scope="scope">
            <div class="fs16">{{ scope.row.end }}</div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
              background
              class="pagination"
              :current-page="pageIndex"
              :page-sizes="[15, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        pageIndex: 1,
        pageSize: 15,
        totalCount: 0,
        filterForm: {
          origin: '',
          userName: '',
          title: '',
          startTime: '',
          endTime: '',
        },
        orgList: [
          {label: '全部', value: '17960c0caf762472a3582234a829ccdc,1780809bed3ead361cbfd6f48d692154,178080a1be5b4429426e6cf4ea1b793a,1780814be7664fd8c60a5264b6b85b35,178080bebc3694354c2acc34f059d196,178080e9ef70c27e217c03d41b698e35,178080c4b18773901c782a04764b3e2a,178080eedc8dc1d6fa3ed784bb6998ec,178080f32458d53c067fb3743cfb1eba,178080f713b1cbe194ab16a48f08f67e'},
          {label: '奥园集团', value: '17960c0caf762472a3582234a829ccdc'},
          {label: '地产集团', value: '1780809bed3ead361cbfd6f48d692154'},
        ],
        list: [
          {end: '2020/10/09 06:00:00',start: '2020/10/09 06:00:00',source: 'oa会议管理',host: '实际上'}
        ]
      }
    },
    methods:{
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.meetingList()
      },
      handleCurrentChange(pageIndex) {
        this.pageIndex = pageIndex
        this.meetingList()
      },
      meetingList(){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .meeting-list-wrap{
    background: #fff;
    min-height: 100%;
    &__filter{
      text-align: left;
      padding: 0 60px;
      .form-item{
        margin-top: 30px;
        margin-bottom: 0;
        width: 30%;
      }
      .btn{
        margin-left: 30px;
      }
      .m10{
        margin: 0 10px;
      }
    }
    &__table{
      margin-top: 30px;
      padding: 0 35px;
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
      .pagination {
        text-align: right;
        padding: 20px 0;
      }
    }
  }
</style>
