<template>
  <div class="comment-container">
    <!-- 标题区 -->
    <div class="header-section">
      <h2 class="title-text">历史评论</h2>
    </div>

    <!-- 评论列表 -->
    <el-table
        :data="comments"
        style="width: 100%"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        empty-text="暂无评论"
    >
      <el-table-column
          prop="movieName"
          label="影视作品"
          width="100%"
          align="center"
          show-overflow-tooltip
      />
      <el-table-column
          prop="date"
          label="评论时间"
          width="100%"
          align="center"
          show-overflow-tooltip
      />
      <el-table-column
          prop="comment"
          label="评论内容"
          min-width="120%"
          show-overflow-tooltip
      />
      <el-table-column
          prop="type"
          label="类型"
          min-width="30%"
          show-overflow-tooltip
      />
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-wrapper">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, reactive} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {getCommentByUid} from "@/api/User.ts";

interface Comment {
  username: string;
  date: string;
  comment: string;
  type: string;
  movieName: string;
}


 let comments =reactive<Comment[]>([]);

onMounted(async () => {
  const userData = sessionStorage.getItem('userData'); // 使用 sessionStorage 而不是 localStorage
  if (userData) {
    const parsedData = JSON.parse(userData);
    const response = await getCommentByUid(parsedData.id, pageNum.value, pageSize.value);
    if (response.ok) {
      total.value = response.data.total;
      comments.length=0;
      comments.push(...response.data.list);
    } else {
      ElMessage.info("评论加载失败")
    }
  }

});


const emit = defineEmits(['delete'])

// 分页配置
let pageNum = ref(1)
let pageSize = ref(10)
let total = ref(0);


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
const handlePageChange = async (newPage: number) => {
  pageNum.value = newPage;
  const userData = sessionStorage.getItem('userData'); // 使用 sessionStorage 而不是 localStorage
  if (userData) {
    const parsedData = JSON.parse(userData);
    const response = await getCommentByUid(parsedData.id, pageNum.value, pageSize.value);
    if (response.ok) {
      total.value = response.data.total;
      comments.length = 0;
      comments.push(...response.data.list);
    } else {
      ElMessage.info("评论加载失败")
    }
  }

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
  transform: scale(1); /* 新增：解决定位偏移 */
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
