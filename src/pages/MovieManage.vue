<!-- MovieManage.vue -->
<template>
  <div class="admin-wrapper">
    <AdminSidebar />

    <!-- 内容区域 -->
    <main class="content-area">
      <div class="operation-bar">
        <el-input
            v-model="searchQuery"
            placeholder="搜索电影..."
            clearable
            style="width: 300px; margin-right: 16px;"
        />
        <el-button type="primary" @click="openDialog('add')">
          <el-icon><Plus /></el-icon>新增电影
        </el-button>
      </div>

      <el-table
          :data="paginatedMovies"
          style="width: 100%; margin-top: 16px;"
          v-loading="loading"
          border
      >
        <el-table-column label="海报" width="150" align="center">
          <template #default="{ row }">
            <el-image
                :src="row.poster"
                :preview-src-list="[row.poster]"
                class="poster-image"
                fit="cover"
                style="width: 100px; height: 140px;"
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="片名" sortable />

        <el-table-column prop="year" label="年份" width="100" align="center" />

        <el-table-column label="导演" width="180" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="dark">{{ row.director }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="200" align="center">
          <template #default="{ row }">
            <el-tag
                v-for="genre in row.genres"
                :key="genre"
                type="success"
                effect="plain"
                style="margin-right: 5px;"
            >
              {{ genre }}
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
            :total="totalMovies"
            :page-size="pageSize"
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
                v-if="currentMovie.poster"
                :src="currentMovie.poster"
                class="upload-poster"
                fit="cover"
                style="width: 5vh; height: 10vh; border: 1px dashed #ccc; border-radius: 4px;"
            />
            <el-button v-else type="primary" plain>点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="电影名称" prop="title">
          <el-input v-model="currentMovie.title" placeholder="请输入电影名称" />
        </el-form-item>

        <el-form-item label="上映年份" prop="year">
          <el-date-picker
              v-model="currentMovie.year"
              type="year"
              value-format="YYYY"
              placeholder="请选择上映年份"
          />
        </el-form-item>

        <el-form-item label="导演" prop="director">
          <el-input v-model="currentMovie.director" placeholder="请输入导演名称" />
        </el-form-item>

        <el-form-item label="电影类型" prop="genres">
          <el-select
              v-model="currentMovie.genres"
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

        <el-form-item label="剧情简介" prop="description">
          <el-input
              v-model="currentMovie.description"
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

interface movie {
  id: number;
  poster: string;
  title: string;
  year: string;
  director: string;
  genres: string[];
  description: string;
}

const router = useRouter();


// 电影数据
const movies = reactive<movie[]>([
  {
    id: 1,
    poster: "https://example.com/poster1.jpg",
    title: "肖申克的救赎",
    year: "1994",
    director: "弗兰克·德拉邦特",
    genres: ["剧情"],
    description: "一位被冤枉入狱的银行家安迪，在监狱中通过智慧和毅力最终获得自由的故事。",
  },
]);

// 分页相关
const pageSize = 4; // 每页显示4个电影
const currentPage = ref(1);
const totalMovies = computed(() => movies.length);
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return movies.slice(start, start + pageSize);
});

// 搜索功能
const searchQuery = ref("");


// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
  year: [{ required: true, message: "请选择上映年份", trigger: "change" }],
  genres: [
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
];

// 弹窗相关状态
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const currentMovie = reactive<Partial<movie>>({});

// 打开弹窗
const openDialog = (type: "add" | "edit", row?: movie) => {
  dialogType.value = type;
  if (type === "edit" && row) {
    Object.assign(currentMovie, row);
  } else {
    resetForm();
  }
  dialogVisible.value = true;
};

// 保存电影
const saveMovie = () => {
  if (dialogType.value === "add") {
    movies.push({
      ...currentMovie,
      id: Date.now(),
    } as movie);
  } else {
    const index = movies.findIndex((m) => m.id === currentMovie.id);
    if (index !== -1) {
      movies.splice(index, 1, currentMovie as movie);
    }
  }
  dialogVisible.value = false;
  ElMessage.success("保存成功");
};

// 删除电影
const deleteMovie = (id: number) => {
  ElMessageBox.confirm("确定删除该电影？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const index = movies.findIndex((m) => m.id === id);
    movies.splice(index, 1);
    ElMessage.success("删除成功");
  });
};

// 图片上传处理
const handleUpload = (file: UploadFile) => {
  const formData = new FormData();
  formData.append('file', file.raw);

  axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(response => {
        currentMovie.poster = response.data.url; // 假设服务器返回图片的 URL
        ElMessage.success('图片上传成功');
      })
      .catch(error => {
        ElMessage.error('图片上传失败');
        console.error(error);
      });
};

// 重置表单
const resetForm = () => {
  currentMovie.poster = "";
  currentMovie.title = "";
  currentMovie.year = "";
  currentMovie.director = "";
  currentMovie.genres = [];
  currentMovie.description = "";
};

// 分页处理
const handlePageChange = (val: number) => {
  currentPage.value = val;
};


// 加载状态
const loading = ref(true);

// 监听分页变化，确保在合理范围内
watch(currentPage, (newPage) => {
  if (newPage < 1 || newPage > Math.ceil(totalMovies.value / pageSize)) {
    currentPage.value = 1;
  }
});

// 模拟加载完成后关闭加载状态
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

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
