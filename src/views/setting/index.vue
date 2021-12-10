<template>
    <section class="setting-wrap">
        <el-menu
                :default-openeds="subMenu"
                default-active="/myInfo"
                class="setting-wrap__menu"
                background-color="#F7F8F8"
                text-color="#666"
                active-text-color="#666"
                @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">
                    <span>{{ $t('settingMsg.setting') }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item class="setting-wrap__menu__item" index="/myInfo">{{ $t('settingMsg.information') }}</el-menu-item>
<!--                    <el-menu-item class="setting-wrap__menu__item" index="/pwdSecurity">{{ $t('settingMsg.psecurity') }}</el-menu-item>-->
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span>{{ $t('settingMsg.collection') }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item class="setting-wrap__menu__item" index="/myCollect">{{ $t('settingMsg.mcollection') }}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
        <router-view></router-view>
    </section>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      subMenu: ['1']
    }
  },
  methods: {
    handleSelect(index) {
      this.$router.push(index)
    }
  }
}
</script>

<style lang="scss" scoped>
    .setting-wrap {
        display: flex;
        height: 100%;

        &__menu {
            flex: 0 0 200px;
            font-size: 16px;
            padding-top: 10px;

            &__item {
                &.is-active{
                    background: #fff !important;
                }
            }
        }
    }
</style>
<style lang="scss">
    .setting-wrap {
        .el-submenu__title,.el-menu-item {
            font-size: 16px;
            text-align: left;
            height: 40px;
            line-height: 40px;
        }
        .el-menu-item-group__title{
            padding: 0;
        }
    }
</style>
