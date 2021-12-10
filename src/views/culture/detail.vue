<template>
  <div class="layout-wrap">
    <div class="detail-header">
      <div class="detail-nav">
        <span class="nav-item" @click="back">{{ $t('publicMsg.home') }}</span>
        <span class="nav-item">{{ $t('homeMsg.cc') }}</span>
      </div>
      <div class="detail-close" @click="handleClose">{{ $t('detail.close') }}</div>
    </div>
    <!--        <div style="display: flex;justify-content: space-between;align-items: center" class="mt20">-->
    <!--            <div class="back-btn"><span @click="back">首页</span> > <span>企业文化</span></div>-->
    <!--            <div class="detail-close" @click="back">{{ $t('detail.close') }}</div>-->
    <!--        </div>-->
    <section class="culture-detail">
      <!--        <img src="../../assets/images/culture_bg.png" alt="">-->
      <div class="culture-detail__title">中国奥园企业文化</div>
      <div class="culture-detail__sub-title">一、根基：脚踏实地、 不尚空谈，奋力拼搏、 力争一流，踏踏实实办好企业。</div>
<!--      <div class="culture-detail__sub-title">二、使命：迈进世界500强</div>-->
<!--      <div class="culture-detail__sub-ctn">-->
<!--        中国奥园致力于从建设组织机制、创新经营管理、打造核心优势、提升品牌价值、履行社会责任等方面全方位对标世界一流企业，持续做大规模、做优产业、做强能力，为人们创享更加健康美好的生活方式，跻身并稳居世界500强企业行列。-->
<!--      </div>-->
<!--      <div class="culture-detail__sub-title">二、愿景：成为稳健经营的长寿企业</div>-->
<!--      <div class="culture-detail__sub-ctn">-->
<!--        中国奥园着力以效益支撑发展、以创新驱动发展、以科技赋能发展、以制度保障发展，坚持内涵式增长和外延式发展并重，追求可持续、高质量、全面、稳健发展，打造百年老店，实现基业长青，共建健康美好家园。-->
<!--      </div>-->
      <div class="culture-detail__sub-title">二、核心价值观：高效、诚信、责任、共赢</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">高效:</span> 提倡提速增效作风，效率高、效果好、效益优</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">诚信:</span> 坚守诚实守信文化，讲信誉、重诚信、守承诺</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">责任:</span> 倡导奋斗担当精神，对客户、员工、股东负责</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">共赢:</span> 弘扬融合共赢理念，开放包容协作，共享互利</div>
      <div class="culture-detail__sub-title">三、企业理念：品牌理念、经营理念、人才理念</div>
      <div class="culture-detail__sub-title">1、品牌理念：构筑健康生活</div>
      <div class="culture-detail__sub-ctn">
        从运动就在家门口，到构筑健康生活，中国奥园不断思考城市价值提升，接轨国际化新兴产业发展方向，行稳致远打造长青基业，为人们提供更健康、更智慧、更美好的生活场景，引领健康生活未来。
      </div>
      <div class="culture-detail__sub-title">2、经营理念：客户至上、业绩至上、效益至上</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">客户至上:</span> 持续关注客户需求，一切从“为客户创造价值”出发。</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">业绩至上:</span> 业绩为先，结果导向，追求企业高质量、可持续发展。</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">效益至上:</span> 创新驱动，竞合赋能，实现经济效益和社会效益双赢。</div>
      <div class="culture-detail__sub-title">3、人才理念：以人为本、德才兼备、崇尚奋斗、业绩导向</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以人为本:</span> 构建企业与员工共享发展成果的平台。</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">德才兼备:</span> 有良好道德品质，也有过硬工作能力。</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">崇尚奋斗:</span> 鼓励奋斗担当，为达成目标不懈努力。</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">业绩导向:</span> 以结果为导向，优质高效地完成任务。</div>
      <div class="culture-detail__sub-title">四、行为规范：八大工作作风、八大军规、三条红线</div>
      <div class="culture-detail__sub-title">1、八大工作作风（全体员工应遵循的行为要求）</div>
      <div class="culture-detail__sub-ctn">（1）读懂客户：倾听客户声音，提供客户满意的产品与服务。</div>
      <div class="culture-detail__sub-ctn">（2）追求高效：持续优化流程和方法，提升工作效率与质量。</div>
      <div class="culture-detail__sub-ctn">（3）诚信为本：诚信是基石与红线，坚持做人诚实做事守信。</div>
      <div class="culture-detail__sub-ctn">（4）甘于奉献：工作中迎难而上，主动担当作为，甘于奉献。</div>
      <div class="culture-detail__sub-ctn">（5）成人达己：兼顾多方利益诉求，以成就他人来成就自己。</div>
      <div class="culture-detail__sub-ctn">（6）使命必达：不畏艰苦，以奋斗为荣，不懈努力完成任务。</div>
      <div class="culture-detail__sub-ctn">（7）实事求是：坚持实事求是，以科学严谨的态度解决问题。</div>
      <div class="culture-detail__sub-ctn">（8）拥抱变化：保持开放心态，接受新事物，不断创新超越。</div>
      <div class="culture-detail__sub-title">2、八大军规（全体员工应恪守的职业道德）</div>
      <div class="culture-detail__sub-ctn">（1）严禁工作推诿、渎职失职</div>
      <div class="culture-detail__sub-ctn">（2）严禁任人唯亲、结党营私</div>
      <div class="culture-detail__sub-ctn">（3）严禁泄露机密、收取利益</div>
      <div class="culture-detail__sub-ctn">（4）严禁职务侵占、挪用公款</div>
      <div class="culture-detail__sub-ctn">（5）严禁越权审批、以权谋私</div>
      <div class="culture-detail__sub-ctn">（6）严禁欺上瞒下、掩盖过失</div>
      <div class="culture-detail__sub-ctn">（7）严禁群体事件、重大事故</div>
      <div class="culture-detail__sub-ctn">（8）严禁行贿受贿、违法违规</div>
      <div class="culture-detail__sub-ctn">如违反“八大军规”，公司将视情况严肃处理、直至降职、解聘、或追究法律责任。</div>
      <div class="culture-detail__sub-title">3、三条红线（中国奥园对供应商的要求）</div>
      <div class="culture-detail__sub-ctn">（1）不得发生恶性群体事件、重大安全质量事故</div>
      <div class="culture-detail__sub-ctn">（2）不得发生行贿受贿、违法违规行为</div>
      <div class="culture-detail__sub-ctn">（3）不得发生违约转包、偷工减料行为</div>
      <div class="culture-detail__sub-title">五、奥园党建：党建目标、党建方针</div>
      <div class="culture-detail__sub-title">1、党建目标：争当非公企业党建排头兵</div>
      <div class="culture-detail__sub-ctn">创造“五个率先”：</div>
      <div class="culture-detail__sub-ctn">（1）率先成立广州市番禺区第一家非公企业党委——奥园集团党委。</div>
      <div class="culture-detail__sub-ctn">（2）率先成立广州市第一批非公企业纪委——奥园集团纪委。</div>
      <div class="culture-detail__sub-ctn">（3）率先牵头成立“六位一体”的社区大党委——番禺奥园社区党委。</div>
      <div class="culture-detail__sub-ctn">（4）率先成立全国第一家开发商、施工单位、监理公司、驻地党组织等联合建立的深入工地现场的党组织。</div>
      <div class="culture-detail__sub-ctn">（5）率先牵头成立共建共治共享的商圈联合党委——奥园广场商圈党委。</div>
      <div class="culture-detail__sub-title">2、党建方针：以党建促经营、以党建塑文化、以党建育人才、以党建筑和谐、以党建助扶贫</div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以党建促经营:</span> 紧跟党的政策方针，做好经营布局，以党建引领企业高质量、可持续、全面、稳健发展。
      </div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以党建塑文化:</span> 打造具有奥园特色的党建文化，与企业文化有机结合，形成积极向上的凝聚力和向心力。
      </div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以党建育人才:</span> 人才引进同等条件下党员优先，人才发展中注重将骨干培养为党员，将党员发展为骨干。
      </div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以党建筑和谐:</span> 把支部建在工地上、楼宇里、商场中，营造共建共治共享社会治理格局，共筑和谐社会。
      </div>
      <div class="culture-detail__sub-ctn"><span class="fwb">以党建助扶贫:</span> 坚决贯彻党中央决策部署，创新奥园模式助力精准扶贫，巩固脱贫成果，有效防止返贫。
      </div>
    </section>
  </div>
</template>

<script>
  import {analyse} from '@utils/analyse'

  export default {
    name: "Detail",
    mounted() {
      analyse()
      setTimeout(() => {
        console.log(1);
      }, 0)
      console.log(2);
    },
    methods: {
      back() {
        this.$router.push(`/culture?id=${this.$route.query.id}&sid=${this.$route.query.sid}`)
      },
      handleClose() {
        window.close()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .layout-wrap {
    width: 1200px;
  }

  .detail-header {
    width: 100%;
    height: 56px;
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

  .culture-detail {
    margin: 23px auto;
    /*width: 1280px;*/
    border-radius: 5px;
    background: #fff url('../../assets/images/culture_bg.png') no-repeat left top;
    background-size: 100% 240px;
    text-align: left;
    padding: 44px;

    &__title {
      margin-top: 196px;
      font-size: 24px;
      color: #B4A36B;
      text-align: center;
      line-height: 90px;
    }

    &__sub-title {
      font-size: 20px;
      color: #666;
      font-weight: bold;
      line-height: 40px;
      margin-top: 20px;
    }

    &__sub-ctn {
      font-size: 18px;
      color: #666;
      font-weight: 400;
      line-height: 40px;
    }

    .fwb {
      font-weight: bold;
    }
  }
</style>
