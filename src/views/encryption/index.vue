<template>
  <section class="encryption-wrap">
    <div class="encryption-wrap__top">
      <div class="encryption-wrap__top__title">文件加密 <span class="aic" style="color: #999;cursor: pointer" @click="downloadGuide">（ <i class="iconEIP icon_download_grey"></i>下载操作手册）</span></div>
      <div class="encryption-wrap__top__main">
        <div class="upload-list">
          <div class="upload-list__header">
            <span>加密文件</span>
            <el-upload
                    ref="upload"
                    class="upload-btn"
                    multiple
                    :limit="8"
                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
                    :before-upload="beforeUpload"
                    :on-exceed="onExceed"
                    :on-change="uploadChange"
                    :on-progress="uploadProgress"
                    :on-success="uploadSuccess"
                    :show-file-list="false"
                    :data="uploadParams"
                    :headers="{application: 'rmstool'}"
                    :action="action">
              <el-button type="primary" icon="el-icon-upload">选择文件</el-button>
            </el-upload>
            <!--            <input type="file" @change="hh">-->
          </div>
          <div class="scroll-list">
            <div class="upload-list__item" v-for="(item,index) in uploadList" :key="item.uid">
              <div class="file-name" :title="item.name"><i :class="['iconEIP', handleIcon(item)]"></i>{{item.name}}</div>
              <div class="upload-type" v-if="item.status != 'success'">{{item.percentage.toFixed(2)}}%</div>
              <div class="upload-type" v-if="item.status === 'success'">上传成功</div>
              <div class="upload-type" v-if="item.status === 'fail'">上传失败</div>
              <div class="del-btn" @click="delUploadFile(index)">删除</div>
            </div>
          </div>
        </div>
        <div class="encryption-setting">
          <div class="encryption-setting__cell">
            <div class="label">加密方式</div>
            <div class="ctn">
              <div @click="changeEncry(1)" :class="['encry-type',{active: encryType == 1}]">模板加密</div>
              <div @click="changeEncry(2)" :class="['encry-type',{active: encryType == 2}]">自定义加密</div>
            </div>
          </div>
          <div class="encryption-setting__cell" v-if="encryType == 1">
            <div class="label"><span style="color: red">*</span>选择模板</div>
            <div class="ctn">
              <el-select v-model="templateValue" placeholder="请选择">
                <el-option
                        v-for="item in templateList"
                        :key="item.Key"
                        :label="item.Value"
                        :value="item.Key">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="encryption-setting__cell" v-if="encryType == 2">
            <div class="label"><span style="color: red">*</span>权限范围</div>
            <div class="ctn">
              <div class="add-authority" @click="orgVisible = true"><i class="iconEIP icon_org"></i>添加组织</div>
              <div class="add-authority" @click="addUserVisible = true"><i class="iconEIP icon_user_add"></i>添加员工</div>
            </div>
          </div>
          <div class="encryption-setting__cell" style="align-items: flex-start" v-if="encryType == 2">
            <div class="label"><span style="color: red">*</span>权限控制</div>
            <div class="ctn">
              <el-checkbox-group v-model="permissionList" style="text-align: left">
                <el-checkbox :disabled="item.Key === 'ViewRight'" v-for="item in checkboxList" :key="item.Key" :label="item.Key">{{item.Value}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="encryption-setting__cell">
            <div class="label">添加水印</div>
            <div class="ctn">
              <el-switch
                      v-model="maskSwitch"
                      active-color="#006E38"
                      inactive-color="#ccc">
              </el-switch>
            </div>
          </div>
          <div class="encryption-setting__cell" v-if="maskSwitch">
            <div class="label"><span style="color: red">*</span>水印内容</div>
            <div class="ctn">
              <el-input class="mask-input" v-model="maskValue" placeholder="请填写水印的内容"></el-input>
            </div>
          </div>
        </div>
        <div class="permission-list" v-if="selectedList.length && encryType === 2">
          <div class="permission-list__item" v-for="(item,idx) in selectedList" :key="item.GroupName || item.id">
            {{item.GroupName || item.name}}
<!--            <span class="del-btn">X</span>-->
            <i class="el-icon-close" @click="delOrg(idx,item)"></i></div>
        </div>

      </div>
      <el-button class="lock-btn" type="primary" icon="el-icon-lock" @click="handleEncrypt" :loading="btnLoading">开始加密
      </el-button>
    </div>
    <div class="encryption-wrap__table">
      <div style="color: red;text-align: left" class="mb10">列表只保留两周内的加密文件</div>
      <el-table
              :data="fileList"
              v-loading="encryptListLoading"
              style="width: 100%">
        <el-table-column
                prop="FileName"
                label="文件名称">
          <template slot-scope="scope">
            <div class="ellipsis-one"
                 :title="scope.row.FileName">
              {{scope.row.FileName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="权限范围">
          <template slot-scope="scope">
            <div class="ellipsis"
                 :title="scope.row.RightsTemplates.length ? scope.row.RightsTemplates[0].permission : ''">
              {{scope.row.RightsTemplates.length ? scope.row.RightsTemplates[0].permission : ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="加密控制">
          <template slot-scope="scope">
            <div class="permission-cell">
              <span v-if="scope.row.RightsTemplates.length && scope.row.RightsTemplates[0].HasViewRight">阅读</span>
              <span v-if="scope.row.RightsTemplates.length && scope.row.RightsTemplates[0].HasPrintRight">打印</span>
              <span v-if="scope.row.RightsTemplates.length && scope.row.RightsTemplates[0].HasEditRight">编辑</span>
              <span v-if="scope.row.RightsTemplates.length && scope.row.RightsTemplates[0].HasExtractRight">提取(复制)</span>
              <span v-if="scope.row.RightsTemplates.length && scope.row.RightsTemplates[0].HasExportRight">另存为</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
                prop="TemplateName"
                label="加密模板">
        </el-table-column>
        <el-table-column
                prop="WaterContent"
                label="水印内容">
        </el-table-column>
        <el-table-column
                prop="status"
                label="加密状态">
          <template slot-scope="scope">
            <div v-if="scope.row.Status === 0">等待加密</div>
            <div v-if="scope.row.Status === 1">加密中</div>
            <div v-if="scope.row.Status === 2">加密成功</div>
            <div v-if="scope.row.Status === 3">加密失败：{{scope.row.Msg}}</div>
          </template>
        </el-table-column>
        <el-table-column
                prop="OperateTime"
                label="加密时间">
        </el-table-column>
        <el-table-column
                label="操作">
          <template slot-scope="scope">
            <div style="display: flex">
              <div v-if="scope.row.Status === 3" class="fs12 mr5" style="color: #006e38;cursor: pointer"
                   @click="retryEncrypt(scope.row)">重试
              </div>
              <div v-if="scope.row.Status === 2" class="fs12 mr5" style="color: #006e38;cursor: pointer"
                   @click="downloadFile(scope.row)">下载
              </div>
              <div v-if="scope.row.Status !== 1" class="fs12" style="color: #006e38;cursor: pointer"
                   @click="delEncryptFile(scope.row)">删除
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              background
              class="pagination"
              :current-page="filePageIndex"
              :page-size="filePageSize"
              layout="total, prev, pager, next, jumper"
              :total="fileTotalCount"
              @current-change="handlefileChange">
      </el-pagination>
    </div>

    <el-dialog
            :close-on-click-modal="false"
            title="添加组织"
            :visible.sync="orgVisible"
            class="add-org-wrap">
      <div class="add-org-wrap__body">
        <el-tree
                ref="tree"
                show-checkbox
                check-strictly
                class="tree-line"
                icon-class="iconEip icon_tree_add"
                :data="orgList"
                node-key="OrgGuid"
                lazy
                :load="loadNode"
                :indent="0">
              <span slot-scope="{ node, data }" class="custom-tree-node" :ref="`cs-node${data.id}`" @click.stop="">
                <span class="custom-tree-node__item">
<!--                  <i :class="['iconEIP',data.icon]"></i>-->
                  <span :title="node.label">{{ strSplit(node.label) }}</span></span>
              </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="selectOrg">确定</el-button>
    <el-button @click="orgVisible = false">关闭</el-button>
  </span>
    </el-dialog>

    <el-dialog
            :close-on-click-modal="false"
            title="添加员工"
            :visible.sync="addUserVisible"
            class="employee-dialog">
      <div class="employee-dialog__body">
        <div style="text-align: left">
          <el-input clearable @keyup.enter.native="employeePageIndex=1;getEmployeeList()" class="employee-input" placeholder="请输入姓名" v-model="keyword"></el-input>
          <el-button type="primary" @click="employeePageIndex=1;getEmployeeList()">查询</el-button>
        </div>
        <el-table
                v-loading="employeeListLoading"
                :data="employeeList"
                @selection-change="selectEmployee"
                ref="employee-table"
                row-key="id"
                style="width: 100%">
          <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="55">
          </el-table-column>
          <el-table-column
                  prop="fileName"
                  label="序号"
                  width="80">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
<!--          <el-table-column-->
<!--                  prop="orgGroupName"-->
<!--                  label="集团">-->
<!--          </el-table-column>-->
          <el-table-column
                  prop="company"
                  label="公司">
          </el-table-column>
          <el-table-column
                  prop="department"
                  label="部门">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名">
          </el-table-column>
          <el-table-column
                  prop="positionName"
                  label="职位">
          </el-table-column>
          <el-table-column
                  prop="email"
                  label="电子邮箱">
          </el-table-column>
        </el-table>
        <el-pagination
                background
                class="pagination"
                :current-page="employeePageIndex"
                :page-size="employeePageSize"
                layout="total, prev, pager, next, jumper"
                :total="employeeTotal"
                @current-change="handleEmployeeChange">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="confirmSelectEmployee">确定</el-button>
    <el-button @click="addUserVisible = false">关闭</el-button>
  </span>
    </el-dialog>
  </section>
</template>

<script>
  import API from '@api'

  export default {
    name: "index",
    data() {
      return {
        employeePageIndex: 1,
        employeePageSize: 10,
        employeeTotal: 0,
        btnLoading: false,
        uploadParams: {
          UserId: localStorage.getItem('profileName') || '',
          UserName: localStorage.getItem('userName') || ''
        },
        keyword: '',
        treeList: [],
        employeeListLoading: false,
        encryptListLoading: false,
        employeeList: [],
        orgVisible: false,
        addUserVisible: false,
        permissionList: ['ViewRight'],
        maskSwitch: true,
        maskValue: '',
        templateList: [{
          value: '1',
          label: '奥园集团全体员工只读权限'
        }, {
          value: '2',
          label: '奥园集团全体员工阅读、打印权限'
        }, {
          value: '3',
          label: '奥园集团-信息中心阅读、编辑权限'
        }],
        templateValue: '',
        encryType: 1,
        filePageIndex: 1,
        filePageSize: 10,
        fileTotalCount: 0,
        fileList: [],
        uploadList: [],
        orgList: [],
        selectedList: [],
        employeeTemp: [], //添加员工弹窗列表选中的表格
        tempUploadList: [], //用来判断上传时是否有同名文件,不能用uploadFile,因为uploadChange比beforeUpload先执行
        timer: null,
        checkboxList: [],
      }
    },
    computed: {
      action() {
        return `${process.env.VUE_APP_RMS}/api/v2.0/FRPMS/upload`
      }
    },
    created() {
      this.parentOrg()
      this.getTemplate()
      this.getFilerights()
      this.getEncryList()
    },
    watch: {
      fileList: {
        handler(newV) {
            if(newV.some(v => v.Status === 0 || v.Status === 1)){
              //有文件在等待加密或加密中,则轮询刷新列表
              if(!this.timer) {
                this.timer = setInterval(() => {
                  // let recordIds = newV.filter(v => v.Status === 0 || v.Status === 1).map(v => v.Id)
                  // this.encryptStatus(recordIds)
                  this.getEncryList()
                },5000)
              }
            }else{
              clearInterval(this.timer)
              this.timer = null
            }
        },
        deep: true
      }
    },
    methods: {
      downloadGuide(){
        window.open('https://eip.aoyuan.net/file/api/file-management/files/20210701RMS%E5%8A%A0%E5%AF%86%E5%B7%A5%E5%85%B7%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf')
      },
      encryptStatus(recordIds){
        API.frpms.encryptStatus({recordIds}).then(res => {

        })
      },
      handleIcon(item){
        let idx = item.name.lastIndexOf('.')
        let extension = ''
        if (idx > -1) {
          extension = item.name.substr(idx + 1).toLowerCase()
        }
        let type = ''
        switch (extension) {
          case "docx":
            type = 'icon_word'
            break;
          case "xlsx":
            type = 'icon_excel'
            break;
          case "pptx":
            type = 'icon_ppt'
            break;
          case "pdf":
            type = 'icon_pdf'
            break;
        }
        return type
      },
      downloadFile(item) {
        API.frpms.downloadFile(item.Id).then(res => {
          let idx = item.FileName.lastIndexOf('.')
          let extension = ''
          if (idx > -1) {
            extension = item.FileName.substr(idx + 1).toLowerCase()
          }
          // let type = ''
          // switch (extension) {
          //   case "docx":
          //     type = 'vnd.openxmlformats-officedocument.wordprocessingml.document'
          //     break;
          //   case "xlsx":
          //     type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          //     break;
          //   case "pptx":
          //     type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          //     break;
          //   case "pdf":
          //     type = 'application/pdf'
          //     break;
          // }
          // let blob = new Blob([res.data], {type: `${type};charset=utf-8`});
          let blob = new Blob([res.data]);
          // 获取heads中的filename文件名
          // 下载后文件名
          let name = item.FileName
          if(extension === 'pdf'){
            name = item.FileName.substr(0,idx) + '.ppdf'
          }
          if (navigator.userAgent.indexOf("Trident") > -1) {
            window.navigator.msSaveBlob(blob, name);
          }else{
            let downloadElement = document.createElement('a');
            downloadElement.download = name;
            // 创建下载的链接
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;

            document.body.appendChild(downloadElement);
            // 点击下载
            downloadElement.click();
            // 下载完成移除元素
            document.body.removeChild(downloadElement);
            // 释放掉blob对象
            window.URL.revokeObjectURL(href);
          }
        })
      },
      delEncryptFile(item) {
        API.frpms.delEncryptFile([item.Id]).then(res => {
          this.$message.success('删除成功')
          this.getEncryList()
        }).catch(_ => {
          this.$message.error('删除失败')
        })
      },
      handleEncrypt() {
        if(!this.uploadList.length){
          return this.$message.error('请上传文件')
        }
        if(this.maskSwitch && (this.maskValue.trim().length == 0)){
          return this.$message.error('请输入水印内容')
        }
        this.btnLoading = true
        if (this.encryType === 1) {
          if(!this.templateValue) {
            this.btnLoading = false
            return this.$message.error('请选择模板')
          }
          this.templateEncrypt()
        } else {
          if(!this.permissionList.length){
            this.btnLoading = false
            return this.$message.error('请选择权限控制')
          }
          if(!this.selectedList.length){
            this.btnLoading = false
            return this.$message.error('请选择权限范围')
          }
          this.customEncrypt()
        }
      },
      getEncryList() {
        this.encryptListLoading = true
        let params = {
          "application": 'rmstool',
          "userId": localStorage.profileName || '',
          // "userId": 'zhhui19',
          "skipCount": (this.filePageIndex - 1) * this.filePageSize,
          "maxResultCount": this.filePageSize
        }
        API.frpms.encryptList(params).then(res => {
          this.encryptListLoading = false
          this.fileTotalCount = res.data.TotalCount || 0
          res.data.Items.forEach(v => {
            if (v.RightsTemplates.length) {
              v.RightsTemplates[0].permission = v.RightsTemplates[0].Scopes.reduce((t, v, i) => {
                return t += `${i ? '、' : ''}${v.Name}`
              }, '')
            }
          })
          this.fileList = res.data.Items || []
        }).catch(_ => {
          this.encryptListLoading = true
        })
      },
      retryEncrypt(item){
        this.encryptListLoading = true
        API.frpms.retry(item.Id).then(res => {
          this.encryptListLoading = false
          this.getEncryList()
          // item.Status = res.data.Status
          // item.OperateTime = res.data.OperateTime
        }).catch(_ => {
          this.encryptListLoading = false
        })
      },
      customEncrypt() {
        let requestBody = {}
        let isWaterMark = '', content = ''
        isWaterMark = this.maskSwitch
        content = this.maskSwitch ? this.maskValue : ''
        // if(this.selectedList.length === 1 && !this.selectedList[0].OrgGuid && (!this.maskSwitch || !this.maskValue.length)) {
        //   //自定义加密权限范围只选择了一名员工并且没有选择开启水印或者没有水印内容,则水印默认使用该员工的 "账号-姓名"
        //   isWaterMark = true
        //   content = this.selectedList[0].name + '-' + this.selectedList[0].account
        // }else{
        //   isWaterMark = this.maskSwitch
        //   content = this.maskSwitch ? this.maskValue : ''
        // }
        requestBody = {
          "fileIds": this.uploadList.map(v => v.response),
          "encryptionFileDto": {
            "template": {
              "scopes": this.selectedList.map(v => {
                return {
                  mail: v.Mail || v.email,
                  name: v.GroupName || v.name,
                  isOrg: !!v.OrgGuid
                }
              }),
              "hasViewRight": this.permissionList.includes('ViewRight'),
              "hasPrintRight": this.permissionList.includes('PrintRight'),
              "hasEditRight": this.permissionList.includes('EditRight'),
              "hasExtractRight": this.permissionList.includes('ExtractRight'),
              "hasExportRight": this.permissionList.includes('ExportRight')
            },
            "isWaterMark": isWaterMark,
            "waterContent": content
          }
        }
        API.frpms.customEncrypt(requestBody).then(res => {
            this.btnLoading = false
            this.uploadList = []
            this.tempUploadList = []
            this.$refs['upload'].clearFiles()
          this.getEncryList()
        }).catch(_ => {
          this.btnLoading = false
          this.$message.error('加密失败')
        })
      },
      templateEncrypt() {
        let requestBody = {
          FileIds: this.uploadList.map(v => v.response),
          TemplateEncryptDto: {
            TemplateId: this.templateValue,
            IsWaterMark: this.maskSwitch,
            WaterContent: this.maskSwitch ? this.maskValue : ''
          }
        }
        API.frpms.templateEncrypt(requestBody).then(res => {
            this.btnLoading = false
            this.uploadList = []
            this.tempUploadList = []
            this.$refs['upload'].clearFiles()
          this.getEncryList()
        }).catch(_ => {
          this.btnLoading = false
          this.$message.error('加密失败')
        })
      },
      getFilerights() {
        API.frpms.getFilerights().then(res => {
          this.checkboxList = res.data || []
        })
      },
      getTemplate() {
        API.frpms.getTemplate().then(res => {
          this.templateList = res.data || []
        })
      },
      confirmSelectEmployee() {
        //右侧列表筛选出组织机构
        let arr = this.selectedList.filter(v => v.OrgGuid)
        arr.push(...this.employeeTemp)
        this.selectedList = arr

        // this.employeeTemp.forEach(v => {
        //   if (!this.selectedList.some(s => s.id === v.id)) {
        //     //已选中的员工没有存在右侧列表,则添加进去
        //     this.selectedList.push(v)
        //   }
        // })
        this.addUserVisible = false
      },
      selectEmployee(rows) {
        this.employeeTemp = rows
      },
      getEmployeeList() {
        let params = {
          keyWord: this.keyword,
          pageIndex: this.employeePageIndex,
          pageSize: this.employeePageSize,
          skipEmptyEmail: true
        }
        this.employeeListLoading = true
        API.home.orgUserList(params).then(res => {
          this.employeeListLoading = false
          if (res.data.code === 200) {
            this.employeeList = res.data.data.items || []
            this.employeeTotal = res.data.data.totalCount || 0
            // this.$nextTick(() => {
            //   //由于有列表回显选中状态机制,需要将右侧删除过的员工在加载列表时取消掉勾选状态
            //   this.delUserList.forEach(v => {
            //     let item = this.employeeList.find(e => e.id === v)
            //     if (item) this.$refs['employee-table'].toggleRowSelection(item, false)
            //   })
            // })
          }
        }).catch(_ => {
          this.employeeListLoading = false
        })
      },
      delOrg(idx,row) {
        this.selectedList.splice(idx, 1)
        if(row.GroupName){
          //设置组织机构选中状态
          let arr = this.$refs['tree'].getCheckedNodes()
          console.log(arr);
          let keysArr = arr.filter(e => e.OrgGuid !== row.OrgGuid).map(v => v.OrgGuid)
          this.$refs['tree'].setCheckedKeys(keysArr)
        }else{
          //设置员工选中状态
          let checkIdx = this.employeeTemp.findIndex(v => row.id === v.id)
          let delItem = this.employeeTemp.splice(checkIdx, 1)

          // let item = this.employeeList.find(e => e.id === row.id)
          // if(item) this.$refs['employee-table'].toggleRowSelection(item, false)
          this.$refs['employee-table'].toggleRowSelection(delItem[0], false)
        }
      },
      selectOrg() {
        let arr = this.$refs['tree'].getCheckedNodes()

        //右侧已选的个人员工列表
        let userList = this.selectedList.filter(v => v.id)
        userList.push(...arr)

        this.selectedList = userList
        // arr.forEach(v => {
        //   if (!this.selectedList.some(s => s.OrgGuid === v.OrgGuid)) {
        //     //已选中的机构没有存在右侧列表,则添加进去
        //     this.selectedList.push(v)
        //   }
        // })
        this.orgVisible = false
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.orgList);
        } else {
          this.childOrg(node.data.GroupName, resolve)
        }
      },
      delUploadFile(idx) {
        this.$refs['upload'].abort(this.uploadList[idx])
        this.uploadList.splice(idx, 1)
        this.tempUploadList.splice(idx, 1)
      },
      uploadProgress(e, file, fileList) {
        this.uploadList = fileList
      },
      uploadChange(file, fileList) {
        this.uploadList = fileList
      },
      onExceed(file, fileList) {
        this.$message.error('最多只能上传8个文件')
      },
      uploadSuccess(res,file, fileList) {
        this.tempUploadList = JSON.parse(JSON.stringify(fileList))
      },
      beforeUpload(file) {
        if(this.tempUploadList.some(v => v.name === file.name)){
          //同名文件不能重复上传
          this.$message.error(`${file.name}已存在,无需上传`)
          return false
        }

        let idx = file.name.lastIndexOf('.')
        let extension = ''
        if (idx > -1) {
          extension = file.name.substr(idx).toLowerCase()
        }
        if (['.docx', '.xlsx', '.pptx', '.pdf'].indexOf(extension) === -1) {
          //后缀名不符合
          this.$message.error(`${file.name}无法上传,只能上传docx,xlsx,pptx,pdf文件`)
          return false
        }
        if ((file.size / 1024 / 1024) > 30) {
          //大于30mb不能上传
          this.$message.error(`${file.name}大于30mb无法上传`)
          return false
        }
      },
      childOrg(parentOrgName, resolve) {
        API.frpms.childOrg({parentOrgName}).then(res => {
          const arr = res.data.map(v => {
            return {
              ...v,
              label: v.GroupName,
              children: []
            }
          })
          resolve(arr)
        }).catch(_ => {
          resolve([])
        })
      },
      parentOrg() {
        API.frpms.parentOrg().then(res => {
          if (res.data.GroupName) {
            this.orgList = [{label: res.data.GroupName, children: [], ...res.data}]
            // this.childOrg(res.data.GroupName)
          }
        })
      },
      changeEncry(type) {
        this.encryType = type
      },
      handlefileChange(pageIndex) {
        this.filePageIndex = pageIndex
        this.getEncryList()
      },
      handleEmployeeChange(pageIndex) {
        this.employeePageIndex = pageIndex
        this.getEmployeeList()
      },
      strSplit(str) {
        if (str.length > 50) {
          return str.substr(0, 50) + '...'
        } else {
          return str
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .encryption-wrap {
    &__top {
      background: #fff;
      border-radius: 5px;
      padding: 0 30px;
      margin-top: 20px;
      margin-bottom: 14px;

      .lock-btn {
        width: 350px;
        font-size: 16px;
        height: 46px;
        margin: 30px 0;
      }

      &__title {
        line-height: 86px;
        margin-bottom: 30px;
        border-bottom: 1px solid #eee;
        color: #333;
        font-size: 18px;
        width: 100%;
        display: flex;
        align-items: center;

        &::before {
          content: '';
          background: #006E38;
          width: 4px;
          height: 15px;
          margin-right: 10px;
        }
      }

      &__main {
        display: flex;

        .upload-list {
          flex: 0 0 550px;
          border-right: 1px solid #E5E5E5;

          &__header {
            margin-bottom: 40px;
            text-align: left;

            > span {
              margin-right: 27px;
              font-size: 16px;
              color: #4C4C4C;
            }

            .upload-btn {
              display: inline-block;
            }
          }

          .scroll-list {
            height: 340px;
            overflow-y: auto;
          }

          &__item {
            padding-right: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #333;
            margin-bottom: 22px;

            &:last-child {
              margin-bottom: 0;
            }

            .iconEIP {
              margin-right: 6px;
            }

            .file-name {
              text-align: left;
              flex: 0 0 250px;
              width: 250px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }

            .upload-type {
              text-align: center;
            }

            .del-btn {
              text-align: right;
              color: #006E38;
              cursor: pointer;
            }
          }
        }

        .encryption-setting {
          padding: 0 50px;
          flex: 0 0 575px;

          &__cell {
            display: flex;
            align-items: center;
            margin-bottom: 25px;

            .label {
              font-size: 16px;
              color: #4C4C4C;
              margin-right: 20px;
              flex: 0 0 70px;
              text-align: right;
              white-space: nowrap;
            }

            .ctn {
              display: flex;
              align-items: center;

              .encry-type {
                flex: 0 0 110px;
                color: #676767;
                font-size: 14px;
                line-height: 34px;
                text-align: center;
                border-radius: 3px 0 0 3px;
                border: 1px solid #c8c8c8;
                cursor: pointer;

                &:last-child {
                  border-radius: 0 3px 3px 0;
                  margin-left: -1px;
                }

                &.active {
                  color: #006E38;
                  border-color: #006E38;
                  z-index: 2;
                }
              }

              .add-authority {
                cursor: pointer;
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #006e38;

                &:last-child {
                  margin-left: 30px;
                }

                .iconEIP {
                  margin-right: 7px;
                }

              }
            }
          }
        }

        .permission-list {
          flex: 0 0 410px;
          font-size: 16px;
          color: #4c4c4c;
          padding: 20px;
          padding-right: 0;
          border: 1px solid #C8C8C8;
          border-radius: 3px;
          height: 380px;
          overflow-y: auto;
          text-align: left;

          &__item {
            display: inline-block;
            /*width: 50%;*/
            border: 1px solid #006e38;
            background: #ebf4ef;
            line-height: 28px;
            margin-right: 10px;
            border-radius: 14px;
            margin-bottom: 12px;
            padding: 0 10px;
            color: #006E38;

            .el-icon-close {
              cursor: pointer;
              margin-left: 5px;
            }
          }
        }
      }
    }

    &__table {
      border-radius: 5px;
      background: #fff;
      padding: 30px;
    }

    .pagination {
      text-align: right;
      margin-top: 20px;
    }

    .ellipsis {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .ellipsis-one {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }

    .permission-cell {
      span:not(:first-child) {
        &::before {
          content: '、';
        }
      }
    }
  }
</style>
<style lang="scss">
  .encryption-wrap {
    .el-checkbox__label {
      font-size: 16px;
    }

    .mask-input, .el-select {
      width: 350px;
    }

    .add-org-wrap {
      &__body {
        width: 900px;
      }
    }

    .employee-dialog {
      .el-dialog {
        width: 1420px;
      }

      &__body {
        .employee-input {
          width: 360px;
          margin-right: 12px;
          margin-bottom: 30px;
        }
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

      .custom-tree-node__item {
        display: flex;
        align-items: center;

        .iconEIP {
          margin-right: 5px;
        }
      }
    }
  }
</style>
