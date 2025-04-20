<template>
  <!-- 引入导航栏 -->
  <NavBar />
  <!-- 反馈表单容器 -->
  <div class="body">
    <div class="feedback-container">
      <!-- 主标题 -->
      <h1>您的反馈很重要 ❤️</h1>

      <!-- 反馈表单开始 -->
      <el-form :model="form" :rules="rules" ref="formRef" label-width="40vw" label-position="top">
        <!-- 反馈类型选择 -->
        <el-form-item prop="type">
          <template #label>
            <span style="color: black">反馈类型</span>
          </template>
          <el-select v-model="form.type" placeholder="请选择类型" class="select2" style="width: 15vw">
            <el-option label="页面建议" value="页面建议" />
            <el-option label="问题反馈" value="问题反馈" />
            <el-option label="合作咨询" value="合作咨询" />
          </el-select>
        </el-form-item>

        <!-- 详细描述输入区 -->
        <el-form-item  prop="description" label-position="top">
          <template #label>
            <span style="color: black">详细描述</span>
          </template>
          <el-input v-model="form.description" type="textarea" :rows="5" resize="none"
            placeholder="请具体描述您的建议或遇到的问题..." />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :disabled="isSubmitting">
            提交反馈
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/Navbar.vue";
import { reactive, ref } from 'vue';
import { ElMessage, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElButton } from 'element-plus';
import { PostFeedback } from "@/api/Feedback.ts";

// 表单数据
const form = reactive({
  type: '',
  description: ''
});

// 表单验证规则
const rules = {
  type: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' }
  ]
};

// 表单引用
const formRef = ref(null);

// 提交状态
const isSubmitting = ref(false);



// 提交表单方法
const submitForm = async () => {
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  if (!userData) {
    ElMessage.error('请先登录');
    return;
  }
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 禁用提交按钮
      isSubmitting.value = true;

      // 处理表单提交逻辑
      const response = await PostFeedback({
        username: userData.username,
        content: form.description,
        type: form.type
      })

      if (response.ok) {
        ElMessage.success('反馈提交成功');
        console.log(form);
        isSubmitting.value = false;
      } else {
        ElMessage.error('反馈提交失败');
        isSubmitting.value = false;
      }

    } else {
      ElMessage.error('请填写完整信息');
      return false;
    }
  });
};

</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

:root {
  /* 主题色 */
  --primary-pink: #566fe0;
  /* 主色调（淡紫色） */
  --accent-mint: #7fcca3;
  /* 强调色（薄荷绿） */
  --light-pink: #727fc7;
  /* 页面背景色（浅粉色） */

  /* 功能色 */
  --dark-text: #333;
  /* 主要文本颜色 */
  --error-red: #a8d7b5;
  /* 错误提示色（当前为薄荷绿） */
}

/* 基础页面样式 */
/* 确保 body 居中 */
.body {
  background: url("@/assets/images/background8.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.feedback-container {
  max-width: 60vh;
  /* 设置最大宽度 */
  width: 100%;
  /* 自适应宽度 */
  margin: 0 auto;
  /* 水平居中 */
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
  border-bottom: 2px solid var(--primary-pink);
  /* 底部装饰线 */
  padding-bottom: 2vh;
}


/* 表单元素组样式 */
.el-form-item {
  margin-bottom: 3vh;
  /* 表单元素间距 */
}

/* 标签样式 */
.el-form-item__label {
  color: var(--dark-text);
  font-weight: bold;
}

/* 通用输入控件样式 */
.el-select,
.el-input,
.el-textarea {
  width: 92%;
}

/* 提交按钮样式 */
.el-button {
  width: 20vw;
  height: 6vh;
  border-radius: 25px;
  /* 胶囊按钮形状 */
  font-size: 16px;
  transition: transform 0.3s ease;
  /* 悬停动画效果 */
  display: block;
  /* 新增 */
  margin: 0 auto;
  /* 新增 */
}

/* 按钮悬停状态 */
.el-button:hover {
  transform: translateY(-2px);
  /* 轻微上移效果 */
  box-shadow: 0 5px 15px rgba(195, 128, 159, 0.3);
  /* 动态阴影 */
}
.custom-textarea .el-textarea__inner {
  border-radius: 100px;
}
</style>
