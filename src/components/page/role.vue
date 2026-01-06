<template>
  <div class="role-container">
    <el-card class="role-card">
      <!-- 头部区域（搜索框） -->
      <div class="role-header">
        <el-input
          v-model="searchKey"
          placeholder="🔍 请输入用户名"
          clearable
          class="search-input"
        ></el-input>
      </div>

      <!-- 权限表格 -->
      <el-table :data="filteredPermissions" border class="role-table">
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" min-width="180" align="center"></el-table-column>
        <el-table-column prop="role" label="用户角色" min-width="180" align="center"></el-table-column>
        <el-table-column prop="permission" label="用户权限" min-width="300"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="editPermission(row)">编辑权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="permissions.length"
        :page-size="5"
        class="pagination"
      ></el-pagination>
    </el-card>

    <!-- 编辑权限弹窗 -->
    <el-dialog title="编辑用户权限" :visible.sync="dialogVisible" width="500px">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="currentPermission.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="currentPermission.role" placeholder="请选择角色" class="full-width">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="访客" value="guest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户权限">
          <el-input v-model="currentPermission.permission" placeholder="请输入用户权限"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      searchKey: "",
      permissions: [], // 存储后端返回的权限数据
      dialogVisible: false, // 控制弹窗显示
      currentPermission: {}, // 当前正在编辑的权限对象
    };
  },
  computed: {
    filteredPermissions() {
      return this.permissions.filter((p) =>
        p.userName.includes(this.searchKey)
      );
    },
  },
  methods: {
    // 获取权限数据
    fetchPermissions() {
      this.$http.get('/permission/query')
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.permissions = res.data;
          }
        })
        .catch(() => {
          this.$message.error("获取权限列表失败！");
        });
    },

    // 编辑权限
    editPermission(permission) {
      this.currentPermission = { ...permission }; // 复制对象，防止直接修改原数据
      this.dialogVisible = true;
    },

    // 保存修改（调用后端API）
    savePermission() {
      const {id, role, permission} = this.currentPermission;

      this.$http.post('/permission/update', {id, role, permission})
        .then(res => {
          if (res.status === 200) {
            this.$message.success("权限更新成功！");
            this.fetchPermissions(); // 重新获取数据，确保数据同步
            this.dialogVisible = false;
          } else {
            this.$message.error("更新失败！");
          }
        })
        .catch(() => {
          this.$message.error("网络错误，无法更新权限！");
        });
    }
  },
  mounted() {
    this.fetchPermissions(); // 页面加载时获取数据
  },
};
</script>

<style scoped>
/* 容器样式 */
.role-container {
  padding: 20px;
  background: #f4f7fa;
}

/* 角色管理卡片 */
.role-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 头部搜索栏 */
.role-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.search-input {
  width: 260px;
}

/* 表格 */
.role-table {
  margin-bottom: 15px;
}

/* 分页 */
.pagination {
  text-align: center;
  margin-top: 10px;
}

/* 让 el-select 组件铺满 */
.full-width {
  width: 100%;
}
</style>
