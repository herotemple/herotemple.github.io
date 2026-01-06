<template>
  <div class="warehouse-container">
    <h2 class="page-title">🏢 仓库管理</h2>

    <!-- 搜索 & 筛选 -->
    <div class="filter-container">
      <el-input
        v-model="searchQuery"
        placeholder="🔍 搜索仓库名称"
        clearable
        class="filter-input"
      />
      <el-select v-model="selectedFilter" placeholder="📍 按位置筛选" clearable class="filter-select">
        <el-option label="北京" value="北京"></el-option>
        <el-option label="上海" value="上海"></el-option>
        <el-option label="广州" value="广州"></el-option>
        <el-option label="深圳" value="深圳"></el-option>
      </el-select>
      <el-button type="primary" @click="fetchAllWarehouses">📋 显示全部</el-button>
      <el-button type="success" @click="openAddDialog">➕ 新增仓库</el-button>
    </div>

    <!-- 仓库列表 -->
    <div class="warehouse-list">
      <div
        class="warehouse-item"
        v-for="warehouse in filteredWarehouses"
        :key="warehouse.id"
      >
        <div class="image-container">
          <img :src="getImageUrl(warehouse.picture)" alt="仓库图片" class="warehouse-image" />
        </div>
        <div class="warehouse-info">
          <h3 class="warehouse-name">{{ warehouse.housename }}</h3>
          <p class="warehouse-location">📍 {{ warehouse.address }}</p>
          <div class="actions">
            <el-button type="warning" @click="openEditDialog(warehouse)">编辑</el-button>
            <el-button type="danger" @click="deleteWarehouse(warehouse.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑仓库弹窗 -->
    <el-dialog :title="isEditing ? '编辑仓库' : '新增仓库'" :visible.sync="dialogVisible">
      <el-form :model="warehouseForm">
        <el-form-item label="仓库名称">
          <el-input v-model="warehouseForm.housename"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="warehouseForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="warehouseForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="容量">
          <el-input v-model="warehouseForm.size"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="warehouseForm.storage"></el-input>
        </el-form-item>

        <!-- 直接输入文件名 -->
        <el-form-item label="仓库图片文件名">
          <el-input v-model="warehouseForm.picture" placeholder="请输入图片文件名，如 house1.png"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWarehouse">{{ isEditing ? '更新' : '保存' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      warehouses: [],
      searchQuery: "",
      selectedFilter: "",
      dialogVisible: false,
      isEditing: false,
      warehouseForm: {
        id: null,
        housename: "",
        address: "",
        remark: "",
        size: "",
        storage: "",
        picture: "",
      },
    };
  },
  computed: {
    // 计算过滤后的数据
    filteredWarehouses() {
      return this.warehouses.filter((w) => {
        const matchesName = this.searchQuery ? w.housename.includes(this.searchQuery) : true;
        const matchesLocation = this.selectedFilter ? w.address.includes(this.selectedFilter) : true;
        return matchesName && matchesLocation;
      });
    },
  },
  created() {
    this.fetchWarehouses();
  },
  methods: {
    // 获取仓库数据
    fetchWarehouses() {
      this.$http.get("/warehouse/query").then((res) => {
        if (Array.isArray(res.data)) {
          this.warehouses = res.data;
        }
      });
    },

    // 显示全部（清空搜索框和筛选项）
    fetchAllWarehouses() {
      this.searchQuery = "";
      this.selectedFilter = "";
      this.fetchWarehouses();
    },

    // 获取图片 URL
    getImageUrl(imageName) {
      if (!imageName) {
        return require("@/assets/images/house1.png"); // 默认图片
      }
      try {
        return require(`@/assets/images/${imageName}`); // 从 assets 目录获取
      } catch (e) {
        return require("@/assets/images/house1.png"); // 图片不存在时返回默认图片
      }
    },

    // 打开编辑仓库弹窗
    openEditDialog(warehouse) {
      this.isEditing = true;
      this.warehouseForm = {...warehouse}; // 复制仓库数据
      this.dialogVisible = true;
    },

    // 打开新增仓库弹窗
    openAddDialog() {
      this.isEditing = false;
      this.warehouseForm = {
        id: null,
        housename: "",
        address: "",
        remark: "",
        size: "",
        storage: "",
        picture: "",
      };
      this.dialogVisible = true;
    },

    // 保存或更新仓库数据
    saveWarehouse() {
      const action = this.isEditing ? "/warehouse/update" : "/warehouse/add";
      this.$http.post(action, this.warehouseForm).then(() => {
        this.fetchWarehouses();
        this.dialogVisible = false;
      });
    },

    // 删除仓库
    deleteWarehouse(id) {
      this.$confirm("确定删除该仓库吗？", "警告", {type: "warning"})
        .then(() => {
          this.$http.post("/warehouse/delete", {id}).then(() => {
            this.fetchWarehouses();
          });
        })
        .catch(() => {
        });
    },
  },
};
</script>

<style scoped>
/* 页面背景 */
.warehouse-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 20px;
}

/* 筛选区域 */
.filter-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.filter-input {
  width: 250px;
}

.filter-select {
  width: 180px;
}

/* 仓库列表 */
.warehouse-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

/* 单个仓库项 */
.warehouse-item {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.warehouse-item:hover {
  transform: translateY(-6px);
}

/* 图片 */
.image-container {
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
}

.warehouse-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 按钮 */
.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

/* 弹窗表单项 */
.el-dialog {
  width: 500px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-form-item label {
  font-weight: bold;
}

.el-form-item input {
  width: 100%;
}
</style>
