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
      <button @click="toUser()" class="nav-item">账号</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from "@/assets/images/logo.jpg";
import { router } from "@/router";

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
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  padding: 15px 5rem 15px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: rgba(44, 62, 80, 0.2);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100vw;
  z-index: 10;
}

.logo {
  width: 100px;
  height: auto;
  margin-right: 50px;
  user-select: none;
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
  user-select: none;
}

.nav-links-right {
  margin-left: 64vw;
}

.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}
</style>
