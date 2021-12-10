<template>
    <section class="pwd-security">
        <div class="pwd-security__header">{{ $t('settingMsg.resetpwd') }}</div>
        <div class="pwd-security__body">
            <div class="pwd-security__body__tab">
                <div :class="{active:!tabIndex}" @click="tabIndex = 0">{{ $t('settingMsg.changepwd') }}</div>
                <div :class="{active:tabIndex}" @click="tabIndex = 1">{{ $t('settingMsg.squestion') }}</div>
            </div>
            <div v-show="!tabIndex">
                <el-form ref="form" :rules="editRules" :model="editForm" :label-width="$i18n.locale === 'en-US' ? '180px':'120px'">
                    <el-form-item class="form-item" :label="$t('settingMsg.originalpwd')" prop="oldPwd">
                        <el-input v-model="editForm.oldPwd" show-password></el-input>
                    </el-form-item>
                    <el-form-item class="form-item" :label="$t('settingMsg.newpwd')" prop="newPwd1">
                        <el-input v-model="editForm.newPwd1" show-password></el-input>
                    </el-form-item>
                    <el-form-item class="form-item" :label="$t('settingMsg.confirmpwd')" prop="newPwd2">
                        <el-input v-model="editForm.newPwd2" show-password></el-input>
                    </el-form-item>
                </el-form>
                <el-button class="save-btn" :loading="pwdLoading" :disabled="pwdDisabled" style="margin-left: 100px;width: 130px;" type="primary" @click="setPwd">{{ $t('settingMsg.csave') }}</el-button>
            </div>
            <div v-show="tabIndex">
                <div class="tips">{{ $t('settingMsg.questionTips') }}</div>
                <el-form ref="form" :model="questionForm" label-width="80px">
                    <div v-for="(item,index) in problemList" :key="index">
                        <el-form-item class="form-item" :label="$t('settingMsg.question') + (index+1)" required>
                            <el-select v-model="questionForm[`question${index+1}`]" :placeholder="$t('settingMsg.pplaceholder')">
                                <el-option v-for="(value,opIndex) in item.Problems" :key="opIndex" :label="value" :value="value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-item" :label="$t('settingMsg.answer')" required>
                            <el-input v-model="questionForm[`answer${index+1}`]" :placeholder="$t('settingMsg.aplaceholder')"></el-input>
                        </el-form-item>
                    </div>
<!--                    <el-form-item class="form-item" label="问题二" prop="question2">-->
<!--                        <el-select v-model="questionForm.question2" placeholder="请选择(必填)">-->
<!--                            <el-option label="区域一" value="shanghai"></el-option>-->
<!--                            <el-option label="区域二" value="beijing"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item class="form-item" label="答案" prop="answer2">-->
<!--                        <el-input v-model="questionForm.answer2" placeholder="请输入答案(必填)"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item class="form-item" label="问题三" prop="question3">-->
<!--                        <el-select v-model="questionForm.question3" placeholder="请选择(必填)">-->
<!--                            <el-option label="区域一" value="shanghai"></el-option>-->
<!--                            <el-option label="区域二" value="beijing"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item class="form-item" label="答案" prop="answer3">-->
<!--                        <el-input v-model="questionForm.answer3" placeholder="请输入答案(必填)"></el-input>-->
<!--                    </el-form-item>-->
                </el-form>
                <el-button class="save-btn" :loading="problemLoading" :disabled="problemDisabled" style="margin-left: 80px;width: 130px;" type="primary" @click="setProblems">{{ $t('settingMsg.submit') }}</el-button>
            </div>
        </div>
    </section>
</template>

