<!-- src/components/Navbar.vue -->
<template>
  <nav>
    <img :src="logo" class="logo" alt="Logo">
    <div class="nav-links">
      <button @click="toComment()" class="nav-item">评价</button>
      <button @click="toMovie()" class="nav-item">影视剧</button>
      <button @click="toFeedBack()" class="nav-item">反馈</button>
    </div>
    <div class="nav-links-right">
      <template v-if="isLoggedIn">
        <button @click="toAdmin()" v-if="isAdmin" class="nav-item">切换管理端</button>
        <button @click="toUser()" class="nav-item">{{ userName }}</button>
        <button @click="logout()" class="nav-item">退出</button>
      </template>
      <template v-else>
        <button @click="showLoginDialog" class="nav-item">登录</button>
        <button @click="showRegisterDialog" class="nav-item">注册</button>
      </template>
    </div>
  </nav>
  <!-- 登录弹出框 -->
  <el-dialog v-model="loginDialogVisible" width="30%" style="--el-dialog-bg-color:rgba(255, 255, 255, 0.1)">
    <LoginForm @close="closeLoginDialog" @reset="showResetDialog" @register="showRegisterDialog" />

  </el-dialog>
  <!-- 注册弹出框 -->
  <el-dialog v-model="registerDialogVisible" width="30%"  style="--el-dialog-bg-color:rgba(255, 255, 255, 0.1)">
    <RegisterForm @close="closeRegisterDialog" @login="showLoginDialog" />
  </el-dialog>
  <!-- 重置密码弹出框 -->
  <el-dialog v-model="resetDialogVisible" width="30%"   style="--el-dialog-bg-color:rgba(255, 255, 255, 0.1)">
    <ResetForm @close="closeResetDialog" @login="showLoginDialog"/>
  </el-dialog>
</template>

<script setup lang="ts">
import logo from "@/assets/images/logo.jpg";
import { router } from "@/router";
import { ref, onMounted, onUnmounted } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import ResetForm from '@/components/ResetForm.vue';

const isLoggedIn = ref(false);
const isAdmin = ref(false);
const userName = ref('');
const loginDialogVisible = ref(false);
const registerDialogVisible = ref(false);
const resetDialogVisible = ref(false);

function updateUserData() {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    isLoggedIn.value = true;
    userName.value = parsedData.name;
    isAdmin.value = parsedData.admin;
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    userName.value = '';
  }
}

onMounted(() => {
  updateUserData();
  window.addEventListener('storage', updateUserData);
});

onUnmounted(() => {
  window.removeEventListener('storage', updateUserData);
});

function toMovie() {
  router.push('/Movie');
}

function toComment() {
  router.push('/Comment');
}

function toFeedBack() {
  router.push('/FeedBack');
}

function toUser() {
  router.push('/User');
}

function toAdmin() {
  router.push('/TodayComment');
}

function logout() {
  sessionStorage.removeItem('userData');
  window.dispatchEvent(new Event('storage')); // 手动触发storage事件
}

function showLoginDialog() {
  loginDialogVisible.value = true;
  registerDialogVisible.value = false;
 resetDialogVisible.value = false;
}

function closeLoginDialog() {
  loginDialogVisible.value = false;
}

function showRegisterDialog() {
  loginDialogVisible.value = false; // 关闭登录弹窗
  registerDialogVisible.value = true;
}

function closeRegisterDialog() {
  registerDialogVisible.value = false;
}

function showResetDialog() {
  loginDialogVisible.value = false; // 关闭登录弹窗
  resetDialogVisible.value = true;
}

function closeResetDialog() {
  resetDialogVisible.value = false;
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 公共样式 */
nav {
  display: flex;
  align-items: center;
  padding: 15px 5rem 15px 30px;
  /* Safari 兼容 */
  position: fixed;
  width: 100vw;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100px;
  /* 根据需要调整图片宽度 */
  height: auto;
  /* 保持图片比例 */
  margin-right: 50px;
  user-select: none; /* 禁止选中 */
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-item {
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid skyblue;
  text-decoration: none;
  padding: 4px 4px;
  font-size: 1.2rem;
  margin: 0 10px;
  transition: all 0.3s;
  user-select: none; /* 禁止选中 */
}
.nav-links-right {
  margin-left: 50vw; /* 将按钮推到最右侧 */
}
.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}
.fixed-height-dialog {
  height: 2px; /* 固定高度 */
}

</style>
