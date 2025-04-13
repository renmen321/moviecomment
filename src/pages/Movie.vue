<template>
  <nav>
    <img :src="logo" class="logo" alt="">
    <div class="nav-links">
      <button @click="toComment()" class="nav-item">评价</button>
      <button @click="toMovie()" class="nav-item">影视剧</button>
      <button @click="toFeedBack()" class="nav-item">反馈</button>
    </div>
    <div class="nav-links-right">
      <button @click="toUser()"  class="nav-item">账号</button>
    </div>
  </nav>
  <div class="container">
    <!-- 左边影视内容 -->
    <div class="media-section">
      <h1>热门影视</h1>
      <div style="display: flex ;margin-bottom:1vh ">
        <el-input v-model="movie_name" placeholder="电影名称" style="width: 10vw;"
                  @change="fetchMovie(movie_name)"></el-input>
        <el-input-number v-model="page" :min="1" :max="63" @change="fetchMovies(page)"
                         style="width: 10vw;margin-left: 30vw"></el-input-number>
      </div>
      <div class="media-grid">
        <!-- 电影卡片 -->
        <div class="media-card" v-for="(movie, index) in movies" :key="index" @click="draw(index)">
          <img :src="`http://127.0.0.1:8080/movies/getImage?id=${movie.id}`" @click="tomoviedata(index)"
               style="width:100%;height:20vh;object-fit:cover">
          <h3>{{ movie.movieChineseName }}</h3>
          <p>{{ movie.type }}</p>
          <p>{{ movie.ratings }}</p>
        </div>
      </div>
    </div>
    <div style="width: 50vw;display: flex;height: 100vh;justify-content: center;align-items: center;">
      <div class="chart-container" id="chart">
        <div class="echart" ref="mychart1" style="height:74.5vh;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import * as echarts from "echarts";
