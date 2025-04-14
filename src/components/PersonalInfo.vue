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

    <!-- 用户名 -->
    <div class="info-item">
      <div class="label">用户名：</div>
      <div v-if="!isEditing" class="value">{{ formData.name || '未设置' }}</div>
      <el-input
          v-else
          v-model="localData.name"
          placeholder="请输入用户名"
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
    name: string
    movieTypes: string[]
    favoriteMovie: string
    slogan: string
  }
}>()

const emit = defineEmits(['update'])

// 编辑状态
const isEditing = ref(false)

// 正确初始化响应式对象
const localData = reactive({
  name: '',
  movieTypes: [] as string[],
  favoriteMovie: '',
  slogan: ''
})

// 初始化数据
const initData = () => {
  Object.assign(localData, {
    name: props.formData.name || '',
    movieTypes: [...props.formData.movieTypes],
    favoriteMovie: props.formData.favoriteMovie || '',
    slogan: props.formData.slogan || ''
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
  if (!isEditing.value) {
    initData() // 使用正确的方式重置数据
  }
}

// 保存修改
const saveChanges = () => {
  const submitData = {
    name: (localData.name || '').trim(),
    movieTypes: [...localData.movieTypes], // 创建新数组
    favoriteMovie: (localData.favoriteMovie || '').trim(),
    slogan: (localData.slogan || '').trim()
  }

  if (!submitData.name) {
    ElMessage.error('用户名不能为空')
    return
  }

  if (submitData.slogan.length > 30) {
    ElMessage.error('标语长度不能超过30个字符')
    return
  }

  emit('update', submitData)
  ElMessage.success('保存成功')
  isEditing.value = false // 保存后退出编辑模式
}

// 取消编辑
const cancelEdit = () => {
  initData()
  isEditing.value = false
}

// 监听父组件数据变化
watch(
    () => props.formData,
    () => {
      initData()
    },
    { deep: true, immediate: true }
)
</script>

<style scoped>
.personal-settings {
  width: 640px;
  margin: 20px auto;
  padding: 32px 40px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E4E7ED;
}

h2 {
  font-size: 20px;
  color: #303133;
  font-weight: 600;
  margin: 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 18px 0;
  margin: 0 -8px;
}

.label {
  width: 100px;
  color: #606266;
  font-size: 14px;
  line-height: 36px;
  padding: 0 8px;
}

.value {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 36px;
  padding: 0 8px;
}

.edit-field {
  flex: 1;
  max-width: 420px;
}

.action-bar {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E4E7ED;
  display: flex;
  justify-content: center; /* 居中对齐按钮 */
  gap: 15px; /* 按钮间距 */
}

/* 输入框聚焦样式 */
.el-input ::v-deep .el-input__inner:focus,
.el-textarea ::v-deep .el-textarea__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 4px rgba(64, 158, 255, 0.3);
}
</style>
