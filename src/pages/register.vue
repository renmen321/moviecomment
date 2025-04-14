<template>
  <div class="body">
    <div class="auth-card">
      <h2>注册</h2>
      <form @submit.prevent="validateRegister">
        <div class="form-group1">
          <input v-model="id" type="text" id="id" placeholder="用户名" required />
        </div>
        <div class="form-group1">
          <input v-model="email" type="email" id="email" placeholder="电子邮箱" required />
        </div>
        <div class="form-group2">
          <input v-model="check" type="text" id="check" placeholder="验证码" required />
          <button type="button" @click="sendVerificationCode">发送验证码</button>
        </div>
        <div class="form-group1">
          <input v-model="password" type="password" id="password" placeholder="密码（至少6位）" minlength="6" required />
        </div>
        <div class="form-group1">
          <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="确认密码" required />
          <p class="password-check" :style="{ display: passwordError ? 'block' : 'none' }">两次密码输入不一致</p>
        </div>
        <p class="verification-check" :style="{ display: verificationError ? 'block' : 'none' }">验证码错误或已过期</p>
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
import { router } from '@/router/index.js';
import {sendCode,register} from "@/api/test.ts";

const id = ref('');
const email = ref('');
const check = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref(false);
const verificationError = ref(false);

// 表单提交验证
async function validateRegister() {

  if (password.value !== confirmPassword.value) {
    passwordError.value = true;
    verificationError.value = false;
    return false;
  }
  const respose=await register(
      {
        username: id.value,
        password: password.value,
        email: email.value,
        code : check.value
      }
  );
  if (respose.ok) {
    passwordError.value = false;
    verificationError.value = false;
    Comment();
  }else if(respose.message=="验证码错误或已过期"){
    verificationError.value = true;
  }else {
    alert('注册失败，请稍后再试');
  }
  passwordError.value = false;
}

// 发送验证码
async function sendVerificationCode() {
  const respose=await sendCode(
    email.value
  );
  if(respose.ok){
    alert('验证码已发送，请查收邮箱！');
  }else{
    alert('发送验证码失败，请稍后再试');
  }
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
</style>
