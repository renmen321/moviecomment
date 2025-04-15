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
    <!-- 修改后的头像上传组件 -->
    <div class="info-item" v-if="isEditing">
      <div class="label">头像：</div>
      <div class="avatar-container">
        <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            accept="image/jpeg,image/png"
        >
          <template #trigger> <!-- 新增触发插槽 -->
            <div class="upload-wrapper">
              <div v-if="localData.avatar" class="avatar-preview">
                <img :src="localData.avatar" class="preview-avatar">
                <div class="hover-mask">
                  <i class="el-icon-upload"></i>
                </div>
              </div>
              <div v-else class="upload-button">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>
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
      <el-button type="primary" @click="saveChanges">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  formData: {
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
    name: localData.name.trim(),
    slogan: localData.slogan.trim()
  }

  if (!submitData.name) {
    ElMessage.error('姓名不能为空')
    return
  }

  if (submitData.slogan.length > 30) {
    ElMessage.error('标语长度不能超过30个字符')
    return
  }

  emit('update', submitData)
  ElMessage.success('保存成功')
  isEditing.value = false // 自动返回非编辑模式
}

// 取消编辑
const cancelEdit = () => {
  initData()
  isEditing.value = false
}

// 处理头像上传
const handleAvatarSuccess = (res: any, file: File) => {
  localData.avatar = URL.createObjectURL(file)
  ElMessage.success('头像上传成功')
}

// 处理头像上传错误
const handleAvatarError = (err: any, file: File, fileList: File[]) => {
  ElMessage.error('头像上传失败')
}

// 上传验证
const beforeAvatarUpload = (file: File) => {
  console.log('Selected file:', file) // 添加日志
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只支持JPG/PNG格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }

  return isImage && isLt2M
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
.upload-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
}

.avatar-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed #dcdfe6;
  transition: border-color 0.3s;
}

.avatar-preview:hover {
  border-color: #409eff;
}

.preview-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .hover-mask {
  opacity: 1;
}

.hover-mask i {
  color: #fff;
  font-size: 24px;
}

.upload-button {
  width: 100%;
  height: 100%;
  border: 2px dashed #dcdfe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #8c939d;
  transition: all 0.3s;
}

.upload-button:hover {
  border-color: #409eff;
  color: #409eff;
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

.current-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #F0F2F5;
}

.default-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #F0F2F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 24px;
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader .avatar-upload-button {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c939d;
}

.preview-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
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
  justify-content: center; /* 居中对齐按钮 */
  gap: 16px;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  border-radius: 4px;
}
</style>
