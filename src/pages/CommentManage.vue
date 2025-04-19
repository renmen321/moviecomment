<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

    <!-- 评论管理主内容区 -->
    <main v-if="activeMenu === 'comment'" class="content-area">
      <div class="operation-bar">
        <el-input
            v-model="searchQuery"
            placeholder="搜索电影名称..."
            clearable
            style="width: 20vw"
            @keyup.enter="searchMovies"
        />
        <el-button type="primary" @click="searchMovies">搜索</el-button>
        <el-select v-model="selectedMovieId" placeholder="选择电影" style="width: 20vw; margin-left: 40vw;">
          <el-option
              v-for="movie in movies"
              :key="movie.id"
              :label="movie.movieChineseName"
              :value="movie.id"
          />
        </el-select>
      </div>

      <!-- 当前电影评论展示 -->
      <div v-if="currentMovie" class="movie-comments">
        <h3 class="movie-title">{{ currentMovie.movieChineseName }} 评论管理</h3>

        <el-tabs v-model="activeCommentType">
          <el-tab-pane
              v-for="t in commentTypes"
              :key="t.type"
              :label="`${t.label} (${currentCommentCounts[t.type]})`"
              :name="t.type"
          >
            <el-table
                :data="paginatedComments"
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
            <!-- 评论分页 -->
            <el-pagination
                background
                layout="prev, pager, next, jumper"
                :total="currentCommentCounts[t.type]"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="handlePageChange"
                style="margin-left: 30vw;"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminSidebar from '@/components/AdminSidebar.vue';

interface Comment {
  type: 'good' | 'general' | 'bad'
  content: string
  user: string
  time: string
  movieId: number
}

interface Movie {
  id: number
  movieChineseName: string
}

// 模拟数据
const movies = reactive<Movie[]>([
  {
    id: 1,
    movieChineseName: "肖申克的救赎"
  },
  {
    id: 2,
    movieChineseName: "阿甘正传"
  }
])

const comments = reactive<Comment[]>([
  { type: 'good', content: '经典之作，百看不厌', user: '影迷A', time: '2025-03-30', movieId: 1 },
  { type: 'bad', content: '节奏太慢看不下去', user: '用户B', time: '2025-03-29', movieId: 1 },
  { type: 'general', content: '剧情不错但拍摄手法老旧', user: '观众C', time: '2025-03-28', movieId: 1 }
])

// 响应式状态
const activeMenu = ref('comment')
const searchQuery = ref('')
const selectedMovieId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const activeCommentType = ref('good')
const commentTypes = reactive([
  { type: 'good', label: '好评' },
  { type: 'general', label: '中评' },
  { type: 'bad', label: '差评' }
])

// 计算属性
const filteredMovies = computed(() => {
  return movies.filter(movie =>
      movie.movieChineseName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentMovie = computed(() => {
  if (selectedMovieId.value !== null) {
    return movies.find(movie => movie.id === selectedMovieId.value);
  }
  return filteredMovies.value[currentPage.value - 1];
})

const currentComments = computed(() => {
  return comments.filter(comment => comment.movieId === currentMovie.value?.id);
})

const currentCommentCounts = computed(() => {
  const counts = { good: 0, general: 0, bad: 0 }
  currentComments.value.forEach(c => counts[c.type]++)
  return counts
})

const paginatedComments = computed(() => {
  const comments = currentComments.value.filter(c => c.type === activeCommentType.value);
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return comments.slice(start, end);
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
    const commentIndex = comments.findIndex(c =>
        c.type === comment.type &&
        c.content === comment.content &&
        c.user === comment.user &&
        c.time === comment.time &&
        c.movieId === comment.movieId
    );
    if (commentIndex > -1) {
      comments.splice(commentIndex, 1); // 删除评论
      ElMessage.success('删除成功');
    }
  });
}

// 监听 selectedMovieId 的变化
watch(selectedMovieId, (newVal) => {
  if (newVal !== null) {
    currentPage.value = 1;
  }
})

// 监听 activeCommentType 的变化
watch(activeCommentType, () => {
  currentPage.value = 1;
})
</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

/* 内容区域 */
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
}

.movie-title {
  color: #303133;
  margin-bottom: 2vh;
}
</style>
