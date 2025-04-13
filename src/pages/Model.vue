<!-- Modal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">关闭</button>
      <h2>反馈详情</h2>
      <p><strong>内容摘要:</strong> {{ feedback.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义 FeedbackItem 类型
interface FeedbackItem {
  user: string;
  type: string;
  content: string;
  status: keyof typeof statusMap; // 确保 status 是 statusMap 的键
}

// 定义 props
const props = defineProps<{
  visible: boolean;
  feedback: FeedbackItem;
}>();

// 定义状态映射
const statusMap: Record<string, string> = {
  pending: '待处理',
  resolved: '已解决'
};

// 定义 emit
const emit = defineEmits(['close']);

// 关闭模态框方法
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #7a3333;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
