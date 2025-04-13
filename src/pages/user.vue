<template>
  <!-- 引入导航栏 -->
  <nav>
    <img :src="logo" class="logo" alt="">
    <div class="nav-links">
      <button @click="toComment()" class="nav-item">评价</button>
      <button @click="toMovie()" class="nav-item">影视剧</button>
      <button @click="toFeedBack()" class="nav-item">反馈</button>
    </div>
    <div class="nav-links-right">
      <button @click="toUser()"  class="nav-item">账号</button>
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, UploadRequestOptions } from 'element-plus'
import logo from "@/assets/images/logo.jpg";

const router = useRouter()
const route = useRoute()

function toMovie() {
  router.push('/Movie');
}

function toComment() {
  router.push('/Comment');
}

function toFeedBack() {
  router.push('/FeedBack');
}
function toUser() {
  router.push('/User');
}

// 响应式状态管理
const formData = reactive({
  username: '',
  email: '',
  password: '',
  birthday: ''
})

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

// 返回按钮逻辑

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
  gap: 30px;
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
  user-select: none; /* 禁止选中 */
}
.nav-links-right {
  margin-left: 64vw; /* 将按钮推到最右侧 */
}
.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}

/* 内容区域美化 */
.content-area {
  background: #f8f7f7;
  display: flex;
  justify-content: center;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat center center fixed;
  background-size: cover;
  align-items: center;
}

.profile-card {
  margin-top: 15vh;
  width: 40vw;
  padding: 30px;
  background: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 背景虚化效果 */
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
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
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-uploader .upload-hint {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}

.avatar-uploader:hover .upload-hint {
  opacity: 1;
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
}

.custom-save-button:hover {
  background-color: #66b1ff; /* 设置悬停时的背景颜色 */
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
