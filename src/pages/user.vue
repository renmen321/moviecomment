<template>
  <!-- 全局导航栏 -->
  <nav class="global-nav">
    <img :src="logo" class="logo" alt="">
    <div class="nav-links">
      <button @click="toComment()" class="nav-item">评价</button>
      <button @click="toMovie()" class="nav-item">影视剧</button>
      <button @click="toFeedBack()" class="nav-item">反馈</button>
    </div>
    <div class="nav-links-right">
      <button @click="toUser()" class="nav-item">账号</button>
    </div>
  </nav>

  <!-- 主体内容容器 -->
  <div class="account-container">
    <!-- 侧边栏卡片 -->
    <el-card class="sidebar-card">
      <div class="sidebar-content">
        <!-- 头像上传组件 -->
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
        >
          <el-image
              v-if="avatarUrl"
              :src="avatarUrl"
              class="avatar"
              fit="cover"
          />

        </el-upload>

        <!-- 导航菜单 -->
        <el-menu
            :default-active="activeNav"
            class="side-menu"
            @select="switchNav"
        >
          <el-menu-item index="personalInfo">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="accountSecurity">
            <el-icon><Lock /></el-icon>
            <span>安全设置</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-card>

    <!-- 内容区卡片 -->
    <el-card class="content-card">
      <component
          :is="activeComponent"
          :form-data="formData"
          @update="handleUpdate"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import PersonalInfo from '@/components/PersonalInfo.vue';
import AccountSecurity from '@/components/AccountSecurity.vue'
import {router} from "@/router";
import logo from "@/assets/images/logo.jpg";
import {ElMessage, UploadRequestOptions} from "element-plus";

const activeNav = ref('personalInfo')
const avatarUrl = ref('') // 头像地址
const formData = ref({
  id: 'wer',
  name: '',
  movieTypes: [],
  favoriteMovie: '',
  tags: '',
  newPassword: '',
  newEmail: ''
})

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

// 组件映射
const componentMap = {
  personalInfo: PersonalInfo,
  accountSecurity: AccountSecurity
}

const activeComponent = computed(() => componentMap[activeNav.value])

const switchNav = (key: string) => {
  activeNav.value = key
}

const beforeAvatarUpload = (file: File) => {
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) ElMessage.error('仅支持 JPG/PNG 格式!')
  if (!isLt5M) ElMessage.error('图片大小不能超过5MB!')
  return isImage && isLt5M
}

const handleAvatarUpload = async (options: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    // 调用上传接口
    avatarUrl.value = URL.createObjectURL(options.file)
    ElMessage.success('头像上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleUpdate = (updatedData: any) => {
  Object.assign(formData.value, updatedData) // 同步更新数据
}
</script>

<style scoped>
/* 公共样式 */
.global-nav {
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
  width: 100%;
  z-index: 1000;
  top: 0;
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
  margin-left: 64vw; /* 将按钮推到最右侧 */
}

.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}

/* 主体布局 */
.account-container {
  max-width: 80%;
  margin:15vh  auto 0; /* 调整上边距以避免被导航栏遮挡 */
  padding: 0 20px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

/* 侧边栏卡片 */
.sidebar-card {
  height: fit-content;

  :deep(.el-card__body) {
    padding: 30px 20px;
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader {
  text-align: center;
  margin-bottom: 30px;
}

/* 导航菜单 */
.side-menu {
  border-right: none;
  width: 100%;
}

/* 头像上传容器 */
.avatar-uploader {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #f0f2f5;
  cursor: pointer;
  transition: all 0.3s;
}

/* 头像图片样式 */
.avatar {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50%;
  background: #f0f2f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 鼠标悬停效果 */
.avatar-uploader:hover {
  transform: scale(1.05);
}

.avatar-uploader:hover {
  color: #409eff;
}

/* 上传组件覆盖element样式 */
:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-upload:hover) {
  border-color: #409eff;
}

/* 内容区卡片 */
.content-card {
  min-height: 80vh;

  :deep(.el-card__body) {
    padding: 30px 40px;
  }
}
</style>
