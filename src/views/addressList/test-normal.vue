<template>
  <section style="height: 100%;">
    <div class="address-wrap">
      <div class="address-wrap__left">
        <div v-loading="treeLoading">
          <el-tree
                  :props="treeProps"
                  class="tree-line"
                  icon-class="iconEip icon_tree_add"
                  :data="treeList"
                  :default-expanded-keys="expandKey"
                  lazy
                  :load="loadNode"
                  node-key="id"
                  :indent="0">
              <span slot-scope="{ node, data }" class="custom-tree-node" :ref="`cs-node${data.id}`"
                    @click.stop="viewData(data)">
                <span class="custom-tree-node__item">
                  <i :class="['iconEIP',data.icon]"></i>
                  <span :title="node.label">{{ strSplit(node.label) }}</span></span>
              </span>
          </el-tree>
        </div>
      </div>
      <div class="address-wrap__right">
        <div class="address-wrap__right__search">
          <el-input @clear="pageIndex=1;orgUserList(1)" @keyup.enter.native="pageIndex=1;orgUserList(1)" clearable
                    v-model="keyword" placeholder="请输入姓名/账号/手机信息进行搜索"></el-input>
          <el-button type="primary" @click="pageIndex=1;orgUserList(1)">查询</el-button>
        </div>

        <div class="table-wrap">
          <el-table
                  v-loading="listLoading"
                  :data="list"
                  header-row-class-name="fs16"
                  cell-class-name="fs16"
                  style="width: 100%">
            <div slot="empty" class="empty-wrap">
              <img src="@/assets/images/address-none.png" alt="">
              <div>
                <div class="empty-wrap__bold">抱歉,未找到符合条件的记录</div>
                <div class="empty-wrap__grey mb20">请尝试其他查询条件</div>
                <div style="display: flex;">
                  <div class="empty-wrap__grey mr5">可能原因:</div>
                  <div class="empty-wrap__grey">
                    <div>没有查看权限</div>
                    <div>记录为空</div>
                  </div>
                </div>
              </div>
            </div>
            <el-table-column
                    align="center"
                    label="序号"
                    width="80">
              <template slot-scope="scope"><span style="text-align: center">{{scope.$index + 1}}</span></template>
            </el-table-column>
            <!--            <el-table-column-->
            <!--                    prop="orgGroupName"-->
            <!--                    label="集团"-->
            <!--                    width="180">-->
            <!--            </el-table-column>-->
            <el-table-column
                    prop="company"
                    min-width="120"
                    label="公司">
            </el-table-column>
            <el-table-column
                    prop="department"
                    label="部门">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="account"
                    label="账号"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="positionName"
                    width="180"
                    label="职位">
            </el-table-column>
            <el-table-column
                    prop="phoneNumber"
                    label="手机"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="telephoneNumber"
                    label="办公电话"
                    width="130">
            </el-table-column>
            <!--            <el-table-column-->
            <!--                    prop="email"-->
            <!--                    label="电子邮箱">-->
            <!--            </el-table-column>-->
          </el-table>

          <el-pagination
                  background
                  class="pagination"
                  :current-page="pageIndex"
                  :page-sizes="[10, 20, 30, 40]"
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
  import {mapState} from "vuex";

  export default {
    name: "index",
    data() {
      return {
        treeProps: {
          label: 'label',
          children: 'children',
          isLeaf: 'leaf'
        },
        treeList: [],
        keyword: '',
        list: [],
        selectDom: null,
        listLoading: true,
        orgCode: '',
        CompanyCode: '',
        treeLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        expandKey: []
      }
    },
    computed: {
      ...mapState({
        mailwhitelist (state) {
          return state.user.permission.mailwhitelist;
        }
      }),
    },
    watch: {
      mailwhitelist(newV){
        if(newV){
          this.$router.replace(`/_addressList?id=${this.$route.query.id}&sid=${this.$route.query.sid}`)
        }
      }
    },
    created() {
      this.mailOrgList()
    },
    methods: {
      loadNode(node, resolve) {
        console.log(node);
        if (node.level === 0) {
          return resolve(this.treeList);
        }
        if (node.level > 0 && !node.data.needLoad) {
          return resolve(node.data.children.map(v => {
            return {
              ...v,
              icon: v.orgType === 1 ? "icon_building" : 'icon_dep',
              leaf: !v.needLoad && v.children.length === 0, //只有一种情况leaf为true, 即needLoad为false 并且 children为空
            }
          }))
        } else {
          //要加载
          this.childOrg(node.data.code, resolve)
        }
      },
      childOrg(orgCode, resolve) {
        API.home.__orgPartList({orgCode}).then(res => {
          const arr = res.data.data.map(v => {
            return {
              ...v,
              label: v.name,
              children: [],
              icon: v.orgType === 1 ? "icon_building" : 'icon_dep',
              id: v.orgID,
              leaf: false,
              needLoad: true
            }
          })
          resolve(arr)
        }).catch(_ => {
          resolve([])
        })
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.orgUserList(1)
      },
      handleCurrentChange(pageIndex) {
        this.pageIndex = pageIndex
        this.orgUserList(1)
      },
      flatten(arr) {
        for (let i = 0; i < arr.length; i++) {
          if(!arr[i].needLoad){
            this.expandKey.push(arr[i].id)
            this.flatten(arr[i].children)
          }
        }
      },
      mailOrgList() {
        this.treeLoading = true
        API.home.__mailOrgList().then(res => {
          this.treeLoading = false
          if (res.data.code === 200) {
            //组装数据适用于el-tree
            this.treeList = [{
              label: res.data.data.Tree.name,
              icon: 'icon_building',
              children: res.data.data.Tree.children,
              code: 'AY',
              leaf: false,
              id: res.data.data.Tree.id,
              needLoad: false
            }]
            this.orgCode = res.data.data.DepartmentCode
            this.CompanyCode = res.data.data.CompanyCode
            this.flatten(this.treeList)
            console.log(this.expandKey);

            this.pageIndex = 1
            this.orgUserList()
          }
        }).catch(_ => {
          this.treeLoading = false
        })
      },
      orgUserList(type) {
        // if(!this.orgCode) return this.$message.error('请选择集团或公司')
        let params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        if (type === 1) {
          //点击查询,只需要keyword
          params.keyWord = this.keyword
          if (!this.keyword.length) {
            //没有输入关键字去查询,则相当于点击左侧树状图当前部门
            params.orgCode = this.orgCode
          }
        } else {
          //点击左侧机构查询只需要orgCode
          params.orgCode = this.orgCode
        }
        this.listLoading = true
        API.home.__orgUserList(params).then(res => {
          this.listLoading = false
          if (res.data.code === 200) {
            this.list = res.data.data.items || []
            this.totalCount = res.data.data.totalCount
          }
        }).catch(_ => {
          this.listLoading = false
        })
      },
      strSplit(str) {
        if (str.length > 50) {
          return str.substr(0, 50) + '...'
        } else {
          return str
        }
      },
      viewData(item) {
        if (item.orgType === 2 || item.code === this.CompanyCode) {
          if (this.selectDom) {
            //先还原原来的颜色
            this.selectDom.style.color = '#606266'
          }
          this.selectDom = this.$refs[`cs-node${item.id}`]
          this.selectDom.style.color = '#006E38'
          console.log(item, '=3=3=3=33');
          this.orgCode = item.code
          this.pageIndex = 1
          this.keyword = ''
          this.orgUserList(0)
        }
        // if (item.url) { #006E38 606266
        //   if (item.url.substr(0, 4) === 'http') {
        //     window.open(item.url, '_blank')
        //   } else {
        //     window.open(`${window.SITE_CONFIG.oaUrl}${item.url}`, '_blank')
        //   }
        // }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .address-wrap {
    display: flex;
    height: 100%;

    .empty-wrap {
      display: flex;
      justify-content: center;
      margin: 155px 0 155px;
      line-height: 26px;
      text-align: left;

      img {
        width: 177px;
        height: 125px;
        margin-right: 20px;
      }

      &__bold {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }

      &__grey {
        font-size: 18px;
        color: #999;
      }
    }

    &__left {
      width: 348px;
      flex: 0 0 348px;
      background: #fff;
      margin-right: 18px;
      height: 100%;
      overflow-x: auto;
      -ms-overflow-style: scrollbar;
    }

    &__right {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .table-wrap {
        background: #fff;
        height: calc(100% - 100px);

        .pagination {
          text-align: right;
          padding: 20px;
          background: #fff;
        }
      }

      &__search {
        background: #fff;
        text-align: left;
        padding: 18px 9px;
        margin-bottom: 18px;

        .el-input {
          width: 360px;
          margin-right: 12px;
        }
      }
    }

    .custom-tree-node__item {
      display: flex;
      align-items: center;

      .iconEIP {
        margin-right: 5px;
      }
    }

  }
</style>
<style lang="scss">
  .address-wrap {
    .el-table__header {
      width: 100% !important;
    }

    .el-table__body {
      width: 100% !important;
    }
  }

  .tree-line {
    /*width: 500px;*/
    font-size: 16px;
    display: inline-block;
    min-width: 100%;

    .el-tree-node:focus > .el-tree-node__content {
      background: #fff;
    }

    > .el-tree-node > .el-tree-node__content > span:first-child {
      /*display: none;*/
      left: -21px;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px; // 缩进量
    }

    > .el-tree-node {
      padding-left: 33px; //父级缩进量
    }

    .el-tree-node__children {
      padding-left: 16px; // 缩进量
      /*overflow-x: auto;*/
    }

    // 竖线
    .el-tree-node::before {
      content: "";
      height: 100%;
      width: 1px;
      position: absolute;
      left: -9px;
      top: -26px;
      border-width: 1px;
      border-left: 1px dashed #c8c8c8;
    }

    // 当前层最后一个节点的竖线高度固定
    .el-tree-node:last-child::before {
      height: 38px; // 可以自己调节到合适数值
    }

    .el-tree-node__content {
      height: 40px;
      position: relative;

      &:hover {
        background: #fff;
      }

      .el-tree-node__expand-icon {
        position: absolute;
        left: -31px;
        top: 12px;
        z-index: 9;
        transition: none;

        &.expanded {
          background: url('../../assets/images/icon_tree_sub.png') no-repeat;
          background-size: contain;
          transform: none;
        }
      }
    }

    // 横线
    .el-tree-node::after {
      content: "";
      width: 18px;
      height: 20px;
      position: absolute;
      left: -5px;
      top: 20px;
      border-width: 1px;
      border-top: 1px dashed #c8c8c8;
    }

    // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
    & > .el-tree-node::after {
      border-top: none;
    }

    & > .el-tree-node::before {
      border-left: none;
    }

    // 展开关闭的icon
    .el-tree-node__expand-icon {
      font-size: 16px;
      // 叶子节点（无子节点）
      &.is-leaf {
        /*color: transparent;*/
        display: none; // 也可以去掉
      }
    }
  }
</style>
