<template>
  <div class="sales-container">
    <!-- 商品销售表格 -->
    <div class="table-wrapper">
      <el-table :data="salesData" stripe style="width: 90%">
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="number" label="销售数量" width="180"></el-table-column>
        <el-table-column prop="price" label="单价 (元)" width="180"></el-table-column>
        <el-table-column prop="total" label="销售金额 (元)" width="180"></el-table-column>
        <el-table-column prop="date" label="销售日期" width="180"></el-table-column>
      </el-table>
    </div>

    <!-- 销售饼图 -->
    <div id="salesPieChart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      salesData: [],
    };
  },
  mounted() {
    this.fetchSalesData();
  },
  methods: {
    async fetchSalesData() {
      try {
        const response = await this.$http.get('/product/sale');
        this.salesData = response.data.map(item => ({
          ...item,
          total: (parseFloat(item.number) * parseFloat(item.price)).toFixed(2), // 计算销售金额
        }));
        this.drawSalesPieChart();
      } catch (error) {
        console.error('获取销售数据失败:', error);
      }
    },
    drawSalesPieChart() {
      const chart = echarts.init(document.getElementById('salesPieChart'));
      const option = {
        title: {
          text: '商品销售分布',
          left: 'center',
          textStyle: { color: '#333', fontSize: 18, fontWeight: 'bold' },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '销售数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.salesData.map(item => ({ value: parseInt(item.number), name: item.name })),
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>


<style scoped>
.sales-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.el-table {
  width: 80%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#salesPieChart {
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
