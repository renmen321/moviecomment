<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <nav class="sidebar">
      <div class="nav-title">
        <span class="logo">📈</span>
        Admin Analytics
      </div>
      <div class="nav-items">
        <!-- 使用 v-for 指令遍历 menus 数组，生成导航项 -->
        <a
            v-for="item in menus"
            :key="item.path"
            @click="router.push(item.path)"
            class="nav-item"
            :class="{ 'active': activeMenu === item.path }"
        >
          <span class="icon">{{ item.icon }}</span> <!-- 显示菜单项的图标 -->
          <span class="text">{{ item.text }}</span> <!-- 显示菜单项的文字 -->
          <div class="hover-indicator"></div> <!-- 用于指示鼠标悬停效果的占位符 -->
        </a>
      </div>
    </nav>

    <!-- 评论管理主内容区 -->
    <main v-if="activeMenu === 'comment'" class="content-area">
      <div class="operation-bar">
        <el-input
            v-model="searchQuery"
            placeholder="搜索电影名称..."
            clearable
            style="width: 300px"
            @keyup.enter="searchMovies"
        />
        <el-button type="primary" @click="searchMovies">搜索</el-button>
      </div>

      <!-- 当前电影评论展示 -->
      <div v-if="currentMovie" class="movie-comments">
        <h3 class="movie-title">{{ currentMovie.title }} 评论管理</h3>

        <el-tabs v-model="activeCommentType">
          <el-tab-pane
              v-for="t in commentTypes"
              :key="t.type"
              :label="`${t.label} (${currentCommentCounts[t.type]})`"
              :name="t.type"
          >
            <el-table
                :data="currentMovie.comments.filter(c => c.type === t.type)"
                height="500"
                border
                v-loading="loading"
            >
              <el-table-column prop="user" label="用户" width="120" />
              <el-table-column prop="content" label="评论内容" min-width="300" />
              <el-table-column prop="time" label="时间" width="150" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button
                      type="danger"
                      size="mini"
                      @click="deleteComment(row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 电影分页 -->
            <el-pagination
                background
                layout="prev, pager, next, jumper"
                :total="filteredMovies.length"
                :page-size="1"
                @current-change="handlePageChange"
                style="margin: 20px 0;"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { router } from "@/router";

interface Comment {
  type: 'good' | 'medium' | 'bad'
  content: string
  user: string
  time: string
}

interface Movie {
  id: number
  title: string
  comments: Comment[]
}

// 模拟数据
const movies = reactive<Movie[]>([
  {
    id: 1,
    title: "肖申克的救赎",
    comments: [
      { type: 'good', content: '经典之作，百看不厌', user: '影迷A', time: '2025-03-30' },
      { type: 'bad', content: '节奏太慢看不下去', user: '用户B', time: '2025-03-29' },
      { type: 'medium', content: '剧情不错但拍摄手法老旧', user: '观众C', time: '2025-03-28' }
    ]
  },
  {
    id: 2,
    title: "阿甘正传",
    comments: [
      { type: 'good', content: '充满人生哲理', user: '哲学爱好者', time: '2025-03-25' },
      { type: 'good', content: '汤姆·汉克斯演技炸裂', user: '影评人D', time: '2025-03-24' }
    ]
  }
])

// 响应式状态
const activeMenu = ref('comment')
const searchQuery = ref('')
const currentPage = ref(1)
const loading = ref(false)
const activeCommentType = ref('good')
const commentTypes = reactive([
  { type: 'good', label: '好评' },
  { type: 'medium', label: '中评' },
  { type: 'bad', label: '差评' }
])

// 计算属性
const filteredMovies = computed(() => {
  return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentMovie = computed(() => {
  return filteredMovies.value[currentPage.value - 1]
})

const currentCommentCounts = computed(() => {
  const counts = { good: 0, medium: 0, bad: 0 }
  currentMovie.value?.comments?.forEach(c => counts[c.type]++)
  return counts
})

// 方法
const searchMovies = () => {
  currentPage.value = 1
}

const handlePageChange = (val: number) => {
  currentPage.value = val
}

const deleteComment = (comment: Comment) => {
  ElMessageBox.confirm('确定删除该评论？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    const movieIndex = movies.findIndex(m => m.id === currentMovie.value?.id);
    if (movieIndex > -1) {
      // 找到当前电影的所有评论
      const comments = movies[movieIndex].comments;
      // 找到评论在数组中的索引
      const commentIndex = comments.findIndex(c =>
          c.type === comment.type &&
          c.content === comment.content &&
          c.user === comment.user &&
          c.time === comment.time
      );
      if (commentIndex > -1) {
        comments.splice(commentIndex, 1); // 删除评论
        ElMessage.success('删除成功');
      }
    }
  });
}

// 导航菜单
const menus = [
  { path: '/TodayComment', icon: '📊', text: '今日评论' },
  { path: '/FeedBackAdmin', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/CommentManage', icon: '💬', text: '评论管理' },
  { path: '/Admin', icon: '👤', text: '账号管理' },
]
</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

/* 侧边栏动态特效 */
.sidebar {
  background: linear-gradient(195deg, #1a1a1a, #2d2d2d);
  color: white;
  position: sticky;
  top: 0;
  height: 100vh;
  box-shadow: 4px 0 12px rgba(0,0,0,0.1);
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5vh;
  margin-top: 2vh;
  display: flex;
  align-items: center;
  gap: 2vh;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
}

.nav-item {
  position: relative;
  color: rgba(255,255,255,0.8);
  padding: 2vh 1vw;
  margin: 2vh 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 2vh;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255,255,255,0.05);
    transform: translateX(8px);

    .hover-indicator {
      opacity: 1;
      width: 3px;
    }
  }

  &.active {
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
}

.hover-indicator {
  position: absolute;
  height: 60%;
  width: 0;
  border-radius: 2px;
  opacity: 0;
  transition: all 0.3s;
}

.content-area {
  padding: 2vh;
}

.operation-bar {
  display: flex;
  gap: 2vh;
  margin-bottom: 2vh;
}

.movie-comments {
  background: white;
  padding: 2vh;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  .movie-title {
    color: #303133;
    margin-bottom: 2vh;
  }
}

.el-tabs {
  margin-top: 2vh;
}

.el-pagination {
  justify-content: center;
}
</style>
