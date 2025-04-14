<template>
  <div class="body">
    <div class="auth-card">
      <h2>注册</h2>
      <form @submit.prevent="validateRegister">
        <div class="form-group1">
          <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="form-group1">
          <input v-model="id" type="text" id="id" placeholder="用户名" required />
        </div>
        <div class="form-group1">
          <input v-model="email" type="email" id="email" placeholder="电子邮箱" required />
          <p class="email-check" :style="{ display: emailError ? 'block' : 'none' }">邮箱格式不正确</p>
        </div>
        <div class="form-group2">
          <input v-model="check" type="text" id="check" placeholder="验证码" required />
          <button type="button" @click="sendVerificationCode" :disabled="isSending">
            {{ isSending ? `${countdown} 秒后重试` : '发送验证码' }}
          </button>
        </div>
        <div class="form-group1">
          <input v-model="password" type="password" id="password" placeholder="密码（至少6位）" minlength="6" required />
        </div>
        <div class="form-group1">
          <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="确认密码" required />
          <p class="password-check" :style="{ display: passwordError ? 'block' : 'none' }">两次密码输入不一致</p>
        </div>
        <p class="verification-check" :style="{ display: verificationError ? 'block' : 'none' }">验证码错误</p>
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

const id = ref('');
const email = ref('');
const check = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref(false);
const verificationError = ref(false);
const isSending = ref(false);
const emailError = ref(false);
const countdown = ref(60);
const imageUrl = ref('');
let verificationCode = '123456'; // 假设这是生成的验证码

// 表单提交验证
function validateRegister() {
  if (password.value !== confirmPassword.value) {
    passwordError.value = true;
    verificationError.value = false;
    return false;
  }
  if (check.value !== verificationCode) {
    verificationError.value = true;
    passwordError.value = false;
    return false;
  }
  passwordError.value = false;
  verificationError.value = false;
  Comment();
}

// 发送验证码
function sendVerificationCode() {
  // 邮箱格式验证
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    emailError.value = true;
    return;
  }
  emailError.value = false;
  if (isSending.value) return;

  isSending.value = true;
  verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 生成新的验证码

  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(interval);
      isSending.value = false;
      countdown.value = 60;
    }
  }, 1000);
}

// 处理头像上传成功
function handleAvatarSuccess(res: any, file: any) {
  imageUrl.value = URL.createObjectURL(file.raw);
}

// 上传前检查文件
function beforeAvatarUpload(file: any) {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
  }
  return isJPGorPNG && isLt2M;
}

// 返回登录界面
function login() {
  router.push('/Login');
}

function Comment() {
  router.push('/Comment');
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.body {
  font-family: Arial, sans-serif;
  background-image: url('@/assets/images/background5.jpg'); /* 替换为你的背景图片URL */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.auth-card {
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 背景虚化效果 */
  padding: 4vw;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 25vw;
}
h2 {
  text-align: center;
  color: white;
  font-size: 3vw;
  margin-bottom: 5vh;
  user-select: none; /* 禁止选中 */
}
.form-group1 {
  margin-bottom: 20px;
}
.form-group2 {
  display: flex;
  margin-bottom: 20px;
  gap: 2vw;
}
/* 输入样式 */
input {
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  padding: 2vh;
  border: 1px solid #d7d6d6;
  border-radius: 5px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 2vh;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid white; /* 添加白色边框 */
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background: #6f7777;
}
button:disabled {
  background: #6f7777;
  cursor: not-allowed;
}
.toggle-link {
  text-align: center;
  margin-top: 5vh;
  /* 添加鼠标悬停时的样式 */
  cursor: pointer;
}
a {
  color: #2f2f79;
  text-decoration: none;
}
.password-check {
  color: #e74c3c;
  font-size: 12px;
  display: none;
}
.email-check {
  color: #e74c3c;
  font-size: 12px;
  display: none;
}
.verification-check {
  color: #e74c3c;
  font-size: 12px;
  display: none;
}
::v-deep .avatar-uploader {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  .el-upload {
    border: 2px dashed #ffffff !important;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    overflow: hidden;
    background: rgba(255,255,255,0.2);
    transition: border-color 0.3s;

    &:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      color: #504343;
      font-size: 24px;
      transition: all 0.3s;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
