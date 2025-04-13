<template>
  <div class="personal-settings">
    <h2 class="header-title">个人信息</h2>

    <!-- 用户名 -->
    <div class="setting-item">
      <div class="setting-header">
        <div class="info-group">
          <div class="label-group">
            <span class="main-label">用户名</span>
            <span class="sub-label">{{ formData.name || '未设置' }}</span>
          </div>
        </div>
        <el-button
            type="primary"
            size="small"
            @click="showNameEdit = !showNameEdit"
        >
          {{ showNameEdit ? '取消' : '更改' }}
        </el-button>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showNameEdit" class="edit-panel">
          <el-form class="center-form">
            <el-form-item label="新用户名：" label-width="100px">
              <el-input
                  v-model="tempName"
                  placeholder="请输入新用户名"
                  class="centered-input"
              />
            </el-form-item>
            <div class="action-buttons">
              <el-button @click="showNameEdit = false">取消</el-button>
              <el-button type="primary" @click="saveName">确定</el-button>
            </div>
          </el-form>
        </div>
      </transition>
    </div>

    <!-- 电影类型 -->
    <div class="setting-item">
      <div class="setting-header">
        <div class="info-group">
          <div class="label-group">
            <span class="main-label">喜欢的电影类型</span>
            <span class="sub-label">{{ displayMovieTypes }}</span>
          </div>
        </div>
        <el-button
            type="primary"
            size="small"
            @click="showTypeEdit = !showTypeEdit"
        >
          {{ showTypeEdit ? '取消' : '更改' }}
        </el-button>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showTypeEdit" class="edit-panel">
          <el-form class="center-form">
            <el-form-item label="选择类型：" label-width="100px">
              <el-select
                  v-model="tempTypes"
                  multiple
                  placeholder="选择喜欢的类型"
                  class="centered-input"
              >
                <el-option
                    v-for="item in movieGenres"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
            <div class="action-buttons">
              <el-button @click="showTypeEdit = false">取消</el-button>
              <el-button type="primary" @click="saveTypes">确定</el-button>
            </div>
          </el-form>
        </div>
      </transition>
    </div>

    <!-- 喜欢的电影 -->
    <div class="setting-item">
      <div class="setting-header">
        <div class="info-group">
          <div class="label-group">
            <span class="main-label">喜欢的电影</span>
            <span class="sub-label">{{ formData.favoriteMovie || '未设置' }}</span>
          </div>
        </div>
        <el-button
            type="primary"
            size="small"
            @click="showMovieEdit = !showMovieEdit"
        >
          {{ showMovieEdit ? '取消' : '更改' }}
        </el-button>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showMovieEdit" class="edit-panel">
          <el-form class="center-form">
            <el-form-item label="电影名称：" label-width="100px">
              <el-input
                  v-model="tempMovie"
                  placeholder="请输入你最喜欢的电影"
                  class="centered-input"
              />
            </el-form-item>
            <div class="action-buttons">
              <el-button @click="showMovieEdit = false">取消</el-button>
              <el-button type="primary" @click="saveMovie">确定</el-button>
            </div>
          </el-form>
        </div>
      </transition>
    </div>

    <!-- 个人标语 -->
    <div class="setting-item">
      <div class="setting-header">
        <div class="info-group">
          <div class="label-group">
            <span class="main-label">个人标语</span>
            <span class="sub-label slogan-display">
              {{ formData.slogan || '未设置个人标语' }}
            </span>
          </div>
        </div>
        <el-button
            type="primary"
            size="small"
            @click="showSloganEdit = !showSloganEdit"
        >
          {{ showSloganEdit ? '取消' : '更改' }}
        </el-button>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showSloganEdit" class="edit-panel">
          <el-form class="center-form">
            <el-form-item label="编辑标语：" label-width="100px">
              <el-input
                  v-model="tempSlogan"
                  placeholder="请输入您的个人标语（最多30字）"
                  class="centered-input"
                  maxlength="30"
                  show-word-limit
              />
            </el-form-item>
            <div class="action-buttons">
              <el-button @click="showSloganEdit = false">取消</el-button>
              <el-button type="primary" @click="saveSlogan">确定</el-button>
            </div>
          </el-form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
const showNameEdit = ref(false)
const showTypeEdit = ref(false)
const showMovieEdit = ref(false)
const showSloganEdit = ref(false)

// 临时数据
const tempName = ref('')
const tempTypes = ref<string[]>([])
const tempMovie = ref('')
const tempSlogan = ref('')

// 电影类型选项
const movieGenres = [
  '动作', '喜剧', '科幻', '爱情', '悬疑',
  '惊悚', '动画', '战争', '纪录片'
]

// 计算属性
const displayMovieTypes = computed(() => {
  return props.formData.movieTypes.join('、') || '未选择'
})

// 数据初始化
watch(showNameEdit, val => val && (tempName.value = props.formData.name))
watch(showTypeEdit, val => val && (tempTypes.value = [...props.formData.movieTypes]))
watch(showMovieEdit, val => val && (tempMovie.value = props.formData.favoriteMovie))
watch(showSloganEdit, val => val && (tempSlogan.value = props.formData.slogan))

// 保存逻辑
const saveName = () => {
  if (!tempName.value.trim()) {
    ElMessage.error('用户名不能为空')
    return
  }
  emitUpdate('name', tempName.value)
  showNameEdit.value = false
}

const saveTypes = () => {
  if (tempTypes.value.length === 0) {
    ElMessage.error('请至少选择一个类型')
    return
  }
  emitUpdate('movieTypes', tempTypes.value)
  showTypeEdit.value = false
}

const saveMovie = () => {
  const value = tempMovie.value.trim()
  if (!value) {
    ElMessage.error('请输入有效的电影名称')
    return
  }
  emitUpdate('favoriteMovie', value)
  showMovieEdit.value = false
}

const saveSlogan = () => {
  const value = tempSlogan.value.trim()
  if (!value) {
    ElMessage.error('标语内容不能为空')
    return
  }
  if (value.length > 30) {
    ElMessage.error('标语长度不能超过30个字符')
    return
  }
  emitUpdate('slogan', value)
  showSloganEdit.value = false
}

// 通用更新方法
const emitUpdate = (key: string, value: any) => {
  emit('update', {
    ...props.formData,
    [key]: value
  })
  ElMessage.success('更新成功')
}
</script>

<style scoped>
.personal-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.setting-item {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.label-group {
  .main-label {
    font-weight: 500;
    color: #606266;
    margin-right: 15px;
  }
  .sub-label {
    color: #909399;
    font-size: 14px;
    line-height: 1.5;
  }
}

.edit-panel {
  margin: 20px 0;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.center-form {
  max-width: 500px;
  margin: 0 auto;
}

.centered-input {
  width: 100%;
  max-width: 400px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.slogan-display {
  color: #409EFF;
  font-style: italic;
  font-weight: 500;
}

:deep(.el-select) {
  width: 100%;
  .el-tag {
    margin: 2px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

:deep(.el-input__count) {
  color: #909399;
  background: transparent;
}
</style>