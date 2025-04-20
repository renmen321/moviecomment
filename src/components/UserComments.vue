<template>
  <div class="comment-container">
    <!-- 标题区 -->
    <div class="header-section">
      <h2 class="title-text">历史评论</h2>
    </div>

    <!-- 评论列表 -->
    <el-table
        :data="paginatedComments"
        style="width: 100%"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        empty-text="暂无评论"
    >
      <el-table-column
          prop="movieChineseName"
          label="影视作品"
          width="100%"
          align="center"
          show-overflow-tooltip
      />
      <el-table-column
          prop="time"
          label="评论时间"
          width="100%"
          align="center"
          show-overflow-tooltip
      />
      <el-table-column
          prop="comment"
          label="评论内容"
          min-width="100%"
          show-overflow-tooltip
      />
      <el-table-column
          label="操作"
          width="100%"
          align="center"
      >
        <template #default="{ row }">
          <el-button
              type="danger"
              size="small"
              plain
              @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-wrapper">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Comment {
  id: number
  movieChineseName: string
  time: string
  comment: string
}

const props = defineProps<{
  comments: Comment[]
}>()

const emit = defineEmits(['delete'])

// 分页配置
const currentPage = ref(1)
const pageSize = 8
const total = computed(() => props.comments.length)

// 分页计算
const paginatedComments = computed(() => {
  const from = (currentPage.value - 1) * pageSize
  const to = from + pageSize
  return props.comments.slice(from, to)
})

// 表格样式配置
const headerStyle = {
  backgroundColor: '#F5F7FA',
  color: '#606266',
  fontWeight: 600
}

const cellStyle = {
  color: '#606266',
  fontSize: '14px'
}

// 分页处理
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}

// 删除操作
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定删除这条评论吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('delete', id)
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.comment-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.title-text {
  color: #303133;
  font-size: 18px;
  margin: 0;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  margin-top: 16px;
}

:deep(.el-table__empty-block) {
  min-height: 300px;
}

:deep(.el-button--small) {
  padding: 7px 12px;
}

/* 确保表格内容不超出容器宽度 */
:deep(.el-table__body-wrapper) {
  overflow-x: hidden;
}

/* 截断过长的文本 */
:deep(.el-table__cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