<script>
import API from '@api'
import { analyse } from '@utils/analyse'
export default {
  name: "PwdSecurity",
  data() {
    return {
      tabIndex: 0,
      problemLoading: false,
      pwdLoading: false,
      editForm: {
        oldPwd: '',
        newPwd1: '',
        newPwd2: '',
      },
      questionForm: {
        question1: '',
        answer1: '',
        question2: '',
        answer2: '',
        question3: '',
        answer3: '',
      },
      editRules: {
        oldPwd: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
        ],
        newPwd1: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
        ],
        newPwd2: [
          {required: true, message: '请输入确认新密码', trigger: 'blur'},
        ],
      },
      // questionRules: {
      //     question1: [
      //         {required: true, message: '请选择问题一', trigger: 'change'},
      //     ],
      //     answer1: [
      //         {required: true, message: '请选择答案', trigger: 'blur'},
      //     ],
      //     question2: [
      //         {required: true, message: '请选择问题二', trigger: 'change'},
      //     ],
      //     answer2: [
      //         {required: true, message: '请选择答案', trigger: 'blur'},
      //     ],
      //     question3: [
      //         {required: true, message: '请选择问题三', trigger: 'change'},
      //     ],
      //     answer3: [
      //         {required: true, message: '请选择答案', trigger: 'blur'},
      //     ],
      // },
      problemList: []
    }
  },
  computed:{
    problemDisabled() {
      let bol = false
      for(let k in this.questionForm) {
        if(!this.questionForm[k]) {
          bol = true
          break
        }
      }
      return bol
    },
    pwdDisabled() {
      let bol = false
      for(let k in this.editForm) {
        if(!this.editForm[k]) {
          bol = true
          break
        }
      }
      return bol
    },
  },
  created() {
    analyse()
    this.getSecurityList()
  },
  methods:{
    getSecurityList() {
      API.setting.getPasswordProblems().then(res => {
        if(res.data.code === 200) {
          this.problemList = res.data.data || []
          this.problemList.forEach((v, i) => {
            this.questionForm[`question${i+1}`] = v.Selected
          })
        }
      })
    },
    setPwd() {
      this.pwdLoading = true
      let params = {
        oldPassword: this.editForm.oldPwd,
        newPassword : this.editForm.newPwd1,
        comfirmNewPassword : this.editForm.newPwd1,
      }
      API.setting.setPwd(params).then(res => {
        this.pwdLoading = false
        if(res.data.code === 200) {
          this.$message.success(res.data.message)
          this.$store.dispatch('user/logout').then((data) => {
            this.$router.push({ name: 'login'})
          }).catch((error) => {
            this.$router.push({ name: 'login'})
          })
        }else{
          this.$message.error(res.data.message)
        }
      })
    },
    setProblems() {
      this.problemLoading = true
      let params = {
        answers: [
          {question:this.questionForm.question1, answer:this.questionForm.answer1},
          {question:this.questionForm.question2, answer:this.questionForm.answer2},
          {question:this.questionForm.question3, answer:this.questionForm.answer3},
        ]
      }
      API.setting.setProblems(params).then(res => {
        this.problemLoading = false
        if(res.data.code === 200) {
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>

<style lang="scss">
    .pwd-security {
        padding: 24px;
        flex: 1;
        background: #fff;
        overflow-y: auto;

        &__header {
            font-size: 20px;
            color: #4c4c4c;
            text-align: left;
        }

        &__body {
            margin-top: 25px;
            border-top: 1px solid #eee;
            padding: 36px 16px;
            text-align: left;

            &__tab {
                display: flex;

                > div {
                    width: 135px;
                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    border: 1px solid #C8C8C8;
                    font-size: 20px;
                    color: #666;
                    border-radius: 3px 0 0 3px;

                    &:last-child {
                        border-radius: 0 3px 3px 0;
                    }

                    &.active {
                        background: #F1FCF7;
                        border-color: #006e38;
                        color: #006e38;
                    }
                }
            }

            .form-item {
                margin-top: 30px;
                .el-form-item__label{
                    font-size: 20px;
                }
                .el-input, .el-select {
                    width: 362px;
                    font-size: 20px;
                }
            }

            .tips {
                font-size: 20px;
                color: #4c4c4c;
                margin-top: 68px;
            }
            .save-btn{
                font-size: 20px;
            }
        }
    }
</style>
