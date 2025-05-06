<!-- Moviedata.vue -->
<template>
  <!-- 引入导航栏 -->
  <NavBar />
  <div class="container">
    <!-- 电影信息区域 -->
    <div class="movie-info">
      <div class="poster-section">
        <img :src="`https://renmen321.cn:8080/api/images/${movie.image}`" class="poster" alt="电影海报">
      </div>
      <div class="detail-section">
        <div>
          <h1 class="title">{{ movie.movieChineseName }}</h1>
          <div class="meta">
            <span class="year" style="font-size: 2vw; color: #7b7bba">{{ movie.year }}</span>
            <span class="genre" style="color: #bd7474; font-size: 1.2vw; margin-top: 0.9vh">{{ movie.type }}</span>
            <div class="rating" style="font-size: 1.1vw; margin-top: 0.92vh">
              <span v-for="star in movie.ratings" :key="star" class="star">★</span>
              <span class="score">{{ movie.ratings }}</span>
            </div>
          </div>
        </div>
        <!-- 使用 el-card 组件美化剧情简介 -->
        <el-card class="box-card synopsis"
                 style="width:30vw"
                 :body-style="{ maxHeight: '20vh', overflowY: 'auto' }">
          <template #header>
            <div class="card-header">
              <span>剧情简介</span>
            </div>
          </template>
          <p>{{ movie.introduction }}</p>
        </el-card>
      </div>
    </div>
    <!-- 评论区域 -->
    <div class="comment-area">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <h2>观众评论（共 {{ totalComments }} 条）</h2>
            <button class="comment-btn" @click="showCommentModal">发表评论</button>
          </div>
        </template>
        <!-- 使用 el-tabs 和 el-tab-pane 组件分组显示评论 -->
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane :label="`好评（${goodCommentsTotal}）`" name="good" style="background: rgba(76, 175, 80, 0.05);
         border: 2px solid #4CAF50;">
            <div v-for="(comment, index) in goodComments" :key="'good' + index" class="comment-item">
              {{ comment }}
            </div>
            <el-pagination
                background
                :pager-count="4"
                layout="prev, pager, next"
                :total="goodCommentsTotal"
                :page-size="pageSize"
                :current-page="goodCurrentPage"
                @current-change="handleGoodCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane :label="`中评（${mediumCommentsTotal}）`" name="medium" style="background: rgba(255, 193, 7, 0.05);
  border: 2px solid #FFC107;">
            <div v-for="(comment, index) in mediumComments" :key="'medium' + index" class="comment-item">
              {{ comment }}
            </div>
            <el-pagination
                background
                :pager-count="4"
                layout="prev, pager, next"
                :total="mediumCommentsTotal"
                :page-size="pageSize"
                :current-page="mediumCurrentPage"
                @current-change="handleMediumCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane :label="`坏评（${badCommentsTotal}）`" name="bad" style=" background: rgba(244, 67, 54, 0.05);
  border: 2px solid #F44336;">
            <div v-for="(comment, index) in badComments" :key="'bad' + index" class="comment-item">
              {{ comment }}
            </div>
            <el-pagination
                background
                :pager-count="4"
                layout="prev, pager, next"
                :total="badCommentsTotal"
                :page-size="pageSize"
                :current-page="badCurrentPage"
                @current-change="handleBadCurrentChange"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 评论模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>发表你的评论</h3>
        <el-input
            v-model="newComment"
            type="textarea"
            :rows="4"
            placeholder="请输入你的评论..."
            class="comment-input"
        />
        <div class="modal-actions">
          <el-button class="cancel" @click="cancelComment">返回</el-button>
          <el-button type="primary" class="submit" @click="submitComment">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMovieStore } from "@/store/movieStore.ts";
import {reqGetAiResult, reqGetMovieCommentById, reqPostComment} from "@/api/test.ts";
import NavBar from "@/components/Navbar.vue";
import {ElMessage} from "element-plus";

const movieStore = useMovieStore();

