<template>
  <div class="outbound-container">
    <h2 class="page-title">商品出库</h2>

    <!-- 搜索 & 筛选 -->
    <div class="filter-container">
      <input v-model="searchQuery" placeholder="搜索商品名称" class="filter-input" />
      <select v-model="selectedCategory" class="filter-select">
        <option value="">所有类别</option>
        <option value="电子产品">电子产品</option>
        <option value="家具">家具</option>
        <option value="日用">日用</option>
        <option value="食品">食品</option>
      </select>
      <button class="action-button" @click="fetchInventory">刷新数据</button>
    </div>

    <!-- 商品出库表单 -->
    <div class="outbound-form">
      <h3>出库操作</h3>
      <input v-model="selectedProduct.name" placeholder="商品名称" class="form-input" readonly />
      <select v-model="selectedProduct.type" class="form-input" disabled>
        <option value="">选择类别</option>
        <option value="电子产品">电子产品</option>
        <option value="家具">家具</option>
        <option value="日用">日用</option>
        <option value="食品">食品</option>
      </select>
      <input v-model="outboundQuantity" type="number" placeholder="出库数量" class="form-input" />
      <button class="action-button" @click="processOutbound">确认出库</button>
    </div>

    <!-- 库存商品列表 -->
    <div class="inventory-list">
      <div v-for="item in filteredInventory" :key="item.id" class="inventory-item" @click="selectProduct(item)">
        <div class="inventory-info">
          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-category">类别: {{ item.type }}</p>
          <p class="product-stock">库存: {{ item.number }}</p>
        </div>
      </div>
    </div>

    <!-- 库存变化趋势图 -->
    <div class="chart-container">
      <h3>库存趋势</h3>
      <div id="stockChart"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  data() {
    return {
      inventory: [],
      searchQuery: "",
      selectedCategory: "",
      selectedProduct: { name: "", type: "", number: 0 },
      outboundQuantity: ""
    };
  },
  computed: {
    filteredInventory() {
      return this.inventory.filter((item) => {
        return (!this.searchQuery || item.name.includes(this.searchQuery)) &&
            (!this.selectedCategory || item.type === this.selectedCategory);
      });
    },
  },
  mounted() {
    this.fetchInventory();
  },
  methods: {
    fetchInventory() {
      axios.get("/product/select")
          .then((res) => {
            if (Array.isArray(res.data)) {
              this.inventory = res.data;
              this.$nextTick(() => {
                this.renderStockChart();
              });
            }
          })
          .catch((error) => {
            console.error("获取库存数据失败:", error);
          });
    },
    selectProduct(item) {
      this.selectedProduct = { ...item };
    },
    processOutbound() {
      if (!this.selectedProduct.name || !this.outboundQuantity) {
        alert("请完整填写出库信息");
        return;
      }
      if (this.outboundQuantity > this.selectedProduct.number) {
        alert("出库数量不能大于库存！");
        return;
      }
      axios.post("/product/out", {
        name: this.selectedProduct.name,
        type: this.selectedProduct.type,
        number: this.outboundQuantity
      }).then(() => {
        alert("商品出库成功！");
        this.fetchInventory();
      }).catch((error) => {
        console.error("出库失败:", error);
      });
    },
    renderStockChart() {
      let chart = echarts.init(document.getElementById("stockChart"));
      let option = {
        title: { text: "库存趋势", textStyle: { color: "#fff" } },
        xAxis: {
          type: "category",
          data: this.inventory.map(item => item.name),
          axisLine: {lineStyle: {color: "#fff"}},
          axisLabel: {
            color: "#fff",
            fontSize: 12, // 调整字体大小
            rotate: 45,  // 旋转标签，避免重叠
            interval: 0, // 保证每个标签都显示
            formatter: (value) => {
              return value.length > 10 ? value.slice(0, 10) + '...' : value; // 如果名称过长，添加省略号
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {lineStyle: {color: "#fff"}},
        },
        series: [
          {
            name: "库存数量",
            data: this.inventory.map(item => Number(item.number)),
            type: "bar",
            itemStyle: {color: "#0ff"},
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
/* 整体布局 */
.outbound-container {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
  min-height: 100vh;
  padding: 30px;
}

/* 标题 */
.page-title {
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  margin-bottom: 20px;
  text-align: center;
}

/* 筛选区域 */
.filter-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-input, .filter-select {
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  width: 250px;
  background: rgba(255, 255, 255, 0.1);
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border: 2px solid #0ff;
}

/* 按钮 */
.action-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  background: rgba(0, 255, 255, 0.3);
  color: #0ff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transition: 0.3s;
}

.action-button:hover {
  background: rgba(0, 255, 255, 0.6);
  box-shadow: 0 0 25px rgba(0, 255, 255, 1);
}

/* 出库表单 */
.outbound-form {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.form-input {
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
}

.form-input:focus {
  outline: none;
  border: 2px solid #0ff;
}

/* 商品列表 */
.inventory-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.inventory-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  transition: 0.3s;
}

.inventory-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.7);
}

/* 统计图 */
.chart-container {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

#stockChart {
  width: 100%;
  height: 400px;
}
</style>
