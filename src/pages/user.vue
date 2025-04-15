<template>
  <!-- 全局导航栏 -->
    <NavBar />
  <!-- 主体内容容器 -->
  <div class="account-container">
    <div class="c-box">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed , onMounted } from 'vue'
import { User, Lock, Edit } from '@element-plus/icons-vue'
import PersonalInfo from '@/components/PersonalInfo.vue';
import AccountSecurity from '@/components/AccountSecurity.vue'
import UserComments from '@/components/UserComments.vue'
import NavBar from "@/components/Navbar.vue";


const name = ref('');
const email = ref('');
const profilePicture = ref('');

onMounted(() => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    name.value = parsedData.name;
    email.value = parsedData.email;
    profilePicture.value = parsedData.profilePicture;
  }
});

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
nav {
  position: fixed;
  top: 0; /* 明确坐标 */
  left: 0;
  right: 0;
  height: 60px; /* 固定高度 */
  z-index: 1000; /* 提高层级 */
}
/* 主体布局 */
.account-container {
  border-radius: 1.5vw;
  box-shadow: 0 0.5vh 1.5vh rgba(0, 0, 0, 0.1);
  padding: 10vh 0 0 0;
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/background6.jpg'); /* 添加背景图片 */
  background-size: cover; /* 使背景图片覆盖整个容器 */
  background-position: center; /* 将背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
}
.c-box{
  width: 80%;
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
