<template>
  <div class="body">
    <div class="auth-card">
      <h2>登录</h2>
      <div class="link">
        <div class="toggle-link" >
          <a @click="tourist">游客登陆</a>
        </div>
      </div>
      <form @submit.prevent="validateLogin">
        <div class="form-group">
          <input type="text" id="id" v-model="id" placeholder="用户名" >
        </div>
        <div class="form-group">
          <input type="password" id="loginPassword" v-model="password" placeholder="密码" >
        </div>
        <button type="submit">立即登录</button>
      </form>
      <div class="link">
        <div class="toggle-link">
          <a @click="reset">忘记密码？</a>
        </div>
        <div class="toggle-link">
          <a @click="register">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { login } from '@/api/test';
    const router = useRouter();
    const id = ref('');
    const password = ref('');

   async function validateLogin() {
      const response= await login({
        username: id.value,
        password: password.value,
      });
      if(response.ok){
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          token: response.data.token,
        };
        // 将用户数据存储在 sessionStorage 中
        sessionStorage.setItem('userData', JSON.stringify(userData));
        if(response.data.admin){
          router.push('/TodayComment');
        }else{
          router.push('/Comment');
        }
      }else{
        alert(response.message);
      }

    }

    function reset() {
      router.push( '/Reset' );
    }

    function register() {
      router.push('/Register');
    }

    function tourist() {
      router.push('/Comment');
    }
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
    .body {
      font-family: Arial, sans-serif;
      background-image: url('@/assets/images/background5.jpg'); /* 替换为你的背景图片URL */
      background-size: cover; /* 按比例缩放以覆盖整个容器 */
      background-position: center; /* 居中显示 */
      background-repeat: no-repeat; /* 防止背景图重复 */
      height: 100vh; /* 占满整个视口高度 */
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
    }
    .auth-card {
      background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
      backdrop-filter: blur(10px); /* 背景虚化效果 */
      padding: 4vw;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(240, 238, 238, 0.3);
      width: 25vw;
    }
    h2 {
      text-align: center;
      color: white;
      font-size: 3vw;
      margin-bottom: 5vh;
      user-select: none; /* 禁止选中 */
    }
    .form-group {
      margin-bottom: 5vh;
    }
    /* 输入样式 */
    input {
      background-color: rgba(255, 255, 255, 0.1);
      width: 100%;
      padding: 2vh;
      border: 1px solid #d7d6d6;
      border-radius: 5px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 2vh;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid white; /* 添加白色边框 */
      border-radius: 50px;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #6f7777;
    }
    .link {
      display: flex;
      justify-content: space-between;
      margin-top: 5vh;
      cursor: pointer;
      margin-bottom: 3vh;
    }
    .toggle-link {
      text-align: left; /* 确保文本左对齐 */
      margin: 0; /* 移除内边距 */
      user-select: none; /* 禁止选中 */
    }
    a {
      color: #2f2f79;
      text-decoration: none;
    }
</style>
