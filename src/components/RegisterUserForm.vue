<!-- src/components/RegisterUserForm.vue -->
<template>
  <div class="body login-register-bg">
    <div class="auth-card">
      <form @submit.prevent="validateRegister">
        <!-- 头像上传 -->
        <div class="form-group1">
          <el-upload
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="handleUpload"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <!-- 用户名 -->
        <div class="form-group1">
          <input v-model="id" type="text" id="id" placeholder="用户名" />
        </div>

        <!-- 邮箱 -->
        <div class="form-group1">
          <input v-model="email" type="email" id="email" placeholder="电子邮箱" required />
        </div>

        <!-- 验证码 -->
        <div class="form-group2">
          <input v-model="check" type="text" id="check" placeholder="验证码" required />
          <button type="button" @click="sendVerificationCode" :disabled="isSending">
            {{ isSending ? `${countdown} 秒后重试` : '发送验证码' }}
          </button>
        </div>

        <!-- 密码 -->
        <div class="form-group1">
          <input v-model="password" type="password" id="password" placeholder="密码（至少6位）" minlength="6" />
        </div>

        <!-- 确认密码 -->
        <div class="form-group1">
          <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="确认密码" required />
        </div>

        <!-- 是否为管理员 -->
        <div class="form-group1">
          <label for="admin">是否为管理员</label>
          <el-switch
              v-model="admin"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
          />
        </div>
        <!-- 注册按钮 -->
        <button type="submit">保存</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { sendCode, register } from '@/api/test.ts'

const id = ref('')
const email = ref('')
const check = ref('')
const password = ref('')
const confirmPassword = ref('')
const file = ref<File | null>(null)
const imageUrl = ref('')
const isSending = ref(false)
const countdown = ref(60)
const admin = ref(false) // 新增字段：是否为管理员

// 处理头像上传
const handleUpload = (options: any) => {
  const { file: uploadFile, onSuccess } = options
  file.value = uploadFile

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(uploadFile)

  onSuccess({}, uploadFile)
}

// 头像格式校验
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 表单验证 - 邮箱格式
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 表单验证 - 密码格式
function validatePassword(password: string) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber
}

// 发送验证码
async function sendVerificationCode() {
  if (isSending.value) return

  const response = await sendCode(email.value)
  if (response.ok) {
    ElMessage.success('验证码已发送，请查收邮箱！')
    startCountdown()
  } else {
    ElMessage.error('发送验证码失败，请稍后再试')
  }
}

// 倒计时控制
function startCountdown() {
  isSending.value = true
  let timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSending.value = false
      countdown.value = 60
    }
  }, 1000)
}

// 表单提交验证
async function validateRegister() {
  // 验证邮箱
  if (!validateEmail(email.value)) {
    ElMessage.error('邮箱格式不正确')
    return false
  }

  // 验证密码复杂度
  if (!validatePassword(password.value)) {
    ElMessage.error('密码长度不能小于8，且必须包含大小写字母和数字')
    return false
  }

  // 验证两次密码是否一致
  if (password.value !== confirmPassword.value) {
    ElMessage.error('两次密码输入不一致')
    return false
  }

  // 调用注册接口
  const response = await register({
    username: id.value,
    password: password.value,
    email: email.value,
    code: check.value,
    profilePicture: imageUrl.value,
    admin: admin.value
  })

  if (response.ok) {
    emit('close')
    emit('Success')
  }
  else if (response.message === '验证码错误或已过期') {
    ElMessage.error('验证码错误或已过期')
  }
  else {
    ElMessage.error(response.message)
  }
}

const emit = defineEmits(['close', 'Success'])
</script>

<style scoped>
@import "@/assets/styles/common.css";

.form-group1 {
  margin-bottom: 20px;
}

.form-group2 {
  display: flex;
  margin-bottom: 20px;
  gap: 2vw;
}
</style>
