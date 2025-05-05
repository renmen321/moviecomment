<!-- UserManage.vue -->
<template>
  <div class="admin-wrapper">
    <!-- 动态侧边栏 -->
    <AdminSidebar />

    <!-- 内容区域 -->
    <main class="content-area">
      <div class="user-management">
        <div class="search-bar">
          <el-input v-model="searchQuery" placeholder="搜索用户" class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="showRegisterDialog">新增用户</el-button>
        </div>

        <el-table :data="users" style="width: 100%" :header-cell-style="{ background: '#f8f8f8', color: '#333' }">
          <el-table-column label="头像" width="100%">
            <template #default="scope">
<<<<<<< Updated upstream
              <el-image
                  :src="`http://renmen321.cn:8080/api/profilePicture/${scope.row.profilePicture}`"
                  class="avatar"
                  fit="cover"
              />
=======
              <el-image :src="scope.row.profilePicture" class="avatar" fit="cover" />
>>>>>>> Stashed changes
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="100%" />
          <el-table-column prop="name" label="姓名" width="100%" />
          <el-table-column label="是否为管理员" width="150%">
            <template #default="scope">
              <span>{{ scope.row.admin ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="喜欢的电影类型" width="240%">
            <template #default="scope">
              <div class="movie-tags">
                <el-tag v-for="type in getFavoriteTypesArray(scope.row.favoriteType)" :key="type" type="info"
                        class="movie-tag">
                  {{ type }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="喜欢的电影" width="240%">
            <template #default="scope">
              <div class="movies">
                <el-tag v-for="movie in scope.row.likeMovies" :key="movie" type="info" class="movie">
                  {{ movie }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="personalLabel" label="个人标签" width="250%" />
          <el-table-column label="操作" width="100%">
            <template #default="scope">
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon-color="#6200ea"
                             title="确定要删除该用户吗？" @confirm="deleteUser(scope.row.id)">
                <template #reference>
                  <el-button type="danger" size="small"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                       v-model:current-page="pageNum" @current-change="handlePageChange" class="pagination" />
      </div>
    </main>

    <!-- 注册弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增用户" width="40%" style="--el-dialog-bg-color:rgba(255, 255, 255, 0.5)">
      <RegisterUserForm ref="registerFormRef" @Success="fetchUsers" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
<<<<<<< Updated upstream
import AdminSidebar from "@/components/AdminSidebar.vue";
import {deleteUserById, getUserPage} from "@/api/User.ts";
import {getAllMovieName, getCommentTypeCountByName, getMovieCommentByName} from "@/api/Movies.ts";
import {ElMessage} from "element-plus";
=======
import AdminSidebar from '@/components/AdminSidebar.vue'
import { getUserPage } from '@/api/User.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import RegisterUserForm from '@/components/RegisterUserForm.vue'
>>>>>>> Stashed changes

const router = useRouter()

interface User {
  id: number,
  username: string,
  name: string,
  profilePicture: string,
  admin: boolean,
  email: string,
  personalLabel: string,
  likeMovies: string[],
  favoriteType: string
}

// 响应式状态管理
let users = reactive<User[]>([])
let total = ref(0)
const searchQuery = ref('')

// 方法：将 favoriteType 字符串转换为数组
const getFavoriteTypesArray = (favoriteType: string): string[] => {
  if (favoriteType) return favoriteType.trim().split(/\s+/).filter(type => type.length > 0)
}

// 分页功能
const pageNum = ref(1)
const pageSize = ref(10)

const handlePageChange = async (newPageNum: number) => {
  pageNum.value = newPageNum
  const response = await getUserPage(pageNum.value, pageSize.value)
  if (response.ok) {
    total.value = response.data.total
    users.length = 0
    users.push(...response.data.list)
  } else {
    ElMessage.error('获取用户数据失败')
  }
}
<<<<<<< Updated upstream
//删除用户
  const deleteUser = async (id: number) => {
    const response = await deleteUserById(id);
    if(response.ok){
      ElMessage.success('删除成功');
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users.splice(index, 1);
      }
    }else {
      ElMessage.error('删除失败');
    }
  }
=======
>>>>>>> Stashed changes

onMounted(async () => {
  const response = await getUserPage(pageNum.value, pageSize.value)
  if (response.ok) {
    total.value = response.data.total
    users.length = 0
    users.push(...response.data.list)
  } else {
    ElMessage.error('获取用户数据失败')
  }
})

// 弹窗控制
const dialogVisible = ref(false)
const registerFormRef = ref()
const showRegisterDialog = () => {
  dialogVisible.value = true
}

// 刷新用户列表
const fetchUsers = async () => {
  const response = await getUserPage(pageNum.value, pageSize.value)
  if (response.ok) {
    total.value = response.data.total
    users.length = 0
    users.push(...response.data.list)
  } else {
    ElMessage.error('刷新用户列表失败')
  }
}

// 删除用户方法（需要实现具体逻辑）
const deleteUser = (userId: number) => {
  // 这里添加删除用户的逻辑
  ElMessage.success('用户删除成功')
  // 刷新列表
}
</script>

<style scoped>
/* 全局布局优化 */
.admin-wrapper {
  display: grid;
  grid-template-columns: 19vw 81vw;
  min-height: 100vh;
  background: white;
}

/* 内容区域美化 */
.content-area {
  padding: 2vw;
  background: #f8f7f7;
  overflow-y: auto;
}

.user-management {
  width: auto;
  padding: 2vw;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.search-bar {
  margin-bottom: 3vh;
}

.search-input {
  width: 15vw;
}

.avatar {
  width: 4.5vw;
  height: 7vh;
  border-radius: 50%;
}

.movie-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
}

.movie-tag {
  border-radius: 20px;
  padding: 1vw 1vh;
  font-size: 12px;
}

.movies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.movie {
  border-radius: 20px;
  padding: 1vw 1vh;
  font-size: 12px;
}

.pagination {
  margin-top: 2vh;
  display: flex;
  justify-content: flex-end;
}

.el-dialog__body {
  padding: 20px 20px 0 20px;
}

.el-form-item__content {
  width: 80%;
}

.el-select {
  width: 100%;
}
</style>
