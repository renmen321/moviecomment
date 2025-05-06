<!-- src/components/AdminSidebar.vue -->
<template>
  <nav class="sidebar">
    <div class="nav-title">
      <span class="logo">📈</span>
      Admin
    </div>
    <div class="nav-items">
      <a
          v-for="item in menus"
          :key="item.path"
          @click="router.push(item.path)"
          class="nav-item"
          :class="{ 'active': activeMenu === item.path }"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="text">{{ item.text }}</span>
        <div class="hover-indicator"></div>
      </a>
      <!-- 添加退出按钮 -->
      <a
          @click="logout"
          class="nav-item"
      >
        <span class="icon">🚪</span>
        <span class="text">客户端</span>
        <div class="hover-indicator"></div>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 导航菜单配置
const menus = [
  { path: '/CommentCalendar', icon: '📅', text: '评论日历' },
  { path: '/FeedBackAdmin', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/CommentManage', icon: '💬', text: '评论管理' },
  { path: '/UserManage', icon: '👤', text: '用户管理' },
]

// 计算属性：获取当前激活的菜单路径
const activeMenu = computed(() => route.path)

// 退出功能
const logout = () => {
  router.push('/Main')
}
</script>

<style scoped>
/* 侧边栏动态特效 */
.sidebar {
  background: linear-gradient(195deg, #1a1a1a, #2d2d2d);
  color: white;
  position: sticky;
  top: 0;
  height: 100vh;
  box-shadow: 4px 0 12px rgba(0,0,0,0.1);
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5vh;
  margin-top: 2vh;
  display: flex;
  align-items: center;
  gap: 2vh;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
}

.nav-item {
  position: relative;
  color: rgba(255,255,255,0.8);
  padding: 2vh 1vw;
  margin: 2vh 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 2vh;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255,255,255,0.05);
    transform: translateX(8px);

    .hover-indicator {
      opacity: 1;
      width: 3px;
    }
  }

  &.active {
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
}

.hover-indicator {
  position: absolute;
  height: 60%;
  width: 0;
  border-radius: 2px;
  opacity: 0;
  transition: all 0.3s;
}
</style>
