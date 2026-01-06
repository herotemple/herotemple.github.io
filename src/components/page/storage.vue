<template>
  <div class="storage-container">
    <header class="storage-header">
      <h2>仓储位置信息管理</h2>
      <button class="btn-add" @click="openAddDialog">新增仓储位</button>
    </header>

    <section class="storage-list">
      <table class="storage-table">
        <thead>
        <tr>
          <th>位置编号</th>
          <th>位置名称</th>
          <th>容量(立方米)</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in storageList" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.capacity }}</td>
          <td>{{ item.description }}</td>
          <td>
            <button class="btn-edit" @click="openEditDialog(item)">编辑</button>
            <button class="btn-delete" @click="confirmDelete(item.id)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="仓储位信息" width="450px">
      <el-form :model="form">
        <el-form-item label="位置编号" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="容量" :label-width="formLabelWidth">
          <el-input-number v-model="form.capacity" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStorage">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Storage",
  data() {
    return {
      storageList: [],
      dialogVisible: false,
      formLabelWidth: "100px",
      form: {
        id: null,
        code: "",
        name: "",
        capacity: 0,
        description: "",
      },
      isEdit: false,
    };
  },
  created() {
    this.fetchStorageList();
  },
  methods: {
    // 获取仓储位列表
    fetchStorageList() {
      this.$http.get("/storage/list").then(res => {
        this.storageList = res.data;
      }).catch(() => {
        this.$message.error("获取仓储位信息失败");
      });
    },
    // 打开新增弹窗
    openAddDialog() {
      this.isEdit = false;
      this.form = { id: null, code: "", name: "", capacity: 0, description: "" };
      this.dialogVisible = true;
    },
    // 打开编辑弹窗
    openEditDialog(item) {
      this.isEdit = true;
      this.form = { ...item };
      this.dialogVisible = true;
    },
    // 保存（新增或修改，统一调用/storage/save）
    saveStorage() {
      this.$http.post("/storage/save", this.form).then(() => {
        this.$message.success(this.isEdit ? "修改成功" : "新增成功");
        this.dialogVisible = false;
        this.fetchStorageList();
      }).catch(() => {
        this.$message.error(this.isEdit ? "修改失败" : "新增失败");
      });
    },
    // 删除前确认
    confirmDelete(id) {
      this.$confirm('确定要删除该仓储位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStorage(id);
      }).catch(() => {
        // 取消删除
      });
    },
    // 删除仓储位
    deleteStorage(id) {
      this.$http.delete(`/storage/delete/${id}`).then(() => {
        this.$message.success("删除成功");
        this.fetchStorageList();
      }).catch(() => {
        this.$message.error("删除失败");
      });
    },
  },
};
</script>

<style scoped>
.storage-container {
  padding: 30px 40px;
  background: #f0e6d2; /* 米黄色背景 */
  min-height: 100vh;
  font-family: "Segoe UI", "PingFang SC", sans-serif;
  color: #5a4a3a;
  box-sizing: border-box;
  background-image: url('https://www.transparenttextures.com/patterns/dust.png'); /* 细腻尘土纹理 */
}

.storage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #b99863;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 24px;
  color: #7a5d2f;
  text-shadow: 1px 1px 0 #d1b87d;
}

.btn-add {
  background-color: #a97c50;
  border: none;
  padding: 8px 18px;
  color: #f2e6cf;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 1px 1px 6px #704e25 inset;
  transition: background-color 0.3s ease;
}
.btn-add:hover {
  background-color: #8b6a3d;
}

.storage-list {
  background: #e3d8ba;
  border-radius: 8px;
  box-shadow: inset 0 0 20px #c1ad73;
  padding: 20px;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 3px 10px rgb(102 76 18 / 0.3);
}

.storage-table th,
.storage-table td {
  border: 1px solid #b79e5a;
  padding: 12px 18px;
  text-align: left;
  font-size: 16px;
  background-color: #f3ead1;
  color: #5a4632;
}

.storage-table thead th {
  background-color: #b99863;
  color: #f5f1e6;
  text-shadow: 1px 1px 2px #7c6437;
  font-weight: 600;
}

.btn-edit,
.btn-delete {
  background-color: transparent;
  border: 1.5px solid #92794f;
  color: #6e5b2d;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
  box-shadow: 1px 1px 3px #7e683d inset;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-edit:hover {
  background-color: #a07d3c;
  color: #fff;
}

.btn-delete:hover {
  background-color: #9f4632;
  border-color: #7e3628;
  color: #fff;
}

/* Dialog按钮风格修改 */
.el-dialog__header {
  background-color: #a07d3c;
  color: #f7eedb;
  font-weight: bold;
  box-shadow: 0 3px 8px #6e5520;
}

.el-dialog {
  border-radius: 10px;
}

.el-button--primary {
  background-color: #7a5d2f;
  border-color: #7a5d2f;
}

.el-button--primary:hover {
  background-color: #5f4a20;
  border-color: #5f4a20;
}
</style>
