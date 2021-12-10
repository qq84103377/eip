<template>
  <div class="service" v-loading="loading">
    <div class="service-main">
      <div class="main-left">
        <ul class="m-menu">
          <li v-for="(item,key) in list" :key="key" class="menu-item" @click="handleToggleNav(key)">
            <div :class="{active: categoryIndex == key}">{{item.groupName}}</div>
            <!--            <div>{{handleGroupName(key)}}</div>-->
            <!--            <el-collapse-transition>-->
            <!--              <ul v-show="categoryIndex==key" class="m-sub-menu">-->
            <!--                <li @click.stop="selectGroup(gi)" v-for="(g,gi) in item" :key="gi" :class="['submenu-item',{active:gi===groupIndex}]">{{gi}}</li>-->
            <!--              </ul>-->
            <!--            </el-collapse-transition>-->
          </li>
        </ul>
      </div>
      <div class="main-right">
        <div class="head-seach">
          <el-input @keyup.enter.native="handleClickSearch" clearable v-model="searchValue" class="head-seach-ipt" type="text" maxlength="50" :placeholder="$t('homeMsg.seach')"></el-input>
          <span class="head-seach-btn" @click="handleClickSearch"></span>
        </div>
        <div v-if="list[categoryIndex].users.length">
          <div class="line-group" v-for="item in list[categoryIndex].users" :key="item.lineName">
            <div class="main-right__header">{{item.lineName}}</div>
            <div class="main-right__body">
              <div class="main-right__body__user-group" v-for="(u,ui) in item.list" :key="ui">
                <div style="font-weight:bold;"><i class="iconEIP book_icon_user"></i> {{u.workDetail}}</div>
                <div v-if="u.phone"><i class="iconEIP book_icon_number"></i> {{u.phone}}</div>
                <div v-if="u.email"><i class="iconEIP book_icon_mail"></i> {{u.email}}</div>
              </div>
            </div>
<!--            <div class="fold-btn" v-if="item.list.length > 6">-->
<!--              <div @click="viewMore(item)">{{item.open ? '收起' : '查看更多'}} <i :class="['fold-arrow', {open:item.open}]"></i></div>-->
<!--            </div>-->
          </div>
        </div>
<!--        <div v-else class="empty-wrap">-->
<!--          <img src="@/assets/images/address-none.png" alt="">-->
<!--          <div>-->
<!--            <div class="empty-wrap__bold">抱歉,未找到符合条件的记录</div>-->
<!--            <div class="empty-wrap__grey mb20">请尝试其他查询条件</div>-->
<!--            <div style="display: flex;">-->
<!--              <div class="empty-wrap__grey mr5">可能原因:</div>-->
<!--              <div class="empty-wrap__grey">-->
<!--                <div>没有查看权限</div>-->
<!--                <div>记录为空</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div v-else class="empty-wrap">
          <img src="@/assets/images/news-none.png">
          <div class="empty-wrap__grey">
            <div>暂无内容</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import API from '@api'
  import {analyse} from '@utils/analyse'

  export default {
    name: "Service",
    data() {
      return {
        categoryIndex: 0,
        groupIndex: '',
        // list: [{groups:[{consultingService:[]}]}],
        list: [{users:[]}],
        fold: true,
        searchValue: '',
        loading: false,
      }
    },
    mounted() {
      this.getServiceList()
      analyse()
    },
    methods: {
      handleEmail(item){
        if ( item.fdYouxiang == "" ) return false;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return !re.test(item.fdYouxiang);
      },
      // 搜索
      handleClickSearch () {
        // if(this.searchValue === ''){
        //   return this.$message.error('请输入关键字检索')
        // }
        this.getServiceList()
      },
      viewMore(item){
        this.$set(item,'open',!item.open)
      },
      handleGroupName(key) {
        switch (key) {
          case 'cw':
            return '财务'
          case 'cwgx':
            return '财务共享'
          case 'it':
            return '信息咨询'
          case 'jc':
            return '监察监督'
          case 'rl':
            return '人力'
        }
      },
      selectGroup(index) {
        this.groupIndex = index
      },
      handleToggleNav(id) {
        this.categoryIndex = id
      },
      getServiceList() {
        this.loading = true
        let params = {
          keyWord: this.searchValue
        }
        API.home.adviceDtos(params).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.list = res.data.data.length ? res.data.data : [{users:[]}]
            // this.list = [{OrgName: 'asda',users:[]},{OrgName: 'asda',users:[]},{OrgName: 'asda',users:[]},{OrgName: 'asda',users:[]},]
          }
        }).catch(_ => {
          this.loading = false
        })
      },
    }
  }
