<template>
  <div class="personal-settings">
    <div class="header-wrapper">
      <h2>个人信息</h2>
      <el-button type="primary" size="small" @click="toggleEditMode">
        {{ isEditing ? '取消编辑' : '编辑信息' }}
      </el-button>
    </div>

    <!-- 头像模块（仅在编辑模式显示） -->
    <div class="info-item" v-if="isEditing">
      <div class="label">头像：</div>
      <div class="avatar-container">
        <!-- 头像上传组件 -->
        <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload">
          <el-image v-if="imageUrl === undefined"
            :src="`http://127.0.0.1:8080/api/profilePicture/${formData.profilePicture}`" class="avatar" fit="cover" />
          <el-image v-else :src="imageUrl" class="avatar" fit="cover" />

        </el-upload>
      </div>
    </div>

    <!-- 用户名 -->
    <div class="info-item">
      <div class="label">用户名：</div>
      <div class="value">{{ formData.username || '未设置' }}</div>
    </div>
    <!-- 姓名 -->
    <div class="info-item">
      <div class="label">姓名：</div>
      <div v-if="!isEditing" class="value">{{ formData.name || '未设置' }}</div>
      <el-input v-else v-model="formData.name" placeholder="请输入姓名" class="edit-field" />
    </div>



    <!-- 电影类型 -->
    <div class="info-item">
      <div class="label">电影类型：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.favoriteType || '未选择' }}
      </div>
      <el-select v-else v-model="favoriteTypeInput" multiple placeholder="选择喜欢的类型" class="edit-field">
        <el-option v-for="genre in movieGenres" :key="genre" :label="genre" :value="genre" />
      </el-select>
    </div>

    <!-- 喜欢的电影 -->
    <div class="info-item">
      <div class="label">喜欢的电影：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.likeMovies.join(",") || '未设置' }}
      </div>
      <el-input v-else v-model="likeMoviesInput" placeholder="请输入电影名称，多个电影用逗号分隔" class="edit-field" />

    </div>

    <!-- 个人标语 -->
    <div class="info-item">
      <div class="label">个人标语：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.personalLabel || '未设置个人标语' }}
      </div>
      <el-input v-else v-model="formData.personalLabel" type="textarea" :rows="2" placeholder="请输入个人标语（最多30字）"
        maxlength="30" show-word-limit class="edit-field" />
    </div>

    <!-- 操作按钮 -->
    <div v-if="isEditing" class="action-bar">
      <div class="button-container">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveChanges">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
import { ElMessage, UploadRequestOptions } from 'element-plus'
import { updateUserVO } from "@/api/User.ts";

const formData = ref({
  id: 0,
  profilePicture: '',
  username: '',
  name: '',
  favoriteType: '',
  likeMovies: [] as string[],//定义为数组
  personalLabel: '',
  password: '',
  email: '',
  picture: undefined,
})
let imageUrl = ref();
const initData = () => {
  const userData = sessionStorage.getItem('userData'); // 使用 sessionStorage 而不是 localStorage
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.id = parsedData.id;
    formData.value.profilePicture = parsedData.profilePicture;
    formData.value.username = parsedData.username;//parsedData.username不显示
    formData.value.name = parsedData.name;
    formData.value.email = parsedData.email;
    formData.value.password = parsedData.password;
    formData.value.favoriteType = parsedData.favoriteType;
    formData.value.likeMovies = parsedData.likeMovies;
    formData.value.personalLabel = parsedData.personalLabel;
  }
  imageUrl.value = undefined;
}

const emit = defineEmits(['update'])
const likeMoviesInput = ref('');
const favoriteTypeInput = ref([] as string[]);
watch(likeMoviesInput, (newValue) => {
  // 将输入的字符串按逗号分隔成数组，并去除前后空格
  formData.value.likeMovies = newValue.split(',').map(movie => movie.trim()).filter(movie => movie);
});

// 编辑状态
const isEditing = ref(false)


// 电影类型选项
const movieGenres = [
  '动作', '喜剧', '科幻', '爱情', '悬疑',
  '惊悚', '动画', '战争', '纪录片'
]

// 切换编辑模式
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  isEditing.value ? initData() : cancelEdit()
  likeMoviesInput.value = formData.value.likeMovies.join(',');
  favoriteTypeInput.value = Array.isArray(formData.value.favoriteType) ? formData.value.favoriteType : formData.value.favoriteType.split(' ');
}

// 保存修改
const saveChanges = async () => {
  formData.value.favoriteType = favoriteTypeInput.value.join(' ');
  const response = await updateUserVO(formData.value);
  if (response.ok) {
    ElMessage.success('修改成功')
    const userData = {
      id: response.data.id,
      username: JSON.parse(sessionStorage.getItem('userData')).username,
      name: response.data.name,
      email: response.data.email,
      profilePicture: response.data.profilePicture,
      token: JSON.parse(sessionStorage.getItem('userData')).token,
      admin: response.data.admin,
      personalLabel: response.data.personalLabel,
      favoriteType: response.data.favoriteType,
      likeMovies: response.data.likeMovies,
    };
    // 将用户数据存储在 sessionStorage 中
    sessionStorage.setItem('userData', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('storage', { detail: { key: 'userData', newValue: JSON.stringify(userData) } })); // 手动触发storage事件
    emit('update')
    isEditing.value = false
    imageUrl.value=undefined;
  } else {
    ElMessage.error(response.message)
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 处理头像上传
const beforeAvatarUpload = (file: File) => {
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) ElMessage.error('仅支持 JPG/PNG 格式!')
  if (!isLt5M) ElMessage.error('图片大小不能超过5MB!')
  return isImage && isLt5M
}

const handleAvatarUpload = async (options: UploadRequestOptions) => {
  try {
    formData.value.picture = options.file;
    // 调用上传接口
    imageUrl.value = URL.createObjectURL(options.file)
    ElMessage.success('头像上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}
onMounted(() => { initData() })
</script>

<style scoped>
.personal-settings {
  width: 50vw;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 3vh;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5vh;
  padding-bottom: 5vh;
  border-bottom: 1px solid #EBEEF5;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F0F2F5;
}

.label {
  width: 100px;
  color: #606266;
  font-size: 14px;
  flex-shrink: 0;
}

.value {
  flex: 1;
  color: #303133;
  font-size: 14px;
}

.avatar-container {
  display: flex;
  align-items: center;
  height: 80px;
}

/* 头像上传容器 */
.avatar-uploader {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #f0f2f5;
  cursor: pointer;
  transition: all 0.3s;
}

/* 头像图片样式 */
.avatar {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50%;
  background: #f0f2f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 鼠标悬停效果 */
.avatar-uploader:hover {
  transform: scale(1.05);
}

.avatar-uploader:hover {
  color: #409eff;
}

/* 上传组件覆盖element样式 */
:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-preview:hover .hover-mask {
  opacity: 1;
}

.hover-mask i {
  color: #fff;
  font-size: 24px;
}

.edit-field {
  width: 100%;
  max-width: 400px;
}

.action-bar {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: center;
  /* 居中对齐 */
  gap: 16px;
}

.button-container {
  display: flex;
  justify-content: center;
  /* 居中对齐 */
  gap: 16px;
}
</style>
