<template>
  <section class="my-collect">
    <div class="my-collect__header">
      <div>{{ $t('settingMsg.mcollection') }}</div>
      <el-button class="add-btn" type="primary" @click="handleCate(false)">{{ $t('settingMsg.addcategory') }}
      </el-button>
    </div>
    <div class="my-collect__body">
      <el-tree
              class="tree-line"
              icon-class="iconEip icon_tree_add"
              :data="treeList"
              node-key="id"
              default-expand-all
              :indent="0">
              <span slot-scope="{ node, data }" class="custom-tree-node" @click="jumpUrl(data)">
                <span><i :class="['iconEIP',data.icon]"></i> <span :title="node.label">{{ strSplit(node.label) }}</span> <i
                        v-if="data.type!=2 && data.cateType == 2"
                        class="iconEIP icon_tree_edit"
                        @click.stop="handleCate(true,data,node)"></i><i
                        v-if="data.type!=2 && data.cateType == 2 && (!data.children || !data.children.length)" class="iconEIP icon_tree_del"
                        @click.stop="handleDel(data)"></i></span>
              </span>
      </el-tree>
    </div>

    <el-dialog
            :close-on-click-modal="false"
            :title="isEdit?$t('settingMsg.mcategory'):$t('settingMsg.acategory')"
            :visible.sync="editCateVisible"
            width="30%">
      <div class="edit-cate-wrap">
        <el-form ref="form" :model="form" label-width="135px">
          <el-form-item :label="$t('settingMsg.ncategory')" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('settingMsg.pcategory')">
<!--            <el-select v-model="form.cate" style="width: 100%;" placeholder="">-->
<!--              <el-option v-for="item in cateList" v-if="!(isEdit && tempData.id === item.data.id)" :key="item.data.id" :label="item.data.text"-->
<!--                         :value="item.data.id"></el-option>-->
<!--            </el-select>-->

            <el-cascader
                    style="width: 100%;"
                    :show-all-levels="false"
                    v-model="form.cate"
                    :options="cateList"
                    :props="{ checkStrictly: true, children: 'child', label: 'shortLabel'}"
                    clearable></el-cascader>
          </el-form-item>
        </el-form>
        <div class="edit-cate-wrap__btn-group">
          <el-button :loading="btnLoading" class="w100" type="primary" @click="handleConfirm">{{ $t('publicMsg.ok') }}
          </el-button>
          <el-button class="w100" @click="editCateVisible=false">{{ $t('publicMsg.cancel') }}</el-button>
        </div>
      </div>
    </el-dialog>


  </section>
</template>