</script>

<style lang="scss" scope>
  .service {
    width: 100%;
    height: 100%;
    .empty-wrap{
      padding: 155px 0 155px;
      background: #fff;
      line-height: 26px;
      text-align: center;
      img{
        width: 177px;
        height: 125px;
        margin-right: 20px;
      }
      &__bold{
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
      &__grey{
        font-size: 18px;
        color: #999;
      }
    }

    .service-main {
      display: flex;
      padding: 10px 0;
      /*height: 100%;*/
      /*padding: 20px;*/
      .main-left {
        width: 260px;
        /*overflow-y: auto;*/
        /*scrollbar-width: none; !* firefox *!*/
        /*-ms-overflow-style: none; !* IE 10+ *!*/
        /*&::-webkit-scrollbar {*/
        /*  display: none; !* Chrome Safari *!*/
        /*}*/

        .m-menu {
          width: 100%;
          height: auto;
          list-style: none;

          .menu-item {
            width: 100%;
            line-height: 60px;
            border-bottom: 1px solid #fff;
            background: #006E38;
            color: #fff;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;

            > div.active {
              color: #006E38;
              background: #fff;
            }
          }
        }
      }

      .main-right {
        /*scrollbar-width: none; !* firefox *!*/
        /*-ms-overflow-style: none; !* IE 10+ *!*/
        /*&::-webkit-scrollbar {*/
        /*  display: none; !* Chrome Safari *!*/
        /*}*/
        /*overflow-y: auto;*/
        flex: 1;
        margin-left: 20px;
        color: #333;
        .head-seach {
          margin-bottom: 20px;
          width: 311px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.intColor {
            border-color: #006E38;
          }
          .head-seach-ipt {
            padding-left: 10px;
            height: 100%;
            width: 100%;
            input{
              height: 100%;
              border-radius: 0;
              line-height: 35px;
            }
          }
          .head-seach-btn {
            width: 35px;
            height: 35px;
            display: inline-block;
            background: url("../../assets/images/home_search.png") no-repeat center center #006E38;
            background-size: 18px 18px;

          }
        }

        .line-group{
          padding: 0 24px;
          border-radius: 5px;
          margin-bottom: 20px;
          background: #fff;
          .fold-btn{
            height: 42px;
            >div{
              cursor: pointer;
              width: 324px;
              height: 42px;
              margin: 0 auto;
              background: url("../../assets/images/trapezoid.png") no-repeat;
              background-size: 100% 100%;
              font-size: 16px;
              color: #999;
              text-align: center;
              line-height: 42px;
              display: flex;
              align-items: center;
              justify-content: center;
              .fold-arrow{
                width: 12px;
                height: 5px;
                margin-left: 3px;
                background: url("../../assets/images/arrow_down.png") no-repeat;
                background-size: 100% 100%;
                &.open{
                  transform: rotateZ(180deg);
                }
              }
            }
          }
        }

        &__header {
          text-align: left;
          font-size: 20px;
          line-height: 86px;
          border-bottom: 1px solid #eee;
          margin-bottom: 30px;
          display: flex;
          align-items: center;

          &::before {
            margin-right: 10px;
            content: "";
            background: #006E38;
            width: 4px;
            height: 15px;
          }
        }

        &__body {
          display: flex;
          flex-wrap: wrap;

          &__user-group {
            width: 33.33%;
            font-size: 18px;
            text-align: left;
            line-height: 24px;
            margin-bottom: 40px;
          }
        }
      }
    }

    .service-code {
      display: flex;
      font-size: 16px;
      margin: 10px 0;

      &__wrap {
        background: #fff;
        flex: 1;
        margin-right: 20px;
        overflow: hidden;

        &:last-child {
          margin-right: 0;
        }

        &__header {
          text-align: left;
          line-height: 50px;
          padding: 0 20px;
          border-bottom: 1px solid #ddd;
        }

        &__body {
          padding: 50px 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          min-height: 230px;

          &.fold {
            height: 180px;
            min-height: auto;
            overflow: hidden;
          }

          .url-group {
            flex: 0 0 150px;
            width: 150px;
            text-align: center;

            a {
              color: #333;
            }

            img {
              width: 60px;
              height: 60px;
              margin-bottom: 10px;
            }
          }

          .code-group {
            flex: 0 0 150px;
            width: 150px;
            text-align: center;
            margin-bottom: 20px;

            img {
              width: 90px;
              height: 90px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>
