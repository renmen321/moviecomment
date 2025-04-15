<template>
  <!-- 引入导航栏 -->
  <NavBar />
  <div class="container">
    <!-- 电影信息区域 -->
    <div class="movie-info">
      <div class="poster-section">
        <img :src="`http://127.0.0.1:8080/api/movies/getImage?id=${movie.id}`" class="poster" alt="电影海报">
      </div>
      <div class="detail-section">
        <div>
          <h1 class="title">{{ movie.movieChineseName }}</h1>
          <div class="meta">
            <span class="year" style="font-size: 2vw;color: #7b7bba">{{ movie.year }}</span>
            <span class="genre" style="color: #bd7474;font-size: 1.2vw;margin-top: 0.9vh">{{ movie.type }}</span>
            <div class="rating" style="font-size: 1.1vw;margin-top: 0.92vh">
              <span v-for="star in movie.ratings" :key="star" class="star">★</span>
              <span class="score">{{ movie.ratings }}</span>
            </div>
          </div>
        </div>
        <div class="synopsis">
          <h3>剧情简介</h3>
          <p>{{ movie.introduction }}</p>
        </div>
      </div>
    </div>
    <!-- 评论区域 -->
    <div class="comment-area">
      <div class="comment-header">
        <h2>观众评论（共 {{ totalComments }} 条）</h2>
        <button class="comment-btn" @click="showCommentModal">发表评论</button>
      </div>

      <div class="comment-container">
        <!-- 好评 -->
        <div class="comment-column good">
          <div class="comment-title">
            <span class="tag">好评（{{ goodCommentsTotal }}）</span>
          </div>
          <div class="comment-list">
            <div v-for="(comment, index) in goodComments" :key="'good' + index" class="comment-item">
              {{ comment }}
            </div>
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
        </div>

        <!-- 中评 -->
        <div class="comment-column medium">
          <div class="comment-title">
            <span class="tag">中评（{{ mediumCommentsTotal }}）</span>
          </div>
          <div class="comment-list">
            <div v-for="(comment, index) in mediumComments" :key="'medium' + index" class="comment-item">
              {{ comment }}
            </div>
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
        </div>

        <!-- 差评 -->
        <div class="comment-column bad">
          <div class="comment-title">
            <span class="tag">差评（{{ badCommentsTotal }}）</span>
          </div>
          <div class="comment-list">
            <div v-for="(comment, index) in badComments" :key="'bad' + index" class="comment-item">
              {{ comment }}
            </div>
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
        </div>

      </div>
    </div>
    <!-- 评论模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>发表你的评论</h3>
        <textarea v-model="newComment" placeholder="请输入你的评论..." class="comment-input"></textarea>
        <div class="rating-select">
          <label>评分：</label>
          <select v-model="selectedRating">
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="1">★☆☆☆☆</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="cancel" @click="cancelComment">返回</button>
          <button class="submit" @click="submitComment">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useMovieStore} from "@/store/movieStore.ts";
import {reqGetMovie, reqGetMovieCommentById, reqPostComment} from "@/api/test.ts";
import NavBar from "@/components/Navbar.vue";
const movieStore = useMovieStore();

const postComment = async (id,comment,type) => {
  try {
    const response = await reqPostComment({id,comment,type})
    if (response.ok) {

    } else {
      console.error('提交评论失败:', response.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};


onMounted(async () => {
  movie.value=movieStore.movie;
  if (movie.value.id) {
    try {
      const goodResponse = await reqGetMovieCommentById(movie.value.id, goodCurrentPage.value, pageSize.value, 0);
      goodComments.value = goodResponse.data.list.map(item => item.comment);
      goodCommentsTotal.value=goodResponse.data.total;

      const mediumResponse = await reqGetMovieCommentById(movie.value.id, mediumCurrentPage.value, pageSize.value, 1);
      mediumComments.value = mediumResponse.data.list.map(item => item.comment);
      mediumCommentsTotal.value=mediumResponse.data.total;

      const badResponse = await reqGetMovieCommentById(movie.value.id, badCurrentPage.value, pageSize.value, 2);
      badComments.value = badResponse.data.list.map(item => item.comment);
      badCommentsTotal.value=badResponse.data.total;

    } catch (error) {
      console.error('Error fetching initial comments:', error);
    }
  }
})
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
const submitComment = () => {
  if (!newComment.value.trim()) {
    alert('评论内容不能为空！');
    return;
  }

  const rating = parseInt(selectedRating.value);
  const type = rating >= 4 ? 0 : rating === 3 ? 1 : 2;
  if (rating >= 4) {
    goodComments.value.push(newComment.value);
  } else if (rating === 3) {
    mediumComments.value.push(newComment.value);
  } else {
    badComments.value.push(newComment.value);
  }
  postComment(movie.value.id,newComment.value,type);
  showModal.value = false;
  newComment.value = '';

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
  height:auto;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/background.jpg'); /* 添加背景图片 */
  background-size: cover; /* 使背景图片覆盖整个容器 */
  background-position: center; /* 将背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
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
  color: wheat;
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
  height: 20vh;
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
  height: 45vh;
  width: 80vw;
  background: #fff;
  border-radius: 12px;
  padding: 2VW;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  width:25vw;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.good {
  background: rgba(76, 175, 80, 0.05);
  border: 2px solid #4CAF50;
}

.medium {
  background: rgba(255, 193, 7, 0.05);
  border: 2px solid #FFC107;
}

.bad {

  background: rgba(244, 67, 54, 0.05);
  border: 2px solid #F44336;
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
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
}

.comment-input {
  width: 100%;
  height: 150px;
  margin: 15px 0;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: vertical;
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

</style>