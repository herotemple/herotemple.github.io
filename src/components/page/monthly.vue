<template>
  <div class="month-container">
    <el-card class="chart-card">
      <h2>2024年 月度统计</h2>
      <div id="monthChart" class="chart"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  data() {
    return {
      monthData: [], // 存储后端返回的数据
    };
  },
  mounted() {
    this.fetchMonthData();
  },
  methods: {
    async fetchMonthData() {
      try {
        const response = await this.$http.get("/census/month");
        this.monthData = response.data;
        this.drawMonthChart();
      } catch (error) {
        console.error("获取月度数据失败:", error);
      }
    },
    drawMonthChart() {
      if (!this.monthData.length) return;

      const chart = echarts.init(document.getElementById("monthChart"));

      const option = {
        title: {
          text: "2024年 月度统计（玫瑰图）",
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          textStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            name: "月度数据",
            type: "pie",
            radius: [20, 120], // 内外半径
            roseType: "area", // 玫瑰图模式
            data: this.monthData.map((item) => ({
              value: item.content,
              name: item.name,
            })),
            label: {
              color: "#fff",
              fontSize: 14,
            },
            itemStyle: {
              borderRadius: 8,
              borderColor: "#000",
              borderWidth: 2,
            },
          },
        ],
        backgroundColor: "#2c3e50", // 设置背景色
      };

      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.month-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #2c3e50;
}
.chart-card {
  width: 80%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.chart {
  width: 100%;
  height: 400px;
}
</style>
