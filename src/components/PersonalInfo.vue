<template>
  <div class="personal-settings">
    <div class="header-wrapper">
      <h2>个人信息</h2>
      <el-button
          type="primary"
          size="small"
          @click="toggleEditMode"
      >
        {{ isEditing ? '取消编辑' : '编辑信息' }}
      </el-button>
    </div>

    <!-- 头像模块（仅在编辑模式显示） -->
    <div class="info-item" v-if="isEditing">
      <div class="label">头像：</div>
      <div class="avatar-container">
        <!-- 头像上传组件 -->
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
        >
          <el-image
              v-if="localData.avatarUrl"
              :src="localData.avatarUrl"
              class="avatar"
              fit="cover"
          />


        </el-upload>
      </div>
    </div>

    <!-- 用户名 -->
    <div class="info-item">
      <div class="label">用户名：</div>
      <div class="value">{{ formData.id || '未设置' }}</div>
    </div>

    <!-- 姓名 -->
    <div class="info-item">
      <div class="label">姓名：</div>
      <div v-if="!isEditing" class="value">{{ formData.name || '未设置' }}</div>
      <el-input
          v-else
          v-model="localData.name"
          placeholder="请输入姓名"
          class="edit-field"
      />
    </div>

    <!-- 电影类型 -->
    <div class="info-item">
      <div class="label">电影类型：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.movieTypes.join('、') || '未选择' }}
      </div>
      <el-select
          v-else
          v-model="localData.movieTypes"
          multiple
          placeholder="选择喜欢的类型"
          class="edit-field"
      >
        <el-option
            v-for="genre in movieGenres"
            :key="genre"
            :label="genre"
            :value="genre"
        />
      </el-select>
    </div>

    <!-- 喜欢的电影 -->
    <div class="info-item">
      <div class="label">喜欢的电影：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.favoriteMovie || '未设置' }}
      </div>
      <el-input
          v-else
          v-model="localData.favoriteMovie"
          placeholder="请输入电影名称"
          class="edit-field"
      />
    </div>

    <!-- 个人标语 -->
    <div class="info-item">
      <div class="label">个人标语：</div>
      <div v-if="!isEditing" class="value">
        {{ formData.slogan || '未设置个人标语' }}
      </div>
      <el-input
          v-else
          v-model="localData.slogan"
          type="textarea"
          :rows="2"
          placeholder="请输入个人标语（最多30字）"
          maxlength="30"
          show-word-limit
          class="edit-field"
      />
    </div>

    <!-- 操作按钮 -->
    <div v-if="isEditing" class="action-bar">
      <el-button @click="cancelEdit">取消</el-button>
      <el-button  @click="saveChanges">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import {ElMessage, UploadRequestOptions} from 'element-plus'

const props = defineProps<{
  formData: {
    avatarUrl: string
    id: string
    name: string
    movieTypes: string[]
    favoriteMovie: string
    slogan: string
    avatar: string
  }
}>()

const emit = defineEmits(['update'])

// 编辑状态
const isEditing = ref(false)


// 本地数据
const localData = reactive({
  avatarUrl: '',
  id: '',
  name: '',
  movieTypes: [] as string[],
  favoriteMovie: '',
  slogan: '',
  avatar: ''
})



// 初始化数据
const initData = () => {
  Object.assign(localData, {
    avatarUrl:props.formData.avatarUrl,
    id: props.formData.id,
    name: props.formData.name,
    movieTypes: [...props.formData.movieTypes],
    favoriteMovie: props.formData.favoriteMovie,
    slogan: props.formData.slogan,
    avatar: props.formData.avatar
  })
}

// 电影类型选项
const movieGenres = [
  '动作', '喜剧', '科幻', '爱情', '悬疑',
  '惊悚', '动画', '战争', '纪录片'
]

// 切换编辑模式
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  isEditing.value ? initData() : cancelEdit()
}

// 保存修改
const saveChanges = () => {
  const submitData = {
    ...localData,
    avatar: localData.avatarUrl, // 同步头像URL
    name: localData.name.trim(),
    slogan: localData.slogan.trim()
  }

  if (!submitData.name) {
    ElMessage.error('姓名不能为空')
    return
  }

  emit('update', submitData)
  ElMessage.success('保存成功')
  isEditing.value = false
}

// 取消编辑
const cancelEdit = () => {
  initData()
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
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    // 调用上传接口
    localData.avatarUrl = URL.createObjectURL(options.file)
    ElMessage.success('头像上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 监听数据变化
watch(
    () => props.formData,
    () => initData(),
    { deep: true, immediate: true }
)
</script>

<style scoped>
.personal-settings {
  width: 640px;
  margin: 20px auto;
  padding: 32px 40px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
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
  justify-content: flex-end;
  gap: 16px;
}

.el-upload {
  display: block !important;
  width: 100%;
  height: 100%;
}

.el-upload__input {
  display: none;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  border-radius: 4px;
}
</style>