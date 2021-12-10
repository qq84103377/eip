<template>
    <section class="culture-wrap">
        <div class="culture-wrap__top">
            <div class="culture-wrap__top__body">
                <div class="culture-wrap__top__body__banner">
                    <el-carousel :interval="5000" style="cursor: pointer" ref="carousel" arrow="always" indicator-position="none" @change="handleChange">
                        <el-carousel-item v-for="(item,index) in banner" :key="index">
                            <img class="banner-img" @click="viewLink(item)" :src="OA_URL + item.image" alt="">
                            <!--                            <img @click="viewLink(item)" class="banner-img" src="https://pick-oss.aomygod.com/pick/upload/20200708/a4c00dd0ac0349a886b002cd51c228bf.jpg" alt="">-->
                        </el-carousel-item>
                    </el-carousel>
                    <div class="swiper-indicator">
                        <!--                        <i style="cursor: pointer" class="iconEIP icon_arrow_left" @click="toggleBanner('prev')"></i>-->
                        <!-- <div class="swiper-indicator__text">
                            {{ curBannerIndex + 1 }}/{{ banner.length }} {{banner[curBannerIndex]?banner[curBannerIndex].text:''}}
                        </div> -->
                                               <div class="swiper-indicator__circle">
                                                   <div @click="toggleBanner(index)" :class="['swiper-indicator__circle__item',{active:curBannerIndex==index}]" v-for="(item,index) in banner" :key="index"></div>
                                               </div>
                                               <!-- <i style="cursor: pointer" class="iconEIP icon_arrow_right" @click="toggleBanner('next')"></i> -->
                    </div>
                </div>
                <div class="culture-wrap__top__body__culture">
                    <div class="culture-wrap__top__body__culture__header">
                        <div class="fs16 aic"><i class="iconEIP icon_enterprise" style="vertical-align: initial"></i> {{
                            $t("cultureMsg.aculture") }}
                        </div>
                        <div class="more-btn aic" @click="viewCultureDetail">{{ $t("publicMsg.more") }} <i
                                class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="culture-wrap__top__body__culture__ctn">
                        <div class="culture-cell">
                            <span class="culture-label">根基</span><span class="fs16">脚踏实地、不尚空谈，奋力拼搏、力争一流，踏踏实实办好企业</span>
                        </div>
