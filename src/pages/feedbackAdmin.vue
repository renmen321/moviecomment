<!-- feedBackAdmin.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <nav class="sidebar">
      <div class="nav-title">
        <span class="logo">📩</span> <!-- 修改图标为信封 -->
        Admin Feedback <!-- 修改标题为反馈管理 -->
      </div>
      <div class="nav-items">
        <a
            v-for="item in menus"
            :key="item.path"
            @click="router.push(item.path)"
            class="nav-item"
            :class="{ 'active': activeMenu === item.path }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="text">{{ item.text }}</span>
          <div class="hover-indicator"></div>
        </a>
        <!-- 添加退出按钮 -->
        <a
            @click="logout"
            class="nav-item"
        >
          <span class="icon">🚪</span>
          <span class="text">退出</span>
          <div class="hover-indicator"></div>
        </a>
      </div>
    </nav>

    <!-- 内容区域 -->
    <main class="content-area">
      <section class="feedback-section">
        <!-- 使用Element Plus表格组件 -->
        <el-table
            :data="feedbackList"
            stripe
            border
            style="width: 100%"
            class="custom-table"
            empty-text="暂无反馈数据"
        >
          <el-table-column prop="user" label="用户" width="180" align="center" />
          <el-table-column prop="type" label="类型" width="120" align="center" />

          <!-- 内容摘要列（不可点击） -->
          <el-table-column prop="content" label="内容摘要">
            <template #default="{ row }">
              <span class="content-preview">{{ truncatedContent(row.content) }}</span>
            </template>
          </el-table-column>

          <!-- 状态列（带标签样式） -->
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag
                  :type="row.status === 'resolved' ? 'success' : 'warning'"
                  effect="dark"
                  class="status-tag"
              >
                {{ statusMap[row.status] }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 操作列（带确认对话框） -->
          <el-table-column label="操作" width="220" align="center">
            <template #default="{ row }">
              <el-button
                  type="primary"
                  size="small"
                  @click="openModal(row)"
                  class="action-btn"
              >
                查看
              </el-button>
              <el-popconfirm
                  title="确认标记为解决？"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="markResolved(row)"
              >
                <template #reference>
                  <el-button
                      type="success"
                      size="small"
                      :disabled="row.status === 'resolved'"
                      class="action-btn"
                  >
                    解决
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-wrapper">
          <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="feedbackList.length"
          />
        </div>
      </section>

      <!-- 详情弹窗 -->
      <el-dialog
          v-model="isModalVisible"
          :title="`反馈详情 - ID:${selectedFeedback?.id}`"
          width="60%"
          top="5vh"
      >
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户">{{ selectedFeedback?.user }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ selectedFeedback?.type }}</el-descriptions-item>
          <el-descriptions-item label="完整内容">
            <pre class="content-pre">{{ selectedFeedback?.content }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {ElMessage} from "element-plus";

const router = useRouter()
const route = useRoute()

interface FeedbackItem {
  id: number;
  user: string;
  type: string;
  content: string;
  status: 'pending' | 'resolved';
}
// 反馈数据状态管理
//读取反馈数据
const feedbackList = reactive<FeedbackItem[]>([
  {
    id: 1,
    username: 'user_123',
    type: '功能建议',
    content: '希望增加夜间模式...wdaaddwwdfafda daad awda fwa w',
    status: 'pending'
  },
  {
    id: 2,
    username: 'user_123',
    type: '功能建议',
    content: '希望增加夜间模式...',
    status: 'pending'
  }
])

// 导航菜单配置
const menus = [
  { path: '/TodayComment', icon: '📊', text: '今日评论' },
  { path: '/FeedBackAdmin', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/CommentManage', icon: '💬', text: '评论管理' },
  { path: '/UserManage', icon: '👤', text: '用户管理' },
]

// 计算属性
const activeMenu = computed(() => route.path)
const statusMap: Record<string, string> = {
  pending: '待处理',
  resolved: '已解决'
}

// 模态框相关状态
const isModalVisible = ref(false)
const selectedFeedback = ref<FeedbackItem | null>(null)


// 截断内容摘要的方法
const truncatedContent = (content: string) => {
  if (content.length > 15) {
    return content.slice(0, 15) + '...';
  }
  return content;
}
// 操作方法
const openModal = (item: FeedbackItem) => {
  selectedFeedback.value = item
  isModalVisible.value = true
}

const markResolved = (item: FeedbackItem) => {
  const target = feedbackList.find(f => f.id === item.id)
  if (target) {
    target.status = 'resolved'
    ElMessage.success('状态更新成功')
  }
}
// 退出功能
const logout = () => {
  router.push('/login')
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
  user-select: none; /* 禁止选中 */
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
  user-select: none; /* 禁止选中 */

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

/* 反馈表格优化 */
.custom-table {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  margin-top: 2vh;

  :deep(.el-table__header th) {
    background-color: #f5f7fa;
    font-weight: 600;
  }

  :deep(.el-table__row:hover td) {
    background-color: #f5f7fa !important;
  }
}

.status-tag {
  font-size: 0.9em;
  border-radius: 12px;
}

.action-btn {
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
}

.content-preview {
  color: #409eff;
}

.pagination-wrapper {
  margin-top: 2vh;
  display: flex;
  justify-content: flex-end;
}

.content-pre {
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 1vh;
  border-radius: 4px;
}
</style>
