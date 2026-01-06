<template>
  <el-container class="user-management-container">
    <!-- 页面标题 -->
    <el-header class="header">
      <span class="title">用户管理</span>
      <el-button type="primary" class="add-user-btn" @click="openAddUserDialog">
        <i class="el-icon-plus"></i> 添加用户
      </el-button>
    </el-header>

    <el-main>
      <!-- 用户列表表格 -->
      <el-table :data="userList" stripe class="user-table">
        <el-table-column prop="userName" label="用户名" width="220"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="role" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="150">
          <template v-slot="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template v-slot="scope">
            <el-button size="mini" type="warning" @click="openEditUserDialog(scope.row)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row.userName)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
        class="pagination"
      ></el-pagination>
    </el-main>

    <!-- 新增用户弹窗 -->
    <el-dialog :visible.sync="addDialogVisible" title="新增用户" width="500px" class="user-dialog">
      <el-form :model="addUserForm" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="addUserForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addUserForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addUserForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 编辑用户弹窗 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑用户" width="500px" class="user-dialog">
      <el-form :model="editUserForm" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editUserForm.role">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editUserForm.status">
            <el-option label="活跃" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      userList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        userName: "",
        email: "",
        role: "user",
        status: "active"
      },
      editUserForm: {
        userName: "",
        email: "",
        role: "",
        status: ""
      }
    };
  },
  mounted() {
    this.fetchUserList();
  },
  methods: {
    fetchUserList() {
      this.$http.get("/user/select").then((res) => {
        console.log("服务器返回数据：", res);
        if (Array.isArray(res.data)) {
          this.userList = res.data;
          this.pagination.total = this.userList.length;
        } else {
          console.error("数据格式错误:", res.data);
        }
      }).catch(error => {
        console.error("获取用户数据失败:", error);
      });
    },
    handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchUserList();
    },
    openAddUserDialog() {
      this.addUserForm = { userName: "", email: "", role: "user", status: "active" };
      this.addDialogVisible = true;
    },
    openEditUserDialog(user) {
      this.editUserForm = { ...user };
      this.editDialogVisible = true;
    },
    addUser() {
      this.$http.post("/user/adduser", this.addUserForm).then(() => {
        this.$message.success("新增用户成功");
        this.addDialogVisible = false;
        this.fetchUserList();
      }).catch(() => {
        this.$message.error("新增失败，请检查网络");
      });
    },
    updateUser() {
      this.$http.post("/user/update", this.editUserForm).then(() => {
        this.$message.success("用户信息更新成功");
        this.editDialogVisible = false;
        this.fetchUserList();
      }).catch(() => {
        this.$message.error("更新失败，请检查网络");
      });
    },
    deleteUser(userName) {
      this.$confirm("确认删除该用户吗?", "提示", { type: "warning" })
        .then(() => {
          this.$http.post("/user/delete", { userName: userName }).then(() => {
            this.$message.success("用户已删除");
            this.fetchUserList();
          }).catch(() => {
            this.$message.error("删除失败，请检查网络");
          });
        });
    }
  }
};
</script>


<style scoped>
/* 页面背景 */
.user-management-container {
  padding: 20px;
  background: #f4f6f8;
}

/* 标题栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 添加用户按钮 */
.add-user-btn {
  background: linear-gradient(90deg, #42a5f5, #1e88e5);
  color: white;
}

/* 表格美化 */
.user-table {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
}

.user-table ::v-deep th {
  background: #f1f3f5 !important;
}

.user-table ::v-deep td {
  transition: background 0.3s;
}

.user-table ::v-deep tr:hover td {
  background: #e3f2fd !important;
}

/* 按钮动画 */
.el-button {
  transition: 0.3s;
}

.el-button:hover {
  transform: scale(1.05);
}

/* 分页 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 弹窗优化 */
.user-dialog .el-dialog__footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
