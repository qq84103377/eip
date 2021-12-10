<template>
    <section class="no-permission">
        <div class="bg"></div>
        <div class="tip">抱歉，您没有访问权限！</div>
        <div class="tip">we are sorry，you have no access permissions！</div>
        <div class="jump-tip">{{ jumpTips }}</div>
        <el-button type="primary" @click="$router.push('/home?id=1')">{{ $t('publicMsg.goHome') }}</el-button>
    </section>
</template>

<script>
export default {
  name: "NoPermission",
  data() {
    return {
      time: 5,
      timer: null
    }
  },
  computed: {
    jumpTips() {
      if (this.$i18n.locale === 'en-US') {
        return `Jump to home page in ${this.time} seconds`
      } else {
        return `${this.time}秒后将自动跳到首页…`
      }
    }
  },
  mounted() {
    let that = this
    that.time = 5
    this.timer = setInterval(that.countDown, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    countDown() {
      this.time--
      if(this.time < 0) {
        localStorage.removeItem('token')
        document.cookie = `jsessionid='';domain=.aoyuan.net;`
        clearInterval(this.timer)
        this.$router.push({ name: 'login' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .no-permission{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 30px;
        .bg{
            margin-top: 213px;
            margin-bottom: 40px;
            background: url('../../assets/images/noPermission.png') no-repeat;
            background-size: contain;
            width: 500px;
            height: 280px;
        }
        .tip{
            font-size: 22px;
            color: #333;
            margin-bottom: 10px;
        }
        .jump-tip{
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
    }
</style>
