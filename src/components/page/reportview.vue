<template>
  <div class="report-page" style="padding: 20px; max-width: 1000px; margin: auto;">
    <h2>岩芯样本月度统计报表（全部年份）</h2>

    <div style="margin-bottom: 20px;">
      <button @click="loadReport(null)" style="padding: 6px 12px; margin-right: 10px;">全部年份</button>
      <button v-for="y in [2022, 2023, 2024]" :key="y" @click="loadReport(y)" style="padding: 6px 12px; margin-right: 5px;">
        {{ y }}
      </button>
    </div>

    <div v-if="loading" style="text-align:center; font-size:16px; color:#888;">加载中...</div>
    <div v-else>
      <div v-if="!chartData || chartData.length === 0" style="text-align:center; color:#888;">暂无数据</div>
      <div ref="echarts" style="height: 400px; width: 100%;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      loading: false,
      rawData: [],
      chartData: [],
      chartInstance: null,
      selectedYear: null,
    };
  },
  mounted() {
    this.loadReport(null); // 默认加载全部年份数据
  },
  methods: {
    loadReport(year) {
      this.loading = true;
      const params = {};
      if (year !== null && year !== undefined) {
        params.year = parseInt(year, 10);
      }
      this.$http.get('/core/monthly', {params})
        .then(res => {
          this.loading = false;
          console.log('接口返回 res =', res);
          const data = res.data || res.body || [];
          if (Array.isArray(data)) {
            this.rawData = data;
            this.processData();
            this.$nextTick(() => {
              this.renderChart();
            });
          } else {
            alert('获取数据失败');
          }
        })
        .catch(err => {
          this.loading = false;
          console.error('请求出错:', err);
          alert('请求出错');
        });
    },
    processData() {
      const types = [...new Set(this.rawData.map(item => item.type))];
      const months = Array.from({ length: 12 }, (_, i) => i + 1);

      const series = types.map(type => {
        return {
          name: type,
          type: 'bar',
          stack: 'total',
          emphasis: { focus: 'series' },
          data: months.map(m => {
            const match = this.rawData.find(d => parseInt(d.month) === m && d.type === type);
            return match ? match.count : 0;
          })
        };
      });

      // ✅ 打印调试确认数据结构
      console.log('months:', months);
      console.log('types:', types);
      console.log('series:', JSON.stringify(series, null, 2));

      this.chartData = {
        months,
        types,
        series
      };
    },
    renderChart() {
      const chartDom = this.$refs.echarts;
      if (!chartDom) {
        console.warn('echarts 容器未找到');
        return;
      }

      // 清除旧图表实例
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(chartDom);

      // 若无数据则不渲染
      if (!this.chartData || !this.chartData.series || this.chartData.series.length === 0) {
        console.warn('series 数据为空，图表不渲染');
        return;
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: this.chartData.types,
          top: 'bottom'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.months.map(m => `${m}月`)
        },
        yAxis: {
          type: 'value'
        },
        series: this.chartData.series
      };

      this.chartInstance.setOption(option);
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  }
};
</script>

<style scoped>
button {
  background-color: #409EFF;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #66b1ff;
}
</style>
