<template>
    <section class="news-list">
        <div class="news-list__nav">
            <span style="cursor: pointer" v-if="$route.query.type != 6" @click="$router.push('/home?id=1')">{{ $t('publicMsg.home') }}</span>
            <span v-if="$route.query.type != 6" class="split"> > </span>
            <span v-if="!isFromHome" style="cursor: pointer" @click="handleJump">{{ $route.query.from=='news'? $t('newsListMsg.new') : $t('homeMsg.cc') }}</span>
            <span v-if="!isFromHome" class="split"> > </span>
            <span ref="pageName" style="color: #ccc">{{ navTitle }}</span>
        </div>
        <div class="news-list__body">
            <div v-if="$route.query.type != 6" class="news-list__body__tab">
                <!-- 企业文化 -->
                <div v-if="isCulture">
                    <div class="news-list__body__tab__header">
                        <i class="iconEIP icon_cate"></i> {{ $t('newsListMsg.nav') }}
                    </div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.dnews')}" :class="['news-list__body__tab__item',{active:tabIndex==1}]" @click="changeTab(1)" :title="$t('newsListMsg.dnews')">
                        <i class="iconEIP icon_news_nav5"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.dnews') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.dintroduction')}" :class="['news-list__body__tab__item',{active:tabIndex==3}]" @click="changeTab(3)" :title="$t('newsListMsg.dintroduction')">
                        <i class="iconEIP icon_news_nav4"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.dintroduction') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.college')}" :class="['news-list__body__tab__item',{active:tabIndex==2}]" @click="changeTab(2)" :title="$t('newsListMsg.college')">
                        <i class="iconEIP icon_news_nav3"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.college') }}</span></div>
<!--                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.buyhouse')}" :class="['news-list__body__tab__item',{active:tabIndex==5}]" @click="changeTab(5)">-->
<!--                        <i class="iconEIP icon_news_nav9"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.buyhouse') }}</span></div>-->
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.follow')}" :class="['news-list__body__tab__item',{active:tabIndex==4}]" @click="changeTab(4)" :title="$t('newsListMsg.follow')">
                        <i class="iconEIP icon_news_nav7"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.follow') }}</span></div>
                </div>
                <!-- 新闻中心 -->
                <div v-else>
                    <div class="news-list__body__tab__header">
                        <i class="iconEIP icon_cate"></i> {{ $t('newsListMsg.nav') }}
                    </div>
                    <div v-analyse="{pageEvent:'点击'+$t('publicMsg.all')}" :class="['news-list__body__tab__item',{active:tabIndex==7}]" @click="changeTab(7)" :title="$t('publicMsg.all')">
                        <i class="iconEIP icon_news_nav10"></i> <span class="news-list__body__tab__title">{{ $t('publicMsg.all') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('publicMsg.homeNews1')}" :class="['news-list__body__tab__item',{active:tabIndex==5}]" @click="changeTab(5)" :title="$t('publicMsg.homeNews1')">
                        <i class="iconEIP icon_news_nav4"></i> <span class="news-list__body__tab__title">{{ $t('publicMsg.homeNews1') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.industry')}" :class="['news-list__body__tab__item',{active:tabIndex==8}]" @click="changeTab(8)" :title="$t('newsListMsg.industry')">
                        <i class="iconEIP icon_news_nav7"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.industry') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.glory')}" :class="['news-list__body__tab__item',{active:tabIndex==3}]" @click="changeTab(3)" :title="$t('newsListMsg.glory')">
                        <i class="iconEIP icon_news_nav6"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.glory') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.watch')}" :class="['news-list__body__tab__item',{active:tabIndex==1}]" @click="changeTab(1)" :title="$t('newsListMsg.watch')">
                        <i class="iconEIP icon_news_nav1"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.watch') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.dnews')}" :class="['news-list__body__tab__item',{active:tabIndex==2}]" @click="changeTab(2)" :title="$t('newsListMsg.dnews')">
                        <i class="iconEIP icon_news_nav5"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.dnews') }}</span></div>
                    <div v-analyse="{pageEvent:'点击'+$t('newsListMsg.college')}" :class="['news-list__body__tab__item',{active:tabIndex==4}]" @click="changeTab(4)" :title="$t('newsListMsg.college')">
                        <i class="iconEIP icon_news_nav3"></i> <span class="news-list__body__tab__title">{{ $t('newsListMsg.college') }}</span></div>
                </div>
            </div>
            <div class="news-list__body__main">
                <div class="news-list__body__main__filter">
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
<!--                            <el-form-item class="form-item" :label="$t('newsListMsg.important')">-->
<!--                                <el-select v-model="filterForm.important" class="w100" placeholder="">-->
<!--                                    <el-option v-for="(item,index) in importantOption" :key="index" :label="item.label"-->
<!--                                               :value="item.value"></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
                            <el-form-item class="form-item" :label="$t('newsListMsg.title')+':'">
                                <el-input style="width: 15vw" clearable v-model="filterForm.keyword" :placeholder="$t('newsListMsg.kplaceholder')"></el-input>
                            </el-form-item>
                            <el-form-item class="form-item">
                                <el-button type="primary" @click="handleSearch">{{ $t('newsListMsg.search') }}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="display: flex;align-items: center;cursor: pointer">
