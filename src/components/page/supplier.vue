<template>
  <div class="supplier-container">
    <h2 class="page-title">📦 供货商管理</h2>

    <!-- 新增供货商按钮 -->
    <div class="add-btn-container">
      <el-button type="primary" icon="el-icon-plus" size="medium" @click="openDialog('add')">
        新增供货商
      </el-button>
    </div>

    <!-- 供货商卡片布局 -->
    <div class="supplier-grid">
      <el-card v-for="supplier in suppliers" :key="supplier.id" class="supplier-card">
        <div class="card-header">
          <h3>{{ supplier.suppliername }}</h3>
          <el-dropdown @command="handleAction($event, supplier)">
            <el-button icon="el-icon-more" circle></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">✏️ 编辑</el-dropdown-item>
              <el-dropdown-item command="delete" divided>🗑️ 删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <p><i class="el-icon-phone"></i> {{ supplier.phone }}</p>
        <p><i class="el-icon-location"></i> {{ supplier.address }}</p>
      </el-card>
    </div>

    <!-- 弹窗（新增/编辑） -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="450px">
      <el-form :model="supplierForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="supplierForm.suppliername"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="supplierForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="supplierForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Supplier",
  data() {
    return {
      suppliers: [], // 供货商数据
      dialogVisible: false,
      dialogTitle: "新增供货商",
      supplierForm: { id: null, suppliername: "", phone: "", address: "" },
      actionType: "add",
    };
  },
  methods: {
    fetchSuppliers() {
      this.$http.post("/supplier/query").then((res) => {
        if (Array.isArray(res.data)) this.suppliers = res.data;
      });
    },
    openDialog(type, supplier = {}) {
      this.dialogTitle = type === "add" ? "新增供货商" : "编辑供货商";
      this.actionType = type;
      this.supplierForm = type === "edit" ? { ...supplier } : { id: null, suppliername: "", phone: "", address: "" };
      this.dialogVisible = true;
    },
    handleSubmit() {
      const url = this.actionType === "add" ? "/supplier/add" : `/supplier/update?id=${this.supplierForm.id}`;
      const payload = { suppliername: this.supplierForm.suppliername, phone: this.supplierForm.phone, address: this.supplierForm.address };

      this.$http.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        this.dialogVisible = false;
        this.fetchSuppliers();
      });
    },
    handleAction(action, supplier) {
      if (action === "edit") {
        this.openDialog("edit", supplier);
      } else if (action === "delete") {
        // 删除时传递完整的 supplier 对象
        this.$confirm(`确定要删除 "${supplier.suppliername}" 吗？`, "提示", {type: "warning"}).then(() => {
          this.$http.post("/supplier/delete", supplier, {  // 传递完整的 Supplier 对象
            headers: {"Content-Type": "application/json"}
          }).then(() => this.fetchSuppliers());
        });
      }
    },
  },
  mounted() {
    this.fetchSuppliers();
  },
};
</script>

<style scoped>
/* 页面背景 */
.supplier-container {
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa, #d1d5db);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 26px;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 20px;
}

/* 按钮 */
.add-btn-container {
  margin-bottom: 20px;
}

/* 供货商卡片网格 */
.supplier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 1200px;
  padding: 10px;
}

/* 卡片样式 - 玻璃拟态 */
.supplier-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.supplier-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* 供货商信息 */
.supplier-card p {
  font-size: 14px;
  color: #444;
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.supplier-card p i {
  margin-right: 6px;
  font-size: 16px;
  color: #007aff;
}

/* 标题 & 操作 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

/* 弹窗按钮 */
.dialog-footer {
  text-align: right;
}
</style>
