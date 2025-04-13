<template>
  <router-view/>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router"; // 导入 useRouter

const router = useRouter(); // 获取 router 实例

onMounted(() => {
  router.push('/shouye');
});
</script>
