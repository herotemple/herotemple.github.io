<template>
  <div class="inventory-container">
    <h2 class="page-title">📦 库存管理</h2>

    <!-- 搜索 & 筛选 -->
    <div class="filter-container">
      <input v-model="searchQuery" placeholder="🔍 搜索商品名称" class="filter-input" />
      <select v-model="selectedCategory" class="filter-select">
        <option value="">📍 所有类别</option>
        <option value="电子产品">电子产品</option>
        <option value="家具">家具</option>
        <option value="日用">日用</option>
        <option value="食品">食品</option>
      </select>
      <button class="glow-button" @click="fetchInventory">📋 刷新数据</button>
    </div>

    <!-- 商品库存列表 -->
    <div class="inventory-list">
      <div v-for="item in filteredInventory" :key="item.id" class="inventory-item">
        <div class="inventory-info">
          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-category">📍 类别: {{ item.type }}</p>
          <p class="product-stock">📦 当前库存: {{ item.number }}</p>
        </div>
      </div>
    </div>

    <!-- 库存统计图 -->
    <div class="chart-container">
      <h3>📊 库存趋势</h3>
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
      inventory: [], // 服务器返回的库存数据
      searchQuery: "",
      selectedCategory: "",
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
    this.fetchInventory(); // 进入页面时自动获取数据
  },
  methods: {
    fetchInventory() {
      this.$http.get("/product/select")
        .then((res) => {
          if (Array.isArray(res.data)) {
            this.inventory = res.data;
            this.$nextTick(() => {
              this.renderStockChart();  // 确保数据更新后再渲染图表
            });
          }
        })
        .catch((error) => {
          console.error("获取库存数据失败:", error);
        });
    },
    renderStockChart() {
      let chart = echarts.init(document.getElementById("stockChart"));
      let option = {
        title: {text: "库存趋势", textStyle: {color: "#fff"}},
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.inventory.map(item => item.name),
          axisLine: {lineStyle: {color: "#fff"}},
        },
        yAxis: {
          type: "value",
          axisLine: {lineStyle: {color: "#fff"}},
        },
        series: [
          {
            name: "库存数量",
            data: this.inventory.map(item => Number(item.number)), // 确保数据为数字类型
            type: "bar",
            smooth: true,
            itemStyle: {color: "#0ff"},
          },
        ],
      };
      chart.setOption(option);
    }
  },
};
</script>

<style scoped>
/* 深蓝渐变背景 */
.inventory-container {
  background: linear-gradient(135deg, #001f3f, #011f4b);
  color: white;
  min-height: 100vh;
  text-align: center;
  padding: 30px;
}

/* 标题 */
.page-title {
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  margin-bottom: 20px;
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
}

/* 按钮 */
.glow-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  background: rgba(0, 255, 255, 0.2);
  color: #0ff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transition: 0.3s;
}

.glow-button:hover {
  background: rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 25px rgba(0, 255, 255, 1);
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
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

#stockChart {
  width: 100%;
  height: 400px; /* 确保足够的高度 */
}
</style>
