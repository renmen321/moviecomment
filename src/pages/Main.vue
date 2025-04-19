<template>
  <NavBar />
  <div class="poster-container">
    <!-- 主视觉区 -->
    <div class="main-visual" :style="{ backgroundImage: `url(${movies[currentIndex].image})` }">
    </div>
    <!-- 固定电影列表 -->
    <div class="film-list">
      <div
          v-for="(movie, index) in movies"
          :key="movie.movieChineseName"
          class="film-item"
          :class="{ active: currentIndex === index }"
          @click="handleClick(index)"
      >
        <div class="film-title">{{ movie.movieChineseName }}</div>
      </div>
    </div>
  </div>
  <!-- 热门推荐部分 -->
  <div class="recommendation-container">
    <div class="recommendation-title">热门推荐</div>
    <div class="recommendation-list">
      <el-card v-for="(movie, index) in recommendedMovies" :key="index" class="recommendation-card">
        <img :src="movie.image" alt="movie poster" class="recommendation-poster">
        <div class="recommendation-info">
          <div class="recommendation-title">{{ movie.movieChineseName }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NavBar from "@/components/Navbar.vue";
import { ElCard } from 'element-plus';
interface Movie {
  movieChineseName: string;
  image: string;
}

const movies = ref<Movie[]>([
  { movieChineseName: '《千与千寻》', image: 'src/assets/images/1.png' },
  { movieChineseName: '《千与千寻》', image: 'src/assets/images/2.jpg' },
  { movieChineseName: '《千与千寻》', image: 'src/assets/images/1.png' },
  { movieChineseName: '《千与千寻》', image: 'src/assets/images/2.jpg' }
]);
const recommendedMovies = ref<Movie[]>([
  { movieChineseName: '《寻梦环游记》', image: 'src/assets/images/background.jpg' },
  { movieChineseName: '《疯狂动物城》', image: 'src/assets/images/background2.jpg' },
  { movieChineseName: '《冰雪奇缘》', image: 'src/assets/images/background3.jpg' },
  { movieChineseName: '《千与千寻》', image: 'src/assets/images/background2.jpg' }
]);

const currentIndex = ref(0)
let timer = null
//点击事件
const handleClick = (index: number) => {  // 添加点击事件处理方法
  currentIndex.value = index
}

const switchMovie = () => {
  currentIndex.value = (currentIndex.value + 1) % movies.value.length
}

onMounted(() => {
  timer = setInterval(switchMovie, 3000) // 3秒切换
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
nav {
  position: fixed;
  top: 0; /* 明确坐标 */
  left: 0;
  right: 0;
  height: 11vh; /* 固定高度 */
  z-index: 1000; /* 提高层级 */
}
.poster-container {
  position: relative;
  padding: 10vh 0 0 0;
  background: #1a1a1a;
}

/* 主视觉区 */
.main-visual {
  position: absolute;
  right: 0;
  top: 10vh;
  width: 100%;
  height: 50vh;
  background-size: 60% 100%; /* 使用 cover 以确保图片覆盖整个元素 */
  background-position: center;
  background-repeat: no-repeat;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden; /* 确保伪元素不会超出边界 */
  background-color: black;
}

/* 新增遮罩层伪元素 */
.main-visual::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20%; /* 仅覆盖左半部分 */
  height: 100%;
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(255, 255, 255, 0.5) 100%
  );
  pointer-events: none;
}

/* 电影列表 */
.film-list {
  position: absolute;
  right: 0;
  top: 10vh;
  width: 20vw;
  background: rgba(0,0,0,0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.film-item {
  display: flex;
  align-items: center;
  height: 12.5vh;
  background: rgba(255,255,255,0.1);
  border-left: 3px solid transparent;
  transition: all 0.6s ease;
}

.film-item.active {
  border-color: #a9a898;
  background: rgba(26, 12, 12, 0.1);
  transform:  translateZ(20px) scale(1.1); /* 添加 3D 浮动效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 增加阴影效果 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
}


.film-title {
  color: #fff;
  font-size: 1.1em;
  letter-spacing: 1px;
}
/* 热门推荐部分 */
.recommendation-container {
  position: relative;
  margin-top: 50vh;
  background: #1a1a1a;
}

.recommendation-title {
  font-size: 2em;
  color: #fff;
  margin-bottom: 2vh;
  margin-left: 3vw;
}

.recommendation-list {
  display: flex;
  justify-content: space-around;
}

.recommendation-card {
  width: 20%;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.recommendation-card:hover {
  transform: scale(1.05);
}

.recommendation-poster {
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.recommendation-info {
  padding: 10px;
}

.recommendation-info .recommendation-title {
  font-size: 1.2em;
  color: #fff;
}

</style>