import { defineStore } from "pinia";
import { ref } from "vue";

export const useTestStore = defineStore("testStore", () => {
  const data = ref<string>("test");

  return {
    data,
  };
});
