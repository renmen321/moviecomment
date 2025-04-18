<!-- src/components/SelectMovieTypeDialog.vue -->
<template>
  <el-dialog v-model="dialogVisible" width="30%" style="--el-dialog-bg-color:rgba(255, 255, 255, 0.1)">
    <h2>请选择你喜欢的电影类型</h2>
    <div>
      <el-checkbox-group v-model="selectedTypes">
        <el-checkbox label="动作"></el-checkbox>
        <el-checkbox label="喜剧"></el-checkbox>
        <el-checkbox label="科幻"></el-checkbox>
        <el-checkbox label="爱情"></el-checkbox>
        <el-checkbox label="悬疑"></el-checkbox>
        <el-checkbox label="惊悚"></el-checkbox>
        <el-checkbox label="动画"></el-checkbox>
        <el-checkbox label="战争"></el-checkbox>
        <el-checkbox label="纪录片"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div style="margin-top: 20px;">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveSelection">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const dialogVisible = ref(props.modelValue);
const selectedTypes = ref<string[]>([]);
//关闭对话框
function closeDialog() {
  emit('update:modelValue', false);
}
//保存用户选择的电影类型
function saveSelection() {
  emit('confirm', selectedTypes.value);
  closeDialog();
}
</script>

<style scoped>
/* 添加样式 */
</style>
