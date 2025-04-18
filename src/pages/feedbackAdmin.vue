<!-- src/pages/feedbackAdmin.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

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
          <el-table-column prop="username" label="用户" width="180" align="center" />
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
              v-model:page-count="pageNum"
              :pageSize="pageSize"
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
          <el-descriptions-item label="用户">{{ selectedFeedback?.username }}</el-descriptions-item>
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
import {reactive, computed, ref, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {ElMessage} from "element-plus";
import AdminSidebar from '@/components/AdminSidebar.vue';
import {reqGetMovieCommentById} from "@/api/test.ts";
import {GetFeedback, UpdateFeedbackStatus} from "@/api/Feedback.ts";
let pageNum = ref(1);
let pageSize = ref(10);
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  const response =await GetFeedback(pageNum.value,pageSize.value);
  // 清空并替换数组内容（推荐）
  feedbackList.splice(0, feedbackList.length, ...response.data.list);

})
interface FeedbackItem {
  id : number;
  username: string;
  type: string;
  content: string;
  date: string;
  status: 'pending' | 'resolved';
}

// 反馈数据状态管理
//读取反馈数据
let feedbackList = reactive<FeedbackItem[]>([])


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
  selectedFeedback.value = item;
  isModalVisible.value = true;
}

const markResolved = async (item: FeedbackItem) => {
  const target = feedbackList.find(f => f.id === item.id)
  const response = await UpdateFeedbackStatus(target.id, 'resolved');
  if (response.ok) {
    target.status = 'resolved';

    ElMessage.success('状态更新成功');
  }else{
    ElMessage.error('状态更新失败');
  }
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

/* 内容区域 */
.content-area {
  padding-top: 1vh;
  overflow: auto;
}

.feedback-section {
  padding: 2vh;
}

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