<!--                        <div class="culture-cell">-->
<!--                            <span class="culture-label">使命</span><span class="fs16">迈进世界500强</span>-->
<!--                        </div>-->
<!--                        <div class="culture-cell">-->
<!--                            <span class="culture-label">愿景</span><span class="fs16">成为稳健经营的长寿企业</span>-->
<!--                        </div>-->
                        <div class="culture-cell">
                            <span class="culture-label">核心价值观</span><span class="fs16">高效、诚信、责任、共赢</span>
                        </div>
                        <div class="culture-cell">
                            <span class="culture-label">品牌理念</span><span class="fs16">构筑健康生活</span>
                        </div>
                        <div class="culture-cell">
                            <span class="culture-label">经营理念</span><span class="fs16">客户至上、业绩至上、效益至上</span>
                        </div>
                        <div class="culture-cell">
                            <span class="culture-label">人才理念</span><span class="fs16">以人为本、德才兼备、崇尚奋斗、业绩导向</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="culture-wrap__main">
            <div class="culture-wrap__main__left">
                <!--                党建介绍-->
                <div class="group-list">
                    <div class="group-list__header">
                        <div class="aic fs16"><i class="iconEIP icon_clique mr5"></i> {{ $t("cultureMsg.dintroduction") }}</div>
                        <div class="more-btn aic" @click="viewMore(3)">{{ $t("publicMsg.more") }} <i
                                class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="group-list__body" v-if="lists.partyIntro.length">
                        <div v-for="(item,index) in lists.partyIntro" :key="index" class="list-item">
                            <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :href="viewDetail(item)" :class="!item.showNewIcon?'ellipsis mw737 visited':'ellipsis mw737'" :title="item.docSubject">{{item.docSubject}}</a>
                                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
                            </div>
                            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd')}}</div>
                        </div>
                    </div>
                    <div class="group-list__body" v-else>
                        <div v-for="a in 6" :key="a" class="list-item">
                            <div :class="['list-item__ctn','skeleton-news',{loading: partyLoading}]"></div>
                            <div :class="['list-item__date','skeleton-news',{loading: partyLoading}]"></div>
                        </div>
                    </div>
                </div>
                <!--                奥园党建-->
                <div class="group-list">
                    <div class="group-list__header">
                        <div class="aic fs16"><i class="iconEIP icon_party mr5"></i> {{ $t("cultureMsg.dnews") }}</div>
                        <div class="more-btn aic" @click="viewMore(1)">{{ $t("publicMsg.more") }} <i
                                class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="group-list__body" v-if="lists.partyNews.length">
                        <div v-for="(item,index) in lists.partyNews" :key="index" class="list-item">
                            <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :href="viewDetail(item)" :class="!item.showNewIcon?'ellipsis mw737 visited':'ellipsis mw737'" :title="item.docSubject">{{item.docSubject}}</a>
                                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
                            </div>
                            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd')}}</div>
                        </div>
                    </div>
                    <div class="group-list__body" v-else>
                        <div v-for="a in 6" :key="a" class="list-item">
                            <div :class="['list-item__ctn','skeleton-news',{loading: newsLoading}]"></div>
                            <div :class="['list-item__date','skeleton-news',{loading: newsLoading}]"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="culture-wrap__main__right">
                <!--                企业大学-->
                <div class="group-list">
                    <div class="group-list__header">
                        <div class="aic fs16"><i class="iconEIP icon_college mr5"></i> {{ $t("cultureMsg.college") }}</div>
                        <div class="more-btn aic" @click="viewMore(2)">{{ $t("publicMsg.more") }} <i
                                class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="group-list__body" v-if="lists.college.length">
                        <div v-for="(item,index) in lists.college" :key="index" class="list-item">
                            <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :href="viewDetail(item)" :class="!item.showNewIcon?'ellipsis mw737 visited':'ellipsis mw737'" :title="item.docSubject">{{item.docSubject}}</a>
                                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
                            </div>
                            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd')}}</div>
                        </div>
                    </div>
                    <div class="group-list__body" v-else>
                        <div v-for="a in 6" :key="a" class="list-item">
                            <div :class="['list-item__ctn','skeleton-news',{loading: collegeLoading}]"></div>
                            <div :class="['list-item__date','skeleton-news',{loading: collegeLoading}]"></div>
                        </div>
                    </div>
                </div>
                <!--                雇主品牌-->
                <div class="group-list">
                    <div class="group-list__header">
                        <div class="aic fs16"><i class="iconEIP icon_followup mr5"></i> {{ $t("cultureMsg.follow") }}</div>
                        <div class="more-btn aic" @click="viewMore(4)">{{ $t("publicMsg.more") }} <i
                                class="iconEIP icon_more"></i></div>
                    </div>
                    <div class="group-list__body" v-if="lists.follow.length">
                        <div v-for="(item,index) in lists.follow" :key="index" class="list-item">
                            <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :href="viewFollowDetail(item)" :class="!item.showNewIcon?'ellipsis mw737 visited':'ellipsis mw737'" :title="item.eipDocSubject || item.docSubject">{{item.eipDocSubject || item.docSubject}}</a>
                                <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                                <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
                            </div>
                            <div class="list-item__date">{{ item.publishTime}}</div>
                        </div>
                    </div>
                    <div class="group-list__body" v-else>
                        <div v-for="a in 6" :key="a" class="list-item">
                            <div :class="['list-item__ctn','skeleton-news',{loading: followLoading}]"></div>
                            <div :class="['list-item__date','skeleton-news',{loading: followLoading}]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import {analyse} from '@utils/analyse'
    import API from '@api'

    export default {
        name: "Index",
        data() {
            return {
                curBannerIndex: 0,
                banner: [],
                //奥园党建 15f053c140f7f9b00ed3bfe455b903a2， 企业大学 16951aef596dc2ea47f2b064bf997565， 党建介绍 15fc7cdfb67bdd9bb3188d04a28b90c6
                // cateIds: [{id:'15f053c140f7f9b00ed3bfe455b903a2',name:'partyNews'},{id:'16951aef596dc2ea47f2b064bf997565',name:'college'},{id:'15fc7cdfb67bdd9bb3188d04a28b90c6',name:'partyIntro'}],
                lists:{
                    partyNews: [],//奥园党建
                    partyIntro: [], //党建介绍
                    college: [], //企业大学
                    follow: [], //雇主品牌
                },
                partyLoading: false,
                followLoading: false,
                newsLoading: false,
                collegeLoading: false,
            }
        },
        computed: {
            OA_URL(){
                return process.env.VUE_APP_OA_URL
            },
            docCategoryIds() {
                return window.SITE_CONFIG.docCategoryIds
            },
            cateDnewsId() {
                return this.docCategoryIds.dnews.catId
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
        },
        created(){
            this.getCateNewsList(this.cateDintroductionId,'partyIntro', 'partyLoading')
            this.getCateNewsList(this.cateCollegeId,'college', 'collegeLoading')
            this.getCateNewsList(this.cateDnewsId,'partyNews', 'newsLoading')
            this.getFollowUp()
        },
        mounted() {
            analyse()
            this.getSwipe()
        },
        methods: {
            handleRead(item){
                if(item.showNewIcon){
                    item.showNewIcon = false;
                }
            },
            viewMoreFollow(){
                window.open(this.OA_URL + '/km/doc/?categoryId=15f05303eb24fd664fc09e54b9c873d0#j_path=%2FdocCategory&docCategory=15f05303eb24fd664fc09e54b9c873d0', '_blank')
            },
            //跳转OA雇主品牌详情
            viewFollowDetail(item) {
                if(item.catehref.indexOf('http') > -1){
                    return item.catehref
                }else{
                    return `${process.env.VUE_APP_OA_URL}/${item.catehref}`
                }
                // window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank')
            },
            viewCultureDetail(){
                let routeData = this.$router.resolve({ path: '/cultureDetail', query: {id: this.$route.query.id, sid: this.$route.query.sid}});
                window.open(routeData.href, '_blank');
            },
            //跳转OA新闻详情
            viewDetail(item) {
                if(item.href.indexOf('http') > -1) {
                    return item.href
                }else{
                    return `${process.env.VUE_APP_OA_URL}${item.href}`
                }
                // window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank')
            },
            getFollowUp(){
                this.followLoading = true
                let params = {
                    fdCategoryId: this.cateFollowId,
                    showIntroduced: true,
                    newsTag: '雇主新闻',
                    pageNo: '1',
                    pageSize: '6',
                }
                API.news.employerBrand(params).then(res => {
                    this.followLoading = false
                    if (res.data.code === 200) {
                        this.lists.follow = res.data.data.data.list || []
                    }
                }).catch(_ => {
                    this.followLoading = false
                })
            },
            getNews(v){
                let params = {
                    cateId:v.id,
                    rowSize: 6,
                }
                API.culture.getCultureNews(params).then(res => {
                    if (res.data.code === 200) {
                        this.lists[v.name] = res.data.data || []
                    }
                })
            },
            //分类新闻
            getCateNewsList(DocCategory,name, loading) {
                this[loading] = true
                let params = {
                    DocCategory,
                    DocStatus: '30',
                    FdDepartment: '',
                    J_path: '/allNews',
                    Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
                    Ordertype: 'down',
                    Pageno: 1,
                    Rowsize: 6,
                }
                API.news.getNewsCategoryPage(params).then(res => {
                    this[loading] = false
                    if (res.data.code === 200) {
                        this.lists[name] = res.data.data.list || []
                    }
                }).catch(err => {
                    this[loading] = false
                    this.lists[name] = []
                })
            },
            //大轮播图左右箭头切换
            toggleBanner(idx) {
                this.$refs['carousel'].setActiveItem(idx)
            },
            viewLink(item) {
                if (item.href) {
                    if (item.href.substr(0, 4) === 'http') {
                        window.open(item.href, '_blank')
                    } else {
                        window.open(this.OA_URL + item.href, '_blank')
                    }
                }
            },
            handleChange(index) {
                this.curBannerIndex = index
            },
            getSwipe() {
                let params = {
                    pageId: '15e5b0bd95f04b890202a0143b089016'
                }
                API.culture.getCultureSwipe(params).then(res => {
                    if (res.data.code === 200) {
                        this.banner = res.data.data || []
                    }
                })
            },
            viewMore(type) {
                this.$router.push(`/newsList?type=${type}&from=culture&id=${this.$route.query.id}&sid=6`)
                // let routeData = this.$router.resolve(`/newsList?type=${type}&from=culture&id=${this.$route.query.id}&sid=6`);
                // window.open(routeData.href, '_blank');
            },
        }
    }
</script>

<style lang="scss" scoped>
    .culture-wrap {
        padding: 30px;
        background: #fff;

        &__top {
            margin-bottom: 30px;

            &__body {
                display: flex;

                &__banner {
                    flex: 0 0 1046px;
                    height: 420px;
                    margin-right: 20px;
                    position: relative;

                    .banner-img {
                        width: 100%;
                        height: 100%;
                    }

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

                &__culture {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 0 14px;
                    border: 1px solid #e8e8e8;

                    &__header {
                        flex: 0 0 52px;
                        line-height: 52px;
                        height: 52px;
                        border-bottom: 1px solid #e8e8e8;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 24px;
                    }

                    &__ctn {
                        font-size: 18px;
                        color: #333;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        text-align: left;

                        .culture-cell{
                            display: flex;
                        }
                        .culture-label {
                            font-weight: bold;
                            flex: 0 0 150px;
                            width: 150px;
                            display: inline-block;

                            &::before {
                                content: '';
                                display: inline-block;
                                width: 3px;
                                height: 17px;
                                background: #006e38;
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }
        }

        &__main {
            display: flex;

            &__left {
                flex: 1;
            }

            &__right {
                flex: 1;
                margin-left: 20px;
            }

            .group-list {
                border: 1px solid #e8e8e8;
                padding: 0 14px;
                margin-bottom: 30px;
                height: 312px;

                &:last-child {
                    margin-bottom: 0;
                }

                &__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    line-height: 52px;
                    border-bottom: 1px solid #e8e8e8;
                }

                &__body {
                    padding: 14px 0;
                }
            }
        }

        .list-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 18px;
            color: #333;

            &__ctn {
                text-align: left;
                line-height: 40px;
                display: flex;
                align-items: center;
                &.skeleton-news{
                    width: 500px;
                    height: 25px;
                    margin-bottom: 15px;
                    background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                    list-style: none;
                    background-size: 400% 100%;
                    background-position: 100% 50%;
                }
                a{
                    color: #333;
                    &.visited{
                        color: #999;
                    }
                    // &:visited {
                    //     color: #999;
                    // }
                }
                .ellipsis {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 560px;
                }

                .new-tag {
                    color: #F07E69;
                    font-size: 14px;
                    border: 1px solid #F07E69;
                    border-radius: 2px;
                    padding: 0 4px;
                    vertical-align: top;
                    margin-left: 8px;
                    height: 16px;
                    line-height: 16px;
                }

                .orange {
                    color: #F07E69;
                }
            }

            &__date {
                font-size: 18px;
                color: #999;
                margin-left: 10px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                &.skeleton-news{
                    width: 100px;
                    height: 25px;
                    margin-bottom: 15px;
                    background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
                    list-style: none;
                    background-size: 400% 100%;
                    background-position: 100% 50%;
                }
            }
        }

        .more-btn {
            font-size: 14px;
            color: #999;
            cursor: pointer;
        }

        .mw737 {
            max-width: 580px !important;
        }
        .loading{
            animation: skeleton-loading 1.4s ease infinite;
        }
        @keyframes skeleton-loading {
            0% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0 50%;
            }
        }
    }
</style>
<style lang="scss">
    .culture-wrap__top__body__banner{
        .el-carousel__arrow--left{
            left: 0;
            border-radius: 0;
            height: 64px;
            width: 36px;
            .el-icon-arrow-left{
                font-size: 30px;
            }
        }
        .el-carousel__arrow--right{
            right: 0;
            border-radius: 0;
            height: 64px;
            width: 36px;
            .el-icon-arrow-right{
                font-size: 30px;
            }
        }
    }
</style>
