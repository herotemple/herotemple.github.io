<template>
  <div class="year-statistics">
    <h2>2015-2024年 年度统计</h2>

    <!-- 旭日图 -->
    <div id="sunburstChart" class="chart"></div>

    <!-- 漏斗图 -->
    <div id="funnelChart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      yearData: [],
    };
  },
  async mounted() {
    await this.fetchYearData();
    this.drawSunburstChart();
    this.drawFunnelChart();
  },
  methods: {
    async fetchYearData() {
      try {
        const response = await this.$http.get('/census/year');
        this.yearData = response.data.map(item => ({
          year: item.name,
          value: parseInt(item.content),
        }));
      } catch (error) {
        console.error('获取年度数据失败:', error);
      }
    },
    drawSunburstChart() {
      if (!this.yearData.length) return;
      const chart = echarts.init(document.getElementById('sunburstChart'));
      chart.setOption({
        title: { text: '年度数据层次分析', left: 'center' },
        series: [
          {
            type: 'sunburst',
            data: [
              { name: '2015-2017', children: this.yearData.slice(0, 3) },
              { name: '2018-2020', children: this.yearData.slice(3, 6) },
              { name: '2021-2024', children: this.yearData.slice(6, 10) },
            ],
            radius: ['20%', '90%'],
            label: { show: true },
          },
        ],
      });
    },
    drawFunnelChart() {
      if (!this.yearData.length) return;
      const chart = echarts.init(document.getElementById('funnelChart'));
      chart.setOption({
        title: { text: '年度趋势分析', left: 'center' },
        series: [
          {
            type: 'funnel',
            data: this.yearData.map(item => ({ name: item.year, value: item.value })).reverse(),
            label: { show: true, position: 'inside' },
          },
        ],
      });
    }
  }
};
</script>

<style scoped>
.year-statistics {
  text-align: center;
  padding: 20px;
}
.chart {
  width: 90%;
  height: 400px;
  margin: 20px auto;
}
</style>
