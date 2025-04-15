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
        <!-- 头像显示 -->
        <div class="avatar-container">
          <el-image
              v-if="formData.avatarUrl"
              :src="formData.avatarUrl"
              class="avatar"
              fit="cover"
          />
          <div v-else class="avatar-placeholder">
            <el-icon><User /></el-icon>
          </div>
        </div>

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
          <el-menu-item index="userComments">
            <el-icon><Edit /></el-icon>
            <span>历史评论</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-card>

    <!-- 内容区卡片 -->
    <el-card class="content-card">
      <component
          :is="activeComponent"
          :form-data="formData"
          :comments="comments"
          @delete="handleDeleteComment"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Lock, Edit } from '@element-plus/icons-vue'
import PersonalInfo from '@/components/PersonalInfo.vue';
import AccountSecurity from '@/components/AccountSecurity.vue'
import UserComments from '@/components/UserComments.vue'
import { router } from "@/router";
import logo from "@/assets/images/logo.jpg";

const activeNav = ref('personalInfo')

const formData = ref({
  avatarUrl: '',
  id: '',
  name: '',
  movieTypes: [],
  favoriteMovie: '',
  tags: '',
  newPassword: '',
  newEmail: ''
})

// 假设评论数据从某个 API 获取
const comments = ref([
  {
    id: 1,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！这是一部非常棒的电影！这是一部非常棒的电影！'
  },
  {
    id: 2,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 3,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 4,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 5,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 6,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 7,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 8,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },{
    id: 9,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 10,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 11,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 12,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 13,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 14,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  },
  {
    id: 15,
    movieTitle: '电影A',
    date: '2023-10-01 12:34:56',
    content: '这是一部非常棒的电影！'
  },
  {
    id: 16,
    movieTitle: '电影B',
    date: '2023-09-25 09:12:34',
    content: '剧情很吸引人，值得一看。'
  }
])

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
  accountSecurity: AccountSecurity,
  userComments: UserComments // 添加 UserComments 组件
}

const activeComponent = computed(() => componentMap[activeNav.value])

const switchNav = (key: string) => {
  activeNav.value = key
}

const handleDeleteComment = (id: number) => {
  const index = comments.value.findIndex(comment => comment.id === id)
  if (index !== -1) {
    comments.value.splice(index, 1)
  }
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

.avatar-container {
  text-align: center;
  margin-bottom: 30px;
}

/* 头像图片样式 */
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0f2f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 头像占位符 */
.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 24px;
}

/* 导航菜单 */
.side-menu {
  border-right: none;
  width: 100%;
}

/* 内容区卡片 */
.content-card {
  min-height: 80vh;

  :deep(.el-card__body) {
    padding: 30px 40px;
  }
}
</style>
