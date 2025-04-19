<!-- src/components/RegisterForm.vue -->
<template>
  <div class="body login-register-bg">
  <div class="auth-card">
    <h2>注册</h2>
    <form @submit.prevent="validateRegister">
      <div class="form-group1">
        <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="handleUpload"
            :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="form-group1">
        <input v-model="id" type="text" id="id" placeholder="用户名"  />
      </div>
      <div class="form-group1">
        <input v-model="email" type="email" id="email" placeholder="电子邮箱" required />
      </div>
      <div class="form-group2">
        <input v-model="check" type="text" id="check" placeholder="验证码" required />
        <button type="button" @click="sendVerificationCode" :disabled="isSending">
          {{ isSending ? `${countdown} 秒后重试` : '发送验证码' }}
        </button>
      </div>
      <div class="form-group1">
        <input v-model="password" type="password" id="password" placeholder="密码（至少6位）" minlength="6"  />
      </div>
      <div class="form-group1">
        <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="确认密码" required />
      </div>
      <button type="submit">立即注册</button>
    </form>
    <div class="toggle-link">
      <a @click="login">已有账号？立即登录</a>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElUpload } from 'element-plus';
import { router } from '@/router/index.js';
import { sendCode, register } from "@/api/test.ts";

const id = ref('');
const email = ref('');
const check = ref('');
const password = ref('');
const confirmPassword = ref('');
const file = ref<File | null>(null);
const imageUrl = ref('');
const isSending = ref(false); // 控制按钮禁用状态
const countdown = ref(60); // 倒计时时间
const handleUpload = (options: any) => {
  const { file: uploadFile, onSuccess, onError } = options;
  file.value = uploadFile;

  // 读取文件以进行前端回显
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(uploadFile);

  // 这里可以添加上传文件到服务器的逻辑，但因为我们希望在注册时一起发送，所以这里只存储文件
  onSuccess({}, uploadFile);
};

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};

// 表单提交验证
async function validateRegister() {
  // 验证邮箱格式
  if (!validateEmail(email.value)) {
    ElMessage.error('邮箱格式不正确');
    return false;
  }
  // 验证密码长度和字符类型
  if (!validatePassword(password.value)) {
    ElMessage.error('密码长度不能小于8，且必须包含大小写字母和数字');
    return false;
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.error('两次密码输入不一致');
    return false;
  }
  const response = await register(
      {
        username: id.value,
        password: password.value,
        email: email.value,
        code: check.value,
        profilePicture: imageUrl.value
      }
  );
  if (response.ok) {
    const userData = {
      name: id.value,
      email: email.value,
      profilePicture: imageUrl.value,
    };
    // 将用户信息存储在 sessionStorage 中
    sessionStorage.setItem('userData', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage')); // 手动触发storage事件
    emit('close');
    emit('Success');
  } else if (response.message === "验证码错误或已过期") {
    ElMessage.error('验证码错误或已过期');
  } else {
    ElMessage.error(response.message);
  }
}
// 邮箱格式验证
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
// 密码验证
function validatePassword(password: string) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
}
// 发送验证码
async function sendVerificationCode() {
  if (isSending.value) return; // 如果正在发送验证码，则直接返回

  const response = await sendCode(
      email.value
  );
  if (response.ok) {
    ElMessage.success('验证码已发送，请查收邮箱！');
    startCountdown();
  } else {
    ElMessage.error('发送验证码失败，请稍后再试');
  }
}

// 启动倒计时
function startCountdown() {
  isSending.value = true;
  let timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isSending.value = false;
      countdown.value = 60;
    }
  }, 1000);
}

// 返回登录界面
function login() {
  emit('login');
}

const emit = defineEmits(['close', 'login', 'Success']);
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
.toggle-link {
  text-align: center;
  margin-top: 5vh;
  /* 添加鼠标悬停时的样式 */
  cursor: pointer;
}
</style>