<!--                        <div v-if="$route.query.from === 'news' || $route.query.from === 'home'" @click="viewOaNews">-->
<!--                            OA新闻后台-->
<!--                        </div>-->
                        <div class="ml20" style="display: flex;align-items: center;cursor: pointer" @click="toggleLayout"><i
                                :class="['iconEIP mr5',layout?'icon_toggle_list':'icon_toggle_summary']"></i> {{
                            layout?$t('newsListMsg.list') : $t('newsListMsg.abstract') }}
                        </div>
                    </div>
                </div>
                <div class="news-list__body__main__table">
                    <!--                                            :show-header="layout"
                    -->
                    <el-table
                            ref="table"
                            v-loading="listLoading"
                            :show-header="layout"
                            :cell-style="{height: layout?'2.8vw':'5.5vw'}"
                            :data="list"
                            header-row-class-name="fs16"
                            :header-cell-style="{background:'#FAFAFA'}"
                            style="width: 100%"
                            @row-click="viewDetail"
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
<!--                                优惠购房-->
                                <div v-if="isCulture && tabIndex == 4">
                                    <div v-if="layout" class="table-title fs16" :title="scope.row.eipDocSubject || scope.row.docSubject">{{ scope.row.eipDocSubject || scope.row.docSubject }}
                                        <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                        <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                    </div>
                                    <div v-else>
                                        <div class="fs18" style="cursor: pointer;width: 100%;" :title="scope.row.eipDocSubject || scope.row.docSubject">{{ scope.row.eipDocSubject || scope.row.docSubject }}
                                            <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                            <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                        </div>
                                        <div class="title-desc">
                                            <span class="mr60">{{ $t('newsListMsg.author') }}: {{ scope.row.creator }}</span>
        <!--                                        <span class="mr60">{{ $t('newsListMsg.importants') }}: {{ scope.row.fdImportance }}</span>-->
                                            <span class="mr60">{{ $t('newsListMsg.time') }}: {{ scope.row.publishTime}}</span>
                                            <span>{{ $t('newsListMsg.click') }}: {{ scope.row.docHits }}</span>
                                        </div>
                                    </div>
                                </div>
