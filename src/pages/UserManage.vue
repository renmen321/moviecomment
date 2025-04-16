<!-- UserManage.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

    <!-- 内容区域 -->
    <main class="content-area">
      <div class="user-management">
        <div class="search-bar">
          <el-input
              v-model="searchQuery"
              placeholder="搜索用户"
              class="search-input"
          >
            <template #prefix>
              <el-icon><el-icon-search /></el-icon>
            </template>
          </el-input>
        </div>

        <el-table
            :data="filteredUsers"
            style="width: 100%"
            :header-cell-style="{ background: '#f8f8f8', color: '#333' }"
        >
          <el-table-column label="头像" width="100%">
            <template #default="scope">
              <el-image
                  :src="scope.row.avatarUrl"
                  class="avatar"
                  fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="100%" />
          <el-table-column prop="name" label="姓名" width="100%" />
          <el-table-column label="喜欢的电影类型" width="240%">
            <template #default="scope">
              <div class="movie-tags">
                <el-tag
                    v-for="genre in scope.row.movieTypes"
                    :key="genre"
                    type="info"
                    class="movie-tag"
                >
                  {{ genre }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="喜欢的电影" width="240%">
            <template #default="scope">
              <div class="movies">
                <el-tag
                    v-for="movie in scope.row.favoriteMovies"
                    :key="movie"
                    type="info"
                    class="movie"
                >
                  {{ movie }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="slogan" label="个人标签" width="250%" />
        </el-table>

        <el-pagination
            background
            layout="prev, pager, next"
            :total="users.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            class="pagination"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from "@/components/AdminSidebar.vue";

const router = useRouter()
const route = useRoute()

// 响应式状态管理
const users = ref([
  {
    avatarUrl: 'https://via.placeholder.com/40',
    username: 'user1',
    name: '张三',
    movieTypes: ['动作', '喜剧'],
    favoriteMovies: ['无间道', '唐人街探案'],
    slogan: '生活即战斗'
  },
  {
    avatarUrl: 'https://via.placeholder.com/40',
    username: 'user2',
    name: '李四',
    movieTypes: ['科幻', '爱情'],
    favoriteMovies: ['星际穿越', '泰坦尼克号'],
    slogan: '探索未知'
  },
  // 添加更多用户数据
])

// 导航菜单配置
const menus = [
  { path: '/TodayComment', icon: '📊', text: '今日评论' },
  { path: '/FeedBackAdmin', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/CommentManage', icon: '💬', text: '评论管理' },
  { path: '/UserManage', icon: '👤', text: '用户管理' },
]

// 搜索功能
const searchQuery = ref('')
const filteredUsers = computed(() => {
  return users.value.filter(user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 分页功能
const currentPage = ref(1)
const pageSize = 10

// 退出功能

</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

/* 内容区域美化 */
.content-area {
  padding: 2vw;
  background: #f8f7f7;
  overflow-y: auto; /* 添加垂直滚动条 */
}

.user-management {
  width: auto;
  padding: 2vw;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.search-bar {
  margin-bottom: 3vh;
}

.search-input {
  width: 15vw;
}

.avatar {
  width: 4.5vw;
  height: 7vh;
  border-radius: 50%;
}

.movie-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
}

.movie-tag {
  border-radius: 20px; /* 设置为椭圆样式 */
  padding: 1vw 1vh;
  font-size: 12px;
}

.movies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.movie {
  border-radius: 20px; /* 设置为椭圆样式 */
  padding: 1vw 1vh;
  font-size: 12px;
}

.pagination {
  margin-top: 2vh;
  display: flex;
  justify-content: flex-end;
}
</style>
