<template>
  <div class="user-analysis">
    <el-row :gutter="20">
      <!-- 用户活跃趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>用户活跃趋势</h3>
          <div ref="activeTrendChart" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 转化率分析 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <h3>转化率分析</h3>
          <div ref="conversionFunnelChart" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 用户画像 -->
      <el-col :span="24">
        <el-card shadow="hover">
          <h3>用户画像</h3>
          <div ref="userProfileChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "UserBehavior",
  mounted() {
    this.initActiveTrendChart();
    this.initConversionFunnelChart();
    this.initUserProfileChart();
  },
  methods: {
    // 用户活跃趋势（折线图）
    initActiveTrendChart() {
      const chart = echarts.init(this.$refs.activeTrendChart);
      const option = {
        xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"] },
        yAxis: { type: "value" },
        series: [{ data: [150, 230, 224, 218, 135, 147, 260], type: "line", smooth: true }]
      };
      chart.setOption(option);
    },

    // 转化率分析（漏斗图）
    initConversionFunnelChart() {
      const chart = echarts.init(this.$refs.conversionFunnelChart);
      const option = {
        tooltip: { trigger: "item" },
        series: [
          {
            name: "转化率",
            type: "funnel",
            width: "40%",
            data: [
              { value: 1000, name: "浏览" },
              { value: 800, name: "加入购物车" },
              { value: 600, name: "支付" },
              { value: 400, name: "成功购买" }
            ]
          }
        ]
      };
      chart.setOption(option);
    },

    // 用户画像（雷达图）
    initUserProfileChart() {
      const chart = echarts.init(this.$refs.userProfileChart);
      const option = {
        radar: {
          indicator: [
            { name: "年龄 18-24", max: 1000 },
            { name: "年龄 25-34", max: 1000 },
            { name: "年龄 35-44", max: 1000 },
            { name: "年龄 45+", max: 1000 }
          ]
        },
        series: [
          {
            name: "用户群体",
            type: "radar",
            data: [{ value: [500, 300, 200, 100], name: "用户群体" }]
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.user-analysis {
  padding: 20px;
}
.el-card {
  border-radius: 10px;
  text-align: center;
}
h3 {
  margin-bottom: 10px;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>
