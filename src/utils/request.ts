import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://renmen321.cn:8080/api', // 设置基础路径
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            // 将 token 添加到请求头中
            // config.headers.Authorization = `${userData.token}`;
            config.headers.setAuthorization(`${userData.token}`)
        }
      return config;
    },
    error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
      // 对响应数据做点什么
      return response.data;
    },
    error => {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
);

export default service;