const postComment = async (movieId :number, comment :string, type :number) => {
  try {
    const response = await reqPostComment({ movieId, comment, type });
    if (response.ok) {
      // 刷新评论列表
      fetchComments();
    } else {
      console.error('提交评论失败:', response.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

onMounted(async () => {
  movie.value = movieStore.movie;
  if (movie.value.id) {
    fetchComments();
  }
});

// 电影数据
let movie = ref({});

// 模态框状态
const showModal = ref(false);
const newComment = ref('');
const selectedRating = ref('5');

// 分页相关
const pageSize = ref(5); // 每页显示的评论数量

// 好评分页
const goodCurrentPage = ref(1);
const goodComments = ref<string[]>([]);
const goodCommentsTotal = ref(0);

// 中评分页
const mediumCurrentPage = ref(1);
const mediumComments = ref<string[]>([]);
const mediumCommentsTotal = ref(0);

// 差评分页
const badCurrentPage = ref(1);
const badComments = ref<string[]>([]);
const badCommentsTotal = ref(0);

// 当前选中的标签
const activeTab = ref('good');

// 获取评论数据
const fetchComments = async () => {
  try {
    const goodResponse = await reqGetMovieCommentById(movie.value.id, goodCurrentPage.value, pageSize.value, 0);
    goodComments.value = goodResponse.data.list.map(item => item.comment);
    goodCommentsTotal.value = goodResponse.data.total;

    const mediumResponse = await reqGetMovieCommentById(movie.value.id, mediumCurrentPage.value, pageSize.value, 1);
    mediumComments.value = mediumResponse.data.list.map(item => item.comment);
    mediumCommentsTotal.value = mediumResponse.data.total;

    const badResponse = await reqGetMovieCommentById(movie.value.id, badCurrentPage.value, pageSize.value, 2);
    badComments.value = badResponse.data.list.map(item => item.comment);
    badCommentsTotal.value = badResponse.data.total;
  } catch (error) {
    console.error('Error fetching initial comments:', error);
  }
};

// 处理好评页码变化
const handleGoodCurrentChange = async (page: number) => {
  goodCurrentPage.value = page;
  try {
    const response = await reqGetMovieCommentById(movie.value.id, goodCurrentPage.value, pageSize.value, 0);
    goodComments.value = response.data.list.map(item => item.comment);
  } catch (error) {
    console.error('Error fetching good comments:', error);
  }
};

// 处理中评页码变化
const handleMediumCurrentChange = async (page: number) => {
  mediumCurrentPage.value = page;
  try {
    const response = await reqGetMovieCommentById(movie.value.id, mediumCurrentPage.value, pageSize.value, 1);
    mediumComments.value = response.data.list.map(item => item.comment);
  } catch (error) {
    console.error('Error fetching medium comments:', error);
  }
};

// 处理差评页码变化
const handleBadCurrentChange = async (page: number) => {
  badCurrentPage.value = page;
  try {
    const response = await reqGetMovieCommentById(movie.value.id, badCurrentPage.value, pageSize.value, 2);
    badComments.value = response.data.list.map(item => item.comment);
  } catch (error) {
    console.error('Error fetching bad comments:', error);
  }
};

// 计算总评论数
const totalComments = computed(() =>
    goodCommentsTotal.value + mediumCommentsTotal.value + badCommentsTotal.value
);

// 显示评论模态框
const showCommentModal = () => {
  showModal.value = true;
};

// 取消评论
const cancelComment = () => {
  showModal.value = false;
  newComment.value = '';
};

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('评论内容不能为空！');
    return;
  }

  const response = await reqGetAiResult({
    sentence: newComment.value
  })
  let type;
  if (response.prediction_result === "好评") {
    type = 0
  } else if (response.prediction_result === "差评") {
    type = 2
  } else {
    type = 1
  }

  postComment(movie.value.id, newComment.value, type);
  // 根据评分类型将新评论添加到对应数组的开头
  if (type === 0) {
    goodComments.value.unshift(newComment.value);
    goodCommentsTotal.value += 1;
  } else if (type === 1) {
    mediumComments.value.unshift(newComment.value);
    mediumCommentsTotal.value += 1;
  } else if (type === 2) {
    badComments.value.unshift(newComment.value);
    badCommentsTotal.value += 1;
  }
  showModal.value = false;
  newComment.value = '';
  ElMessage.success("评论已提交,是" + response.prediction_result);

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column; /* 竖向排列 */
  border-radius: 1.5vw;
  box-shadow: 0 0.5vh 1.5vh rgba(0, 0, 0, 0.1);
  padding: 10vh 0 0 0;
  width: 100vw;
  height: auto;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/background4.jpg'); /* 添加背景图片 */
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* 电影信息区域 */
.movie-info {
  display: flex;
  gap: 10vw;
  margin-bottom: 2vh;
  justify-content: center;
  align-content: center;
}

.poster {
  display: flex;
  width: 40vh;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.detail-section {
  display: grid;
}

.title {
  font-size: 2.5rem;
  color: #3c91c4;
  margin-bottom: 15px;
}

.meta {
  display: flex;
  gap: 5vw;
  margin-bottom: 20px;
  color: white;
}

.rating {
  color: #ff9800;
}

.synopsis {
  width: 43vw;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  overflow-y: auto; /* 启用垂直滚动 */
}

.synopsis h3 {
  font-size: 1.5rem; /* 调整字体大小 */
  margin-bottom: 10px; /* 添加底部间距 */
}

/* 评论区域 */
.comment-area {
  width: 80vw;
  background: #fff;
  border-radius: 12px;
  padding: 2vw;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 2vh;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s;
}

.comment-btn:hover {
  background: #1976d2;
}

.comment-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  height: 30vh;
}

.comment-column {
  width: 25vw;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}


.el-pager li {
  font-size: 12px !important;
}

.comment-title {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tag {
  font-weight: bold;
  font-size: 1.1rem;
}

.good .tag {
  color: #4CAF50;
}

.medium .tag {
  color: #FFC107;
}

.bad .tag {
  color: #F44336;
}

.comment-list {
  max-height: 23vh;
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.comment-item {
  padding: 10px;
  margin: 8px 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保模态框在最上层 */
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  position: relative; /* 确保内容相对定位 */
  z-index: 1001; /* 确保内容在模态框背景之上 */
}

.comment-input {
  width: 100%;
  height: 100%;
  margin: 15px 0;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: none;
}

.rating-select {
  margin: 15px 0;
}

.rating-select select {
  padding: 8px;
  border-radius: 6px;
  border: 2px solid #ddd;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.modal-actions button {
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.submit {
  background: #4CAF50;
  color: white;
}

.cancel {
  background: #f44336;
  color: white;
}

button:hover {
  opacity: 0.9;
}

/* el-card 样式 */
.box-card {
  width: 100%;
  margin-bottom: 2vh;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.card-header .comment-btn {
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 20px;
}

.comment-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.comment-header .comment-btn {
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 20px;
}

/* el-tabs 样式 */
.el-tabs__item.is-active {
  color: #4CAF50;
}

.el-tabs__nav-wrap::after {
  background: #4CAF50;
}

.el-tabs__content {
  padding: 10px 0;
}

.el-pagination {
  margin-top: 10px;
  justify-content: flex-end;
}
</style>
