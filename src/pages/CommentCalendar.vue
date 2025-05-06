<!-- CommentManage.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

    <!-- 内容区域 -->
    <main class="content-area">
      <section class="stats-section">
        <div class="stats-grid">
          <el-card class="stat-card">
            <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
              style="width: 150px; margin-bottom: 20px;" />

            <div class="stat-value">{{ statsData.todayComments }}</div>
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
                <el-progress :percentage="statsData.sentiment.good" :stroke-width="16" color="#67C23A" />
              </div>
              <div class="progress-item">
                <span>中评 ({{ statsData.sentiment.medium }}%)</span>
                <el-progress :percentage="statsData.sentiment.medium" :stroke-width="16" color="#E6A23C" />
              </div>
              <div class="progress-item">
                <span>差评 ({{ statsData.sentiment.bad }}%)</span>
                <el-progress :percentage="statsData.sentiment.bad" :stroke-width="16" color="#F56C6C" />
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
              <el-table-column prop="username" label="用户名" width="120" />
              <el-table-column prop="movieName" label="电影" width="150" />
              <el-table-column prop="comment" label="评论" />
              <el-table-column prop="type" label="好中坏" width="100">
                <template #default="{ row }">
                  <el-tag :type="getSentimentType(row.type)" effect="dark">
                    {{ row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="时间" width="120" />
            </el-table>

            <!-- 加载更多按钮 -->
            <div class="load-more-wrapper">
              <el-button type="primary" @click="showAllCommentsDialog">
                加载更多
              </el-button>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 所有评论弹窗 -->
      <el-dialog v-model="allCommentsDialogVisible" title="所有评论" width="80%" top="5vh">
        <div class="all-comments-management">
          <!-- 搜索和分页控制 -->
          <div class="pagination-controls">
            <el-input v-model="movieSearch" placeholder="搜索电影名称" clearable style="width: 300px" />
            <div class="pagination-group">
              <el-pagination background :total="totalComments" :page-size="pageSize" :current-page="currentPage"
                @current-change="handlePageChange" :page-count="Math.ceil(statsData.todayComments / pageSize)"
                layout="prev, pager, next, jumper" />
            </div>
          </div>

          <!-- 评论表格 -->
          <el-table :data="statsData.comments" stripe border style="width: 100%" class="custom-table"
            empty-text="暂无评论数据">
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="movieName" label="电影" width="150" />
            <el-table-column prop="comment" label="评论" />
            <el-table-column prop="type" label="好中坏" width="100">
              <template #default="{ row }">
                <el-tag :type="getSentimentType(row.type)" effect="dark">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="时间" width="120" />
          </el-table>
        </div>
      </el-dialog>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElCard, ElProgress, ElTable, ElTableColumn, ElButton, ElTag, ElMessage } from 'element-plus'
import { getTypePercentageByDate, reqGetAdminCommentByDate } from "@/api/test.ts";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { watch } from 'vue'

const router = useRouter() // 获取 Vue Router 实例
const route = useRoute() // 获取当前路由信息
interface StatsData {
  todayComments: number;
  commentProgress: number;
  sentiment: Sentiment;
  comments: any[];
}
interface Sentiment {
  good: number;
  medium: number;
  bad: number;
}
const statsData = reactive<StatsData>({
  todayComments: 0,
  commentProgress: 0,
  sentiment: {
    good: 0,
    medium: 0,
    bad: 0
  },
  comments: []
});
// 响应式状态
const selectedDate = ref('2025-04-15');
onMounted(async () => {
  await loadCommentsByDate();
})
watch(selectedDate, () => {
  loadCommentsByDate()
})
onMounted(async () => {
  const response = await reqGetAdminCommentByDate(selectedDate.value, 1, 12);
  if (response.ok) {
    statsData.comments = response.data.list;
    statsData.todayComments = response.data.total;
  } else {
    console.error('Error fetching comments:', response.message);
  }
  const response1 = await getTypePercentageByDate(selectedDate.value);
  if (response1.ok) {
    statsData.sentiment.good = parseFloat(response1.data.goodPercentage.toFixed(2));
    statsData.sentiment.medium = parseFloat(response1.data.generalPercentage.toFixed(2));
    statsData.sentiment.bad = parseFloat(response1.data.badPercentage.toFixed(2));
  } else {
    console.error('Error fetching PercentageByDate', response.message);
  }
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



// 分页事件处理
const handlePageChange = async (val: number) => {
  currentPage.value = val;
  const response = await reqGetAdminCommentByDate(selectedDate.value, currentPage.value, pageSize.value);
  statsData.comments = response.data.list;
  statsData.todayComments = response.data.total;

}
// 修改初始评论显示为前2条
const initialComments = computed(() => statsData.comments.slice(0, 5))


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

</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
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
