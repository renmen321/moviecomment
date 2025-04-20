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
              v-if="formData.profilePicture"
              :src="formData.profilePicture"
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
          @update="handleUpdate"
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


const formData = ref({
  profilePicture: '',
  username: '',
  name: '',
  movieTypes: [] as string[],//定义为数组
  favoriteMovie: [] as string[],//定义为数组
  tags: '',
  password: '',
  email: ''
})
onMounted(() => {
  const userData = sessionStorage.getItem('userData'); // 使用 sessionStorage 而不是 localStorage
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.profilePicture = parsedData.profilePicture;
    formData.value.username = parsedData.username;//parsedData.username不显示
    formData.value.name = parsedData.name;
    formData.value.email = parsedData.email;
    formData.value.password = parsedData.password;
    formData.value.movieTypes = ["科幻", "动作"]; // 根据需要初始化
    formData.value.favoriteMovie = ["1","2"]; // 根据需要初始化
    formData.value.tags = ''; // 根据需要初始化

  }
});


const activeNav = ref('personalInfo')



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
  // 设置当前激活的导航项
  activeNav.value = key;
}

const handleDeleteComment = (id: number) => {
  // 查找要删除的评论的索引
  const index = comments.value.findIndex(comment => comment.id === id);
  if (index !== -1) {
    // 如果找到评论，则从 comments 数组中删除该评论
    comments.value.splice(index, 1);
  }
}

const handleUpdate = (updatedData: any) => {
  // 更新 formData 对象，合并新的数据
  formData.value = { ...formData.value, ...updatedData };
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

}
.c-box{
  width: 80%;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 5vw;

}
/* 侧边栏卡片 */
.sidebar-card {
  height: fit-content;
  :deep(.el-card__body) {
    padding:3vh 2vw;
  }
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
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
  width: 9vw;
  height: 14vh;
  border-radius: 50%;
  background: #f0f2f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 头像占位符 */
.avatar-placeholder {
  width: 9vw;
  height: 14.5vh;
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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* 内容区卡片 */
.content-card {
  min-height: 80vh;

  :deep(.el-card__body) {
    padding: 30px 40px;
  }
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
</style>
