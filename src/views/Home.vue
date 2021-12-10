<template>
  <div class="home">
    <template v-if="!$route.meta.hideHeader">
      <keep-alive>
        <HeadModule :is-show-nav="$route.meta.isShowNav"></HeadModule>
      </keep-alive>
    </template>
    <section class="scroll-view">
      <!--      <div class="loading-wrap" style="z-index: 9999" v-show="vanLoading">-->
      <!--        <van-loading class="inline-loading" type="spinner" color="#1989fa" />-->
      <!--      </div>-->
      <router-view class="scroll-view__router"></router-view>
      <div v-if="routerArr.indexOf($route.path) > -1" class="page-footer">{{$t('publicMsg.footer')}}</div>
    </section>
  </div>
</template>

<script>
  import API from '@api'
  import HeadModule from "@components/head-module1"

  export default {
    name: "Home",
    components: {
      HeadModule
    },
    data() {
      return {
        navId: '',
        routerArr: ['/home']
      }
    },
    created() {
      this.navId = Number(this.$route.query.id) || 1
      this.userPermission()
    },
    methods: {
      lowerJSONKey(jsonObj) {
        for (let key in jsonObj) {
          jsonObj[key.toLowerCase()] = jsonObj[key]
          delete (jsonObj[key])
        }
        return jsonObj
      },
      userPermission() {
        API.home.userPermission().then(res => {
          if (res.data.code === 200) {
            this.$store.commit('user/UPDATE_USER_PERMISSION', this.lowerJSONKey(res.data.data.Grants || {}))
          } else {
            this.$store.commit('user/UPDATE_USER_PERMISSION', {})
          }
        }).catch(_ => {
          this.$store.commit('user/UPDATE_USER_PERMISSION', {})
        })
      },
    }
  }
</script>

<style lang="scss" scope>
  .home {
    height: 100%;
    flex-direction: column;
    display: flex;
    background: #f4f4f4;

    .scroll-view {
      /*max-width: 1600px;*/
      /*margin: 0 auto;*/
      /*background: #fff;*/
      width: 100%;
      flex: 1;
      overflow-y: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      &__router {
        max-width: 1600px;
        margin: 0 auto;
      }
    }

    .page-footer {
      width: 100%;
      flex: 0 0 40px;
      background: #414141;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }
  .el-pagination__editor .el-input__inner  {
  line-height: 1.458vw !important;
}
</style>
