import { createApp } from "vue";
import "@/styles/index.css";
import App from "@/App.vue";
import { pinia } from "@/store";
import { router } from "@/router";


const app = createApp(App);
app.use(pinia);
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.mount("#app");
