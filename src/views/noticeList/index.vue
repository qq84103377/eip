<template>
  <section class="notice-list">
    <div class="notice-list__nav">
      <span v-if="$route.query.type != 5" style="cursor: pointer;" @click="$router.push('/home?id=1')">{{ $t("publicMsg.home") }}</span>
      <span v-if="$route.query.type != 5" class="split"> > </span>
      <span ref="pageName" style="color: #999">{{ navTitle }}</span>
    </div>
    <div class="notice-list__body">
      <div v-if="$route.query.type != 5" class="notice-list__body__tab">
        <div class="notice-list__body__tab__header">
          <i class="iconEIP icon_cate"></i> {{ $t("noticeListMsg.nav") }}
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('publicMsg.all')}"
             :class="['notice-list__body__tab__item',{active:tabIndex==0}]" @click="toggleTab(0)" :title="$t('publicMsg.all')">
          <i class="iconEIP icon_news_nav3"></i> <span
                class="notice-list__body__tab__title">{{ $t("publicMsg.all") }}</span>
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('publicMsg.notice')}"
             :class="['notice-list__body__tab__item',{active:tabIndex==1}]" @click="toggleTab(1)" :title="$t('publicMsg.notice')">
          <i class="iconEIP icon_notice_nav1"></i> <span class="notice-list__body__tab__title">{{ $t("publicMsg.notice") }}</span>
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('publicMsg.minutes')}"
             :class="['notice-list__body__tab__item',{active:tabIndex==2}]" @click="toggleTab(2)" :title="$t('publicMsg.minutes')">
          <i class="iconEIP icon_notice_nav2"></i> <span class="notice-list__body__tab__title">{{ $t("publicMsg.minutes") }}</span>
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('publicMsg.personnel')}"
             :class="['notice-list__body__tab__item',{active:tabIndex==3}]" @click="toggleTab(3)" :title="$t('publicMsg.personnel')">
          <i class="iconEIP icon_notice_nav3"></i> <span class="notice-list__body__tab__title">{{ $t("publicMsg.personnel") }}</span>
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('publicMsg.system')}"
             :class="['notice-list__body__tab__item',{active:tabIndex==4}]" @click="toggleTab(4)" :title="$t('publicMsg.system')">
          <i class="iconEIP icon_notice_nav4"></i> <span class="notice-list__body__tab__title">{{ $t("publicMsg.system") }}</span>
        </div>
      </div>
      <div class="notice-list__body__main">
        <div :class="['notice-list__body__main__filter',{pd20:tabIndex != 2}]">
          <div>
            <el-form :inline="true" class="demo-form-inline" @keyup.enter.native="handleSearch">
              <el-form-item v-show="tabIndex != 2" class="form-item"
                            :label="tabIndex != 2 ? ($t('noticeListMsg.publishTime')+':') : ($t('noticeListMsg.time')+':')">
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
              <el-form-item v-show="tabIndex != 2" class="form-item mgL40" :label="$t('noticeListMsg.title') + ':'">
                <el-input clearable v-model="filterForm.title" :placeholder="$t('noticeListMsg.kplaceholder')"></el-input>
              </el-form-item>

              <el-form-item :label-width="$i18n.locale === 'en-US' ? '7.5vw' : '6.5vw'" v-show="tabIndex == 2" class="form-item mt20" :label="$t('noticeListMsg.company')">
                <el-select :disabled="$route.query.id != 1" style="width: 10.5vw;" v-model="orgType" clearable :placeholder="$t('noticeListMsg.sCompany')">
                  <el-option
                          v-for="item in orgList"
                          :key="item.label"
                          :label="$i18n.locale === 'en-US' ? item.en :item.label"
                          :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="6.5vw" v-show="tabIndex == 2" class="form-item mt20" :label="$t('noticeListMsg.meetingType')">
                <el-select style="width: 10.5vw;" v-model="meetingType" clearable :placeholder="$t('noticeListMsg.sMeetingType')">
                  <el-option
                          v-for="item in meetingTypeList"
                          :key="item.meetingTypeValue"
                          :label="item.meetingTypeName"
                          :value="item.meetingTypeValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="$i18n.locale === 'en-US' ? '11vw' : '6.5vw'" v-show="tabIndex == 2" class="form-item mt20" :label="$t('noticeListMsg.mName')">
                <el-input style="width: 12.5vw;" v-model="filterForm.title" clearable :placeholder="$t('noticeListMsg.sMName')"></el-input>
              </el-form-item>
              <el-form-item label-width="6.5vw" v-show="tabIndex == 2" class="form-item mt20" :label="$t('noticeListMsg.publisher')">
                <el-input style="width: 10.5vw;" v-model="publisher" clearable :placeholder="$t('noticeListMsg.sPublisher')"></el-input>
              </el-form-item>
              <el-form-item label-width="6.5vw" v-show="tabIndex == 2" class="form-item mt20" :label="$t('noticeListMsg.mTime')">
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
              <el-form-item class="form-item" v-show="tabIndex != 2">
                <el-button type="primary" @click="handleSearch">{{ $t('noticeListMsg.search') }}</el-button>
              </el-form-item>
              <el-form-item class="form-item mt20 mb20 ml20" v-show="tabIndex == 2">
                <el-button type="primary" @click="handleSearch">{{ $t('noticeListMsg.search') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="notice-list__body__main__table">
          <el-table
                  v-if="tabIndex != 2"
                  ref="table"
                  :cell-style="{height: '2.8vw'}"
                  :data="noticeData"
                  header-row-class-name="fs16 whn"
                  v-loading="listLoading"
                  @row-click="viewDetail"
                  :header-cell-style="{background:'#FAFAFA'}"
                  style="width: 100%"
          >
            <div slot="empty" class="empty-wrap">
              <img src="@/assets/images/address-none.png" alt="">
              <div>暂无数据</div>
            </div>
            <el-table-column
                    :label="$t('noticeListMsg.no')"
                    width="80"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    :label="$t('noticeListMsg.title')">
              <template slot-scope="scope">
                <div class="table-title fs16" :title="scope.row.docSubject">{{ scope.row.docSubject }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    :label="$t('noticeListMsg.number')"
                    width="100"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.fdFileNo }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    :label="$t('noticeListMsg.author')"
                    width="100"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.docAuthor }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    :label="$t('noticeListMsg.department')"
                    width="120"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.docDeptName }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    width="160"
                    :label="$t('noticeListMsg.publishTime')"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-table
                  v-else
                  ref="table"
                  :cell-style="{height: '2.8vw'}"
                  :data="noticeData"
                  header-row-class-name="fs16"
                  v-loading="listLoading"
                  @row-click="viewDetail"
                  :header-cell-style="{background:'#FAFAFA'}"
                  style="width: 100%"
          >
            <div slot="empty" class="empty-wrap">
              <img src="@/assets/images/address-none.png" alt="">
              <div>暂无数据</div>
            </div>
            <el-table-column
                    :label="$t('noticeListMsg.no')"
                    width="80"
                    align="center">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    width="150"
                    :label="$t('noticeListMsg.company')">
              <template slot-scope="scope">
                <div class="table-title fs16">{{ scope.row.groupyName }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    width="150"
                    :label="$t('noticeListMsg.meetingType')">
              <template slot-scope="scope">
                <div class="table-title fs16">{{ scope.row.meetingTypeName }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    :label="$t('noticeListMsg.mName')">
              <template slot-scope="scope">
                <div class="table-title fs16" :title="scope.row.docSubject">{{ scope.row.docSubject }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    width="140"
                    :label="$t('noticeListMsg.mTime')">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.meetingCreateTime * 1 | formatDate('yyyy.MM.dd') }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    width="100"
                    :label="$t('noticeListMsg.publisher')">
              <template slot-scope="scope">
                <div class="fs16">{{ scope.row.docAuthor }}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    width="100"
                    :label="$t('noticeListMsg.operation')">
              <template slot-scope="scope">
                <div class="fs16" style="cursor: pointer;color: #006E38">{{$t('noticeListMsg.detail')}}</div>
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

      </div>
    </div>
  </section>
</template>

<script>
  import {analyse} from '@utils/analyse'
  import API from '@api'
  import {formatDate} from '@utils'

  export default {
    name: "NoticeList",
    data() {
      return {
        publisher: '',
        orgType: '',
        meetingType: '',
        meetingTypeList: [],
        tabIndex: this.$route.query.noticeId,
        filterForm: {title: '', startTime: '', endTime: '', meetingName: ''},
        noticeParams: {
          startTime: '',
          endTime: '',
          title: '',
        },
        meetingParams: {
          startTime: '',
          endTime: '',
          title: '',
          publisher: '',
          orgType: '',
          meetingType: '',
        },
        listLoading: false,
        pageIndex: 1,
        pageSize: 15,
        totalCount: 0,
        noticeData: [],
        meetingList: [],
        // 开发环境
        // categoryIds: [[],
        //   [
        //     '15ea8fcaee30216a77e2f1a49dda8c07','15ea918b9b602e23b64e7cc4ba780791,15ea910421061ba7aad65d24342ab24f,15f03fdc5634670aef213754d7daec40,15fb375ae7e2e73439ee3a14b0d8cebf,15f03fef4a6febabbce0a5c4c0b8b18c,15fb374ef87b5ec43428d2a4783a08c5,15f0400459a60c34a9a6d704ed0b6258,160c43557c8560d84353cb143c4b6912,16d1fc0b24f191e281e1d794b6b8378a','17960c0caf762472a3582234a829ccdc',
        //     '15ea90e6fe248e66401202b464ab2a37,15ea90f9a85c94752d49f8f4a678ccb4,15f03fe118f164c093d5bde433496916,15f03ff8f088534fcdee42a4f53bf833,15f040088455c646232acb147999aa45,15fb3752329600db4386ae44ac7ae9cd,15fb375e5a399d626179ae04b40bf88b,160c435dfe53bce9fbde8c946148e6eb,16d1fc0ff4b9aecda4106de4c2498146',
        //     '15ea90c31477db82539a5604e28b46ae,15ea9092daaacb02cd5b9fa4bfb8a45f,15f03fd55f01e31d0fe30b94f5896d2a,15f03feb230efcf8f37f6e841058c741,15f03ffff83c9937d64570c44b48b626,15fb3749601715c13d92f854f299aea1,15fb37577bfdfbced7db1ff4d2caeaa3,160c434bb6084e40ff0aa354cea8dcbc,16d1fc0467bd10dc5aa639e469ab6c4a',''
        //   ],
        // ['15ea90044ea546a81d6a708475c8f258','15ea918b9b602e23b64e7cc4ba780791','17960c0caf762472a3582234a829ccdc','15ea90e6fe248e66401202b464ab2a37','15ea90c31477db82539a5604e28b46ae'],
      //   ['15ea901c3417b08ab1bf868433eb63a2','15ea910421061ba7aad65d24342ab24f','177fc538c8f56f638e8a3b24c6b91fd2','15ea90f9a85c94752d49f8f4a678ccb4','15ea9092daaacb02cd5b9fa4bfb8a45f'],
        //   ['15ea902208284dcd3c119504956be925','15f03fdc5634670aef213754d7daec40','15e9974c06682ef7d6297d84fad9a74e','15f03fe118f164c093d5bde433496916','15f03fd55f01e31d0fe30b94f5896d2a'],
        //   ['15fb370da1fe0dee87713a249778d798','15fb375ae7e2e73439ee3a14b0d8cebf','15e99750e156127a49b9cf640ef99963','15fb375e5a399d626179ae04b40bf88b','15fb37577bfdfbced7db1ff4d2caeaa3'],
        //   ['15ea90277ce7db70b7ac80e4749a0044','15f03fef4a6febabbce0a5c4c0b8b18c','15e9974580180c5b529b58f47be9a2eb','15f03ff8f088534fcdee42a4f53bf833','15f03feb230efcf8f37f6e841058c741'],
        //   ['15fb3709b462cbafcabf10b4ba789f6e','15fb374ef87b5ec43428d2a4783a08c5','1602465e054e23734b501af4db380f44','15fb3752329600db4386ae44ac7ae9cd','15fb3749601715c13d92f854f299aea1'],
        //   ['15ea902e5030a11a9fcb1574d19bdaab','15f0400459a60c34a9a6d704ed0b6258','15e99755b092b044eccaafb4d3e81f6f','15f040088455c646232acb147999aa45','15f03ffff83c9937d64570c44b48b626'],
        //   ['160c4343879a09497fe07f744b88a761','160c43557c8560d84353cb143c4b6912','15e9974b2bfa3093427805f43938ca6a','160c435dfe53bce9fbde8c946148e6eb','160c434bb6084e40ff0aa354cea8dcbc'],
        //   ['16d1fbfb4d337ec6b724a4b42b5adfc9','16d1fc0b24f191e281e1d794b6b8378a','170d2b97339f4eaf93ddba51b88c38a3','16d1fc0ff4b9aecda4106de4c2498146','16d1fc0467bd10dc5aa639e469ab6c4a'],
        //   ['','','','','']
        // ],
        //生产环境
        categoryIds: [[],
          [
            '15ea8fcaee30216a77e2f1a49dda8c07','15ea918b9b602e23b64e7cc4ba780791,15ea910421061ba7aad65d24342ab24f,15f03fdc5634670aef213754d7daec40,15fb375ae7e2e73439ee3a14b0d8cebf,15f03fef4a6febabbce0a5c4c0b8b18c,15fb374ef87b5ec43428d2a4783a08c5,15f0400459a60c34a9a6d704ed0b6258,160c43557c8560d84353cb143c4b6912,16d1fc0b24f191e281e1d794b6b8378a','177f82c02537fc38f3c5ce0437f9b804,1780809bed3ead361cbfd6f48d692154,178080a1be5b4429426e6cf4ea1b793a,1780814be7664fd8c60a5264b6b85b35,178080bebc3694354c2acc34f059d196,178080e9ef70c27e217c03d41b698e35,178080c4b18773901c782a04764b3e2a,178080eedc8dc1d6fa3ed784bb6998ec,178080f32458d53c067fb3743cfb1eba,178080f713b1cbe194ab16a48f08f67e',
            '15ea90e6fe248e66401202b464ab2a37,15ea90f9a85c94752d49f8f4a678ccb4,15f03fe118f164c093d5bde433496916,15f03ff8f088534fcdee42a4f53bf833,15f040088455c646232acb147999aa45,15fb3752329600db4386ae44ac7ae9cd,15fb375e5a399d626179ae04b40bf88b,160c435dfe53bce9fbde8c946148e6eb,16d1fc0ff4b9aecda4106de4c2498146',
            '15ea90c31477db82539a5604e28b46ae,15ea9092daaacb02cd5b9fa4bfb8a45f,15f03fd55f01e31d0fe30b94f5896d2a,15f03feb230efcf8f37f6e841058c741,15f03ffff83c9937d64570c44b48b626,15fb3749601715c13d92f854f299aea1,15fb37577bfdfbced7db1ff4d2caeaa3,160c434bb6084e40ff0aa354cea8dcbc,16d1fc0467bd10dc5aa639e469ab6c4a',''
          ],
        ['15ea90044ea546a81d6a708475c8f258','15ea918b9b602e23b64e7cc4ba780791','177f82c02537fc38f3c5ce0437f9b804','15ea90e6fe248e66401202b464ab2a37','15ea90c31477db82539a5604e28b46ae'],
          ['15ea901c3417b08ab1bf868433eb63a2','15ea910421061ba7aad65d24342ab24f','1780809bed3ead361cbfd6f48d692154','15ea90f9a85c94752d49f8f4a678ccb4','15ea9092daaacb02cd5b9fa4bfb8a45f'],
          ['15ea902208284dcd3c119504956be925','15f03fdc5634670aef213754d7daec40','178080a1be5b4429426e6cf4ea1b793a','15f03fe118f164c093d5bde433496916','15f03fd55f01e31d0fe30b94f5896d2a'],
          ['15fb370da1fe0dee87713a249778d798','15fb375ae7e2e73439ee3a14b0d8cebf','1780814be7664fd8c60a5264b6b85b35','15fb375e5a399d626179ae04b40bf88b','15fb37577bfdfbced7db1ff4d2caeaa3'],
          ['15ea90277ce7db70b7ac80e4749a0044','15f03fef4a6febabbce0a5c4c0b8b18c','178080bebc3694354c2acc34f059d196','15f03ff8f088534fcdee42a4f53bf833','15f03feb230efcf8f37f6e841058c741'],
          ['15fb3709b462cbafcabf10b4ba789f6e','15fb374ef87b5ec43428d2a4783a08c5','178080e9ef70c27e217c03d41b698e35','15fb3752329600db4386ae44ac7ae9cd','15fb3749601715c13d92f854f299aea1'],
          ['15ea902e5030a11a9fcb1574d19bdaab','15f0400459a60c34a9a6d704ed0b6258','178080c4b18773901c782a04764b3e2a','15f040088455c646232acb147999aa45','15f03ffff83c9937d64570c44b48b626'],
          ['160c4343879a09497fe07f744b88a761','160c43557c8560d84353cb143c4b6912','178080eedc8dc1d6fa3ed784bb6998ec','160c435dfe53bce9fbde8c946148e6eb','160c434bb6084e40ff0aa354cea8dcbc'],
          ['16d1fbfb4d337ec6b724a4b42b5adfc9','16d1fc0b24f191e281e1d794b6b8378a','178080f32458d53c067fb3743cfb1eba','16d1fc0ff4b9aecda4106de4c2498146','16d1fc0467bd10dc5aa639e469ab6c4a'],
          ['177cc77ec59098ee3b4a9724a668df91','177cc7921f71009ebf82ef64b65b5acf','178080f713b1cbe194ab16a48f08f67e','177cc7965959e69074ffad3409d91e09','177cc78b703078d98786b9a4c2cb6fae']
        ],
        orgList: [
          {label: '全部', en: 'All', value: '177f82c02537fc38f3c5ce0437f9b804,1780809bed3ead361cbfd6f48d692154,178080a1be5b4429426e6cf4ea1b793a,1780814be7664fd8c60a5264b6b85b35,178080bebc3694354c2acc34f059d196,178080e9ef70c27e217c03d41b698e35,178080c4b18773901c782a04764b3e2a,178080eedc8dc1d6fa3ed784bb6998ec,178080f32458d53c067fb3743cfb1eba,178080f713b1cbe194ab16a48f08f67e'},
          {label: '奥园集团', en: 'China Aoyuan', value: '177f82c02537fc38f3c5ce0437f9b804'},
          {label: '地产集团', en: 'Property', value: '1780809bed3ead361cbfd6f48d692154'},
          {label: '商业地产集团', en: 'Commercial Property', value: '178080a1be5b4429426e6cf4ea1b793a'},
          {label: '国际投资集团', en: 'International Investment', value: '1780814be7664fd8c60a5264b6b85b35'},
          {label: '健康生活集团', en: 'Healthy', value: '178080bebc3694354c2acc34f059d196'},
          {label: '资本投资集团', en: 'Capital Investment', value: '178080e9ef70c27e217c03d41b698e35'},
          {label: '文旅集团', en: 'Cultural Tourism', value: '178080c4b18773901c782a04764b3e2a'},
          {label: '科技集团', en: 'Technology', value: '178080eedc8dc1d6fa3ed784bb6998ec'},
          {label: '城市建设集团', en: 'Urban Construction', value: '178080f32458d53c067fb3743cfb1eba'},
          {label: '奥园美谷', en: 'Beauty', value: '178080f713b1cbe194ab16a48f08f67e'},
        ],
        //UAT环境
        // categoryIds: [[],
        //   [
        //     '15ea8fcaee30216a77e2f1a49dda8c07','15ea918b9b602e23b64e7cc4ba780791,15ea910421061ba7aad65d24342ab24f,15f03fdc5634670aef213754d7daec40,15fb375ae7e2e73439ee3a14b0d8cebf,15f03fef4a6febabbce0a5c4c0b8b18c,15fb374ef87b5ec43428d2a4783a08c5,15f0400459a60c34a9a6d704ed0b6258,160c43557c8560d84353cb143c4b6912,16d1fc0b24f191e281e1d794b6b8378a','17960c0caf762472a3582234a829ccdc,1780809bed3ead361cbfd6f48d692154,178080a1be5b4429426e6cf4ea1b793a,1780814be7664fd8c60a5264b6b85b35,178080bebc3694354c2acc34f059d196,178080e9ef70c27e217c03d41b698e35,178080c4b18773901c782a04764b3e2a,178080eedc8dc1d6fa3ed784bb6998ec,178080f32458d53c067fb3743cfb1eba,178080f713b1cbe194ab16a48f08f67e',
        //     '15ea90e6fe248e66401202b464ab2a37,15ea90f9a85c94752d49f8f4a678ccb4,15f03fe118f164c093d5bde433496916,15f03ff8f088534fcdee42a4f53bf833,15f040088455c646232acb147999aa45,15fb3752329600db4386ae44ac7ae9cd,15fb375e5a399d626179ae04b40bf88b,160c435dfe53bce9fbde8c946148e6eb,16d1fc0ff4b9aecda4106de4c2498146',
        //     '15ea90c31477db82539a5604e28b46ae,15ea9092daaacb02cd5b9fa4bfb8a45f,15f03fd55f01e31d0fe30b94f5896d2a,15f03feb230efcf8f37f6e841058c741,15f03ffff83c9937d64570c44b48b626,15fb3749601715c13d92f854f299aea1,15fb37577bfdfbced7db1ff4d2caeaa3,160c434bb6084e40ff0aa354cea8dcbc,16d1fc0467bd10dc5aa639e469ab6c4a',''
        //   ],
        //   ['15ea90044ea546a81d6a708475c8f258','15ea918b9b602e23b64e7cc4ba780791','17960c0caf762472a3582234a829ccdc','15ea90e6fe248e66401202b464ab2a37','15ea90c31477db82539a5604e28b46ae'],
        //   ['15ea901c3417b08ab1bf868433eb63a2','15ea910421061ba7aad65d24342ab24f','1780809bed3ead361cbfd6f48d692154','15ea90f9a85c94752d49f8f4a678ccb4','15ea9092daaacb02cd5b9fa4bfb8a45f'],
        //   ['15ea902208284dcd3c119504956be925','15f03fdc5634670aef213754d7daec40','178080a1be5b4429426e6cf4ea1b793a','15f03fe118f164c093d5bde433496916','15f03fd55f01e31d0fe30b94f5896d2a'],
        //   ['15fb370da1fe0dee87713a249778d798','15fb375ae7e2e73439ee3a14b0d8cebf','1780814be7664fd8c60a5264b6b85b35','15fb375e5a399d626179ae04b40bf88b','15fb37577bfdfbced7db1ff4d2caeaa3'],
        //   ['15ea90277ce7db70b7ac80e4749a0044','15f03fef4a6febabbce0a5c4c0b8b18c','178080bebc3694354c2acc34f059d196','15f03ff8f088534fcdee42a4f53bf833','15f03feb230efcf8f37f6e841058c741'],
        //   ['15fb3709b462cbafcabf10b4ba789f6e','15fb374ef87b5ec43428d2a4783a08c5','178080e9ef70c27e217c03d41b698e35','15fb3752329600db4386ae44ac7ae9cd','15fb3749601715c13d92f854f299aea1'],
        //   ['15ea902e5030a11a9fcb1574d19bdaab','15f0400459a60c34a9a6d704ed0b6258','178080c4b18773901c782a04764b3e2a','15f040088455c646232acb147999aa45','15f03ffff83c9937d64570c44b48b626'],
        //   ['160c4343879a09497fe07f744b88a761','160c43557c8560d84353cb143c4b6912','178080eedc8dc1d6fa3ed784bb6998ec','160c435dfe53bce9fbde8c946148e6eb','160c434bb6084e40ff0aa354cea8dcbc'],
        //   ['16d1fbfb4d337ec6b724a4b42b5adfc9','16d1fc0b24f191e281e1d794b6b8378a','178080f32458d53c067fb3743cfb1eba','16d1fc0ff4b9aecda4106de4c2498146','16d1fc0467bd10dc5aa639e469ab6c4a'],
        //   ['177cc77ec59098ee3b4a9724a668df91','177cc7921f71009ebf82ef64b65b5acf','178080f713b1cbe194ab16a48f08f67e','177cc7965959e69074ffad3409d91e09','177cc78b703078d98786b9a4c2cb6fae']
        // ],
        // orgList: [
        //   {label: '全部', en: 'All', value: '17960c0caf762472a3582234a829ccdc,1780809bed3ead361cbfd6f48d692154,178080a1be5b4429426e6cf4ea1b793a,1780814be7664fd8c60a5264b6b85b35,178080bebc3694354c2acc34f059d196,178080e9ef70c27e217c03d41b698e35,178080c4b18773901c782a04764b3e2a,178080eedc8dc1d6fa3ed784bb6998ec,178080f32458d53c067fb3743cfb1eba,178080f713b1cbe194ab16a48f08f67e'},
        //   {label: '奥园集团', en: 'China Aoyuan', value: '17960c0caf762472a3582234a829ccdc'},
        //   {label: '地产集团', en: 'Property', value: '1780809bed3ead361cbfd6f48d692154'},
        //   {label: '商业地产集团', en: 'Commercial Property', value: '178080a1be5b4429426e6cf4ea1b793a'},
        //   {label: '国际投资集团', en: 'International Investment', value: '1780814be7664fd8c60a5264b6b85b35'},
        //   {label: '健康生活集团', en: 'Healthy', value: '178080bebc3694354c2acc34f059d196'},
        //   {label: '资本投资集团', en: 'Capital Investment', value: '178080e9ef70c27e217c03d41b698e35'},
        //   {label: '文旅集团', en: 'Cultural Tourism', value: '178080c4b18773901c782a04764b3e2a'},
        //   {label: '科技集团', en: 'Technology', value: '178080eedc8dc1d6fa3ed784bb6998ec'},
        //   {label: '城市建设集团', en: 'Urban Construction', value: '178080f32458d53c067fb3743cfb1eba'},
        //   {label: '奥园美谷', en: 'Beauty', value: '178080f713b1cbe194ab16a48f08f67e'},
        // ],
      }
    },
    computed: {
      navTitle() {
        let name = ''
        if (this.tabIndex == 0) {
          name = this.$t('publicMsg.all')
        } else if (this.tabIndex == 1) {
          name = this.$t('publicMsg.notice')
        } else if (this.tabIndex == 2) {
          name = this.$t('publicMsg.minutes')
        } else if (this.tabIndex == 3) {
          name = this.$t('publicMsg.personnel')
        } else if (this.tabIndex == 4) {
          name = this.$t('publicMsg.system')
        }
        return name
      },
      currentCateId() {
        return this.categoryIds[this.$route.query.depId][this.tabIndex]
      },
    },
    mounted() {
      // if (this.tabIndex != 2) {
      this.orgType = this.orgList[Number(this.$route.query.id) - 1].value
        this.getNotices()
      // } else {
      //   this.getMeetingList()
      // }
      analyse('进入页面')
      this.getMeetingType()
    },
    methods: {
      getMeetingType(){
        API.home.getMeetingType().then(res => {
          if(res.data.code === 200) {
            this.meetingTypeList = res.data.data || []
          }
        })
      },
      viewDetail(item) {
        // window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank')
        let routeUrl = this.$router.resolve({ name: 'noticeDetail', query: {id: item.fdId, mid: this.$route.query.id, noticeId: this.tabIndex}})
        window.open(routeUrl.href, '_blank');
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
          this.getNotices()
      },
      handleCurrentChange(pageIndex) {
        if(this.tabIndex != 2) {
          this.filterForm.title = this.noticeParams.title
          this.filterForm.startTime = this.noticeParams.startTime
          this.filterForm.endTime = this.noticeParams.endTime
        }else{
          this.filterForm.title = this.meetingParams.title
          this.filterForm.startTime = this.meetingParams.startTime
          this.filterForm.endTime = this.meetingParams.endTime
          this.publisher = this.meetingParams.publisher
          this.orgType = this.meetingParams.orgType
          this.meetingType = this.meetingParams.meetingType
        }
        this.pageIndex = pageIndex
          this.getNotices()
      },
      toggleTab(index) {
        if (this.tabIndex == index) return
        this.noticeParams = {title: '', startTime: '', endTime: ''}
        this.meetingParams = {title: '', startTime: '', endTime: '', publisher: '', orgType: '', meetingType: ''}
        this.filterForm = {title: '', startTime: '', endTime: '', meetingName: ''}
        this.publisher = ''
        this.meetingType = ''
        // this.orgType = ''
        this.orgType = this.orgList[Number(this.$route.query.id) - 1].value

        this.tabIndex = index
        this.pageIndex = 1
        // if (index != 2) {
          this.getNotices()
        // } else {
        //   this.getMeetingList()
        // }
      },
      handleSearch() {
        this.pageIndex = 1
        if(this.tabIndex != 2) {
          this.noticeParams.startTime = this.filterForm.startTime
          this.noticeParams.endTime = this.filterForm.endTime
          this.noticeParams.title = this.filterForm.title
        }else{
          this.meetingParams.startTime = this.filterForm.startTime
          this.meetingParams.endTime = this.filterForm.endTime
          this.meetingParams.title = this.filterForm.title
          this.meetingParams.publisher = this.publisher
          this.meetingParams.orgType = this.orgType
          this.meetingParams.meetingType = this.meetingType
        }
          this.getNotices()
      },
      // getMeetingList() {
      //   this.listLoading = true
      //   let params = {
      //     Orderby: 'docCreateTime',
      //     DocStatus: '30',
      //     JPath: '/myHandleSummary',
      //     DocCreateStartTime: this.filterForm.startTime ? formatDate(this.filterForm.startTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : '',
      //     DocCreateEndTime: this.filterForm.endTime ? formatDate(this.filterForm.endTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : '',
      //     Ordertype: 'down',
      //     FdName: this.filterForm.meetingName,
      //     PageNo: this.pageIndex,
      //     RowSize: this.pageSize,
      //   }
      //   API.home.getMeetingList(params).then(res => {
      //     this.listLoading = false
      //     if (res.data.code === 200) {
      //       this.meetingList = res.data.data.list || []
      //       this.totalCount = res.data.data.totalrows
      //     } else {
      //       this.meetingList = []
      //       this.totalCount = 0
      //     }
      //   }).catch(err => {
      //     this.listLoading = false
      //     this.noticeData = []
      //     this.totalCount = 0
      //   })
      // },
      // 获取公告信息
      getNotices() {
        this.listLoading = true
        let params = {
          Orderby: 'docPublishTime',
          DocCategory: (this.tabIndex == 2 && this.meetingParams.orgType) ? this.meetingParams.orgType : this.currentCateId,
          DocStatus: '30',
          JPath: '/docCategory',
          Ordertype: 'down',
          PageNo: this.pageIndex,
          RowSize: this.pageSize,
          isShowAll: this.tabIndex == 0,
        }
        if(this.tabIndex == 2) {
          params.meetingCreateTimeStart = this.meetingParams.startTime ? formatDate(this.meetingParams.startTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : ''
          params.meetingCreateTimeEnd = this.meetingParams.endTime ? formatDate(this.meetingParams.endTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : ''
          params.publisher = this.meetingParams.publisher
          params.meetingTypeValue = this.meetingParams.meetingType
          params.DocSubject = this.meetingParams.title
        }else{
          params.DocPublishStartTime = this.noticeParams.startTime ? formatDate(this.noticeParams.startTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : ''
          params.DocPublishEndTime = this.noticeParams.endTime ? formatDate(this.noticeParams.endTime, this.$i18n.locale === 'zh-CN' ? 'yyyy-MM-dd' : 'MM/dd/yyyy') : ''
          params.DocSubject = this.noticeParams.title
        }
        API.home.getNotification(params).then(res => {
          this.listLoading = false
          if (res.data.code === 200) {
            this.noticeData = res.data.data.list || []
            this.totalCount = res.data.data.totalrows
          } else {
            this.noticeData = []
            this.totalCount = 0
          }
        }).catch(err => {
          this.listLoading = false
          this.noticeData = []
          this.totalCount = 0
        })
      },
      // 获取页面名称
      getPageName() {
        return this.$refs.pageName.innerText + '列表页面'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .notice-list {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    // display: flex;
    // flex-direction: column;
    -ms-overflow-style: scrollbar;
    /*height: 100%;*/
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
          width: 228px;
          background: #fff;
          line-height: 80px;
          cursor: pointer;
          text-align: left;
          padding-left: 50px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;

          &:hover {
            color: #006E38;
          }

          &.active {
            color: #006E38;
            background: #F2FBF7;
          }
        }

        &__title {
          position: relative;
          top: 2px;
        }
      }

      &__main {
        /*overflow-y: auto;*/
        /*scrollbar-width: none; !* firefox *!*/
        /*-ms-overflow-style: none; !* IE 10+ *!*/
        /*&::-webkit-scrollbar {*/
        /*  display: none; !* Chrome Safari *!*/
        /*}*/
        flex: 1;
        min-width: 500px;
        background: #fff;
        border-radius: 5px;
        padding: 0 24px;

        &__filter {
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #666;
          /*min-height: 86px;*/
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 30px;
          &.pd20{
            padding: 20px 0;
          }

          .form-item {
            margin-bottom: 0;
            .m10{
              margin: 0 10px;
            }
            .w100 {
              width: 100px;
            }
          }

          .mgL40 {
            margin-left: 40px;
          }
        }

        &__table {
          background: #fff;

          .table-title {
            cursor: pointer;

            &:hover {
              color: #006E38;
            }
          }
        }
      }
    }

    .pagination {
      text-align: right;
      padding: 20px 0;
    }

    .mr60 {
      margin-right: 60px;
    }

    .title-desc {
      font-size: 14px;
      color: #999;
      margin-top: 20px;
    }
  }

</style>
<style lang="scss">
  .notice-list{
    .whn{
      .cell{
        white-space: nowrap;
      }
    }
  }
</style>
