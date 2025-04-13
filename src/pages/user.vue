<!-- user.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <nav class="sidebar">
      <div class="nav-title">
        <span class="logo">⚙️</span>
        Admin Pro
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
      </div>
    </nav>

    <!-- 内容区域 -->
    <main class="content-area">
      <el-scrollbar class="content-scroll">
        <el-card class="profile-card">
          <!-- 头像上传组件 -->
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
          >
            <el-image
                v-if="avatarUrl"
                :src="avatarUrl"
                class="avatar"
                fit="cover"
            />
            <el-icon v-else class="avatar-icon">
              <el-icon-user />
            </el-icon>
            <div class="upload-hint">
              <span>点击上传头像</span>
            </div>
          </el-upload>

          <!-- 表单区域 -->
          <el-form :model="formData" label-width="80px">
            <!-- 用户名 -->
            <el-form-item label="用户">
              <el-input
                  v-model="formData.username"
                  @click="handleNameEdit"
                  class="input-with-button"
              >
                <template #append>
                  <el-button @click="handleNameEdit">
                    {{ nameEditable ? '保存' : '修改' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item label="邮箱">
              <el-input
                  v-model="formData.email"
                  :disabled="!emailEditable"
              >
                <template #append>
                  <el-button @click="toggleEmailEdit">
                    {{ emailEditable ? '取消' : '修改' }}
                  </el-button>
                </template>
              </el-input>
              <transition name="el-zoom-in-top">
                <div v-if="emailEditable" class="edit-group">
                  <el-input
                      v-model="emailForm.original"
                      placeholder="原邮箱"
                      class="mb-2"
                  />
                  <el-input
                      v-model="emailForm.new"
                      placeholder="新邮箱"
                      class="mb-2"
                  />
                  <el-button type="primary" class="custom-save-button" @click="saveEmail">确认修改</el-button>
                </div>
              </transition>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item label="密码">
              <el-input
                  v-model="formData.password"
                  show-password
                  :disabled="!passwordEditable"
              >
                <template #append>
                  <el-button @click="togglePasswordEdit">
                    {{ passwordEditable ? '取消' : '修改' }}
                  </el-button>
                </template>
              </el-input>
              <transition name="el-zoom-in-top">
                <div v-if="passwordEditable" class="edit-group">
                  <el-input
                      v-model="passwordForm.current"
                      placeholder="当前密码"
                      show-password
                      class="mb-2"
                  />
                  <el-input
                      v-model="passwordForm.new"
                      placeholder="新密码"
                      show-password
                      class="mb-2"
                  />
                  <el-button type="primary" class="custom-save-button" @click="savePassword">确认修改</el-button>
                </div>
              </transition>
            </el-form-item>

            <!-- 生日 -->
            <el-form-item label="生日">
              <el-date-picker
                  v-model="formData.birthday"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  @change="handleBirthdayChange"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-scrollbar>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, UploadRequestOptions } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 响应式状态管理
const formData = reactive({
  username: '',
  email: '',
  password: '',
  birthday: ''
})

// 导航菜单配置
const menus = [
  { path: '/ss', icon: '📊', text: '今日评论' },
  { path: '/fankui', icon: '📩', text: '反馈管理' },
  { path: '/MovieManage', icon: '🎬', text: '电影管理' },
  { path: '/pinglun', icon: '💬', text: '评论管理' },
  { path: '/user', icon: '👤', text: '用户管理' },
]
// 计算属性
const activeMenu = computed(() => route.path)

// 头像上传逻辑
const avatarUrl = ref('')
const beforeAvatarUpload = (file: File) => {
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) ElMessage.error('仅支持 JPG/PNG 格式!')
  if (!isLt5M) ElMessage.error('图片大小不能超过5MB!')
  return isImage && isLt5M
}

const handleAvatarUpload = async (options: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    // 调用上传接口
    avatarUrl.value = URL.createObjectURL(options.file)
    ElMessage.success('头像上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 编辑状态管理
const nameEditable = ref(false)
const handleNameEdit = () => {
  if (nameEditable.value) {
    // 保存用户名逻辑
    ElMessage.success('用户名更新成功')
  }
  nameEditable.value = !nameEditable.value
}

// 邮箱编辑逻辑
const emailEditable = ref(false)
const emailForm = reactive({
  original: '',
  new: ''
})
const toggleEmailEdit = () => {
  emailEditable.value = !emailEditable.value
  if (emailEditable.value) {
    emailForm.original = formData.email
  }
}

const saveEmail = async () => {
  if (emailForm.new && validateEmail(emailForm.new)) {
    formData.email = emailForm.new
    emailEditable.value = false
    ElMessage.success('邮箱更新成功')
  } else {
    ElMessage.error('请输入有效的邮箱地址')
  }
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 密码编辑逻辑
const passwordEditable = ref(false)
const passwordForm = reactive({
  current: '',
  new: ''
})
const togglePasswordEdit = () => {
  passwordEditable.value = !passwordEditable.value
  if (!passwordEditable.value) {
    passwordForm.current = ''
    passwordForm.new = ''
  }
}

const savePassword = async () => {
  if (passwordForm.new.length >= 8) {
    formData.password = passwordForm.new
    passwordEditable.value = false
    ElMessage.success('密码更新成功')
  } else {
    ElMessage.error('密码长度至少为8位')
  }
}

// 生日更改逻辑
const handleBirthdayChange = (value: string) => {
  console.log('选择的生日:', value)
  // 在这里添加你想要执行的逻辑
}
</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

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

/* 内容区域美化 */
.content-area {
  padding: 2vw;
  background: #f8f7f7;
}

.profile-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background: #eebaba;
}

/* 头像上传样式修复 */
.avatar-uploader {
  width: 10vw;
  height: 16vh;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed var(--el-border-color);
  transition: border-color 0.3s;
  position: relative;
  margin: 0 auto 20px;

  &:hover {
    border-color: var(--el-color-primary);

    .upload-hint {
      opacity: 1;
    }
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .upload-hint {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 50%;
  }
}

/* 输入框间距调整 */
:deep(.el-form-item) {
  margin-bottom: 5vh;

}

/* 按钮间距调整 */
.edit-group {
  display: flex;
  flex-direction: column; /* 垂直排列输入框 */
  gap: 1vh;
  margin-top: 2vh;
  width: 94%;
  align-items: center; /* 水平居中对齐 */
}

/* 输入框样式保持一致 */
.edit-group .el-input {
  margin-bottom: 1vh; /* 确保输入框之间有间距 */
  width: 94%;
}

/* 自定义保存按钮样式 */
.custom-save-button {
  width: 40%; /* 设置按钮宽度 */
  background-color: #409EFF; /* 设置背景颜色 */
  color: white; /* 设置文字颜色 */
  font-size: 14px; /* 设置字体大小 */
  border-radius: 20px; /* 设置圆角 */
  padding: 10px 20px; /* 设置内边距 */
  transition: background-color 0.3s; /* 设置过渡效果 */

  &:hover {
    background-color: #66b1ff; /* 设置悬停时的背景颜色 */
  }
}

/* 日期选择器宽度适配 */
:deep(.el-date-editor) {
  width: 100%;
}

/* 输入组合优化 */
.input-with-button {
  :deep(.el-input-group__append) {
    background-color: transparent;
    padding: 0 1vw;
  }
}
</style>
