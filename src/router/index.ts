import { createWebHashHistory, createRouter } from "vue-router";
import { constantRoutes } from "./constantRoutes";
export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});
