<template>
  <div class="body">
    <div class="auth-card">
      <h2>密码重置</h2>
      <form @submit.prevent="validateRegister">
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
          <input v-model="password" type="password" id="password" placeholder="密码（至少6位）" minlength="6" required />
        </div>
        <div class="form-group1">
          <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="确认密码" required />
        </div>
        <button type="submit">更改</button>
      </form>
      <div class="toggle-link">
        <a @click="login">返回登录</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";

const email = ref('');
const check = ref('');
const password = ref('');
const confirmPassword = ref('');
let verificationCode = 'ttt'; // 假设这是正确的验证码

const router = useRouter();
const isSending = ref(false);
const countdown = ref(60);

function validateRegister() {
  // 验证密码长度和字符类型
  if (!validatePassword(password.value)) {
    ElMessage.error('密码长度不能小于8，且必须包含大小写字母和数字');
    return false;
  }
  if (password.value !== confirmPassword.value) {

    ElMessage.error('两次密码输入不一致');
    return false;
  }
  if (check.value !== verificationCode) {
    ElMessage.error('验证码错误或已过期');
    return false;
  }
  // 这里可以添加密码重置的逻辑
  emit('close');
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
function sendVerificationCode() {
  // 邮箱格式验证
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    ElMessage.error('邮箱格式不正确');
    return;
  }
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

function login() {
  emit('login');
}

const emit = defineEmits(['close', 'login']);
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