<script>
    import API from '@api'
    import {analyse} from '@utils/analyse'

    export default {
        name: "MyCollect",
        data() {
            return {
                form: {
                    name: '',
                    cate: []
                },
                isEdit: false,
                editCateVisible: false,
                treeList: [],
                cateList: [],
                tempCateList: [],
                btnLoading: false,
                tempData: {},
            }
        },
        watch: {
            editCateVisible(v) {
                //清空表单内容
                if (!v) {
                    this.form = {
                        name: '',
                        cate: []
                    }
                }
            }
        },
        created() {
            analyse()
            this.getTree()
        },
        methods: {
            strSplit(str){
              if(str.length > 50){
                return str.substr(0,50) + '...'
              }else{
                return str
              }
            },
            jumpUrl(item) {
                if (item.url) {
                    if (item.url.substr(0, 4) === 'http') {
                        window.open(item.url, '_blank')
                    } else {
                        window.open(`${process.env.VUE_APP_OA_URL}${item.url}`, '_blank')
                    }
                }
            },
            handleConfirm() {
                if (this.form.name) {
                    this.btnLoading = true
                    let params = {
                        categoryName: this.form.name,
                        parentId: this.form.cate.length ? this.form.cate[this.form.cate.length - 1] : '0',
                        token: localStorage.getItem('token') || ''
                    }
                    let api
                    if (this.isEdit) {
                        //编辑
                        api = API.setting.updateCate
                        params.categoryId = this.tempData.id
                    } else {
                        //新增
                        api = API.setting.addCate
                    }
                  api(params).then(res => {
                        this.btnLoading = false
                        if (res.data.code === 200) {
                            this.editCateVisible = false
                            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
                            this.getTree()
                        } else {
                            this.$message.error(this.isEdit ? '修改失败' : '添加失败')
                        }
                    }).catch(err => {
                        this.$message.error(this.isEdit ? '修改失败' : '添加失败')
                        this.btnLoading = false
                    })
                } else {
                    this.$message.error('请输入分类名称')
                }
            },
            //获取收藏树状图数据
            getTree() {
                let params = {
                    parentId: '0',
                    token: localStorage.getItem('token') || ''
                }
                API.setting.getCollectTree(params).then(res => {
                    if (res.data.code === 200) {
                        //组装数据适用于el-tree
                      this.tempCateList = res.data.data
                        this.treeList = [{
                            label: '个人收藏夹', icon: 'icon_collect_file', children: this.handleParams(res.data.data)
                        }]
                      this.cateList = this.handleCateList(res.data.data)
                    }
                })
            },
          //组装分类列表
            handleCateList(data) {
                const arr = data.filter(v => {
                    if (v.child && v.child.length) {
                      v.child = this.handleCateList(v.child)
                        // this.cateList.push(...this.handleCateList(v.child))
                    }
                  v.value = v.data.id
                  v.label = v.data.text
                  v.shortLabel = this.strSplit(v.data.text)
                    return v.data.type != 2
                })
              return arr.length ? arr : null
            },
            //递归组装参数
            handleParams(data) {
                return data.map(v => {
                    const item = v.data
                    return {
                        ...item,
                        label: item.text,
                        icon: item.type==2?'icon_tree_link':'icon_collect_file',
                        children: (v.child && v.child.length) ? this.handleParams(v.child) : [],
                    }
                })
            },
            handleCate(type, item, node) {
                //type false 添加  true 修改
              console.log(node);
              this.editCateVisible = true
                this.isEdit = type
                if (type) {
                    this.tempData = item
                    this.form.name = item.label
                  let nodeP = node, arr = []
                  for (let i = 0; i < (node.level - 2); i++) {
                    arr.push(nodeP.parent.data.id)
                    nodeP = nodeP.parent
                  }
                  arr.reverse()
                  this.form.cate = arr
                }
            },
            handleDel(item) {
                this.$confirm('您确定要删除该分类吗？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '关闭',
                    type: 'warning',
                }).then(() => {
                    let params = {
                        categoryId: item.id,
                        token: localStorage.getItem('token') || ''
                    }
                    API.setting.delCate(params).then(res => {
                        if (res.data.code === 200) {
                            this.getTree()
                            this.$message.success('删除成功')
                        } else {
                            this.$message.error(res.data.code === 400?'分类下有数据，不可以删除！':'删除失败')
                        }
                    }).catch(() => {
                        this.$message.error('删除失败')
                    })
                }).catch(() => {

                })
            },
        }
    }
</script>

<style lang="scss" scoped>
  .my-collect {
    background: #fff;
    flex: 1;
    padding: 24px;
    overflow-y: auto;

    &__header {
      font-size: 20px;
      color: #4c4c4c;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .add-btn {
        width: 88px;
      }
    }

    &__body {
      margin-top: 25px;
      border-top: 1px solid #eee;
      padding: 36px 16px;
    }

    .custom-tree-node {
      line-height: 40px;

      .iconEIP {
        vertical-align: text-bottom;
        margin-right: 5px;
        position: relative;
        z-index: 10;
      }

      .icon_tree_edit {
        margin-left: 20px;
      }

      .icon_tree_del {
        margin-left: 14px;
      }
    }

    .edit-cate-wrap {
      width: 70%;
      margin: 0 auto;
    }

    .w100 {
      width: 100px;
    }
  }
</style>
<style lang="scss">
  .tree-line {
    /*width: 500px;*/

    .el-tree-node:focus > .el-tree-node__content {
      background: #fff;
    }

    > .el-tree-node > .el-tree-node__content > span:first-child {
      display: none;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px; // 缩进量
    }

    .el-tree-node__children {
      padding-left: 16px; // 缩进量
    }

    // 竖线
    .el-tree-node::before {
      content: "";
      height: 100%;
      width: 1px;
      position: absolute;
      left: -6px;
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
        left: -28px;
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
      width: 24px;
      height: 20px;
      position: absolute;
      left: -3px;
      top: 18px;
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
      font-size: 18px;
      // 叶子节点（无子节点）
      &.is-leaf {
        /*color: transparent;*/
        display: none; // 也可以去掉
      }
    }
  }
</style>