import {constantRoutes} from "@/router/constantRoutes.js";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {reqGetMovie, reqGetMovies} from "@/api/test";
import {useMovieStore} from "@/store/movieStore.js";
import logo from "@/assets/images/logo.jpg";
const movieStore = useMovieStore();
const movies = ref([]);
const router = useRouter();
const mychart1 = ref(null);
let page = ref(1);
let movie_name = ref("");
let movie = ref({
  good: 0,
  general: 0,
  bad: 0,
});
let myChartInstance = null;
const draw = (index) => {
  movie.value = movies.value[index];
  initBar();
};
const fetchMovies = async (pages) => {
  try {
    const response = await reqGetMovies(pages);
    if (response.data.ok) {
      // 假设返回的数据结构中有一个 movies 数组
      movies.value = response.data.data.list


    } else {
      console.error('获取电影数据失败:', response.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

const fetchMovie = async (movie_name) => {
  try {
    const response = await reqGetMovie(movie_name);
    if (response.data.ok) {
      movies.value = [response.data.data];
    } else {
      console.error('获取电影数据失败:', response.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

 async function tomoviedata(index) {
   await movieStore.setMovie({
     id: movies.value[index].id,
     movieChineseName: movies.value[index].movieChineseName,
     type: movies.value[index].type,
     ratings: movies.value[index].ratings,
     introduction :movies.value[index].introduction,
     year : movies.value[index].yearOfRelease
   });
   router.push({name: constantRoutes[4].name});
 }

const initBar = () => {
  const option = {
    title: { // 标题组件
      text: '评论数',
      top: 20,
      // 距离容器左侧的距离。可选left,right等
      left: '50vw',
      textStyle: {
        color: '#231e1e',
        fontSize: 20,
        fontFamily: 'Microsoft YaHei'
      }
    },
    grid: { // 直角坐标系内绘图网格
      // grid区域是否包含坐标轴的刻度标签。
      // false可使多个grid区域坐标轴对齐
      containLabel: false,
      bottom: '15%',// grid 组件离容器下侧的距离。默认60px
      top: '15%', // grid 组件离容器上侧的距离。默认60px
      right: '20%'
    },
    xAxis: { // X轴-相关设置
      axisLabel: { // X轴-坐标轴刻度标签的相关设置。
        show: true, // 是否显示刻度标签。默认为true
        color: '#000000',
        rotate: 0,// 刻度标签旋转的角度。默认为0
        margin: 20, // 刻度标签与轴线之间的距离。 默认8px
        fontSize: 20,
        // 坐标轴刻度标签的显示间隔。
        // 0表示显示所有标签,1表示间隔一个显示标签
        interval: 0
      },
      axisTick: { // X轴-坐标轴刻度相关设置
        show: true
      },
      splitLine: { // X轴-分隔线
        show: true
      },
      axisLine: { // X轴-坐标轴轴线相关设置
        show: true,
        lineStyle: {
          color: '#384267',
          type: 'solid' // 线的类型。可选'solid'等
        }
      },
      data: ['好评', '中评', '差评'],
    },
    yAxis: { // Y轴-相关设置
      name: '个数', // Y轴-坐标轴名称
      nameTextStyle: { // Y轴-坐标轴名称的文字样式
        color: '#000000',
        padding: [0, 0, 10, 0],
        fontSize: 14
      },
      axisLabel: { // Y轴-坐标轴刻度标签的相关设置
        color: '#000000',
        fontSize: 15,
      },
      axisTick: { // Y轴-坐标轴刻度相关设置。
        show: true,
        lineStyle: {
          color: '#384267'
        }
      },
      splitLine: { // Y轴-分隔线
        show: true,
        lineStyle: {
          color: '#384267',
          type: 'dashed'
        }
      },
      axisLine: { // Y轴-坐标轴轴线相关设置。
        show: true,
        lineStyle: {
          color: '#384267',
          type: 'solid'
        }
      }
    },
    series: [// 柱体系列数据
      {
        name: '个数',
        data: [movie.value.good, movie.value.general, movie.value.bad],
        type: 'bar',
        barWidth: 30, // 柱条的宽度
        itemStyle: { // 柱条图形样式
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            global: false,
            colorStops: [
              {offset: 0, color: '#057DFE'},// 0% 处的颜色
              {offset: 1, color: '#02D7EA'}// 100% 处的颜色
            ]
          }
        },
        label: { // 图形上的文本标签
          show: true,
          position: 'top',// 标签的位置。可选top，left等
          distance: 10, // 距离图形元素的距离。默认值5
          color: '#000000'
        }
      }
    ],
    tooltip: { // 提示框组件
      trigger: 'axis',// 触发类型。坐标轴触发
      backgroundColor: 'rgba(17,95,182,0.5)',
      textStyle: {
        color: "#000000"
      },
      axisPointer: { // 坐标轴指示器配置项
        type: 'shadow' // 可选line，shadow，none，cross
      },
      formatter: (params) => {
        return (
            `${params[0].name}<br />
          ${params[0].seriesName}：${params[0].value}`
        )
      }
    }
  }
  if (myChartInstance) {
    myChartInstance.setOption(option);
  } else {
    myChartInstance = echarts.init(mychart1.value);
    myChartInstance.setOption(option);
  }
};

onMounted(() => {
  const savedPage = localStorage.getItem('moviePage');
  if (savedPage) {
    page.value = parseInt(savedPage, 10);
  }
  fetchMovies(page.value).then(() => {
    initBar();
  });
  // 使用 beforeRouteLeave 钩子保存 page 值到 localStorage


  onBeforeRouteLeave((to, from, next) => {
    localStorage.setItem('moviePage', page.value.toString());
    next();
  });
});
function toMovie() {

  router.push('/Movie');
}
function toComment() {
  router.push('/Comment');
}
function toFeedBack() {
  router.push('/FeedBack');
}
function toUser() {
  router.push('/User');
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 公共样式 */
nav {
  display: flex;
  align-items: center;
  padding: 15px 5rem 15px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: rgba(44, 62, 80, 0.2);
  /* 使用带透明度的背景色 */
  backdrop-filter: blur(10px);
  /* 标准语法 */
  -webkit-backdrop-filter: blur(10px);
  /* Safari 兼容 */
  position: fixed;
  width: 100vw;
  z-index: 10;
}

.logo {
  width: 100px;
  /* 根据需要调整图片宽度 */
  height: auto;
  /* 保持图片比例 */
  margin-right: 50px;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-item {
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid skyblue;
  text-decoration: none;
  padding: 4px 4px;
  font-size: 1.2rem;
  margin: 0 5px;
  transition: all 0.3s;
}
.nav-links-right {
  margin-left: 64vw; /* 将按钮推到最右侧 */
}
.nav-item:hover {
  color: #3498db;
  background: rgba(255, 255, 255, 0.1);
}
.echart {
  width: 50vw;
}

.container {
  padding-top: 10vh;
  display: grid;
  grid-template-columns: 50vw 50vw;
  height: 90vh;
  overflow: hidden;
  background-image: url('@/assets/images/background2.jpg'); /* 添加背景图片 */
  background-size: cover; /* 使背景图片覆盖整个容器 */
  background-position: center; /* 将背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
}

.media-section {
  padding: 0 2vw;
  display: flex;
  flex-direction: column;
  height: 90vh;
  /* 留出padding空间 */
}

.media-grid {
  display: grid;
  justify-content: center;
  align-items: start;
  grid-template-columns: 1fr 1fr;
  gap: 1vh;
  flex: 1;
}

.media-card {
  background: white;
  border-radius: 1vh;
  padding: 2vh;
  box-shadow: 0 0.2vh 0.8vh rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.media-card:hover {
  transform: translateY(-5px);
}

.chart-container {
  height: 71.5vh;
  width: 45vw;
  background: white;
  padding: 20px 20px 0;
  margin-bottom:2.5vh;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

</style>