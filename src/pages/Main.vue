<template>
  <div class="body">
    <NavBar />
    <div class="poster-container">
      <!-- 主视觉区 -->
      <div class="main-visual" :style="{ backgroundImage: `url(${Movies[currentIndex].image})` }">
      </div>
      <!-- 固定电影列表 -->
      <div class="film-list">
        <div v-for="(Movie, index) in Movies" :key="Movie.movieName" class="film-item"
          :class="{ active: currentIndex === index }" @click="handleClick(index)">
          <div class="film-title">{{ Movie.movieName }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="media-section">
        <h1 class="title">热门电影</h1>
        <div class="search-container">
          <el-input v-model="movie_name" placeholder="搜索电影..." class="search-input" @change="fetchMovie(movie_name)">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-input-number v-model="page" :min="1" :max="63" @change="fetchMovies(page)" class="page-input"
            controls-position="right">
          </el-input-number>
        </div>
        <div class="media-grid">
          <!-- 电影卡片 -->
          <div class="media-card" v-for="(movie, index) in movies" :key="index" @click="showDialog(index)">
            <img :src="`https://renmen321.cn:8080/api/images/${movie.image}`" @click="tomoviedata(index)"
              style="width:100%;height:20vh;object-fit:cover">
            <h3>{{ movie.movieChineseName }}</h3>
            <p>{{ movie.type }}</p>
          </div>
        </div>
      </div>
      <!-- 弹窗 -->
      <el-dialog v-model="dialogVisible" title="电影评论" width="50%" :before-close="handleClose">
        <div class="chart-container" id="chart">
          <div class="echart" ref="mychart1" style="height: 74.5vh;"></div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import NavBar from "@/components/Navbar.vue";
import * as echarts from "echarts";

import { onBeforeRouteLeave, useRouter } from "vue-router";
import { reqGetMovie, reqGetMovies } from "@/api/test";
import { useMovieStore } from "@/store/movieStore.js";

interface Movie {
  movieName: string;
  image: string;
}


const Movies = ref<Movie[]>([
  { movieName: '破·地狱', image: '/images/main1.jpg' },
  { movieName: '指环王·洛汗之战', image: '/images/main2.jpg' },
  { movieName: '射雕英雄传', image: '/images/main3.jpg' },
  { movieName: '平原上的火焰', image: '/images/main4.jpg' }
]);

const currentIndex = ref(0)
let timer = null
//点击事件
const handleClick = (index: number) => {
  currentIndex.value = index
}

const switchMovie = () => {
  if (Movies.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % Movies.value.length;
  }
};
onMounted(() => {
  timer = setInterval(switchMovie, 3000) // 3秒切换
})

onUnmounted(() => clearInterval(timer))
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
const dialogVisible = ref(false);
// 初始化图表，弹窗
const showDialog = (index) => {
  movie.value = movies.value[index];
  dialogVisible.value = true;
  nextTick(() => { // 确保弹窗内容已渲染
    initBar();
  });
};
//关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
};
const fetchMovies = async (pages) => {
  try {
    const response = await reqGetMovies(pages, 6);
    if (response.ok) {
      // 假设返回的数据结构中有一个 movies 数组
      movies.value = response.data.list

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
    if (response.ok) {
      movies.value = [response.data];
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
    introduction: movies.value[index].introduction,
    year: movies.value[index].yearOfRelease,
    image: movies.value[index].image
  });
  router.push("MovieData");
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
              { offset: 0, color: '#057DFE' },// 0% 处的颜色
              { offset: 1, color: '#02D7EA' }// 100% 处的颜色
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
  const savedPage = sessionStorage.getItem('moviePage');
  if (savedPage) {
    page.value = parseInt(savedPage, 10);
  }
  fetchMovies(page.value).then(() => {
    initBar();
  });
  // 使用 beforeRouteLeave 钩子保存 page 值到 localStorage


  onBeforeRouteLeave((to, from, next) => {
    sessionStorage.setItem('moviePage', page.value.toString());
    next();
  });
});

</script>

<style scoped>
.body {
  background: linear-gradient(to bottom, #0c0c10, #1a1a24);
  min-height: 100vh;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 11vh;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(12, 12, 16, 0.8);
}

.poster-container {
  position: relative;
  padding: 10vh 0 0 0;
  background: linear-gradient(to bottom, #332c2c, #1a1a24);
  height: 70vh;
}

/* 主视觉区 */
.main-visual {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 70vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.8s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(12, 12, 16, 0.2) 0%, rgba(12, 12, 16, 0.8) 100%);
  }
}


/* 电影列表 */
.film-list {
  position: absolute;
  right: 5vw;
  top: 15vh;
  width: 20vw;
  background: rgba(33, 32, 32, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.film-item {
  display: flex;
  align-items: center;
  height: 12vh;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.film-item.active {
  border-color: #e50914;
  background: rgba(229, 9, 20, 0.1);
  transform: translateX(10px);
}


.film-title {
  color: #fff;
  font-size: 1.2em;
  font-weight: 500;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.echart {
  width: 100%;
  height: 70vh;
  background: white;
  border-radius: 12px;
}

.container {
  padding: 2rem;
  margin-top: 0;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1a1a24, #0c0c10);
}

.media-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  color: #fff;
  font-size: 2.5em;
  font-weight: 600;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.media-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }
}

.media-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.media-card:hover img {
  transform: scale(1.05);
}

.media-card h3 {
  padding: 1rem;
  margin: 0;
  font-size: 1.1em;
  color: #fff;
  font-weight: 500;
}

.media-card p {
  padding: 0 1rem 1rem;
  color: #9d9a9a;
  font-size: 0.9em;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  margin: 0 auto;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  max-width: 100%;
}

.search-input {
  flex: 1;
  max-width: 300px;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  :deep(.el-input__inner) {
    color: #fff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  :deep(.el-input__prefix) {
    color: rgba(255, 255, 255, 0.5);
  }
}

.page-input {
  width: 120px;

  :deep(.el-input-number__decrease),
  :deep(.el-input-number__increase) {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    box-shadow: none !important;
  }

  :deep(.el-input__inner) {
    color: #fff;
  }
}
</style>