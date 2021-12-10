<template>
  <div class="my-info">
    <div class="my-info-header">{{ $t('settingMsg.information') }}</div>
    <div class="my-info-main">
      <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="145px">
        <el-form-item class="form-item" :label="$t('settingMsg.name')">
          <!-- <el-input v-model="dataForm.name" clearable></el-input> -->
          <div class="fs18"> {{ dataForm.username }}</div>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.email')">
          <!-- <el-input v-model="dataForm.email" clearable></el-input> -->
          <div class="fs18"> {{ dataForm.fdEmail }}</div>
        </el-form-item>
        <el-form-item class="form-item sex" :label="$t('settingMsg.sex')">
          <el-checkbox-group v-model="dataForm.fdSex">
            <el-checkbox label="1" name="sex" @change="handleChangeCheck('sex')">{{ $t('settingMsg.male') }}</el-checkbox>
            <el-checkbox label="0" name="sex" @change="handleChangeCheck('sex')">{{ $t('settingMsg.female') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.mobile')">
            <el-input v-model="dataForm.fdMobileNo" type="tel" :placeholder="$t('settingMsg.mplaceholder')" clearable @blur="handleBlurPhone"></el-input>
            <span class="input-tips">{{ $t('settingMsg.mobilePhoneTips') }}</span>
            <span v-show="isShowError" class="error-tips">{{ $t('settingMsg.mobileTips') }}</span>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.tel')">
            <el-input v-model="dataForm.fdWorkPhone" :placeholder="$t('settingMsg.tplaceholder')" type="tel" maxlength="20" clearable></el-input>
            <span class="input-tips">{{ $t('settingMsg.telPhoneTips') }}</span>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.cornet')">
            <el-input v-model="dataForm.fdShortNo" :placeholder="$t('settingMsg.cplaceholder')" type="tel" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item class="form-item whn" :label="$t('settingMsg.privacy')">
          <el-checkbox v-model="dataForm.privacy1" true-label="1" name="privacy1">{{ $t('settingMsg.pvy1') }}</el-checkbox>
          <el-checkbox v-model="dataForm.privacy2" true-label="1" name="privacy2">{{ $t('settingMsg.pvy2') }}</el-checkbox>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.signature')" prop="sign">
            <el-input v-model="dataForm.fdSignature" type="textarea" class="w362" :placeholder="$t('settingMsg.splaceholder')" resize="none" maxlength="500" rows="5"></el-input>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('settingMsg.label')" prop="tag">
            <el-input v-model="dataForm.tagNameList" :disabled="!dataForm.hasEditTagRole"></el-input>
        </el-form-item>
        <el-form-item class="form-item" style="border-top: 1px solid #eee;">
            <el-button class="save-btn" type="primary" @click="handleClickSave">{{ $t('settingMsg.save') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from '@api'
import { analyse } from '@utils/analyse'
export default {
  name: "MyInfo",
  data() {
    let validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('settingMsg.mplaceholder')))
      } else {
        let isPhone = (/^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/.test(value))
        if (isPhone) {
          this.handleBlurPhone()
        }
        this.isShowError = !isPhone
      }
    }
    return {
      isShowError: false,
      isUniquePhone: false,
      dataForm: {
        fdSex: [],
        privacy: []
      },
      dataRules: {
        fdMobileNo: [
          { required: true, validator: validateMobile, message: this.$t('settingMsg.mplaceholder'), trigger: 'blur' },
        ]
      }
    }
  },
  watch: {
    'dataForm.fdSex': function(oldVal, newVal) {
      if(!this.dataForm.fdSex.length) {
        this.dataForm.fdSex = newVal
      }
    }
  },
  mounted() {
    analyse()
    this.getUserInfo()
  },
  methods:{
    // 单选框操作 含 性别/隐私设置
    handleChangeCheck (type) {
      if (type === 'sex') {
        if (this.dataForm.fdSex.length > 1) {
          this.dataForm.fdSex.shift()
        }
      }
    },
    // 获取个人信息
    getUserInfo() {
      API.setting.getOaUser().then(res => {
        if (res.data.code === 200) {
          res.data.data.fdSex = res.data.data.fdSex === 'F' ? ['0'] : ['1']
          res.data.data.privacy1 = res.data.data.isContactPrivate
          res.data.data.privacy2 = res.data.data.isDepInfoPrivate
          res.data.data.tagNameList = res.data.data.tagNameList.join(' ')
          this.dataForm = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 校验手机号是否唯一
    handleBlurPhone() {
      // let isPhone = (/^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/.test(this.dataForm.fdMobileNo))
      if (!this.dataForm.fdMobileNo) return
      let isPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.dataForm.fdMobileNo)
      if(this.dataForm.fdMobileNo.indexOf('+')> -1) {
        isPhone = /^((\+?\d{1,5})|(\(\+?\d{1,5}\)))?-?(\d{6,11})$/.test(this.dataForm.fdMobileNo)
      }
      this.isShowError = !isPhone
      if (!isPhone) return
      let params = {
        mobilePhone: this.dataForm.fdMobileNo
      }
      this.isUniquePhone = false
      API.setting.validateMobileUnique(this.dataForm.fdId, params).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data.isUnique) {
            this.isUniquePhone = true
            this.$message({
              offset: 200,
              dangerouslyUseHTMLString: true,
              iconClass: 'error-info-icon',
              customClass: 'success-info',
              message: `<div class="ml6">${this.$t('publicMsg.fBoxTips')}</div>`
            })
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 保存个人信息
    handleClickSave() {
      if (this.isShowError) return
      if (this.isUniquePhone) {
        this.$message({
          offset: 200,
          dangerouslyUseHTMLString: true,
          iconClass: 'error-info-icon',
          customClass: 'success-info',
          message: `<div class="ml6">${this.$t('publicMsg.fBoxTips')}</div>`
        })
      } else {
        this.checkMobilePhone()
      }
    },
    // 保存个人信息接口
    saveUserInfoApi(flag) {
      let fdSex = this.dataForm.fdSex[0] === '1' ? 'M' : 'F'
      let params = {
        email: this.dataForm.fdEmail,
        fdCompanyPhone: this.dataForm.fdWorkPhone,
        fdId: this.dataForm.fdId,
        fdSex: fdSex,
        fdShortNo: this.dataForm.fdShortNo,
        fdSignature: this.dataForm.fdSignature,
        fdTagNames: this.dataForm.tagNameList && this.dataForm.tagNameList.length ? this.dataForm.tagNameList.split(' ').filter(d => d).join(';') : '',
        fileId: '',
        fileName: '',
        isContactPrivate: this.dataForm.privacy1,
        isDepInfoPrivate: this.dataForm.privacy2,
        mobilPhone: this.dataForm.fdMobileNo,
        personId: this.dataForm.personId,
        validatePass: String(flag)
      }
      API.setting.updateOaUser(params).then(res => {
        if (res.data.code === 200) {
          this.$message({
            offset: 200,
            dangerouslyUseHTMLString: true,
            iconClass: 'success-info-icon',
            customClass: 'success-info',
            message: `<div class="ml6">${this.$t('publicMsg.sBoxTips')}</div>`
          })
          this.getUserInfo()
        } else {
          this.$message({
            offset: 200,
            dangerouslyUseHTMLString: true,
            iconClass: 'error-info-icon',
            customClass: 'success-info',
            message: `<div class="ml6">${this.$t('publicMsg.eBoxTips')}</div>`
          })
        }
      })
    },
    // 校验手机号
    checkMobilePhone() {
      let params = {
        mobilePhone: this.dataForm.fdMobileNo
      }
      API.setting.checkMobilePhone(this.dataForm.fdId, params).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data.isMatch) {
            let zh = `当前修改后的手机号[${this.dataForm.fdMobileNo}]与EAS中登记的手机号[${res.data.data.mobilePhone}]不一致，将不能正常登陆APP，是否继续保存？`
            let en = `Are you sure you want to modify your mobile phone number?`
            let tips = this.$i18n.locale === 'en-US' ? en : zh
            this.$confirm(tips, this.$t('publicMsg.warning'), {
              cancelButtonText: this.$t('publicMsg.cancel'),
              confirmButtonText: this.$t('publicMsg.ok'),
              type: 'warning',
            }).then(() => {
              this.saveUserInfoApi(!res.data.data.isMatch)
            }).catch(() => {

            })
          } else {
            this.saveUserInfoApi(res.data.data.isMatch)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .success-info {
    min-width: auto;
    padding: 12px 20px;
    background: #fff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
    border-radius: 3px;
  }
  .my-info {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    padding: 0 24px;
    box-sizing: border-box;
    background: #fff;
    flex: 1;
    overflow-y: auto;

    .form-item.whn{
      label{
        white-space: nowrap;
      }
    }
    &-header {
      font-size: 20px;
      color: #4c4c4c;
      text-align: left;
      border-bottom: 1px solid #eee;
      height: 76px;
      line-height: 76px;
    }
    &-main {
      padding-top: 34px;
      text-align: left;
      background: #fff;
      .form-item {
        margin-top: 30px;
        position: relative;
        .el-form-item__label{
          font-size: 20px;
        }
        .el-checkbox__label{
          font-size: 20px;
        }
        textarea{
          font-size: 20px;
        }
        .w362{
          width: 362px;
        }
        .save-btn{
          width: 130px;
          margin: 20px auto 2px auto;
          font-size: 20px;
        }
        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
          color: #C8C8C8;
        }
        input:-moz-placeholder, textarea:-moz-placeholder {
          color:#C8C8C8;
        }
        input::-moz-placeholder, textarea::-moz-placeholder {
          color:#C8C8C8;
        }
        input:-ms-input-placeholder, textarea:-ms-input-placeholder {
          color:#C8C8C8;
        }
        textarea {
          caret-color: #006E38;
          font-family: Avenir, Helvetica, Arial, sans-serif;
        }
        .el-input, .el-select {
          width: 362px;
          font-size: 20px;
        }
        .input-tips {
          margin-left: 30px;
          font-size: 18px;
          color: #B2B2B2;
        }
        .error-tips {
          margin-left: 30px;
          font-size: 16px;
          color: #FF726F;
          &::before {
            content: '';
            width: 16px;
            height: 16px;
            margin-right: 2px;
            display: inline-block;
            position: relative;
            top: 4px;
            background: url("../../assets/images/gantanhao-quan.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
</style>
