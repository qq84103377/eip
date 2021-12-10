<template>
  <section class="home-page-wrap">
<!--    <iframe style="display: none" id="iframe"></iframe>-->
    <div style="display: flex">
      <div class="home-page-wrap__left">
        <div class="home-page-wrap__left__news">
          <div class="home-page-wrap__left__news-header">
            <div class="home-page-wrap__left__news-header-title">
              <el-badge @click.native="viewHomeNews" slot="reference" :value="newsInfoNum" :max="99" class="badge">
                <div @click="viewHomeNews" style="position: relative;cursor:pointer"><i class="iconEIP icon_news"></i> {{ newsTitle() }} </div>
              </el-badge>
              <div class="pop__count__main" @click="viewHomeNews" v-if="showNewsInfoTips">
                <div class="pop__count__main__item">
                  <span>{{$t("homeMsg.rtw")}} {{newsReadInfoData.read || 0}}{{$i18n.locale === 'zh-CN' ? '条' : ''}} | {{$t("homeMsg.unread")}} {{newsInfoUnreadNum}}{{$i18n.locale === 'zh-CN' ? '条' : ''}} | {{newsInfoReadPercent}}</span>
                </div>
                <div class="pop__count__main__close">
                  <img @click.stop="clickedCloseNewsInfo = false" class="close-btn" src="../../assets/images/icon_close.png">
                </div>
              </div>
            </div>
            <div class="aic">
<!--              <div class="news-edit" v-if="oahomenews" @click="newsEdit"><i class="iconEIP icon_news_edit"></i>新闻编辑</div>-->
              <div class="more-btn aic" @click="viewMoreNews">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
            </div>
          </div>
          <div class="home-page-wrap__left__news-body">
            <div class="home-page-wrap__left__news-body__banner">
              <el-carousel ref="carouselRef" :interval="5000" indicator-position="none" arrow="always" @change="handleChange">
                <el-carousel-item v-if="banner.length" v-for="(item, index) in banner" :key="index" @click="goToNewsDetail(item)">
                  <div style="width: 100%;height: 100%;cursor: pointer" @click="goToNewsDetail(item)"><img @error="handleError" class="banner-img" :src="item.isEipVideo ? (item.eipImage || item.image) : (OA_URL + (item.eipImage || item.image))"></div>
                  <i v-if="item.isEipVideo" class="iconEIP icon_new_play" @click="goToNewsDetail(item)"></i>
                </el-carousel-item>
                <el-carousel-item v-if="!banner.length">
                  <img class="banner-img" src="../../assets/images/default_img_2@1x.jpg">
                </el-carousel-item>
              </el-carousel>
              <div class="swiper-indicator">
                <!--                            <i style="cursor: pointer" class="iconEIP icon_arrow_left" @click="toggleBanner('prev')"></i>-->
                <div class="swiper-indicator__text">
                  {{ banner.length ? currentBannerIndex + 1 : 0 }}/{{ banner.length }} {{ banner[currentBannerIndex] ? banner[currentBannerIndex].text:'' }}
                </div>
                <!--                            <div class="swiper-indicator__circle">-->
                <!--                                <div @click="toggleBanner(index)" :class="['swiper-indicator__circle__item',{active:currentBannerIndex==index}]" v-for="(item,index) in banner" :key="index"></div>-->
                <!--                            </div>-->
                <!--                            <i style="cursor: pointer" class="iconEIP icon_arrow_right" @click="toggleBanner('next')"></i>-->
              </div>
            </div>
            <div class="home-page-wrap__left__news-body__list" v-if="newsList.length">
              <div v-for="(item, index) in newsList" :key="index" class="list-item">
                <div class="list-item__ctn"><a @click="handleRead(item)" target="_blank" :title="item.eipDocSubject || item.docSubject" :class="!item.showNewIcon?'ellipsis lh30 visited':'ellipsis lh30'">{{ item.eipDocSubject || item.docSubject }}</a>
                  <i v-if="item.isEipVideo" class="iconEIP icon_video"></i>
                  <i v-else-if="item.showNewIcon" class="iconEIP icon_unread"></i>
                  <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
                </div>
                <div class="list-item__date">{{ newsDate(item.docPublishTime) }}</div>
              </div>
            </div>
            <div class="home-page-wrap__left__news-body__list" v-else>
              <div v-for="item in 8" :key="item" class="list-item lh30">
                <div :class="['list-item__ctn','skeleton',{loading:newsLoading}]"></div>
                <div :class="['list-item__date','skeleton',{loading:newsLoading}]"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-page-wrap__left__notice">
          <div class="home-page-wrap__left__notice-header">
            <div class="notice-tab">
              <div v-for="(item,index) in noticeTabList" :key="index" :title="noticeTabListName(index)"
                   :class="['notice-tab__item',{active:item.active}]" @click="toggleNotice(item, index)"><span>{{ noticeTabListName(index) }}</span>
              </div>
            </div>
            <div class="more-btn aic" @click="hanldeClickNoticeMore">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
          </div>
          <div class="home-page-wrap__left__notice-body">
            <!--通知公告-->
              <div v-for="(item,index) in noticeData" :key="index" class="list-item">
                <div class="list-item__ctn lh50">
                  <span class="orange" @click.stop="viewOaCate(item.cateName)">[{{item.cateName}}]</span>
<!--                  <a target="_blank" :href="oaNoticeLink(item.href)" class="ellipsis mw1000" :title="item.docSubject">{{ item.docSubject }}</a>-->
                  <a target="_blank" @click="oaNoticeLink(item)" class="ellipsis mw1000" :title="item.docSubject">{{ item.docSubject }}</a>
                  <i v-if="item.showNewIcon" class="iconEIP icon_new_tag"></i>
                </div>
                <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
              </div>
<!--            骨架屏-->
            <div v-show="noticeLoading">
              <div v-for="a in 11" :key="a" class="list-item">
                <div :class="['list-item__ctn','skeleton-notice',{loading:noticeLoading}]"></div>
                <div :class="['list-item__date','skeleton-notice',{loading:noticeLoading}]"></div>
              </div>
            </div>
