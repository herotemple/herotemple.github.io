<template>
  <div class="inventory-container">
    <h2 class="page-title">🚀 商品入库</h2>

    <!-- 商品入库表单 -->
    <div class="add-product-form">
      <h3>📥 添加新商品</h3>
      <div class="input-group">
        <input v-model="newProduct.name" placeholder="商品名称" class="form-input" />
      </div>

      <div class="input-group">
        <select v-model="newProduct.type" class="form-input">
          <option value="" disabled selected>选择类别</option>
          <option value="电子产品">电子产品</option>
          <option value="家具">家具</option>
          <option value="日用">日用</option>
          <option value="食品">食品</option>
        </select>
      </div>

      <div class="input-group">
        <input v-model="newProduct.number" type="number" placeholder="库存数量" class="form-input" />
      </div>

      <button class="submit-button" @click="addProduct">✅ 确认入库</button>
    </div>

    <!-- 商品库存列表 -->
    <div class="inventory-list">
      <div v-for="item in inventory" :key="item.id" class="inventory-item">
        <div class="inventory-info">
          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-category">📌 类别: {{ item.type }}</p>
          <p class="product-stock">📦 库存: {{ item.number }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inventory: [], // 服务器返回的库存数据
      newProduct: {
        name: "",
        type: "",
        number: "",
      },
    };
  },
  mounted() {
    this.fetchInventory();
  },
  methods: {
    fetchInventory() {
      this.$http.get("/product/select")
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.inventory = res.data;
          }
        })
        .catch((error) => {
          console.error("获取库存数据失败:", error);
        });
    },
    addProduct() {
      if (!this.newProduct.name || !this.newProduct.type || !this.newProduct.number) {
        alert("请填写完整商品信息");
        return;
      }

      this.$http.post("/product/add", this.newProduct)
        .then(() => {
          alert("商品入库成功！");
          this.newProduct = { name: "", type: "", number: "" }; // 清空输入框
          this.fetchInventory();
        })
        .catch((error) => {
          console.error("入库失败:", error);
        });
    },
  },
};
</script>

<style scoped>
/* 页面背景 */
.inventory-container {
  background: linear-gradient(135deg, #123456, #1a2a45);
  color: white;
  min-height: 100vh;
  text-align: center;
  padding: 30px;
}

/* 标题样式 */
.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 入库表单 */
.add-product-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

/* 输入框样式 */
.input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  color: white;
  font-size: 16px;
  transition: border 0.3s ease-in-out;
  outline: none;
}

/* 输入框聚焦时的效果 */
.form-input:focus {
  border-color: #0ff;
}

/* 按钮样式 */
.submit-button {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  background: #1f8cff;
  color: white;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
  transition: background 0.3s ease;
}

.submit-button:hover {
  background: #0f7ac0;
}

/* 商品列表 */
.inventory-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* 单个商品项 */
.inventory-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  transition: box-shadow 0.3s ease;
}

.inventory-item:hover {
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.5);
}

/* 修改选择类别下拉框样式 */
.form-input option {
  color: #333; /* 设置选项的字体颜色 */
}

/* 修改 select 元素的样式，使其和背景区分开 */
select.form-input {
  color: #fff; /* 设置文本颜色为白色 */
  background-color: rgba(255, 255, 255, 0.2); /* 背景颜色稍微透明 */
  border: 1px solid rgba(255, 255, 255, 0.5); /* 增加边框 */
}
</style>
