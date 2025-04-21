<template>
  <NavBar />
  <div class="container">
    <div class="c-box">
      <!-- 标题 -->
      <h1 class="title">评论情感分析系统</h1>
·
      <!-- 输入区 -->
      <div class="input-section">
        <textarea class="comment-input" placeholder="请输入您的评论..." rows="5" v-model="comment" />
        <el-button class="analyze-btn" @click="startAnalysis" :loading="isLoading">
          {{ isLoading ? '分析中...' : '开始分析' }}
        </el-button>
      </div>

      <!-- 结果展示 -->
      <div class="result-card positive" v-if="resultVisible">
        <div class="result-content">
          <svg class="result-icon" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <div class="result-text">
            <h3>{{ resultText }}</h3>
            <p>置信度：{{ confidence*100 }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetAiResult } from "@/api/test.ts";
import { ref } from "vue";
import NavBar from "@/components/Navbar.vue";
import { ElButton,ElMessage} from 'element-plus';

let result = ref();
const fetchGetAiResult = async (data: {
  sentence: string;
}) => {
  const response = await reqGetAiResult(data);
  result.value = response.prediction_result;
  confidence.value = parseFloat(response.probabilities.toFixed(2));
};

let comment = ref();
let isLoading = ref(false); // 控制加载动画的显示
let resultVisible = ref(false);
let resultText = ref();
let confidence = ref();

async function startAnalysis() {
  if (!comment.value.trim()) {
    ElMessage.error("请输入评论内容");
    return;
  }
  // 显示加载动画
  isLoading.value = true;
  resultVisible.value = false;
  try {
    await fetchGetAiResult({
      sentence: comment.value
    });
    isLoading.value = false; // 隐藏加载动画
    // 分析结果
    if (result.value === "好评") {
      resultText.value = "正面评价 😊";
    } else if (result.value === "差评") {
      resultText.value = "负面评价 😞";
    } else {
      resultText.value = "中性评价 😐";
    }

    // 显示结果卡片
    resultVisible.value = true;
  } catch (error) {
    ElMessage.error("服务器错误，请稍后再试");
    isLoading.value = false;
    resultVisible.value = false;
  }
}
</script>

<style scoped>
/* 基础布局 - 基于视口单位 */
.container {
  border-radius: 1.5vw;
  box-shadow: 0 0.5vh 1.5vh rgba(0, 0, 0, 0.1);
  padding: 10vh 0 0 0;
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/backgroud6.jpg'); /* 添加背景图片 */
  background-size: cover; /* 使背景图片覆盖整个容器 */
  background-position: center; /* 将背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
}
.c-box {
  max-width: 60vh; /* 设置最大宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 5vh;
  width: 80%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
/* 标题样式 */
.title {
  font-size: clamp(2vh, 3vw, 4.5vh);
  /* 响应式字体 */
  color: #2c3e50;
  text-align: center;
  margin: 2vh 0 4vh;
  letter-spacing: 0.1vw;
  user-select: none; /* 禁止选中 */
}

/* 输入区域 */
.input-section {
  margin-bottom: 3vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.comment-input {
  height: 25vh;
  padding: 1.5vh 2vw;
  border: 0.2vh solid #e0e0e0;
  border-radius: 1vw;
  font-size: clamp(1.5vh, 1.8vw, 2.2vh);
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  scrollbar-width: none;
  resize: none;
  overflow: hidden;
}

.comment-input:focus {
  border-color: #2196F3;
  box-shadow: 0 0 1.5vh rgba(33, 150, 243, 0.15);
}

/* 分析按钮 */
.analyze-btn {
  background: #2196F3;
  color: white;
  width: 20vw;
  height: 6vh;
  border: none;
  border-radius: 25px; /* 胶囊按钮形状 */
  font-size: clamp(1.8vh, 2vw, 2.5vh);
  margin: 3vh auto 0;
  display: block;
  cursor: pointer;
  transition:
      transform 0.2s ease,
      box-shadow 0.3s ease;
}

.analyze-btn:hover {
  transform: translateY(-0.3vh);
  box-shadow: 0 0.5vh 1.5vh rgba(33, 150, 243, 0.3);
}

/* 结果卡片 */
.result-card {
  padding: 2.5vh 3vw;
  border-radius: 1vw;
  margin-top: 3vh;
  opacity: 0;
  transform: translateY(2vh);
  animation: cardAppear 0.6s ease forwards;
}

.result-card.positive {
  background: linear-gradient(135deg, #e8f5e9 0%, #d0eed3 100%);
  border: 0.2vh solid #4CAF50;
}

.result-content {
  display: flex;
  align-items: center;
  gap: 2vw;
}

.result-icon {
  width: 5vw;
  height: 5vw;
  min-width: 24px;
  min-height: 24px;
}

.result-text h3 {
  font-size: clamp(2vh, 2.5vw, 3.5vh);
  margin-bottom: 1vh;
  color: #2e7d32;
}

.result-text p {
  font-size: clamp(1.8vh, 2vw, 2.8vh);
  color: #666;
}

/* 动画定义 */
@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .comment-input {
    height: 30vh;
  }

  .result-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