<!--            空提示-->
            <div class="notice-empty" v-if="!noticeData.length && !noticeLoading">
              <div class="notice-empty-img">
                <img src="@/assets/images/news-none.png">
              </div>
              <div class="notice-empty-tips">暂无内容</div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-page-wrap__right">
        <div class="home-page-wrap__right__process">
          <div class="home-page-wrap__right__process-header">
            <div class="process-tab" :class="{en: $i18n.locale == 'en-US'}">
              <div v-for="(item,index) in processTabList" :key="index" v-if="$i18n.locale == 'zh-CN' || ($i18n.locale == 'en-US' && index < 2) " :class="['process-tab__item']" @click="toggleProcess(item,index)">
                <div>{{ processTabListName(index) }}</div>
                <div :class="['num',index===0 && item.num>0?'red':'']">{{ index > 1 ? '' : (item.num > 99 ? '99+' : item.num) }}</div>
              </div>
            </div>
            <div class="more-btn aic mb40" @click="viewWorkBench(0)">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
          </div>
          <div class="home-page-wrap__right__process-body">
            <div class="list-item fs14">
              <div class="list-item__ctn lh38">{{ $t("homeMsg.title") }}</div>
              <div class="list-item__date fs14">{{ $t("homeMsg.rtime") }}</div>
            </div>
            <div v-for="(item,index) in processList" :key="index" class="list-item fs14">
              <div class="list-item__ctn lh38">
                <div @click="goOaDetail(item)" class="ellipsis mw270 oa-item" :title="item.fdSubject">{{ item.fdSubject }}</div>
              </div>
              <div class="list-item__date">{{ item.fdCreateTime * 1 | formatDate('yyyy.MM.dd') }}</div>
            </div>
            <div class="list-none" v-if="!processList || processList.length == 0">
              <div class="list-none-img">
                <img src="@/assets/images/icon_process_list_none.png" class="no-meeting">
              </div>
              <div class="list-none-tips">您&nbsp;&nbsp;<span style="color: #FF6600;font-weight: bold">没有</span>&nbsp;&nbsp;需处理的待办</div>
              <div class="list-none-tips">喝杯咖啡休息一下吧!</div>
            </div>
          </div>
        </div>
        <div class="home-page-wrap__right__meeting">
          <div class="home-page-wrap__right__meeting-header">
            <div style="cursor: pointer" @click="handleClickMettingMore(0)"><i class="iconEIP icon_meetings"></i> {{ $t("homeMsg.meetingInfo") }}(<span style="color: red">{{meetingCount}}</span>)</div>
            <div class="more-btn aic" @click="handleClickMettingMore(1)">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
          </div>
          <div class="home-page-wrap__right__meeting-body">
            <div class="mb10">
              <DatePanel v-model="meetingDate" :metting-sel="mettingListTips" @change="onChangeDate"></DatePanel>
            </div>
            <div v-for="(item, index) in meetingData" :key="index" class="list-item meeting-wrap fs14" @click="goOaMeetting(item.href)">
              <!--                    <div class="list-item__ctn lh32"><span :class="['ellipsis mw280',{red: handleRed(item)}]" :title="item.title">{{ item.title }}</span></div>-->
              <!--                    <div class="list-item__date mw100 ellipsis" :title="item.fdPlaceName" style="color:#333333">{{ item.fdPlaceName }}</div>-->
              <div class="meeting_time">
                <div>{{item.start | formatDate('hh:mm')}}</div>
                <div>~</div>
                <div>{{item.end | formatDate('hh:mm')}}</div>
              </div>
              <div class="meeting_divider"></div>
              <div class="meeting_info">
                <div :class="['meeting_info__title']" :title="item.title">{{item.title}}</div>
                <div class="meeting_info__local" :title="item.fdPlaceName">{{ item.fdPlaceName }}</div>
              </div>
              <div class="meeting_user">{{item.creator}}</div>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center" v-if="!meetingData.length">
              <img class="no-meeting" src="@/assets/images/no-meeting.png" alt="">
              <span style="color: #999;" class="fs14">暂无会议邀请</span>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--长条banner-->
    <div class="home-page-wrap__banner">
      <el-carousel ref="carousel-b" arrow="never" :interval="5000" indicator-position="none" @change="handleChangeB">
        <el-carousel-item v-for="(item,index) in longBanner" :key="index">
          <img @click="viewBannerLink(item.url)" class="banner-img" :src="item.image" alt="">
        </el-carousel-item>
      </el-carousel>
      <div class="home-page-wrap__banner__indicator">
        <div v-for="(item,index) in longBanner" :key="index" :class="{active: curBannerIndexB === index}" @click="changeCarousel(index)">{{ index+1
          }}
        </div>
      </div>
    </div>
    <div class="home-page-wrap__bottom">
      <!--        媒体看澳元-->
      <div class="home-page-wrap__bottom__buyhouse">
        <div class="home-page-wrap__bottom__buyhouse__header">
          <div><i class="iconEIP icon_look"></i> {{ $t("newsMsg.watch") }}</div>
                                  <div class="more-btn aic" @click="viewOaBuyHouse">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
        </div>
        <div class="home-page-wrap__bottom__buyhouse__body" v-if="mediaWatchList.length">
          <div v-for="(item,index) in mediaWatchList" :key="index" class="list-item">
            <div class="list-item__ctn lh40">
              <a target="_blank" style="cursor: pointer" @click="oaWatchLink(item)" :class="!item.showNewIcon?'ellipsis mw500 visited':'ellipsis mw500'" :title="item.docSubject">{{ item.docSubject }}</a>
              <i v-if="item.showNewIcon" class="iconEIP icon_unread"></i>
              <i v-else-if="!item.showNewIcon" class="iconEIP icon_readed"></i>
            </div>
            <div class="list-item__date">{{ item.docPublishTime * 1 | formatDate('yyyy.MM.dd') }}</div>
          </div>
        </div>
        <div class="home-page-wrap__bottom__buyhouse__body pdt10" v-else>
          <div v-for="a in 11" :key="a" class="list-item">
            <div :class="['list-item__ctn','skeleton-buy',{loading:mediaWatchLoading}]"></div>
            <div :class="['list-item__date','skeleton-buy',{loading:mediaWatchLoading}]"></div>
          </div>
        </div>
      </div>
      <!--        专题推荐-->
      <div class="home-page-wrap__bottom__special">
        <div class="home-page-wrap__bottom__special-header">
          <div><i class="iconEIP icon_special"></i> {{ $t("homeMsg.special") }}</div>
          <div class="more-btn aic" @click="viewSpecialList('')">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
        </div>
        <div class="home-page-wrap__bottom__special-body">
<!--          <div @click="viewSpecialList(item.id)" class="home-page-wrap__bottom__special-body__img" v-if="index<2" v-for="(item,index) in specialList" :key="index">-->
<!--            <img :src="item.image" />-->
<!--            <div class="home-page-wrap__bottom__special-body__img__text">{{item.name}}</div>-->
<!--          </div>-->

          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide swiper-no-swiping" :data-id="item.id" v-for="(item,index) in specialList" :key="index">
                <div class="home-page-wrap__bottom__special-body__img">
                  <img :src="item.image" />
                  <div class="home-page-wrap__bottom__special-body__img__text">{{item.name}}</div>
                </div>
              </div>
            </div>
          </div>

<!--          <swiper class="swiper" :options="swiperOption" v-if="specialList.length">-->
<!--            <swiper-slide v-for="(item,index) in specialList" :key="index">-->
<!--              <div class="home-page-wrap__bottom__special-body__img">-->
<!--                <img :src="item.image" />-->
<!--                <div class="home-page-wrap__bottom__special-body__img__text">{{item.name}}</div>-->
<!--              </div>-->
<!--            </swiper-slide>-->
<!--          </swiper>-->


<!--                      <el-carousel style="width: 100%;height: 100%;cursor: pointer" :autoplay="false" type="card" indicator-position="none" direction="vertical" :interval="5000" arrow="never">-->
<!--                        <el-carousel-item v-for="(item,index) in specialList" :key="index">-->
<!--                          <div @click="viewSpecialList(item.id)" class="home-page-wrap__bottom__special-body__img">-->
<!--                            <img :src="item.image" />-->
<!--                            <div class="home-page-wrap__bottom__special-body__img__text">{{item.name}}</div>-->
<!--                          </div>-->
<!--                        </el-carousel-item>-->
<!--                      </el-carousel>-->
        </div>
      </div>
      <div class="home-page-wrap__bottom__honor">
        <div class="home-page-wrap__bottom__honor-header">
          <div><i class="iconEIP icon_honor"></i> {{ $t("homeMsg.aoyuanren") }}</div>
          <div class="more-btn aic" @click="$router.push('/publication')">{{ $t("publicMsg.more") }} <i class="iconEIP icon_more"></i></div>
        </div>
        <div v-analyse="{pageEvent:'点击'+$t('homeMsg.aoyuanren')}" class="home-page-wrap__bottom__honor-body" @click="$router.push('/publication')">
          <img @error="handleErrorPeople" :src="oyPeopleSrc()">
        </div>
      </div>

    </div>

    <div class="service-code">
      <div class="service-code__wrap">
        <div class="service-code__wrap__header"><i class="iconEIP icon_link mr5"></i>{{$t('homeMsg.link')}}</div>
        <div class="service-code__wrap__body" style="flex-wrap: nowrap">
          <div class="url-group">
            <a href="https://www.aoyuan.com.cn" target="_blank">
              <img src="@/assets/images/url-image1.png" alt="">
              <div>奥园官网</div>
            </a>
          </div>
          <div class="url-group">
            <a href="http://www.aoyuanjksh.com/" target="_blank">
              <img src="@/assets/images/url-image4.png" alt="">
              <div>奥园健康</div>
            </a>
          </div>
          <div class="url-group">
            <a href="http://www.000615.com.cn/" target="_blank">
              <img src="@/assets/images/url-image5.png" alt="">
              <div>奥园美谷</div>
            </a>
          </div>
          <div class="url-group">
            <a href="http://www.aomygod.com/" target="_blank">
              <img src="@/assets/images/url-image2.png" alt="">
              <div>奥买家精选</div>
            </a>
          </div>
          <div class="url-group">
            <a target="_blank" :href="`${OA_URL}/sys/portal/sys_portal_page/sysPortalPage.do?method=view&fdId=1608c37d7b658f65071297942a091dd2`">
              <img src="@/assets/images/url-image3.jpg" alt="">
              <div>奥园榜单</div>
            </a>
          </div>

<!--            <div class="url-group" v-for="(item,idx) in linkQrCode.links" :key="idx">-->
<!--              <a target="_blank" :href="item.link">-->
<!--                <img :src="item.image" alt="">-->
<!--                <div>{{item.name}}</div>-->
<!--              </a>-->
<!--            </div>-->
        </div>
      </div>
      <div class="service-code__wrap">
        <div class="service-code__wrap__header"><i class="iconEIP icon_qrcode mr5"></i>{{$t('homeMsg.QRcode')}}</div>
        <div :class="['service-code__wrap__body',{fold:fold}]">
          <div class="code-group">
            <img src="@/assets/images/qrcode3.png" alt="">
            <div>奥园火炬</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode1.png" alt="">
            <div>奥园会</div>
          </div>
<!--          <div class="code-group">-->
<!--            <img src="@/assets/images/qrcode2.jpg" alt="">-->
<!--            <div>全民经纪人</div>-->
<!--          </div>-->
          <div class="code-group">
            <img src="@/assets/images/qrcode4.png" alt="">
            <div>AOoffice</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode5.png" alt="">
            <div>奥园官网</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode7.png" alt="">
            <div>奥园澳洲</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode9.png" alt="">
            <div>奥园行政</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode12.jpg" alt="">
            <div>交付与服务</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode13.jpg" alt="">
            <div>奥园人力资源</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode14.jpg" alt="">
            <div>奥园健康</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode15.jpg" alt="">
            <div>奥园健康生活</div>
          </div>
