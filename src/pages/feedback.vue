<template>
  <!-- 引入导航栏 -->
  <nav>
    <img :src="logo" class="logo" alt="">
    <div class="nav-links">
      <button @click="toComment()" class="nav-item">评价</button>
      <button @click="toMovie()" class="nav-item">影视剧</button>
      <button @click="tofeedback()" class="nav-item">反馈</button>
    </div>
    <div class="nav-links-right">
      <button @click="tozhanghao()"  class="nav-item">账号</button>
    </div>
  </nav>
  <!-- 反馈表单容器 -->
  <div class="body">
    <div class="feedback-container">
      <!-- 主标题 -->
      <h1>您的反馈很重要 ❤️</h1>

      <!-- 反馈表单开始 -->
      <form>
        <!-- 反馈类型选择 -->
        <div class="form-group">
          <label>反馈类型</label>
          <div class="feedback-type">
            <select class="select2">
              <option value="">请选择类型</option>
              <option>页面建议</option>
              <option>问题反馈</option>
              <option>合作咨询</option>
            </select>
          </div>
        </div>

        <!-- 详细描述输入区 -->
        <div class="form-group">
          <label>详细描述 <span style="color:var(--error-red)">*</span></label>
          <!-- 正确写法（标签内无空白） -->
          <textarea rows="5" placeholder="请具体描述您的建议或遇到的问题..."></textarea>
        </div>

        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">提交反馈</button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from "@/assets/images/logo.jpg";

import {router} from "@/router";

function toMovie() {

  router.push('/Movie');
}
function toComment() {
  router.push('/Comment');
}
function tofeedback() {
  router.push('/FeedBack');
}
function tozhanghao() {
  router.push('/User');
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 公共样式 */
nav {
  display: flex;
  align-items: center;
  padding: 15px 5rem 15px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: rgba(44, 62, 80, 0.2);
  /* 使用带透明度的背景色 */
  backdrop-filter: blur(10px);
  /* 标准语法 */
  -webkit-backdrop-filter: blur(10px);
  /* Safari 兼容 */
  position: fixed;
  width: 100vw;
  z-index: 10;
}

.logo {
  width: 100px;
  /* 根据需要调整图片宽度 */
  height: auto;
  /* 保持图片比例 */
  margin-right: 50px;
  user-select: none; /* 禁止选中 */
}

.nav-links {
  display: flex;
  gap: 2vw;
}

.nav-item {
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid skyblue;
  text-decoration: none;
  padding: 4px 4px;
  font-size: 1.2rem;
  margin: 0 5px;
  transition: all 0.3s;
}
.nav-links-right {
  margin-left: 64vw; /* 将按钮推到最右侧 */
}
.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}
:root {
  /* 主题色 */
  --primary-pink: #566fe0;    /* 主色调（淡紫色） */
  --accent-mint: #7fcca3;     /* 强调色（薄荷绿） */
  --light-pink: #727fc7;      /* 页面背景色（浅粉色） */

  /* 功能色 */
  --dark-text: #333;          /* 主要文本颜色 */
  --error-red: #a8d7b5;       /* 错误提示色（当前为薄荷绿） */
}
/* 自定义CSS变量（主题配置） */
:root {
  /* 主题色 */
  --primary-pink: #5b4ebb;    /* 主色调（淡紫色） */
  --accent-mint: #7fcca3;     /* 强调色（薄荷绿） */
  --light-pink: #727fc7;      /* 页面背景色（浅粉色） */

  /* 功能色 */
  --dark-text: #333;          /* 主要文本颜色 */
  --error-red: #a8d7b5;       /* 错误提示色（当前为薄荷绿） */
}

/* 基础页面样式 */
/* 确保 body 居中 */


/* 确保 feedback-container 居中 */
.body {
  background: url("@/assets/images/background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.feedback-container {
  max-width: 60vh; /* 设置最大宽度 */
  width: 100%; /* 自适应宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 5vh;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}


/* 主标题样式 */
h1 {
  color: var(--primary-pink);
  text-align: center;
  margin-bottom: 2vh;
  font-family: 'Arial Black', sans-serif;
  border-bottom: 2px solid var(--primary-pink); /* 底部装饰线 */
  padding-bottom: 2vh;
}

/* 表单元素组样式 */
.form-group {
  margin-bottom: 3vh; /* 表单元素间距 */
  position: relative; /* 为可能的下拉菜单定位准备 */
}

/* 标签样式 */
label {
  display: block; /* 独占一行 */
  margin-bottom: 2vh; /* 标签与输入框间距 */
  color: var(--dark-text);
  font-weight: bold;
}

/* 通用输入控件样式 */
input, select, textarea {
  width: 92%;
  padding: 20px;
  border: 2px solid #ddd; /* 默认边框颜色 */
  border-radius: 8px; /* 输入框圆角 */
  transition: border-color 0.3s ease; /* 边框颜色过渡动画 */
}
textarea{
  resize: none; /* 禁止调整大小 */
}

/* 输入框聚焦状态 */
input:focus, textarea:focus {
  outline: none; /* 移除默认轮廓线 */
  border-color: var(--primary-pink); /* 聚焦边框颜色 */
  box-shadow: 0 0 8px rgba(195,128,159,0.2); /* 光晕效果 */
}


/* 反馈类型选择布局 */
.feedback-type {
  display: grid; /* 使用网格布局 */
  grid-template-columns: repeat(2, 1fr); /* 两列等宽 */
  gap: 1vh; /* 列间距 */
}

/* 提交按钮样式 */
.submit-btn {
  background: #5894da; /* 新的背景颜色 */
  color: #3761b9;
  padding: 1vh 5vw;
  border: none;
  border-radius: 25px; /* 胶囊按钮形状 */
  cursor: pointer;
  width: 50%; /* 全宽按钮 */
  font-size: 16px;
  transition: transform 0.3s ease; /* 悬停动画效果 */
  display: block; /* 新增 */
  margin: 0 auto; /* 新增 */
}

/* 按钮悬停状态 */
.submit-btn:hover {
  transform: translateY(-2px); /* 轻微上移效果 */
  box-shadow: 0 5px 15px rgba(195,128,159,0.3); /* 动态阴影 */
}

</style>