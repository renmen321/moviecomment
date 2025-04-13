<!-- pinglun.vue -->
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

    <!-- 内容区域 -->
    <main class="content-area">
      <section class="stats-section">
        <div class="stats-grid">
          <!-- 今日评论统计 -->
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>今日评论</span>
              </div>
            </template>
            <div class="stat-value">{{ statsData.todayComments }}</div>
            <el-progress
                :percentage="statsData.commentProgress"
                :stroke-width="8"
                :color="customColors"
                status="success"
            />
          </el-card>

          <!-- 情感分析统计 -->
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>评论情感分析</span>
              </div>
            </template>
            <div class="sentiment-progress">
              <div class="progress-item">
                <span>好评 ({{ statsData.sentiment.good }}%)</span>
                <el-progress
                    :percentage="statsData.sentiment.good"
                    :stroke-width="16"
                    color="#67C23A"
                />
              </div>
              <div class="progress-item">
                <span>中评 ({{ statsData.sentiment.medium }}%)</span>
                <el-progress
                    :percentage="statsData.sentiment.medium"
                    :stroke-width="16"
                    color="#E6A23C"
                />
              </div>
              <div class="progress-item">
                <span>差评 ({{ statsData.sentiment.bad }}%)</span>
                <el-progress
                    :percentage="statsData.sentiment.bad"
                    :stroke-width="16"
                    color="#F56C6C"
                />
              </div>
            </div>
          </el-card>

          <!-- 评论列表 -->
          <el-card class="stat-card comment-list">
            <template #header>
              <div class="card-header">
                <span>最新评论</span>
              </div>
            </template>
            <el-table :data="initialComments" style="width: 100%">
              <el-table-column prop="user" label="用户名" width="120" />
              <el-table-column prop="movie" label="电影" width="150" />
              <el-table-column prop="content" label="评论" />
              <el-table-column prop="sentiment" label="好中坏" width="100">
                <template #default="{ row }">
                  <el-tag :type="getSentimentType(row.sentiment)" effect="dark">
                    {{ row.sentiment }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" width="120" />
            </el-table>

            <!-- 加载更多按钮 -->
            <div class="load-more-wrapper">
              <el-button
                  type="primary"
                  @click="showAllCommentsDialog"
              >
                加载更多
              </el-button>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 所有评论弹窗 -->
      <el-dialog
          v-model="allCommentsDialogVisible"
          title="所有评论"
          width="80%"
          top="5vh"
      >
        <div class="all-comments-management">
          <!-- 搜索和分页控制 -->
          <div class="pagination-controls">
            <el-input
                v-model="movieSearch"
                placeholder="搜索电影名称"
                clearable
                style="width: 300px"
            />
            <div class="pagination-group">
              <el-pagination
                  background
                  :total="totalComments"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  @current-change="handlePageChange"
                  :page-count="Math.ceil(totalComments / pageSize)"
                  layout="prev, pager, next, jumper"
              />
            </div>
          </div>

          <!-- 评论表格 -->
          <el-table
              :data="paginatedComments"
              stripe
              border
              style="width: 100%"
              class="custom-table"
              empty-text="暂无评论数据"
          >
            <el-table-column prop="user" label="用户名" width="120" />
            <el-table-column prop="movie" label="电影" width="150" />
            <el-table-column prop="content" label="评论" />
            <el-table-column prop="sentiment" label="好中坏" width="100">
              <template #default="{ row }">
                <el-tag :type="getSentimentType(row.sentiment)" effect="dark">
                  {{ row.sentiment }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="120" />
          </el-table>
        </div>
      </el-dialog>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElCard, ElProgress, ElTable, ElTableColumn, ElAvatar, ElRate, ElButton, ElMessage, ElTag } from 'element-plus'

const router = useRouter() // 获取 Vue Router 实例
const route = useRoute() // 获取当前路由信息

const statsData = reactive({
  todayComments: 1347,
  commentProgress: 72,
  sentiment: {
    good: 68,
    medium: 25,
    bad: 7
  },
  comments: [
    {
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    },
    {
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    },
    {
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    },
    {
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    } ,{
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    },
    {
      user: '用户A',
      movie: '肖申克的救赎', // 添加电影名称
      content: '产品体验非常棒，界面美观易用',
      sentiment: '好评', // 好中坏标签
      time: '10:30'
    },
    {
      user:  '用户B',
      movie: '阿甘正传', // 添加电影名称
      content: '功能基本满足需求，但加载速度有待优化',
      sentiment: '中评', // 好中坏标签
      time: '11:45'
    }


  ]
})

const customColors = [
  { color: '#67C23A', percentage: 20 },
  { color: '#E6A23C', percentage: 40 },
  { color: '#F56C6C', percentage: 80 }
]

// 弹窗相关状态
const allCommentsDialogVisible = ref(false)
const movieSearch = ref('')

// 新增分页相关状态
const currentPage = ref(1)
const pageSize = ref(10) // 每页显示10条
const totalComments = computed(() => statsData.comments.length)

// 修改后的分页计算属性
const paginatedComments = computed(() => {
  const filtered = statsData.comments.filter(comment =>
      comment.movie.toLowerCase().includes(movieSearch.value.toLowerCase())
  )
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 分页事件处理
const handlePageChange = (val: number) => {
  currentPage.value = val
}
// 修改初始评论显示为前2条
const initialComments = computed(() => statsData.comments.slice(0, 2))


// 方法
const showAllCommentsDialog = () => {
  allCommentsDialogVisible.value = true
  resetSearch()
}



const resetSearch = () => {
  movieSearch.value = ''
}

// 辅助方法
const getSentimentType = (sentiment: string) => {
  if (sentiment === '好评') return 'success'
  if (sentiment === '中评') return 'warning'
  return 'danger'
}

// 导航配置：定义侧边栏的菜单项
const menus = [
  { path: '/ss', icon: '📊', text: '今日评论' },
  { path: '/fankui', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/pinglun', icon: '💬', text: '评论管理' },
  { path: '/user', icon: '👤', text: '用户管理' },
]
// 计算属性：获取当前激活的菜单路径
const activeMenu = computed(() => route.path)
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

/* 统计卡片系统 */
.stat-card {
  margin-bottom: 1vh;
  transition: box-shadow 0.3s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1vw;
}

.sentiment-progress {
  padding: 10px;
}

.progress-item {
  margin: 20px 0;
}

.progress-item span {
  display: block;
  color: #570722;
  font-size: 14px;
}

.comment-list {
  grid-column: 1 / -1;
}

.stat-value {
  font-size: 32px;
  color: #303133;
  text-align: center;
  margin: 2vh 0;
}

/* 加载更多按钮样式 */
.load-more-wrapper {
  text-align: center;
  margin-top: 20px;
}

/* 适配Element Plus组件样式 */
:deep(.el-card__header) {
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table td) {
  padding: 12px 0;
}

/* 新增按钮状态样式 */
:deep(.el-button) {
  transition: all 0.3s ease;
  min-width: 10vw;

}
/* 新增分页控制样式 */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
}

.pagination-group {
  display: flex;
  align-items: center;
  gap: 1vh;
}

:deep(.el-pagination__jump) {
  margin-left: 1vw;
}

:deep(.el-pagination__editor) {
  width: 5vw;
}
</style>