<!--          <div class="code-group">-->
<!--            <img src="@/assets/images/qrcode19.jpg" alt="">-->
<!--            <div>人才系统</div>-->
<!--          </div>-->
          <div class="code-group">
            <img src="@/assets/images/qrcode18.png" alt="">
            <div>奥园云行销</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode20.png" alt="">
            <div>奥园云客</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode17.png" alt="">
            <div>奥园移动销售</div>
          </div>
          <div class="code-group">
            <img src="@/assets/images/qrcode16.png" alt="">
            <div>奥园来访登记</div>
          </div>


<!--          <div class="code-group" v-for="(item,idx) in linkQrCode.qrCodes" :key="idx">-->
<!--            <img :src="item.image" alt="">-->
<!--            <div>{{item.name}}</div>-->
<!--          </div>-->
        </div>
        <div class="fold-btn" @click="fold = !fold">
          {{fold?$t('publicMsg.all'):$t('homeMsg.retract')}} <i :style="{transform: `rotateZ(${fold?'90':'270'}deg)`}" class="iconEIP icon_more"></i>
        </div>
      </div>
    </div>

    <el-dialog
            class="hj-return"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="hjReturnShow">
      <div class="hj-return-pop">
        <div class="hj-return-pop__header">
          <img class="hj-logo" src="../../assets/images/hj-logo.png" alt="">
          <div class="title">集团区域本年回款率排行榜单</div>
          <el-checkbox class="hj-checkbox" v-model="hjReturnPrompt" @change="hjReturnNoPrompt">七天内不再提醒</el-checkbox>
          <i class="el-icon-close" @click="hjReturnShow = false"></i>
        </div>
        <div class="hj-return-pop__body">
          <div class="table-wrap">
            <div class="table-wrap__title">后5区域</div>
            <div class="table-wrap__main">
              <div class="table-wrap__main__th">
                <div class="">序号</div>
                <div class="">区域组织</div>
                <div class="">综合回款率</div>
                <div class="">往年签约回款率</div>
                <div class="">今年签约回款率</div>
                <div class="">区域负责人</div>
              </div>
              <div class="table-wrap__main__tr" v-for="(item,idx) in hjReturnList.up.Data" :key="idx">
                <div class="">倒数{{idx + 1}}</div>
                <div class="">{{item.orgname}}</div>
                <div class="">{{((item.GetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{((item.OldGetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{((item.NewGetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{item.adusername}}</div>
              </div>
            </div>
          </div>
          <div class="table-wrap front">
            <div class="table-wrap__title">前5区域</div>
            <div class="table-wrap__main">
              <div class="table-wrap__main__th">
                <div class="">序号</div>
                <div class="">区域组织</div>
                <div class="">综合回款率</div>
                <div class="">往年签约回款率</div>
                <div class="">今年签约回款率</div>
                <div class="">区域负责人</div>
              </div>
              <div class="table-wrap__main__tr" v-for="(item,idx) in hjReturnList.top.Data" :key="idx">
                <div class="">第{{idx + 1}}</div>
                <div class="">{{item.orgname}}</div>
                <div class="">{{((item.GetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{((item.OldGetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{((item.NewGetAmountRate * 100 || 0)).toFixed(2)}}%</div>
                <div class="">{{item.adusername}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="hj-return-pop__footer">备注：按综合回款率排序，数据来源于火炬系统销售回款，统计时间截至昨日21点30分。</div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  /**
   * 生产环境
   * 1764aa239d72d27a9a4873d4f4f871db 媒体看澳元
   * 1764609f782d9bef4addc834addae3c6 奥园荣誉
   * 16951aef596dc2ea47f2b064bf997565 企业大学
   * uat环境
   * 1764ac59bb1d0013ebe118d473caec9b 媒体看澳元
   * 1764ac51e6a8206074ad73c491581020 奥园荣誉
   * 1764f8897076fa663428c4f4afb89dea 企业大学
   */
  import { mapState } from 'vuex'
  import 'swiper/dist/idangerous.swiper.css'
  import Swiper from 'swiper/dist/idangerous.swiper.js'
  import request from '@/api/request'
  import DatePanel from '@components/date-panel.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { formatDate } from '@utils'
  import { analyse } from '@utils/analyse'
  import API from '@api'
  import {watermark_show} from '@utils/watermask'
  export default {
    name: "Index",
    components: {
      DatePanel,
    },
    data() {
      return {
        hjReturnList: {up: {Data: []}, top: {Data: []}},
        hjReturnShow: false,
        hjReturnPrompt: false,
        fold: true,
        clickedCloseNewsInfo: true,
        meetingCount: 0,
        banner: [],
        currentBannerIndex: 0,
        noticeTabList: [
          {name: '全部', active: true},
          {name: '日常通知', active: false},
          {name: '会议纪要', active: false},
          {name: '人事任免', active: false},
          {name: '管理制度', active: false},
        ],
        noticeId: 0,
        processTabList: [
          {name: '待办', active: true, num: 0, value: 'todo'},
          {name: '待阅', active: false, num: 0, value: 'toview'},
          {name: '已办', active: false, num: 0, value: 'tododone'},
          {name: '已阅', active: false, num: 0, value: 'toviewdone'},
        ],
        noticeData: [],
        meetingDate: new Date(),
        meetingData: [],
        mettingListTips: [],
        newsList: [],
        quickApp: [],
        processList: [],
        activeType: 'todo',
        aoyuanPeopleData: {},
        specialList: [],
        meetingList: [], //会议纪要列表
        mediaWatchList: [], //优惠购房列表
        //开发环境
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
        curBannerIndexB: 0,
        longBanner: [], //长条banner
        newsReadInfoData: {},
        mediaWatchLoading: false,
        noticeLoading: false,
        newsLoading: false,
        timer: null,
        changeMonth: null,
        linkQrCode: {links: [], qrCode: []},
        isIE: false,
      }
    },
    computed: {
      ...mapState({
        oahomenews (state) {
          return state.user.permission.oahomenews;
        },
        userName(state) {
          return state.user.name
        }
      }),
      language(){
        return this.$i18n.locale
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
      processTabListName(index) {
        return (index) => {
          let name = ''
          switch (index) {
            case 0:
              name = this.$t("publicMsg.pending")
              break
            case 1:
              name = this.$t("publicMsg.unread")
              break
            case 2:
              name = this.$t("publicMsg.done")
              break
            case 3:
              name = this.$t("publicMsg.read")
              break
          }
          return name
        }
      },
      orginationCode() {
        let code = ''
        switch (Number(this.$route.query.id || 1)) {
          case 1:
            code = ''
            break
          case 2:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).jtzb
            break
          case 3:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).dc
            break
          case 4:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).sy
            break
          case 5:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).gj
            break
          case 6:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).jk
            break
          case 7:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).zb
            break
          case 8:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).wl
            break
          case 9:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).kj
            break
          case 10:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).cs
            break
          case 11:
            code = JSON.parse(process.env.VUE_APP_ORGIDS).mg
            break
        }
        return code
      },
      OA_URL() {
        return process.env.VUE_APP_OA_URL
      },
      docCategoryIds() {
        return window.SITE_CONFIG.docCategoryIds
      },
      cateWatchId() {
        return this.docCategoryIds.watch.catId
      },
      DataType() {
        return this.processTabList.find(v => v.active).value
      },
      currentCateId(){
        return this.categoryIds[[1,2,3,4,5,6,7,8,9,10,11].includes(Number(this.$route.query.id) || 0) ? this.$route.query.id : 1][this.noticeId]
      },
      newsInfoNum() {
        let num = '';
        if ( this.newsReadInfoData && this.newsReadInfoData.unread != undefined && this.newsReadInfoData.unread > 0 ) {
          let unread = this.newsReadInfoData.unread;
          num = unread;
        }
        return num;
      },
      newsInfoUnreadNum() {
        let num = 0;
        if ( this.newsReadInfoData && this.newsReadInfoData.unread != undefined ) {
          let unread = this.newsReadInfoData.unread;
          num = unread;
        }
        return num;
      },
      showNewsInfoTips() {
        let show = false;
        if ( this.clickedCloseNewsInfo ) {
          show = true;
        }
        return show;
      },
      newsInfoReadPercent() {
        let total = 0
        let percent = ''
        if ( this.newsReadInfoData ) {
          total = (this.newsReadInfoData.read || 0) + this.newsInfoUnreadNum
        }
        if ( total == 0 ) {
          percent = 100
        } else {
          percent = ((this.newsReadInfoData.read || 0) / total * 100).toFixed(0)
        }
        return this.$t("homeMsg.rp") + percent + '%'
      }
    },
    watch: {
      '$route.query.id': function (val) {
        this.groupTabIndex = val
        this.getNewsInfo()
        this.getCarousels()
        // if(this.noticeId !== 2){
          this.getNotices()
        // }else{
        //   this.getMeetingList()
        // }
      },
      userName: {
        handler(newV){
          if(newV){
            this.$nextTick(_ => {
              if(document.getElementsByClassName('hj-return-pop')[0]) {
                watermark_show({
                  watermark_txt: localStorage.profileName + '-' + newV,
                  watermark_x: 50,// 水印起始位置x轴坐标
                  watermark_y: 50,// 水印起始位置Y轴坐标
                  watermark_cols: 50,// 水印列数
                  watermark_rows: 50,// 水印行数
                  watermark_x_space: 120,// 水印x轴间隔
                  watermark_y_space: 120,// 水印y轴间隔
                  watermark_angle: 30,// 水印倾斜度数
                  watermark_alpha: 0.2,// 水印透明度
                  watermark_dom: document.getElementsByClassName('hj-return-pop')[0],
                  watermark_position: 'absolute',
                });
              }
            })
          }
        },
        immediate: true
      },
    },
    // beforeRouteEnter(to,from,next){
    //   console.log(from,'=3=3=3==3=3=3=3=3=3=3=33');
    //   if((from.path === '/oidc-callback' && from.query.code) || from.path === '/'){
    //     //正常登录进入
    //     if(!window.hasOpen){
    //       //没打开过 && 刷新或者第一次进入首页
    //       window.open(`https://www.baidu.com`,'hj')
    //       window.hasOpen = true
    //       window.focus()
    //
    //     }else{
    //       //已打开
    //     }
    //   }else{
    //     //其他页面刷新时中途加载
    //
    //   }
    //   next()
    // },
    created(){
      this.isIE = !!window.ActiveXObject || "ActiveXObject" in window
      console.log('home created');
    },
    mounted () {
      window.thisComponent = this
      const jsessionid = localStorage.getItem('jsessionid')

      if(!jsessionid){
        this.getJsessionid()
      }else{
        this.initData()
        this.getOaPermission()
      }
      const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
      let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`
      const expiresTime = JSON.parse(sessionStorage.getItem(sessionKey)).expires_at * 1000
      console.log(expiresTime,'expiresTimeexpiresTimeexpiresTime');
      this.timer = setInterval(() => {
        console.log('待办定时器开启');
        // if(expiresTime > new Date().getTime()){
          this.getProcess()
        // }
      },30000)
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      hjReturnNoPrompt(val){
        API.home.hjReturnNoPrompt({isPrompt:!val})
      },
      getHjReturn(){
        API.home.getHjReturn().then(res => {
          if(res.data.code === 200 && res.data.data) {
            this.hjReturnShow = true
            this.hjReturnList = res.data.data
            if(this.userName) {
              this.$nextTick(_ => {
                watermark_show({
                  watermark_txt: localStorage.profileName + '-' + this.userName,
                  watermark_x: 50,// 水印起始位置x轴坐标
                  watermark_y: 50,// 水印起始位置Y轴坐标
                  watermark_cols: 50,// 水印列数
                  watermark_rows: 50,// 水印行数
                  watermark_x_space: 120,// 水印x轴间隔
                  watermark_y_space: 120,// 水印y轴间隔
                  watermark_angle: 30,// 水印倾斜度数
                  // watermark_alpha: 0.2,// 水印透明度
                  watermark_alpha: 0.5,// 水印透明度
                  watermark_color : '#FFFFFF',// 水印字体颜色
                  watermark_dom: document.getElementsByClassName('hj-return-pop')[0],
                  watermark_position: 'absolute',
                });
              })
            }
          }
        })
      },
      getLinkQrCode(){
        API.home.getLinkQrCode().then(res => {
          if(res.data.code === 200) {
            this.linkQrCode = res.data.data
          }
        })
      },
      openHJ() {
        API.setting.checkHjPermission({account: localStorage.profileName}).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.hasPermission) {
              if (sessionStorage.opened) {
                //刷新页面
              } else {
                //窗口新打开
                sessionStorage.setItem('opened', '1')
                window.open(`${process.env.VUE_APP_HJ}`, 'hj')
              }
            }
          }
        })
      },
      // 跳转到oa
      goOaDetail(item) {
        if (item.fdLink.indexOf('http') > -1) {
          if((item.fdLink.indexOf('pm.aoyuan.net') > -1 || item.fdLink.indexOf('mysofterp.aoyuan.net') > -1 || item.fdLink.indexOf('test-pm.aoyuan.net') > -1 || item.fdLink.indexOf('192.168.209.71') > -1 || item.fdLink.indexOf('testmysoft.aoyuan.net') > -1) && !this.isIE) {
            this.$message({message:'非常抱歉，请使用IE浏览器查看！',customClass: 'ie-tips', type: 'error',showClose: true})
          }else{
            window.open(item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
          }
        } else {
          window.open(item.href.indexOf('http') > -1 ? item.href : `${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
        }
      },
      handleErrorPeople(e) {
        e.target.src = require('../../assets/images/default_img_3@1x.jpg')
      },
      handleError(e) {
        e.target.src = require('../../assets/images/default_img_2@1x.jpg')
      },
      handleClickLink(link) {
        if(link && link.includes('http')){
          window.open(link, '_blank')
        }else{
          window.open(process.env.VUE_APP_OA_URL + link, '_blank')
        }
      },
      initData(){
        this.getNewsInfo()
        this.getCarousels()
        //通知公告
        this.getNotices()
        this.getMeettingInfo()
        this.getProcessReport()
        this.getProcess()
        this.getAoYuanPeople()
        this.getSpecialList()
        //媒体看奥园
        this.getMediaPerspective()
        this.getEipBanner()
        // this.getLinkQrCode()
        // this.getHjReturn()

        var is_mobile = navigator.userAgent.toLowerCase().match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
        console.log(is_mobile,'is_mobileis_mobileis_mobileis_mobileis_mobileis_mobileis_mobileis_mobileis_mobile');
        if(!is_mobile) {
          //移动端打开不需要弹出火炬页签,因为移动端不能新窗口打开页签
          this.openHJ()
        }


        // 埋点
        analyse()
      },
     getJsessionid(){
       const oidc_config = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)
        let sessionKey = `oidc.user:${oidc_config.authority}:${oidc_config.clientId}`
       let userAccount = ''
       // if(localStorage.profileName && localStorage.profileName != 'undefined'){
       //   //如果有存账号则不通过session取值
       //   userAccount = localStorage.profileName
       // }else{
         //如果localstorage没有账号,则通过session取值并储存
         localStorage.setItem('profileName',JSON.parse(sessionStorage.getItem(sessionKey)).profile.name)
         userAccount = JSON.parse(sessionStorage.getItem(sessionKey)).profile.name
       // }
       console.log(JSON.parse(sessionStorage.getItem(sessionKey)).profile.name,'登录用户名',new Date());
       API.login.login(this.encryptedData(userAccount)).then(res => {
          if(res.data.code === 200){
            // this.$message({
            //   message:this.$t('publicMsg.loginsuccess'),
            //   type: 'success',
            //   duration: 1000,
            // })
            document.cookie = `JSESSIONID=${res.data.data.token.jsessionid};domain=.aoyuan.net;`
            localStorage.setItem('jsessionid',res.data.data.token.jsessionid)
            this.initData()
            this.getOaPermission()
            // this.getUserInfo()
          }else{
            //当登录接口报错时重新获取sso信息
            this.$message.error(`登录异常${res.data.message}`)
            let locale = localStorage.locale || '', opened = sessionStorage.opened || ''
            localStorage.clear()
            localStorage.locale = locale
            sessionStorage.clear()
            sessionStorage.opened = opened
            location.reload()
          }
        }).catch(_ => {
         this.$message.error(`登录异常${_}`)
       })
      },
      getIframe() {
        let iframe = document.createElement('iframe')
        iframe.src = `${this.OA_URL}/ssso.jsp`
        iframe.className = 'sso_iframe'
        document.body.appendChild(iframe)
        iframe.style.display = 'none'
      },
      getOaPermission(){
        // if(document.getElementsByClassName('sso_iframe').length < 2){
          this.getIframe()
        //   setTimeout(() => {
        //     this.getIframe()
        //   },2000)
        // }
      },
      encryptedData(data){
        const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1tAUwuzjoFlD802CD5wSWPbF2
/WsPVwGATbp7rNc1xRFf58gkbIarUdShU5i9LSrRpjAy+bH1kSKUSdItu7cscbMr
tofesNqtDlT9nLyokRWG9Pf4StjPhAYLyCKW+cFmARwORdS8HCHksrHY6YlWrey4
8ZGYDkWvItAho8qimwIDAQAB
-----END PUBLIC KEY-----`
        let encryptor = new JSEncrypt()
        encryptor.setPublicKey(publicKey)
        return encryptor.encrypt(data)
      },
      getUserInfo(){
        API.setting.getOaUser().then(async ({data}) => {
          if (data) {
            if (data.code === 200) {
              this.$store.commit('user/SET_NAME', data.data.username)
              this.$store.commit('user/SET_SMALLPHOTOURL', data.data.smallPhotoUrl)
              localStorage.setItem('userName', data.data.username)
              localStorage.setItem('smallPhotoUrl', data.data.smallPhotoUrl)
              localStorage.removeItem('pageJourney')
              if (data.data.orgPageCode == 0) {
                this.$message.error(this.$t('publicMsg.loginError'))
              } else {
                // this.$message.success(this.$t('publicMsg.loginsuccess'))
                if(data.data.orgPageCode == 4){
                  // await this.setEn()
                }
                console.log(321);
                // this.$router.replace({ name: 'home', query: { id: data.data.orgPageCode } })
              }
            }
          }
        })
      },
      handleRead(item){
        if(item.showNewIcon){
          item.showNewIcon = false;
          this.newsReadInfoData.unread--
          this.newsReadInfoData.read++
          //未读设置为已读时,需要在媒体看奥园列表查找对应的新闻,若有则同时设置为已读
          const idx = this.mediaWatchList.findIndex(v => v.fdId === item.fdId)
          if(idx > -1) this.mediaWatchList[idx].showNewIcon = false
        }

        if ( item.isEipVideo != undefined && item.isEipVideo && item.videoId != undefined ) {
          // eip视频新闻
          let id = item.videoId
          let type = 'video'
          let routeUrl = this.$router.resolve({ name: 'detail', query: {type, id}})
          window.open(routeUrl.href, '_blank');
        }else{
          if(item.href.indexOf('http') > -1){
            //返回完整路径
            window.open(item.href, '_blank');
          }else{
            window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank');
          }
        }
      },
      getEipBanner(){
        let params = {
          location: 3
        }
        API.news.getEipBanner(params).then(res => {
          if(res.data.code === 200) {
            this.longBanner = res.data.data || []
          }
        })
      },
      //切换轮播图
      changeCarousel(idx) {
        this.$refs['carousel-b'].setActiveItem(idx)
      },
      viewBannerLink(url){
        if(url){
          if(url.includes('http')){
            window.open(url, '_blank')
          }else{
            window.open(this.OA_URL + url, '_blank')
          }
        }
      },
      handleChangeB(index) {
        this.curBannerIndexB = index
      },
      oyPeopleSrc(){
        if(this.aoyuanPeopleData.image){
          if(this.aoyuanPeopleData.image.indexOf('http') > -1){
            return this.aoyuanPeopleData.image
          }else{
            return this.OA_URL + this.aoyuanPeopleData.image
          }
        }else{
          return ''
        }
      },
      viewSpecialList(cateId){
        this.$router.push(`/specialList?id=${this.$route.query.id || 1}&cateId=${cateId}`)
        // let routeData = this.$router.resolve(`/specialList?id=${this.$route.query.id || 1}&cateId=${cateId}`);
        // window.open(routeData.href, '_blank');
      },
      newsTitle(){
        const index = this.$route.query.id || 0
        if([1,2,3,4,5,6,7,8,9,10,11].includes(Number(index))){
          if ( index == 1 ) {
            return this.$t(`publicMsg.rNews`)
          }
          return this.$t(`publicMsg.homeNews${index}`)
        }else{
          return this.$t(`publicMsg.rNews`)
        }
      },
      handleRed(item){
        return ['待审'].includes(item.fdStatus) && (item.start > new Date().getTime())
      },
      viewMoreNews(){
        this.$router.push(`/news?id=${this.$route.query.id || 1}&sid=1`)
        // let routeData = this.$router.resolve(`/news?id=${this.$route.query.id || 1}&sid=1`)
        // window.open(routeData.href, '_blank');
      },
      // 跳转首页的新闻中心
      viewHomeNews() {
        this.clickedCloseNewsInfo = !this.clickedCloseNewsInfo
        // if ( this.$route.query.id != 1 ) {
          this.$router.push(`/news?id=1&sid=1`)
        // }
      },
      getSpecialList(){
        let _this = this
        API.home.getSpecialCate({IsHomePage: true}).then(res => {
          if (res.data.code === 200) {
            this.specialList = res.data.data || []
            this.$nextTick(() => {
              new Swiper('.swiper-container',{
                autoplay : 5000, //可选选项，自动滑动
                loop : true, //可选选项，开启循环
                mode : 'vertical',
                slidesPerView : 2,
                noSwiping : true,
                onSlideClick: function(swiper){
                  _this.viewSpecialList(swiper.clickedSlide.dataset.id)
                }
              })
            })
          }
        })
      },
      getMeetingList(){
        this.noticeLoading = true
        let params = {
          Orderby: 'docCreateTime',
          DocStatus: '30',
          JPath: '/myHandleSummary',
          Ordertype: 'down',
          Pageno: 1,
          Rowsize: 11,
          parentOrgIds: this.currentCateId
        }
        API.home.getMeetingList(params).then(res => {
          this.noticeLoading = false
          if (res.data.code === 200) {
            this.meetingList = res.data.data.list || []
          }
        }).catch(() => {
          this.noticeLoading = false
        })
      },
      getMediaPerspective(){
        // this.mediaWatchLoading = true
        // let params = {
        //   PageNo: 1,
        //   RowSize: 13
        // }
        // API.news.getMediaPerspective(params).then(res => {
        //   this.mediaWatchLoading = false
        //   if (res.data.code === 200) {
        //     this.mediaWatchList = res.data.data.items || []
        //   }
        // }).catch(_ => {
        //   this.mediaWatchLoading = false
        // })
        this.mediaWatchLoading = true
        let params = {
          DocCategory: window.SITE_CONFIG.docCategoryIds.watch.catId,
          DocStatus: '30',
          FdDepartment: '',
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: 1,
          Rowsize: 10,
          token: localStorage.getItem('token') || ''
        }
        API.news.getNewsCategoryPage(params).then(res => {
          this.mediaWatchLoading = false
          if (res.data.code === 200) {
            this.mediaWatchList = res.data.data.list || []
            // this.mediaWatchList = [{docSubject:213}]
          }
        }).catch(err => {
          this.mediaWatchList = []
            this.mediaWatchLoading = false
        })
      },
      viewWorkBench(bol) {
        this.$router.push(`/workbench?id=${this.$route.query.id}&sid=2&dataType=${bol?this.DataType:'todo'}`)
        // let routeData = this.$router.resolve(`/workbench?id=${this.$route.query.id}&sid=2&dataType=${bol?this.DataType:'todo'}`);
        // window.open(routeData.href, '_blank');
      },
      getProcessReport() {
        API.workbench.getProcessReport().then(res => {
          if (res.data.code === 200) {
            //待办todo，已办tododone，待阅toview，已阅toviewdone
            const {toView, toViewDone, todo, todoDone} = res.data.data
            this.processTabList[0].num = todo
            this.processTabList[1].num = toView
            this.processTabList[2].num = todoDone
            this.processTabList[3].num = toViewDone
          }
        })
      },
      getAoYuanPeople() {
        // let params = {
        //   pageId: '15f045e38b044f93375bc194f46ac135'
        // }
        // API.home.getAoYuanPeople(params).then(res => {
        //   if (res.data.code === 200) {
        //     this.aoyuanPeopleData = res.data.data || {}
        //   }
        // })

        API.publication.getNewAyPeople({}).then(res => {
          if(res.data.code === 200) {
            this.aoyuanPeopleData = res.data.data || {}
          }
        })
      },
      getProcess() {
        let params = {
          DataType: this.DataType,
          Type: ['todo','tododone'].includes(this.DataType)?'13':'2',
          Orderby: 'fdCreateTime',
          Ordertype: 'down',
          Pageno: 1,
          Rowsize: 4
        }
        API.workbench.getProcess(params).then(res => {
          if (res.data.code === 200) {
            res.data.data.list.forEach(v => {
              if(v.appName === 'EKP'){
                const index = v.fdSubject.indexOf('：')
                if(index > -1){
                  v.fdSubject = v.fdSubject.substr(index + 1)
                }
              }
            })
            this.processList = res.data.data.list || []
            this.processTabList[0].num = res.data.data.totalrows
            // this.processList = [{fdSubject: 'sadkjnahdsad'}]
          }
        })
        // let params = {
        //   orderBy: 'fdCreateTime',
        //   orderType: 'down',
        //   dataType: 1,
        //   userAccount: localStorage.getItem('profileName') || '',
        //   // userAccount: 'zhylei',
        //   pageno: 1,
        //   pageSize: 4
        // }
        // API.workbench._getProcess(params).then(res => {
        //   if(res.data && res.data.data && res.data.data.length) {
        //     res.data.data.forEach(v => {
        //       if(v.appName === 'EKP'){
        //         const index = v.fdSubject.indexOf('：')
        //         if(index > -1){
        //           v.fdSubject = v.fdSubject.substr(index + 1)
        //         }
        //       }
        //     })
        //     this.processList = res.data.data || []
        //     this.processTabList[0].num = res.data.total
        //     // this.processList = [{fdSubject: 'sadkjnahdsad'}]
        //   }
        // })
      },
      viewLink(item) {
        if(item.link && item.link.includes('http')){
          window.open(item.link, '_blank')
        }else{
          window.open(process.env.VUE_APP_OA_URL + item.link, '_blank')
        }
      },
      getShortcut() {
        let params = {
          groupName: 'HomeShortcut'
        }
        API.home.getShortcut(params).then(res => {
          if (res.data.code === 200) {
            this.quickApp = res.data.data || []
          }
        })
      },
      getCarousels(bol) {
        let params = {
          DocStatus: '30',
          FdDepartment: bol ? '' : this.orginationCode,
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: '5',
          FdIsPicNews: '1',
          token: localStorage.getItem('token') || ''
        }
        if ( params.FdDepartment == '' ) {
          params['IsHomePage'] = true
        }
        API.home.getCarousels(params).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            this.banner = res.data.data || []
            if(!this.banner.length && !bol){
              //该部门没有推荐轮播图,则获取首页轮播图
              this.getCarousels(1)
            }
          }
        })
      },
      //左右箭头切换轮播图
      toggleBanner(idx) {
        this.$refs['carouselRef'].setActiveItem(idx)
      },
      handleChange(index) {
        this.currentBannerIndex = index
      },
      toggleNotice(item, index) {
        if (item.active) return
        this.noticeTabList.forEach(v => {
          v.active = false
        })
        item.active = true
        this.noticeId = index
        // if(index !== 2){
          this.getNotices()
        // }else{
        //   this.getMeetingList()
        //   // 解决选中闪动的问题
        //   if (this.noticeData && this.noticeData != undefined && this.noticeData.length > 0) {
        //     this.noticeData = []
        //   }
        // }
      },
      toggleProcess(item,index) {
        // if (item.active) return
        this.processTabList.forEach(v => {
          v.active = false
        })
        item.active = true
        if((index < 2 && item.num > 0) || index > 1) {
          this.viewWorkBench(1)
        }
        // this.getProcess()
      },
      // 获取公告信息
      getNotices() {
        // if(this.$route.query.id == 10) {
        //   this.noticeData = []
        //   return
        // }
        this.noticeLoading = true
        let params = {
          Orderby: 'docPublishTime',
          HomePage: '1',
          DocCategory: this.currentCateId,
          DocStatus: '30',
          JPath: '/docCategory',
          Ordertype: 'down',
          PageNo: 1,
          RowSize: 11,
          isShowAll: this.noticeId === 0,
        }

        API.home.getNotification(params).then(res => {
          this.noticeLoading = false
          if (res.data.code === 200) {
              this.noticeData = res.data.data.list || []
            // this.noticeData = [{docSubject:'asjhdkjshdkjadsa',docPublishTime:''}]
          }
        }).catch(() => {
          this.noticeLoading = false
        })
      },
      //跳转OA会议纪要分类
      goOaMeetingCate(cateId){
        // window.open(`http://ayoa.aoyuan.net/km/imeeting/#j_path=%2FmyHandleSummary`, '_blank')
        let routeData = this.$router.resolve({ name: 'noticeList', query: { id: this.$route.query.id || 1, noticeId: this.noticeId, depId: this.$route.query.id || 1 } });
        window.open(routeData.href, '_blank');
      },
      newsEdit(){
        window.open(`${process.env.VUE_APP_OA_URL}/sys/news/index.jsp?j_module=true#cri.q=docStatus%3A30`,'_blank')
      },
      viewOaCate(name){
        // window.open(`${window.SITE_CONFIG.oaUrl}/km/smissive/#j_path=%2FdocCategory&docCategory=${id}`, '_blank')
        // 遍历是否有对应的cateId
        // let exits = false
        // let noticeId = 1
        // for ( let index in this.categoryIds ) {
        //   let tempIds = this.categoryIds[index]
        //   for ( let idx in tempIds ) {
        //     if ( tempIds[idx] === id ) {
        //       exits = true
        //       noticeId = idx
        //       break
        //     }
        //   }
        //   if ( exits ) {
        //     break
        //   }
        // }
          const arr = [null,'日常通知','会议纪要','任免通知','管理制度']
          let index = arr.findIndex(v => name.indexOf(v) > -1)
        if ( index > -1 ) {
          this.$router.push({ name: 'noticeList', query: { id: this.$route.query.id || 1, noticeId: index, depId: this.$route.query.id || 1 } })
          // let routeData = this.$router.resolve({ name: 'noticeList', query: { id: this.$route.query.id || 1, noticeId: index, depId: this.$route.query.id || 1 } });
          // window.open(routeData.href, '_blank');
        } else {
          window.open(`${process.env.VUE_APP_OA_URL}/km/smissive/#j_path=%2FdocCategory&docCategory=${id}`, '_blank')
        }
      },
      oaNoticeLink(item){
        if(item.showNewIcon){
          item.showNewIcon = false
        }
        // window.open(`${window.SITE_CONFIG.oaUrl}${item.href}`, '_blank');
        let routeUrl = this.$router.resolve({ name: 'noticeDetail', query: {id: item.fdId,mid:this.$route.query.id||1,noticeId:this.noticeId}})
        window.open(routeUrl.href, '_blank');
      },
      oaWatchLink(item) {
        if ( item && item.showNewIcon ) {
          item.showNewIcon = false
          //设置未读为已读时,需在新闻列表查找对应的新闻,若有则同时设置为已读
        }
        window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank');
      },
      // 跳转到旧oa通知公告
      goOaNotice(url) {
        return `${process.env.VUE_APP_OA_URL}${url}`
      },
      // 改变会议日期
      onChangeDate(date) {
        this.getMeettingInfo(date,true)
      },
      // 获取会议信息
      getMeettingInfo(date,isChange) {
        date = date || this.meetingDate
        let params = {
          StartTime: formatDate(date, 'yyyy-MM-dd'),
          EndTime: formatDate(date.getTime()+(24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          Pageno: 1,
          Rowsize: 3
        }
        API.home.getMeetting(params).then(res => {
          if (res.data.code === 200) {
            const isToday = formatDate(date, 'yyyy-MM-dd') == formatDate(new Date(), 'yyyy-MM-dd')
            this.meetingData = res.data.data.list.filter(v => !isToday || v.end >= new Date().getTime())
            // this.meetingData = [{title:'dkhad',fdPlaceName: 'sadkjasd',creator:'salkdasd'}]
            this.meetingCount = this.meetingData.length
            this.getMeetingByMonth(date, isChange)
          }
        })
      },
      // 获取会议列表提示信息
      getMeetingByMonth(time, isChange) {
        const changeMonth = new Date(time).getMonth() + 1
        if((this.changeMonth != changeMonth && isChange) || !isChange) {
          this.changeMonth = changeMonth
          let params = {
            time: formatDate(time, 'yyyy-MM-dd')
          }
          API.home.getMeetingByMonth(params).then(res => {
            if (res.data.code === 200) {
              this.mettingListTips = res.data.data
              // this.mettingListTips = ["2021-06-01 00:00:00","2021-06-02 00:00:00","2021-06-27 00:00:00","2021-06-28 00:00:00","2021-06-29 00:00:00","2021-06-30 00:00:00"]
            }
          })
        }

      },
      // 获取新闻栏信息
      getNewsInfo(bol) {
        this.newsLoading = true
        let params = {
          DocStatus: '30',
          FdDepartment: bol ? '' : this.orginationCode,
          J_path: '/allNews',
          Orderby: 'fdIsTop;fdTopTime;docPublishTime;docAlterTime',
          Ordertype: 'down',
          Pageno: '1',
          Rowsize: '6',
          token: localStorage.getItem('token') || ''
        }
        // if ( this.$route.query.id == 1 || !this.$route.query.id ) {
        //   params['IsHomePage'] = true
        // }
        API.home.getNews(params).then(res => {
          this.newsLoading = false
          if (res.data.code === 200) {
            this.newsList = res.data.data.list || []
            if(!this.newsList.length && !bol){
              //如果该部门的推荐新闻为空,则获取首页的推荐新闻
              this.getNewsInfo(1)
            }else{
              //新闻已读未读数量
              this.getNewsReadInfo(params.FdDepartment);
            }

          }
        }).catch(() => {
          this.newsLoading = false
        })
      },
      //获取新闻已读未读数量
      getNewsReadInfo(fdDepartment) {
        let params = {
          fdDepartment
        };
        API.news.getNewsReadInfo(params).then((res) => {
          if (
            res.data.code === 200 &&
            res.data.data
          ) {
            this.newsReadInfoData = res.data.data;
          }
        });
      },
      //跳转OA新闻详情
      goToNewsDetail(item) {
        if(item.showNewIcon){
          item.showNewIcon = false;
          this.newsReadInfoData.unread--
          this.newsReadInfoData.read++

          const idx = this.newsList.findIndex(v => v.fdId === item.fdId)
          if(idx > -1) this.newsList[idx].showNewIcon = false
        }

        if(item.isEipVideo && item.videoId) {
          let routeUrl =this.$router.resolve(`/detail?type=video&id=${item.videoId}`)
          window.open(routeUrl.href, '_blank');
        }else{
          if(item.href.indexOf('http') > -1){
            window.open(`${item.href}`, '_blank')
          }else{
            window.open(`${process.env.VUE_APP_OA_URL}${item.href}`, '_blank')
          }
        }

      },
      newsLink(item) {
        if ( item.isEipVideo != undefined && item.isEipVideo && item.videoId != undefined ) {
          // eip视频新闻
          let id = item.videoId
          let type = 'video'
          let routeUrl = this.$router.resolve({ name: 'detail', query: {type, id}})
          // window.open(routeUrl.href, '_blank');
          return routeUrl.href
        }else{
          if(item.href.indexOf('http') > -1){
            //返回完整路径
            return item.href
          }else{
            return `${process.env.VUE_APP_OA_URL}${item.href}`
          }
        }
      },
      newsDate (time) {
        return formatDate(Number(time), 'yyyy.MM.dd')
      },

      getFirstIndex() {
        API.home.getFirstIndex().then(res => {
          // if (res.data.code === 200) {

          // }
        })
      },
      getUserTask() {
        API.home.getUserTask().then(res => {
          // if (res.data.code === 200) {}
        })
      },
      // 通知公告更多
      hanldeClickNoticeMore() {
        this.$router.push({path: '/noticeList',query: { id: this.$route.query.id || 1, noticeId: this.noticeId, depId: this.$route.query.id || 1 }})
        // let routeData = this.$router.resolve({ name: 'noticeList', query: { id: this.$route.query.id || 1, noticeId: this.noticeId, depId: this.$route.query.id || 1 } });
        // window.open(routeData.href, '_blank');
      },
      // 会议信息更多
      handleClickMettingMore(type) {
        window.open(`${process.env.VUE_APP_OA_URL}/km/imeeting/index.jsp?j_module=true#j_path=%2FkmImeeting_${type?'paln':'fixed'}`, '_blank')
      },
      // 跳转到旧oa会议信息
      goOaMeetting(url) {
        window.open(`${process.env.VUE_APP_OA_URL}${url}`, '_blank')
      },
      // 奥园人更多
      goOaAoYuanRen() {
        // window.open(window.SITE_CONFIG.staticUrls.oaAoYuanRen.url, '_blank')
        let prefixUrl = `${location.origin}/pdf/web/viewer.html?file=`
        let pdfurl = `${location.origin}/file/api/file-management/files/${process.env.VUE_APP_PDF}.pdf`;
        window.open(prefixUrl + encodeURIComponent(pdfurl), '_blank')
      },
      //新闻已读
      handleClickNewsRead() {},
      //新闻未读
      handleClickNewsUnreead() {},
      //查看oa员工购房
      viewOaBuyHouse(){
        this.$router.push(`/newsList?type=1&from=home&id=${this.$route.query.id}`)
        // let routeData = this.$router.resolve(`/newsList?type=1&from=home&id=${this.$route.query.id}`);
        // window.open(routeData.href, '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home-page-wrap {
    display: flex;
    padding: 10px 30px;
    background: #fff;
    width: 1600px;
    margin: 0 auto;
    flex-direction: column;
    /*min-height: 1622px;*/

    &__left {
      flex: 1;

      &__news {
        height: 347px;
        margin-bottom: 10px;
        &-header {
          line-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 18px;
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 14px;
          &-title {
            display: flex;
          }
          .news-edit{
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-right: 24px;
            .icon_news_edit{
              margin-right: 7px;
            }
          }
        }

        &-body {
          display: flex;

          &__banner {
            flex: 0 0 500px;
            /*height: 314px;*/
            height: 281px;
            margin-right: 20px;
            position: relative;


            .icon_new_play{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .banner-img {
              width: 100%;
              height: 100%;
              cursor: pointer;
            }
            .icon_new_play{
              cursor: pointer;
            }

            .swiper-indicator {
              position: absolute;
              background: rgba(0, 0, 0, .7);
              width: 100%;
              height: 44px;
              left: 0;
              bottom: 0;
              font-size: 18px;
              color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 0 16px;
              z-index: 9;

              .icon_arrow_left,.icon_arrow_right{
                flex: 0 0 14px;
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

          &__list {
            flex: 1;
          }
        }
      }

      &__notice {
        margin-bottom: 30px;
        height: 510px;
        &-header {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
          border-bottom: 1px solid #e8e8e8;

          .notice-tab {
            display: flex;

            &__item {
              flex: 0 0 160px;
              font-size: 18px;
              color: #999;
              text-align: center;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              >span{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                width: 160px;
              }
              &:hover{
                color: #006E38;
              }

              &.active {
                background: url('../../assets/images/icon_tab_select.png') no-repeat;
                background-size: contain;
                color: #fff;
              }
            }
          }
        }
      }


    }

    &__right {
      flex: 0 0 400px;
      margin-left: 20px;
      &__process{
        margin-bottom: 10px;
        /*height: 380px;*/
        height: 347px;
        border: 1px solid #e8e8e8;
        padding: 0 14px;
        &-header{
          height: 94.82px;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .process-tab{
            display: flex;
            height: 100%;
            &.en{
              flex: 1;
              .process-tab__item{
                flex: 0 0 30%;
              }
            }

            &__item{
              margin-left: 10px;
              cursor: pointer;
              height: 100%;
              flex: 0 0 70px;
              font-size: 14px;
              color: #999;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border-bottom: 2px solid transparent;
              &:first-child{
                margin-left: 0;
              }
              .num{
                margin-top: 10px;
                color: #333;
                font-size: 28px;
                font-weight: bold;
                height: 28px;
              }
              &.active{
                color: #006E38;
                border-color: #006E38;
                .num{
                  color: #006E38;
                }
              }
            }
          }
        }
        &-body{
          margin-top: 10px;
          height: 134px;
          .list-none {
            margin-top: 50px;
            .list-none-tips {
              height: 20px;
              line-height: 20px;
              font-size: 16px;
              color: #999;
            }
          }
        }
        &-footer {
          height: 105px;
          flex: 0 0 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          color: #333;
          .quick-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            &-img{
              width: 50px;
              height: 50px;
            }
            &-name{

            }
          }
        }
      }
      &__meeting {
        margin-bottom: 30px;
        height: 510px;
        border: 1px solid #e8e8e8;
        padding: 0 14px;
        &-header {
          height: 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
          font-size: 18px;
          color: #333;
        }

      }
    }
    .no-meeting{
      width: 78px;
      height: 78px;
    }
    &__banner{
      width: 100%;
      height: 138px;
      position: relative;
      margin-bottom: 30px;
      .banner-img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      &__indicator {
        position: absolute;
        z-index: 9;
        right: 5px;
        bottom: 5px;
        display: flex;
        font-size: 14px;
        color: #fff;

        > div {
          cursor: pointer;
          width: 33px;
          line-height: 15px;
          text-align: center;
          background: url(https://img04.aomygod.com/fontend/2020825/imgs/icon_news_banner_default.png) no-repeat;
          background-size: contain;

          &.active {
            background: url(https://img04.aomygod.com/fontend/2020825/imgs/icon_news_banner_select.png) no-repeat;
            background-size: contain;
            color: #336997;
          }
        }
      }
    }

    &__bottom{
      display: flex;
      align-items: center;
      &__buyhouse {
        height: 530px;
        flex: 1;
        border: 1px solid #e8e8e8;


        &__header {
          line-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 18px;
          border-bottom: 1px solid #e8e8e8;
          margin: 0 14px;
        }

        &__body {
          /*display: flex;*/
          flex-wrap: wrap;
          padding-top: 20px;
          /*overflow-y: auto;*/
          height: calc(100% - 52px);
          text-align: left;
          scrollbar-width: none; /* firefox */
          -ms-overflow-style: none; /* IE 10+ */
          padding: 0 14px;
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
          .app-item {
            text-align: center;
            display: inline-block;
            flex: 0 0 98px;
            width: 98px;
            color: #4C4C4C;
            font-size: 16px;
            margin-bottom: 40px;
            /*display: flex;*/
            flex-direction: column;
            align-items: center;
            cursor: pointer;

            .list-overflow{
              width: 98px;
            }
            .icon {
              width: 48px;
              height: 48px;
              margin: 0 auto 15px;
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }

      &__special {
        flex: 0 0 404px;
        margin-left: 20px;
        height: 530px;
        border: 1px solid #e8e8e8;

        &-header {
          line-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 18px;
          border-bottom: 1px solid #e8e8e8;
          margin: 0 14px;
        }

        &-body {
          padding: 14px;
          height: calc(100% - 52px);
          &__img{
            width: 100%;
            height: 212px;
            border-radius: 5px;
            margin-bottom: 18px;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            img{
              width: 100%;
              height: 100%;
            }
            &__text{
              background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
              font-size: 20px;
              color: #fff;
              position: absolute;
              left: 0;
              width: 100%;
              height: 60px;
              line-height: 60px;
              padding: 0 20px;
              bottom: 0;
              text-align: left;
            }
            &:last-child{
              margin-bottom: 0;
            }
          }

        }
      }

      &__honor {
        flex: 0 0 400px;
        height: 530px;
        border: 1px solid #e8e8e8;
        padding: 0 14px;
        margin-left: 20px;
        &-header {
          height: 53px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
          font-size: 18px;
          color: #333;
        }
        &-body {
          cursor: pointer;
          img {
            width: 345px;
            height: 450px;
            border-radius: 3px;
            margin-top: 14px;
          }
        }
      }
    }

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      color: #333;

      .meeting_time{
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 18px;
        line-height: 0.8;
      }
      .meeting_divider{
        width: 9px;
        flex: 0 0 9px;
        height: 9px;
        border-radius: 50%;
        background: #d8d8d8;
        margin: 0 10px;
        position: relative;
      }
      .meeting_info{
        flex: 1;
        text-align: left;
        font-size: 18px;
        &__title{
          color: #333;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          max-width: 210px;
        }
        &__local{
          color: #999;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          max-width: 210px;
        }
      }
      .meeting_user{
        font-size: 18px;
        color: #999;
      }
      &.meeting-wrap{
        margin-bottom: 15px;
        justify-content: flex-start;
        cursor: pointer;
        &:last-child{
          margin-bottom: 0;
        }
        &:nth-child(3),&:nth-child(4){
          .meeting_divider::before{
            position: absolute;
            width: 2px;
            height: 55px;
            background: #dbdbdb;
            left: 50%;
            top: -55px;
            transform: translateX(-50%);
            content: '';
          }
        }
      }

      &__ctn {
        text-align: left;
        line-height: 40px;
        display: flex;
        align-items: center;
        a{
          cursor: pointer;
        }
        .icon_video{
          margin-left: 10px;
        }
        &.skeleton{
          width: 310px;
          height: 20px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        &.skeleton-notice{
          width: 700px;
          height: 26px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        &.skeleton-buy{
          width: 350px;
          height: 26px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        a{
          color: #333;
          /*&.visited{*/
          /*  color: #999;*/
          /*}*/
        }
        .ellipsis{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          max-width: 440px;
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
          white-space: nowrap;
          cursor: pointer;
        }
      }
      .lh50 {
        line-height: 42px;
      }
      .lh40 {
        line-height: 46px;
      }
      &__date {
        font-size: 18px;
        color: #999;
        margin-left: 10px;
        &.ellipsis{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          max-width: 670px;
        }
        &.skeleton{
          width: 100px;
          height: 20px;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
        }
        &.skeleton-notice{
          width: 100px;
          height: 26px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
        &.skeleton-buy{
          width: 100px;
          height: 26px;
          // background: #f4f4f4;
          margin-bottom: 15px;
          background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
          list-style: none;
          background-size: 400% 100%;
          background-position: 100% 50%;
          /*animation: skeleton-loading 1.4s ease infinite;*/
        }
      }
    }
    .lh30{
      line-height: 46px;
    }
    .more-btn {
      font-size: 14px;
      color: #999;
      cursor: pointer;
      &.mb40{
        margin-bottom: 40px;
      }
    }
    .mw1000{
      max-width: 800px !important;
    }
    .mw270{
      max-width: 260px !important;
    }
    .mw100{
      max-width: 100px !important;
    }
    .mw280{
      max-width: 280px !important;
    }
    .mw500{
      max-width: 480px !important;
    }
    .h530{
      height: 530px;
    }
    .red{
      color: red !important;
    }
    .service-code{
      display: flex;
      font-size: 18px;
      margin: 10px 0;
      &__wrap{
        background: #fff;
        flex: 1;
        margin-right: 20px;
        overflow: hidden;

        &:last-child{
          margin-right: 0;
        }
        &__header{
          text-align: left;
          line-height: 50px;
          padding: 0 20px;
          border-bottom: 1px solid #ddd;
        }
        &__body{
          padding: 50px 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          min-height: 230px;
          &.fold{
            height: 180px;
            min-height: auto;
            overflow: hidden;
          }
          .url-group{
            flex: 0 0 150px;
            width: 150px;
            text-align: center;
            a{
              color: #333;
            }
            img{
              width: 60px;
              height: 60px;
              margin-bottom: 10px;
            }
          }
          .code-group{
            flex: 0 0 140px;
            width: 140px;
            text-align: center;
            margin-bottom: 20px;
            img{
              width: 90px;
              height: 90px;
              margin-bottom: 10px;
            }
          }
        }
        .fold-btn{
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 20px;
          cursor: pointer;
        }
      }
    }

    .loading {
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
    .notice-empty{
      &-img{
        img{
          width: 300px;
          height: 180px;
        }
        margin-top: 80px;
        margin-bottom: 20px;
      }
      &-tips{
        font-size: 20px;
        color: #999;
      }
    }
    .oa-item{
      cursor: pointer;
      &:hover{
        color: #4285f4;
      }
    }

    .hj-return{
      /deep/ .el-dialog{
        width: 1033px;
      }
      /deep/ .el-dialog__header{
        display: none;
      }
      /deep/ .el-dialog__body{
        padding: 0;
        .hj-return-pop{
          height: 584px;
          padding: 0 25px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(185deg, #FFDBA0 0%, #FFA55E 100%);
          &__header{
            height: 98px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E7AD7F;
            margin-bottom: 22px;
            position: relative;
            .hj-checkbox{
              font-size: 18px;
              position: absolute;
              right: 45px;
              top: 31px;
              color: #C7702C;
              cursor: pointer;
            }
            .el-checkbox__inner:hover {
              border-color: #E37D3A !important;
            }
            .el-checkbox__input.is-checked .el-checkbox__inner{
              border-color: #E37D3A !important;
              background-color: #E37D3A !important;
            }
            .el-checkbox__input.is-focus .el-checkbox__inner{
              border-color:  #E37D3A !important;
            }
            .el-checkbox__input.is-checked + .el-checkbox__label{
              color:  #C4661E !important;
            }
            .el-icon-close{
              font-size: 20px;
              position: absolute;
              right: 11px;
              top: 32px;
              color: #C7702C;
              cursor: pointer;
            }
            .hj-logo{
              width: 141px;
              flex: 0 0 141px;
              margin-right: 156px;
            }
            .title{
              color: #C7702C;
              font-size: 30px;
            }
          }
          &__body{
            display: flex;
            align-items: center;

            .table-wrap{
              flex: 1;
              &:first-child{
                margin-right: 10px;
              }
              &__title{
                background: #FBBD79;
                font-size: 18px;
                color: #C7702C;
                text-align: center;
                line-height: 42px;
                height: 42px;
                margin-bottom: 11px;
              }
              &__main{
                &__th,&__tr{
                  background: #FDB567;
                  font-size: 16px;
                  color: #C7702C;
                  display: flex;
                  align-items: center;
                  > div{
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    &:nth-child(1){
                      flex: 0.7;
                    }
                    &:nth-child(2){
                      flex: 1.4;
                    }
                    &:nth-child(3){
                      flex: 0.9;
                    }
                    &:nth-child(4){
                      flex: 0.9;
                    }
                    &:nth-child(5){
                      flex: 0.9;
                    }
                    &:nth-child(6){
                      flex: 1;
                    }
                  }
                }
                &__tr{
                  background: #FFBC73;
                }
              }

              &.front {
                .table-wrap__title{
                  background: #FFB975;
                  color: #D25223;
                }
                .table-wrap__main{
                  .table-wrap__main__th{
                    background: #FCB16F;
                    color: #D25223;
                  }
                  .table-wrap__main__tr{
                    background: #FFB975;
                    color: #D25223;
                  }
                }
              }
            }
          }
          &__footer{
            line-height: 50px;
            height: 50px;
            font-size: 14px;
            color: #C4661E;
            text-align: left;
          }
        }
      }

    }
  }
</style>
<style lang="scss">
  .ie-tips{
    top: 50% !important;
  }
  .pop__count{
    z-index: -10;
    min-width: auto;
    height: 40px;
    padding: 0 0;
    border: none;
    box-shadow: none;
    &__main{
      width: auto;
      height: 40px;
      display: flex;
      background: none;
      &__item {
        background: url('../../assets/images/news_tips_bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 0 18px 0 20px;
        height: 40px;
        line-height: 40px;
        span{
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          color: #FA9F1F;
        }
      }
      &__close{
        cursor: pointer;
        width: 20px;
        position: relative;
        img {
          width: 20px;
          height: 20px;
          position: absolute;
          left: -18px;
          top: -10px;
        }
      }
    }
  }
  .home-page-wrap{
    .el-badge{
      outline: none;
    }
    .el-badge__content{
      top: 15px;
      right: 0;
      cursor:pointer
    }
  }
  .home-page-wrap__left__special-body{
    .el-carousel__indicator.is-active{
      .el-carousel__button{
        width: 20px;
        border-radius: 5px;
      }
    }
    .el-carousel__button{
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
  .home-page-wrap__left__news-body{
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
  .swiper-container{
    height: 100% !important;
  }
  .swiper-wrapper{
    width: 100% !important;
    height: 100% !important;
  }
  .swiper-slide{
    width: 100% !important;
    height: 212px !important;
    margin-bottom: 13px;
  }
</style>
