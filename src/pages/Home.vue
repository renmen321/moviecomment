html
<template>

  <div class="body">
    <div class="background"></div>
    <img src="@/assets/images/logo.jpg" alt="Logo" class="logo">
    <div class="slogan-container">
      <h1 class="slogan">欢迎来到</h1>
      <h2 class="slogan2">Welcome To</h2>
      <h1 class="slogan1">评心而论</h1>
      <h2 class="slogan2">Speak Honestly</h2>
    </div>

    <!-- 第二屏内容 -->
    <section class="movie-section">
      <div class="text-panel">
        <h1 class="movie-title">这里有海量电影</h1>
        <p class="sub-slogan">探索光影世界的无限可能</p>
      </div>
      <div class="media-visual" ref="mediaVisual">
        <img src="@/assets/images/2.jpg" alt="电影场景" class="movie-image">
      </div>
    </section>

    <!-- 第三屏内容 -->
    <section class="movie-section comment-section">
      <div class="media-visual skew-container">
        <div class="skew-mask">
          <img src="@/assets/images/3.png" alt="用户评论" class="movie-image">
        </div>
      </div>
      <div class="text-panel comment-content">
        <h1 class="movie-title"><span class="neon-text">这里有海量评论</span></h1>
        <p class="sub-slogan">在光影交织中寻找思想的共鸣</p>
      </div>
    </section>

    <!-- 第四屏内容 -->
    <section class="movie-section fourth-section">
      <div class="text-panel">
        <h1 class="slogan3">让我们一起走进电影的世界</h1>
        <button class="custom-button" @click="goToPage">立即体验</button>
        <h2 class="slogan4">嚄嚄嚄嚄嚄嚄嚄喔</h2>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router } from '@/router'

// DOM元素引用
const mediaVisual = ref<HTMLElement>()

// 动画控制器
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting)
  })
}, { threshold: 0.4, rootMargin: '0px 0px -100px 0px' })

onMounted(() => {
  // 初始化滚动监听
  document.querySelectorAll('.movie-section').forEach(section => {
    observer.observe(section)
  })

  // 初始化光标追踪
  if (mediaVisual.value) {
    mediaVisual.value.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      const originalTransform = window.getComputedStyle(e.currentTarget as Element)
          .getPropertyValue('transform')
      ;(e.currentTarget as HTMLElement).style.transform =
          `${originalTransform} rotateY(${x}deg) rotateX(${-y}deg)`
    })
  }
})

function goToPage() {
  router.push('/Comment')
}
</script>

<style scoped>


.body {
  margin: 0;
  height: 100vh;
  position: relative;
  overflow-y: scroll; /* 确保 body 具有滚动条 */
  scroll-snap-type: y mandatory; /* 确保 body 具有滚动捕捉 */
}

.background {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: url('@/assets/images/1.png') no-repeat center center/cover;
  animation: unfold 2s ease-out forwards;
}

/* 光标追踪元素样式 */
.media-visual {
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slogan-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start; /* 定义为滚动停靠点 */
}

.slogan {
  color: rgba(255, 255, 255, 0.95);
  font-size: 4rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.5s forwards;
  margin: 0.5em 0; /* 根据图片实际文字间距调整 */
}

.slogan2 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 2rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.5s forwards;
}

.slogan1 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 4rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.5s forwards;
  letter-spacing: 0.8em;  /* 字间距 */
  text-indent: 0.8em;     /* 补偿首字符偏移 */
  margin: 0.4em 0;
  white-space: nowrap;
}

.logo {
  opacity: 0;
  position: absolute;
  top: 10px; /* 距离顶部 10px */
  left: 10px; /* 距离左侧 10px */
  width: 200px; /* 根据实际情况调整宽度 */
  height: auto; /* 自动调整高度以保持比例 */
  animation: sloganAppear 1s ease-out 1.4s forwards;
}

@keyframes unfold {
  0% { clip-path: inset(50% 0 50% 0); }
  100% { clip-path: inset(0 0 0 0); }
}

