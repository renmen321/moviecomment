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
        <button @click="toUser()" class="nav-item">{{ userName }}</button>
        <button @click="logout()" class="nav-item">退出</button>
      </template>
      <template v-else>
        <button @click="toLogin()" class="nav-item">登录</button>
        <button @click="toRegister()" class="nav-item">注册</button>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from "@/assets/images/logo.jpg";
import { router } from "@/router";
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false);
const userName = ref('');

onMounted(() => {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    isLoggedIn.value = true;
    userName.value = parsedData.name;
  }
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

function toLogin() {
  router.push('/Login');
}

function toRegister() {
  router.push('/Register');
}

function logout() {
  localStorage.removeItem('userData');
  router.push('/Login');
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: rgba(44, 62, 80, 0.2);
  /* 使用带透明度的背景色 */
  backdrop-filter: blur(10px);
  /* 标准语法 */
  -webkit-backdrop-filter: blur(10px);
  /* Safari 兼容 */
  position: fixed;
  width: 100vw;
  z-index: 10;
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
  margin: 0 5px;
  transition: all 0.3s;
  user-select: none; /* 禁止选中 */
}
.nav-links-right {
  margin-left: 60vw; /* 将按钮推到最右侧 */
}
.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}
</style>
