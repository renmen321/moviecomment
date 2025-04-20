<!-- MovieManage.vue -->
<template>
  <div class="admin-wrapper">
    <AdminSidebar />

    <!-- 内容区域 -->
    <main class="content-area">
      <div class="operation-bar">
        <el-input
            v-model="movieName"
            placeholder="搜索电影..."
            clearable
            style="width: 300px; margin-right: 16px;"
            @keyup.enter="searchMovies"
        />
        <el-button type="primary" @click="openDialog('add')">
          <el-icon><Plus /></el-icon>新增电影
        </el-button>
      </div>

      <el-table
          :data="movies"
          style="width: 100%; margin-top: 16px;"
          v-loading="loading"
          border
      >
        <el-table-column label="海报" width="150" align="center">
          <template #default="{ row }">
            <el-image
                v-if="row.movieImage === undefined"
                :src="`http://127.0.0.1:8080/api/images/${row.image}`"
                class="poster-image"
                fit="cover"        style="width: 5vh; height: 10vh; border: 1px dashed #ccc; border-radius: 4px;"
            />
            <el-image
                v-else-if="true"
                :src="row.image"
                class="poster-image"
                fit="cover"        style="width: 5vh; height: 10vh; border: 1px dashed #ccc; border-radius: 4px;"
                />
          </template>
        </el-table-column>

        <el-table-column prop="movieChineseName" width="200" label="片名" sortable />

        <el-table-column prop="yearOfRelease" label="年份" width="200" align="center" />

        <el-table-column label="导演" width="250" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="dark">{{ row.director }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="200" align="center">
          <template #default="{ row }">
            <el-tag
                v-for="type in (Array.isArray(row.type) ? row.type : (row.type || '').split(' '))"
                :key="type"
                type="success"
                effect="plain"
                style="margin-right: 5px;"
            >
              {{ type }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="openDialog('edit', row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteMovie(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div style="margin-top: 16px; float: right;">
        <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            v-model:current-page="pageNum"
            @current-change="handlePageChange"
        />
      </div>

    </main>

    <!-- 电影表单弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增电影' : '编辑电影'"
        width="50%"
        center
    >
      <el-form
          :model="currentMovie"
          :rules="rules"
          label-width="100px"
          ref="formRef"
      >
        <el-form-item label="电影海报" prop="poster">
          <el-upload
              action="#"
              :show-file-list="false"
              :on-change="handleUpload"
              :auto-upload="false"
          >
            <el-image
                v-if="currentMovie.movieImage === undefined"
                :src="`http://127.0.0.1:8080/api/images/${currentMovie.image}`"
                class="upload-poster"
                fit="cover"        style="width: 5vh; height: 10vh; border: 1px dashed #ccc; border-radius: 4px;"
            />
            <el-image
                v-else-if="true"
                :src="currentMovie.image"
                class="upload-poster"
                fit="cover"        style="width: 5vh; height: 10vh; border: 1px dashed #ccc; border-radius: 4px;"
            />
            <el-button v-else type="primary" plain>点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="电影名称" prop="movieChineseName">
          <el-input v-model="currentMovie.movieChineseName" placeholder="请输入电影名称" />
        </el-form-item>

        <el-form-item label="上映年份" prop="yearOfRelease">
          <el-date-picker
              v-model="currentMovie.yearOfRelease"
              type="year"
              value-format="YYYY"
              placeholder="请选择上映年份"
          />
        </el-form-item>

        <el-form-item label="导演" prop="director">
          <el-input v-model="currentMovie.director" placeholder="请输入导演名称" />
        </el-form-item>

        <el-form-item label="电影类型" prop="type">
          <el-select
              v-model="currentMovie.type"
              multiple
              placeholder="请选择类型"
              style="width: 100%;"
          >
            <el-option
                v-for="item in genreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="剧情简介" prop="introduction">
          <el-input
              v-model="currentMovie.introduction"
              type="textarea"
              :rows="4"
              maxlength="500"
              show-word-limit
              placeholder="请输入剧情简介"
              resize="none"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMovie">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadFile } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import axios from 'axios';
import AdminSidebar from "@/components/AdminSidebar.vue";
import {GetFeedback} from "@/api/Feedback.ts";
import {addMovie, deleteMovieById, reqGetAdminMovies, reqGetAdminMoviesByName, UpdateMovie} from "@/api/Movies.ts";

interface movie {
  id: number;
  // poster: string;
  movieChineseName: string;
  yearOfRelease: string;
  director: string;
  type: string;
  introduction: string;
  image: string;
  movieImage?: File;
}

const router = useRouter();
// 加载状态
const loading = ref(true);

// 电影数据
const movies = reactive<movie[]>([
  {
    id: 1,
    // poster: "https://example.com/poster1.jpg",
    movieChineseName: "肖申克的救赎",
    yearOfRelease: "1994",
    director: "弗兰克·德拉邦特",
    type: " ",
    introduction: "一位被冤枉入狱的银行家安迪，在监狱中通过智慧和毅力最终获得自由的故事。",
    image: "https://example.com/poster1.jpg",
    movieImage: undefined,
  },
]);// 分页相关
let pageSize = ref(10); // 每页显示4个电影
const pageNum = ref(1);
const total =ref(0);
onMounted(async () => {
  loading.value = true;
  const response =await reqGetAdminMovies(pageNum.value,pageSize.value);
  if(response.ok) {
    loading.value = false;
    // 清空并替换数组内容（推荐）
    movies.splice(0, movies.length, ...response.data.list);
    total.value = response.data.total;
  }else {
    loading.value = false;
    ElMessage.error('获取电影数据失败');
  }
})


// 搜索功能
let movieName = ref("");
const searchMovies= async () => {
  loading.value = true;
  const response = await reqGetAdminMoviesByName(movieName.value);
  if(response.ok) {
    loading.value = false;
    if(response.data.total === 0) {
      ElMessage.error('没有找到相关电影');
    }else {
      movies.splice(0, movies.length, ...response.data.list);
      total.value = response.data.total;
    }
  }else{
    loading.value = false;
    ElMessage.error('获取电影数据失败');
  }
}

// 表单验证规则
const rules = {
  movieChineseName: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
  yearOfRelease: [{ required: true, message: "请选择上映年份", trigger: "change" }],
  type: [
    { type: "array", required: true, message: "请至少选择一个类型", trigger: "change" },
  ],
};

// 类型选项
const genreOptions = [
  { value: "剧情", label: "剧情" },
  { value: "动作", label: "动作" },
  { value: "科幻", label: "科幻" },
  { value: "爱情", label: "爱情" },
  { value: "悬疑", label: "悬疑" },
  {value: "犯罪", label: "犯罪"},
  {value: "惊悚", label: "惊悚"},
    {value: "同性", label: "同性"},
];

// 弹窗相关状态
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
let currentMovie = reactive<Partial<movie>>({});

// 打开弹窗
const openDialog = (type: "add" | "edit", row?: movie) => {
  dialogType.value = type;
  if (type === "edit" && row) {
    Object.assign(currentMovie, row);
    currentMovie.movieImage = undefined;
    // 将类型数组转换为空格隔开的字符串
    currentMovie.type = Array.isArray(currentMovie.type)
        ? currentMovie.type.join(' ') // 如果是数组，使用空格连接成字符串
        : (currentMovie.type || "").toString(); // 确保是字符串
    currentMovie.image = row.image;
  } else {
    resetForm();
  }
  dialogVisible.value = true;
};

// 保存电影
const saveMovie = async () => {
  if (dialogType.value === "add") {
    currentMovie.type = (currentMovie.type || []).join(' ');
    const response= await addMovie({
      movieChineseName: currentMovie.movieChineseName as string,
      type: currentMovie.type as string,
      introduction: currentMovie.introduction as string,
      yearOfRelease: currentMovie.yearOfRelease as string,
      director: currentMovie.director as string,
      image: currentMovie.image as string,
      movieImage: currentMovie.movieImage as File
    });
    if(response.ok){
      currentMovie.movieImage = undefined;
      assignNonNullValues(currentMovie, response.data);
      const movieCopy = Object.assign({}, currentMovie) as movie;
      movies.push(movieCopy as movie);
    }else {
      ElMessage.error(response.message);
    }
  } else {
    currentMovie.type = (currentMovie.type || []).join(' ');
    const response = await UpdateMovie({
      id: currentMovie.id as number,
      movieChineseName: currentMovie.movieChineseName as string,
      type: currentMovie.type as string,
      introduction: currentMovie.introduction as string,
      yearOfRelease: currentMovie.yearOfRelease as string,
      director: currentMovie.director as string,
      image: currentMovie.image as string,
      movieImage: currentMovie.movieImage as File,
    });
    if(response.ok){
    const index = movies.findIndex((m) => m.id === currentMovie.id);
    if (index !== -1) {
      currentMovie.movieImage = undefined;
      assignNonNullValues(currentMovie, response.data);
      const movieCopy = Object.assign({}, currentMovie) as movie;
      movies.splice(index, 1, movieCopy as movie);
    }}else {
      ElMessage.error(response.message);
    }
  }
  dialogVisible.value = false;
  ElMessage.success("保存成功");
};
const assignNonNullValues = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] !== null) {
      target[key] = source[key];
    }
  }
};