<!--                                媒体看澳元-->
                                <div v-else-if="!isCulture && tabIndex == 1">
                                    <div v-if="layout" class="table-title fs16" :title="scope.row.eipDocSubject || scope.row.docSubject">
                                        <i class="iconEIP icon_top" v-if="scope.row.fdIsTop"></i>
                                        {{scope.row.eipDocSubject || scope.row.docSubject }}
                                        <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                        <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                    </div>
                                    <div v-else>
                                        <div class="fs18" style="cursor: pointer;width: 100%;" :title="scope.row.eipDocSubject||scope.row.docSubject">
                                            <i class="iconEIP icon_top" v-if="scope.row.fdIsTop"></i>
                                            {{scope.row.eipDocSubject || scope.row.docSubject }}
                                            <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                            <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                        </div>
                                        <div class="title-desc">
                                            <span class="mr60">{{ $t('newsListMsg.author') }}: {{ scope.row.fdWriterName }}</span>
                                            <!--                                        <span class="mr60">{{ $t('newsListMsg.importants') }}: {{ scope.row.fdImportance }}</span>-->
                                            <span class="mr60">{{ $t('newsListMsg.time') }}: <span v-if="scope.row.docPublishTime">{{ scope.row.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</span></span>
                                            <span>{{ $t('newsListMsg.click') }}: {{ scope.row.docHits }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-if="layout" class="table-title fs16" :title="scope.row.eipDocSubject ||scope.row.docSubject">
                                        <i class="iconEIP icon_top" v-if="scope.row.fdIsTop"></i>
                                        {{scope.row.eipDocSubject || scope.row.docSubject }}
                                        <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                        <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                    </div>
                                    <div v-else>
                                        <div class="fs18" style="cursor: pointer;width: 100%;" :title="scope.row.eipDocSubject ||scope.row.docSubject">
                                            <i class="iconEIP icon_top" v-if="scope.row.fdIsTop"></i>
                                            {{scope.row.eipDocSubject || scope.row.docSubject }}
                                            <i v-if="scope.row.showNewIcon" class="iconEIP icon_unread"></i>
                                            <i v-else-if="!scope.row.showNewIcon" class="iconEIP icon_readed"></i>
                                        </div>
                                        <div class="title-desc">
                                            <span class="mr60">{{ $t('newsListMsg.author') }}: {{ scope.row.fdWriterName }}</span>
        <!--                                        <span class="mr60">{{ $t('newsListMsg.importants') }}: {{ scope.row.fdImportance }}</span>-->
                                            <span class="mr60">{{ $t('newsListMsg.time') }}: <span v-if="scope.row.docPublishTime">{{ scope.row.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</span></span>
                                            <span>{{ $t('newsListMsg.click') }}: {{ scope.row.docHits }}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
<!--                        <el-table-column-->
<!--                                v-if="layout"-->
<!--                                :label="$t('newsListMsg.important')"-->
<!--                                align="center">-->
<!--                            <template slot-scope="scope">-->
<!--                                <div class="fs16">{{ scope.row.fdImportance }}</div>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column
                                width="80"
                                v-if="layout"
                                :label="$t('newsListMsg.author')"
                                align="center">
                            <template slot-scope="scope">
                                <div v-if="isCulture && tabIndex == 4">
                                    <div class="fs16">{{ scope.row.creator }}</div>
                                </div>
                                <div v-else class="fs16">{{ scope.row.fdWriterName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="layout"
                                width="170"
                                sortable="custom"
                                prop="time"
                                :label="$t('newsListMsg.time')"
                                align="center">
                            <template slot-scope="scope">
                                <div v-if="isCulture && tabIndex == 4">
                                    <div class="fs16">{{ scope.row.publishTime }}</div>
                                </div>
                                <div v-else class="fs16">
                                    <span v-if="scope.row.docPublishTime">{{ scope.row.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="layout"
                                width="125"
                                sortable="custom"
                                prop="click"
                                :label="$t('newsListMsg.clickr')"
                                align="center">
                            <template slot-scope="scope">
                                <span class="fs16" style="color: #B4A36B">{{ scope.row.docHits }}</span>
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
    import API from '@api'
    import {formatDate} from '@utils'
    import { analyse } from '@utils/analyse'
    export default {
        /**
         * 媒体看奥园生产Id 1764aa239d72d27a9a4873d4f4f871db
         * 媒体看奥园开发Id 17683581711989a76ce6e24426499ef3
         * 集团荣誉生产ID   1764609f782d9bef4addc834addae3c6
         * 集团荣誉开发ID   1768358558c25365010ecf7445e9f804
         */
        name: "Index",
        data() {
            return {
                listLoading: false,
                tabIndex: this.$route.query.type,
                filterForm: {startTime: '', endTime: '', keyword: ''},
                requestParams: {startTime: '', endTime: '', keyword: ''},
                list: [],
                layout: false, //false 摘要 true 列表
                pageSize: 15,
                pageIndex: 1,
                totalCount: 0,
                importantOption: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '3',
                    label: '普通'
                }, {
                    value: '2',
                    label: '重要'
                }, {
                    value: '1',
                    label: '非常重要'
                }],
                orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
                orderType: 'down'
            }
        },
        computed: {
            navTitle() {
                //切换tab对应nav名称变化 1 媒体看奥园 2 奥园党建 3 集团荣耀 4 企业大学
                let name = ''
                if ( this.isCulture ) {
                    if (this.tabIndex == 1) {
                        name = this.$t('newsListMsg.dnews')
                    } else if (this.tabIndex == 2) {
                        name = this.$t('newsListMsg.college')
                    } else if (this.tabIndex == 3) {
                        name =  this.$t('newsListMsg.dintroduction')
                    } else if (this.tabIndex == 4) {
                        name =  this.$t('newsListMsg.follow')
                    } else if(this.tabIndex == 5) {
                        name = this.$t('newsListMsg.buyhouse')
                    } else {
                        name = this.$t('publicMsg.rNews')
                    }
                } else {
                    if (this.tabIndex == 1) {
                        name = this.$t('newsListMsg.watch')
                    } else if (this.tabIndex == 2) {
                        name = this.$t('newsListMsg.dnews')
                    } else if (this.tabIndex == 3) {
                        name =  this.$t('newsListMsg.glory')
                    } else if (this.tabIndex == 4) {
                        name =  this.$t('newsListMsg.college')
                    } else if(this.tabIndex == 5) {
                        name = this.$t('publicMsg.homeNews1')
                    } else if(this.tabIndex == 7) {
                        name = this.$t('publicMsg.all')
                    } else if(this.tabIndex == 8) {
                        name = this.$t('newsListMsg.industry')
                    }
                }
                return name
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
            cateDintroductionId() {
                return this.docCategoryIds.dintroduction.catId
            },
            cateFollowId() {
                return this.docCategoryIds.follow.catId
            },
            cateGroupId() {
                return this.docCategoryIds.groupNews.catId
            },
            industryId() {
                return this.docCategoryIds.industryNews.catId
            },
            homebuyersId() {
                return this.docCategoryIds.homebuyers.catId
            },
            // 是否为企业文化页面
            isCulture() {
                let reuslt = false
                if (this.$route.query.from === 'culture') {
                    reuslt = true
                }
                return reuslt
            },
            isFromHome() {
                let reuslt = false
                if (this.$route.query.from === 'home') {
                    reuslt = true
                }
                return reuslt
            }
        },
        created() {
            //判断是否推荐新闻
            // if (this.$route.query.type == 5) {
            //     this.getRecomendList()
            // } else {
            //     this.getCateNewsList()
            // }
            this.getCateNewsList()
        },
        mounted() {
            analyse('进入页面')
        },
        methods: {
            viewOaNews(){
              window.open(`${process.env.VUE_APP_OA_URL}/sys/news/index.jsp?j_module=true#cri.q=docStatus%3A30`,'_blank')
            },
            // getMediaPerspective(){
            //     let start = '', end = '';
            //     if (this.filterForm.startTime && this.filterForm.endTime) {
            //         start = this.filterForm.startTime
            //         end = this.filterForm.endTime
            //         start = formatDate(start, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
            //         end = formatDate(end, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
            //     }
            //     let params = {
            //         Pageno: this.pageIndex,
            //         Rowsize: this.pageSize,
            //         StartTime: start,
            //         EndTime: end,
            //         KeyWord: this.filterForm.keyword
            //     }
            //     API.news.getMediaPerspective(params).then(res => {
            //         this.listLoading = false
            //         if (res.data.code === 200) {
            //             this.list = res.data.data.items || []
            //             this.totalCount = res.data.data.totalCount
            //         }
            //     }).catch(_ => {
            //         this.listLoading = false
            //     })
            // },
            handleJump(){
                if(this.$route.query.from === 'culture'){
                  this.$router.push(`/culture?id=${this.$route.query.id}&sid=6`)
                }else{
                  this.$router.push(`/news?id=${this.$route.query.id}&sid=1`)
                }
            },
            sortList({ column, prop, order }) {
                console.log(order)
                if(prop === 'time') {
                    //时间排序
                    this.orderby = (this.isCulture && this.tabIndex == 4) ? 'docPublishTime' : 'docPublishTime;docAlterTime'
                }
                if(prop === 'click') {
                    //点击率排序
                    this.orderby = (this.isCulture && this.tabIndex == 4) ? 'docHits' :  'docReadCount'
                }
                if(order === 'ascending') {
                    //升序
                    this.orderType = 'up'
                }else if(order === 'descending') {
                    //降序
                    this.orderType = 'down'
                }else {
                    this.orderType = 'down'
                    this.orderby = (this.isCulture && this.tabIndex == 4) ? '' :  'fdIsTop;fdTopTime;docPublishTime;docAlterTime'
                }

                //判断是否推荐新闻
                if(this.tabIndex != 6) {
                    this.getCateNewsList()
                }else{
                    this.getRecomendList()
                }
            },
            //跳转OA新闻详情
            viewDetail(item) {
                if(this.isCulture && this.tabIndex == 4) {
                    if(item.catehref.indexOf('http') > -1){
                        window.open(`${item.catehref}`, '_blank');
                    }else{
                        window.open(`${process.env.VUE_APP_OA_URL}/${item.catehref}`, '_blank');
                    }
                }else{
                    if(item.href.indexOf('http') > -1){
                        window.open(`${item.href}`, '_blank');
                    }else{
                        window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank');
                    }
                }
                item.showNewIcon = false
            },
            //切换左侧导航栏
            changeTab(index) {
                this.tabIndex = index
                this.pageIndex = 1

                this.filterForm = {startTime: '', endTime: '', keyword: ''}
                this.requestParams = {startTime: '', endTime: '', keyword: ''}
                this.getCateNewsList()
            },
            handleSearch() {
                this.pageIndex = 1
                this.requestParams.keyword = this.filterForm.keyword
                this.requestParams.startTime = this.filterForm.startTime
                this.requestParams.endTime = this.filterForm.endTime
                this.getCateNewsList()
            },
            //分类新闻
            getCateNewsList() {
                /**
                 * 新闻分类ID 党建介绍：15fc7cdfb67bdd9bb3188d04a28b90c6 企业大学：16951aef596dc2ea47f2b064bf997565 集团新闻：15ea7ba8183a6afc980bb6c4d639bfb3 奥园党建：15f053c140f7f9b00ed3bfe455b903a2 产业新闻: 1781ab3a9ffb0578829593c49038ef6e
                 * @type {{Orderby: string, Rowsize: string, DocStatus: string, DocSubject: string, Ordertype: string, DocPublishTime: string, FdDepartment: string, Pageno: string, DocCategory: string, FdImportance: string, J_path: string, token: string}}
                 */
                this.listLoading = true
                let DocCategory = ''
                if ( this.isCulture ) {
                    if(this.tabIndex == 1) {
                        DocCategory = this.cateDnewsId
                    }else if (this.tabIndex == 2) {
                        DocCategory = this.cateCollegeId
                    }else if (this.tabIndex == 3) {
                        DocCategory = this.cateDintroductionId
                    }else if (this.tabIndex == 4) {
                        DocCategory = this.cateFollowId
                    } else if ( this.tabIndex == 5 ) {
                        DocCategory = this.homebuyersId
                    }
                } else {
                    if(this.tabIndex == 1) {
                        //媒体看奥园
                        // this.getMediaPerspective()
                        // return
                        DocCategory = this.cateWatchId
                    }else if (this.tabIndex == 2) {
                        DocCategory = this.cateDnewsId
                    }else if (this.tabIndex == 3) {
                        DocCategory = this.cateGloryId
                    }else if (this.tabIndex == 4) {
                        DocCategory = this.cateCollegeId
                    }else if (this.tabIndex == 5) {
                        DocCategory = this.cateGroupId
                    }else if (this.tabIndex == 7) {
                        DocCategory = ''
                    }else if (this.tabIndex == 8) {
                        DocCategory = this.industryId
                    }
                }
                let DocPublishTime = '', start = '', end = ''
                if (this.filterForm.startTime && this.filterForm.endTime) {
                    start = this.filterForm.startTime
                    end = this.filterForm.endTime
                    start = formatDate(start, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
                    end = formatDate(end, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
                    DocPublishTime = `${start},${end}`
                }

                let params = {
                    DocCategory,
                    DocPublishTime,
                    DocStatus: '30',
                    DocSubject: this.filterForm.keyword,
                    FdDepartment: '',
                    FdImportance: this.filterForm.important,
                    J_path: '/allNews',
                    Orderby: this.orderby,
                    Ordertype: this.orderType,
                    Pageno: this.pageIndex,
                    Rowsize: this.pageSize,
                    token: localStorage.getItem('token') || ''
                }
                if ( this.isCulture && this.tabIndex == 4 ) {
                    // 雇主品牌
                    params = {
                        fdCategoryId: DocCategory,
                        showIntroduced: true,
                        newsTag: '雇主新闻',
                        pageNo: this.pageIndex,
                        pageSize: this.pageSize,
                        sortPara: this.orderby,
                        sort: this.orderType,
                        eipDocSubject: this.filterForm.keyword,
                        publishStartTime: start,
                        publishEndTime: end,
                    }
                    API.news.employerBrand(params).then(res => {
                    this.listLoading = false
                    if (res.data.code === 200) {
                        this.list = res.data.data.data.list || []
                        this.totalCount = res.data.data.data.totalrows
                    }
                    }).catch(err => {
                        this.list = []
                        this.totalCount = 0
                    })
                    return
                } else if ( this.isCulture && this.tabIndex == 5 ) {
                    // 优惠购房列表
                    API.news.discountHomebuyersByPage(params, DocCategory).then(res => {
                        this.listLoading = false
                        if (res.data.code === 200) {
                            this.list = res.data.data.list || []
                            this.totalCount = res.data.data.totalrows
                        }
                    }).catch(err => {
                        this.list = []
                        this.totalCount = 0
                    })
                    return
                }
                API.news.getNewsCategoryPage(params).then(res => {
                    this.listLoading = false
                    if (res.data.code === 200) {
                        this.list = res.data.data.list || []
                        this.totalCount = res.data.data.totalrows
                    }
                }).catch(err => {
                    this.list = []
                    this.totalCount = 0
                })
            },
            //推荐新闻
            // getRecomendList() {
            //     /**
            //      * 新闻分类ID 党建介绍：15fc7cdfb67bdd9bb3188d04a28b90c6 企业大学：16951aef596dc2ea47f2b064bf997565 集团新闻：15ea7ba8183a6afc980bb6c4d639bfb3 奥园党建：15f053c140f7f9b00ed3bfe455b903a2
            //      * @type {{Orderby: string, Rowsize: string, DocStatus: string, DocSubject: string, Ordertype: string, DocPublishTime: string, FdDepartment: string, Pageno: string, DocCategory: string, FdImportance: string, J_path: string, token: string}}
            //      */
            //     this.listLoading = true
            //     let DocPublishTime = ''
            //     if (this.filterForm.startTime && this.filterForm.endTime) {
            //         let start = this.filterForm.startTime
            //         let end = this.filterForm.endTime
            //         start = formatDate(start, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
            //         end = formatDate(end, this.$i18n.locale==='zh-CN'?'yyyy-MM-dd':'MM/dd/yyyy')
            //         DocPublishTime = `${start},${end}`
            //     }
            //     let params = {
            //         DocPublishTime,
            //         DocStatus: '30',
            //         DocSubject: this.filterForm.keyword,
            //         FdDepartment: '',
            //         FdImportance: this.filterForm.important,
            //         FdIsTop: 1,
            //         J_path: '/allNews',
            //         Orderby: this.orderby,
            //         Ordertype: this.orderType,
            //         Pageno: this.pageIndex,
            //         Rowsize: this.pageSize,
            //         token: localStorage.getItem('token') || ''
            //     }
            //     API.news.getNewsRecomendPage(params).then(res => {
            //         this.listLoading = false
            //         if (res.data.code === 200) {
            //             this.list = res.data.data.list || []
            //             this.totalCount = res.data.data.totalrows
            //         }
            //     }).catch(err => {
            //         this.list = []
            //         this.totalCount = 0
            //     })
            // },
            handleSizeChange(v){
                this.pageSize = v
                this.pageIndex = 1
                this.getCateNewsList()
            },
            //切换分页
            handleCurrentChange(pageIndex) {
                this.filterForm.keyword = this.requestParams.keyword
                this.filterForm.startTime = this.requestParams.startTime
                this.filterForm.endTime = this.requestParams.endTime
                this.pageIndex = pageIndex
                this.getCateNewsList()
            },
            //切换摘要&列表
            toggleLayout() {
                this.layout = !this.layout
                // this.$nextTick(() => {
                //   let dom = this.$refs.table.$refs.bodyWrapper
                //   dom.style.height = this.layout ? (dom.clientHeight - dom.offsetTop)+'px': (dom.clientHeight +  dom.offsetTop)+'px'
                // })
            },
            // 获取页面名称
            getPageName() {
                return this.$refs.pageName.innerText + '列表页面'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .news-list {
        padding: 20px 0;
        //display: flex;
        //flex-direction: column;
        /*height: 100%;*/
        -ms-overflow-style: scrollbar;
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
            /*height: calc(100% - 40px);*/
            display: flex;
            padding-bottom: 20px;
            &__tab{
                /*scrollbar-width: none; !* firefox *!*/
                /*-ms-overflow-style: none; !* IE 10+ *!*/
                /*&::-webkit-scrollbar {*/
                /*    display: none; !* Chrome Safari *!*/
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
                &__header{
                    margin-bottom: 20px;
                    line-height: 60px;
                    border-bottom: 1px solid #e8e8e8;
                    text-align: left;
                }
                &__item{
                    width: 228px;
                    background: #fff;
                    line-height: 80px;
                    cursor: pointer;
                    text-align: left;
                    padding-left: 50px;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &.active{
                        color: #006E38;
                        background: #F2FBF7;
                    }
                }

                &__title {
                    position: relative;
                    top: 2px;
                }
                .iconEIP {
                    display: inline-block;
                    vertical-align: middle;
                }
            }

            &__main {
                /*overflow-y: auto;*/
                /*scrollbar-width: none; !* firefox *!*/
                /*-ms-overflow-style: none; !* IE 10+ *!*/
                /*&::-webkit-scrollbar {*/
                /*    display: none; !* Chrome Safari *!*/
                /*}*/
                flex: 1;
                min-width: 500px;
                background: #fff;
                border-radius: 5px;
                padding: 0 24px;

                &__filter {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #666;
                    height: 86px;
                    border-bottom: 1px solid #e8e8e8;
                    margin-bottom: 30px;

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

                &__table {
                    background: #fff;
                    .icon_top{
                        margin-right: 5px;
                    }
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
            font-size: 16px;
            color: #999;
            margin-top: 20px;
        }

    }

</style>
