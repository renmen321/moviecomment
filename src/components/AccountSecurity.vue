<template>
  <div class="security-container">
    <div class="security-card">
      <h2 class="header-title">安全设置</h2>

      <!-- 邮箱设置 -->
      <div class="setting-item">
        <div class="setting-header">
          <div class="info-group">
            <span class="main-label">邮箱</span>&nbsp;
            <span class="sub-label">已绑定：{{ formData.email || '未设置' }}</span>
          </div>
          <el-button
              type="primary"
              size="small"
              @click="showEmailEdit = !showEmailEdit"
          >
            {{ showEmailEdit ? '取消' : '更换' }}
          </el-button>
        </div>

        <transition name="el-zoom-in-top">
          <div v-show="showEmailEdit" class="edit-panel">
            <el-form class="center-form">
              <el-form-item label="新邮箱：" label-width="100px">
                <el-input
                    v-model="emailForm.newEmail"
                    placeholder="请输入新邮箱地址"
                    class="centered-input"
                />
              </el-form-item>
              <el-form-item label="验证码：" label-width="100px">
                <div class="code-group">
                  <el-input
                      v-model="emailForm.code"
                      placeholder="请输入验证码"
                      class="code-input"
                  />
                  <el-button
                      type="primary"
                      :disabled="emailCodeCountdown > 0"
                      @click="getEmailCode"
                  >
                    {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}秒后获取` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>
              <div class="action-buttons">
                <el-button @click="showEmailEdit = false">取消</el-button>
                <el-button type="primary" @click="saveEmail">确定</el-button>
              </div>
            </el-form>
          </div>
        </transition>
      </div>

      <!-- 密码设置 -->
      <div class="setting-item">
        <div class="setting-header">
          <div class="info-group">
            <span class="main-label">密码</span>&nbsp;
            <span class="sub-label">******</span>
          </div>
          <el-button
              type="primary"
              size="small"
              @click="showPwdEdit = !showPwdEdit"
          >
            {{ showPwdEdit ? '取消' : '修改' }}
          </el-button>
        </div>

        <transition name="el-zoom-in-top">
          <div v-show="showPwdEdit" class="edit-panel">
            <el-form class="center-form">
              <el-form-item label="原密码：" label-width="100px">
                <el-input
                    type="password"
                    v-model="pwdForm.oldPassword"
                    placeholder="请输入原密码"
                    show-password
                    class="centered-input"
                />
              </el-form-item>
              <el-form-item label="新密码：" label-width="100px">
                <el-input
                    type="password"
                    v-model="pwdForm.newPassword"
                    placeholder="8-20位字符，包含字母和数字"
                    show-password
                    class="centered-input"
                />
              </el-form-item>
              <el-form-item label="确认密码：" label-width="100px">
                <el-input
                    type="password"
                    v-model="pwdForm.confirmPassword"
                    placeholder="请再次输入新密码"
                    show-password
                    class="centered-input"
                />
              </el-form-item>
              <div class="action-buttons">
                <el-button @click="showPwdEdit = false">取消</el-button>
                <el-button type="primary" @click="savePassword">确定</el-button>
              </div>
            </el-form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import {changeEmail, changePasswordByUser} from "@/api/User.ts";
import {router} from "@/router";
import {sendCode} from "@/api/test.ts";
const formData = ref({
  email: ''
})
onMounted(async () => {
  const userData = sessionStorage.getItem('userData'); // 使用 sessionStorage 而不是 localStorage
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.email = parsedData.email;
  }

});




// 定义 emit 事件
const emit = defineEmits(['update'])

// 编辑状态
const showEmailEdit = ref(false)
const showPwdEdit = ref(false)

// 临时数据
const emailForm = reactive({
  newEmail: '',
  code: ''
})

const pwdForm = reactive({
  oldPassword: '', // 增加原密码字段
  newPassword: '',
  confirmPassword: ''
})

// 邮箱默认为原邮箱
watch(showEmailEdit, val => val && (emailForm.newEmail = props.formData.email))

// 获取邮箱验证码
const getEmailCode = async () => {
  if (!/^\w+@[a-z0-9]+\.[a-z]{2,4}$/i.test(emailForm.newEmail)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }
 const response = await sendCode(emailForm.newEmail)
    if (response.ok) {
      ElMessage.success('验证码已发送，请查收邮箱！')
    } else {
      ElMessage.error('发送验证码失败，请稍后再试')
    }

}

// 保存邮箱
const saveEmail = () => {
  if (!emailForm.code) {
    ElMessage.error('请输入验证码')
    return
  }
  const response = changeEmail(emailForm.newEmail, emailForm.code, formData.value.email);
  if (!response.ok) {
    ElMessage.error('邮箱修改失败')
    return
  }
  ElMessage.success('邮箱修改成功')
  showEmailEdit.value = false
  emitUpdate('email', emailForm.newEmail)
}

// 保存密码
const savePassword = async () => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (!/(?=.*[a-zA-Z])(?=.*\d).{8,20}/.test(pwdForm.newPassword)) {
    ElMessage.error('密码需包含字母和数字，长度8-20位')
    return
  }

  const resoprse = await changePasswordByUser(
      pwdForm.oldPassword,
      pwdForm.newPassword
  )
  if(resoprse.ok) {
    ElMessage.success('密码修改成功')
    showPwdEdit.value = false
    ElMessage.success('请重新登录');
    router.push('/login');
  }else {
    ElMessage.error(resoprse.message)
  }
}

// 通用更新方法
const emitUpdate = (key: string, value: any) => {
  emit('update', {
    ...props.formData,
    [key]: value
  })
}

// 验证码倒计时
const emailCodeCountdown = ref(0)
</script>

<style scoped>
.security-container {
  width:50vw;
}

.security-card {
  width: 50vw;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 3vh;
  margin: 0 auto;
}

.header-title {
  font-size: 20px;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.setting-item {
  padding: 24px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #f0f2f5;
  }
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-group {
  .main-label {
    font-size: 15px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 6px;
  }
  .sub-label {
    font-size: 14px;
    color: #909399;
  }
}

.edit-panel {
  margin-top: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
}

.center-form {
  max-width: 500px;
  margin: 0 auto;
}

.code-group {
  display: flex;
  gap: 10px;
  .el-button {
    width: 120px;
    flex-shrink: 0;
  }
}

.centered-input {
  width: 100%;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

@media (max-width: 768px) {
  .security-card {
    padding: 20px;
    border-radius: 8px;
  }

  .setting-item {
    padding: 20px 0;
  }

  .code-group {
    flex-direction: column;
    .el-button {
      width: 100%;
    }
  }

  .header-title {
    font-size: 18px;
    margin-bottom: 25px;
  }
}
</style>