// 删除电影
const deleteMovie = async (id: number) => {
  ElMessageBox.confirm("确定删除该电影？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const index = movies.findIndex((m) => m.id === id);
    movies.splice(index, 1);
    const response = await deleteMovieById(id);
    if(response.ok) {
      ElMessage.success("删除成功");
    }else {
      ElMessage.error(response.message);
    }
  });
};

// 图片上传处理
const handleUpload = (file: UploadFile) => {
  if(file.raw!==undefined) {
    currentMovie.movieImage = file.raw;
    currentMovie.image = URL.createObjectURL(file.raw); // 用于预览
    ElMessage.success('图片已选择，点击保存后上传');
  }
};

// 重置表单
const resetForm = () => {
  currentMovie.id = undefined;
  currentMovie.image = "";
  currentMovie.movieChineseName = "";
  currentMovie.yearOfRelease = "";
  currentMovie.director = "";
  currentMovie.type = "";
  currentMovie.introduction= "";
  currentMovie.movieImage = undefined;
};

// 分页处理
const handlePageChange = async (pageNum: number) => {

  loading.value = true;
  const response = await reqGetAdminMovies(pageNum,pageSize.value);
  if(response.ok) {
    loading.value = false;
    // 清空并替换数组内容（推荐）
    movies.splice(0, movies.length, ...response.data.list);
    total.value = response.data.total;
  }else {
    loading.value = false;
    ElMessage.error('获取电影数据失败');
  }
};


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
  padding-top: 1vh;
  overflow: auto;
}

.operation-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.poster-image {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.upload-poster {
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: block;
}
</style>
