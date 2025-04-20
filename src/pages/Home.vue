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
      <h1 class="slogan5">电影评论分析平台</h1>
      <h2 class="slogan5">Movie Comment Analysis Platform</h2>
    </div>

    <!-- 第二屏内容 -->
    <section class="movie-section">
      <div class="text-panel">
        <h1 class="movie-title">这里有海量电影</h1>
        <p class="sub-slogan">探索光影世界的无限可能</p>
      </div>
      <div class="media-visual" ref="mediaVisual">
        <img src="@/assets/images/2.jpg"  class="movie-image">
      </div>
    </section>

    <section class="movie-section comment-section">
      <!-- 左侧图片容器 -->
      <div class="media-visual skew-container">
        <div class="skew-mask">
          <img src="@/assets/images/3.png"  class="movie-image">
        </div>
      </div>

      <!-- 右侧文字内容 -->
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
        <h2 class="slogan4">本网站基于前沿的Transformer架构与BERT预训练模型，打造了精准的情感三分类系统，为您提供“好、中、差”情感标签与置信度评估。用户可自由发表影评，3秒内即可获得AI智能分析结果，直观查看每部电影的情感分布热力图与评论倾向统计。</h2>
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
  router.push('/Main')
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
  margin: 0.1em ; /* 根据图片实际文字间距调整 */
}

.slogan2 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 2rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  animation: sloganAppear 2s ease-out 0.5s forwards;
  margin-top: 0.05em ; /* 调整间距 */
  margin-bottom: 1em;
}
.slogan5{
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.5rem;
  font-family: 'Microsoft YaHei', sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
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
  margin: 0 0;
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
.comment-section {
  flex-direction: row; /* 保持横向排列 */
}


.comment-content {
  padding-left: 0;
  padding-right: 15%;
  transform: translateX(-10%);
}



/* 光标悬停效果修正 */
.skew-container:hover {
  transform: perspective(1200px) rotateY(-5deg) translateX(8%) !important;
}

.skew-container:hover .movie-image {
  transform: scale(1.08) translateX(-8%);
}

/* 文字面板对齐调整 */
.text-panel.comment-content {
  align-self: center;
  text-align: right;
}

.neon-text {
  animation: neonGlow 1.5s ease-in-out infinite alternate;
}


.fourth-section {
  background: #000000; /* 改为纯黑背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-panel {
  flex: 0 1 90%; /* 调整为90%宽度 */
  transform: none !important; /* 移除位移 */
  max-width: 1200px; /* 限制最大宽度 */
  padding: 40px 20px; /* 增加内边距 */
}

.slogan3 {
  color: #FFFFFF;
  font-size: 3.2rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  text-align: center;
}

.slogan4 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1.8;
  letter-spacing: 0.05em;
  max-width: 820px;
  text-align: center;
  padding: 0 15px;
  margin: 10vh auto 3rem;
  font-family: 'Microsoft YaHei', sans-serif;
}

.custom-button {
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  padding: 16px 48px;
  border-radius: 40px;
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
    display: block;
    margin: 0 auto;

}

.custom-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(255,255,255,0.2) 50%,
      transparent 75%
  );
  animation: buttonGlow 4s infinite linear;
}

@keyframes buttonGlow {
  0% { transform: translate(-25%, -25%) rotate(0deg); }
  100% { transform: translate(-25%, -25%) rotate(360deg); }
}

.custom-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(255, 165, 0, 0.4);
}
</style>