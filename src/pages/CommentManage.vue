<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

    <!-- 评论管理主内容区 -->
    <main v-if="activeMenu === 'comment'" class="content-area">
      <div class="operation-bar">
        <el-input
            v-model="searchQuery"
            placeholder="搜索电影名称..."
            clearable
            style="width: 20vw"
            @keyup.enter="searchMovies"
        />
        <el-button type="primary" @click="searchMovies">搜索</el-button>
        <el-select v-model="selectedMovieName" placeholder="选择电影" style="width: 20vw; margin-left: 40vw;">
          <el-option
              v-for="movie in movies"
              :key="movie"
              :label="movie"
              :value="movie"
          />
        </el-select>
      </div>

      <!-- 当前电影评论展示 -->
      <div v-if="currentMovie" class="movie-comments">
        <h3 class="movie-title">{{ currentMovie}} 评论管理</h3>

        <el-tabs v-model="activeCommentType">
          <el-tab-pane
              v-for="t in commentTypes"
              :key="t.type"
              :label="`${t.type} (${getCommentCount(t.label)})`"
              :name="t.type"
          >
            <el-table
                :data="comments"
                border
                v-loading="loading"
            >
              <el-table-column prop="username" label="用户" width="120" />
              <el-table-column prop="comment" label="评论内容" min-width="300" />
              <el-table-column prop="date" label="时间" width="150" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button
                      type="danger"
                      size="mini"
                      @click="deleteComment(row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 评论分页 -->
            <el-pagination
                v-model:current-page="pageNum"
                layout="prev, pager, next, jumper"
                :total="getCommentCount(t.label)"
                :page-size="pageSize"
                @current-change="handlePageChange"
                style="margin-left: 30vw;"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, computed, watch, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminSidebar from '@/components/AdminSidebar.vue';
import {getTypePercentageByDate, reqGetAdminCommentByDate} from "@/api/test.ts";
import {getAllMovieName, getCommentTypeCountByName, getMovieCommentByName} from "@/api/Movies.ts";

interface Comment {
  comment: string
  username: string
  date: string
  id: number
}


// 模拟数据
let movies = ref<string[]>([]);

onMounted(async () => {
  const response = await getAllMovieName();
  if(response.ok){
    movies.value=response.data.list;
    currentMovie.value=response.data.list[0];
      const response0=await getCommentTypeCountByName(currentMovie.value);
      if(response0.ok){
        currentCommentCounts.length=0;
        currentCommentCounts.push(...response0.data.list);
      }else {
        ElMessage.error('获取电影评论数量失败');
      }
      const response1= await getMovieCommentByName(currentMovie.value,pageNum.value,pageSize.value,0);
      if(response1.ok){
        comments.length=0;
        comments.push(...response1.data.list);
      }else {
        ElMessage.error('获取电影评论失败');
      }

  }else {
    ElMessage.error('获取电影数据失败');
  }
})

const comments = reactive<Comment[]>([])
interface count {
  type: number
  count: number
}
// 响应式状态
let currentCommentCounts = reactive<count[]>([]);
const activeMenu = ref('comment')
const searchQuery = ref('')
const selectedMovieName = ref<string | null>(null)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const activeCommentType = ref('好评')
const commentTypes = reactive([
  { type: '好评', label: 0 },
  { type: '中评', label: 1 },
  { type: '差评', label: 2 }
])


let currentMovie = ref<string>();


// 方法
const searchMovies = () => {
  pageNum.value = 1
}
const getCommentCount = (label: number): number => {
  const countObj = currentCommentCounts.find(item => item.type === label);
  return countObj ? countObj.count : 0;
}
const handlePageChange = async (val: number) => {
  pageNum.value = val;
  if (currentMovie.value) {
    let type;
    if (activeCommentType.value === '好评') {
      type = 0;
    } else if (activeCommentType.value === '中评') {
      type = 1;
    } else {
      type = 2;
    }
    const response = await getMovieCommentByName(currentMovie.value, val, pageSize.value, type);
    if (response.ok) {
      comments.length = 0;
      comments.push(...response.data.list);
    } else {
      ElMessage.error('获取电影评论失败');
    }
  }
}

// const deleteComment = (comment: Comment) => {
//   ElMessageBox.confirm('确定删除该评论？', '警告', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消'
//   }).then(() => {
//     const commentIndex = comments.findIndex(c =>
//         c.type === comment.type &&
//         c.content === comment.content &&
//         c.user === comment.user &&
//         c.time === comment.time &&
//         c.movieId === comment.movieId
//     );
//     if (commentIndex > -1) {
//       comments.splice(commentIndex, 1); // 删除评论
//       ElMessage.success('删除成功');
//     }
//   });
// }


watch(selectedMovieName, async (newVal) => {
  if (newVal !== null) {
    pageNum.value = 1;
    currentMovie.value = newVal;
    const response0=await getCommentTypeCountByName(newVal);
    if(response0.ok){
      currentCommentCounts.length=0;
      currentCommentCounts.push(...response0.data.list);
    }else {
      ElMessage.error('获取电影评论数量失败');
    }
    const response = await getMovieCommentByName(newVal, pageNum.value, pageSize.value, 0);
    if(response.ok){
      comments.length=0;
      currentCommentCounts.value=response.data.total;
      comments.push(...response.data.list);
    }else {
      ElMessage.error('获取电影评论失败');
    }
  }
})

// 监听 activeCommentType 的变化
watch(activeCommentType, async () => {
  let response;
  pageNum.value = 1;
  if (activeCommentType.value === '好评') {
     response = await getMovieCommentByName(currentMovie.value, pageNum.value, pageSize.value, 0);
  }else if (activeCommentType.value === '中评') {
     response = await getMovieCommentByName(currentMovie.value, pageNum.value, pageSize.value, 1);
  } else {
     response = await getMovieCommentByName(currentMovie.value, pageNum.value, pageSize.value, 2);
  }
  if (response.ok) {
    comments.length = 0;
    comments.push(...response.data.list);
  } else {
    ElMessage.error('获取电影评论失败');
  }
})
</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

/* 内容区域 */
.content-area {
  padding: 2vh;
}

.operation-bar {
  display: flex;
  gap: 2vh;
  margin-bottom: 2vh;
}

.movie-comments {
  background: white;
  padding: 2vh;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.movie-title {
  color: #303133;
  margin-bottom: 2vh;
}
</style>
