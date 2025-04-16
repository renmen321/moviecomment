<!-- src/components/LoginForm.vue -->
<template>
  <div class="body login-register-bg">
    <div class="auth-card">
      <h2>登录</h2>
      <form @submit.prevent="validateLogin">
        <div class="form-group">
          <input type="text" id="id" v-model="id" placeholder="用户名">
        </div>
        <div class="form-group">
          <input type="password" id="loginPassword" v-model="password" placeholder="密码">
        </div>
        <button type="submit">立即登录</button>
      </form>
      <div class="link">
        <div class="toggle-link">
          <a @click="emit('reset')">忘记密码？</a>
        </div>
        <div class="toggle-link">
          <a @click="emit('register')">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/test';

const router = useRouter();
const id = ref('');
const password = ref('');

async function validateLogin() {
  const response = await login({
    username: id.value,
    password: password.value,
  });
  if (response.ok) {
    const userData = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      profilePicture: response.data.profilePicture,
      token: response.data.token,
      admin: response.data.admin,
    };
    // 将用户数据存储在 sessionStorage 中
    sessionStorage.setItem('userData', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage')); // 手动触发storage事件
    emit('close');
  } else {
    ElMessage.error(response.message);
  }
}

const emit = defineEmits(['close', 'reset', 'register']);
</script>

<style scoped>
@import "@/assets/styles/common.css";
</style>