@keyframes sloganAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
:root {
  --primary-color: #000000;
  --accent-gradient: linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%);
}

/* 第二屏布局重构 */
.movie-section {
  position: relative;
  height: 100vh;
  background:#000000;
  display: flex;
  align-items: center;
  padding: 0 10%;
  overflow: hidden;
  perspective: 1200px;
  scroll-snap-align: start; /* 定义为滚动停靠点 */
}

/* 文字容器 */
.text-panel {
  flex: 0 1 45%;
  transform: translateX(-15%);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 图片容器 */
.media-visual {
  flex: 0 1 55%;
  position: relative;
  transform: translateX(15%) scale(0.95);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
  will-change: transform;
}

/* 图片边缘渐变 */
.media-visual::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg,
  rgba(50,50,50,0.6) 0%,
  transparent 50%,
  rgba(50,50,50,0.6) 100%);
  z-index: 2;
  mix-blend-mode: multiply;
  border-radius: 12px;
}

/* 图片动画 */
.movie-image {
  width: 100%;
  height: 70vh;
  object-fit: cover;
  border-radius: 8px;
  position: relative;

  z-index: 1;
  filter: grayscale(0.2) contrast(1.1);
  transform-origin: right center;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 动态标题 */
.movie-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #fff 20%, #aaa 80%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s 0.3s;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3),
  0 0 8px rgba(255,255,255,0.2);
}

/* 副标题动画 */
.sub-slogan {
  font-size: 1.2rem;
  color: #888;
  letter-spacing: 0.2em;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s 0.5s;
}

/* 激活状态 */
.active .text-panel {
  transform: translateX(0);
  opacity: 1;
}

.active .media-visual {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.active .movie-title,
.active .sub-slogan {
  opacity: 1;
  transform: translateY(0);
}
/* 第三屏 */
.skew-container {
  order: -1;
  clip-path: polygon(0 0, 85% 0, 65% 100%, 0 100%);
  transform: perspective(1200px) rotateY(12deg) translateX(-15%);
  overflow: hidden;
  position: relative;
}

.skew-mask {
  transform: skewX(-10deg);
  margin-left: -8%;
  width: 118%;
  position: relative;
}

.skew-mask::before {
  content: '';
  position: absolute;
  left: 100px;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg,
  rgba(0,0,0,0) 30%,
  rgba(0,0,0,0.6) 60%,
  rgba(0,0,0,0.9) 80%);
  mix-blend-mode: multiply;
  z-index: 2;
}

.comment-content {
  padding-left: 12%;
  transform: translateX(20%);
  position: relative;
}

/* 动态效果优化 */
.comment-section.active .skew-container {
  clip-path: polygon(0 0, 90% 0, 70% 100%, 0% 100%);
  transform: perspective(1200px) rotateY(8deg) translateX(-5%);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.comment-section.active .comment-content {
  transform: translateX(0);
  transition: transform 1s 0.3s;
}

/* 光标追踪增强 */
.skew-container:hover {
  transform: perspective(1200px) rotateY(5deg) translateX(-8%);
}

.skew-container:hover .movie-image {
  transform: scale(1.08) translateX(8%);
}
.fourth-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}
.text-panel {
  flex: 0 1 100%;
  transform: translateX(-15%);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex; /* 添加 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column; /* 如果需要垂直排列子元素 */
}
.slogan3 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 3.5rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 30px rgba(255, 165, 0, 0.3);
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.3s forwards;
  margin: 1em 0;
  line-height: 1.2;
}

.slogan4 {
  color: rgba(255, 165, 0, 0.9);
  font-size: 2.2rem;
  font-family: 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.3em;
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.6s forwards;
  margin-bottom: 2em;
}

.custom-button {
  padding: 1em 2.5em;
  background: linear-gradient(45deg, #ffa500, #ff8c00);
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  opacity: 0;
  margin: 1em 0;
  animation: sloganAppear 1s ease-out 1s forwards;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
}
</style>