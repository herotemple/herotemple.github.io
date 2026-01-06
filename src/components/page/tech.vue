<template>
  <el-container>
    <el-header class="header">
      <h1>科技风 Web 网页</h1>
    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="tech-card">
            <h2>欢迎来到科技风界面</h2>
            <p>这里展示了科技感十足的 UI 设计。</p>
            <el-button type="primary" @click="showDialog">点击体验</el-button>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="tech-card">
            <h2>数据可视化</h2>
            <div ref="chartContainer" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog v-model="dialogVisible" title="炫酷弹窗">
      <p>这是一个带有动画效果的弹窗。</p>
    </el-dialog>
  </el-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
  setup() {
    const dialogVisible = ref(false);
    const chartContainer = ref(null);

    const showDialog = () => {
      dialogVisible.value = true;
    };

    onMounted(() => {
      const chart = echarts.init(chartContainer.value);
      chart.setOption({
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: { type: 'value' },
        series: [{ data: [120, 200, 150, 80, 70], type: 'line' }]
      });
    });

    return { dialogVisible, showDialog, chartContainer };
  }
};
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  text-align: center;
  font-size: 24px;
}
</style>
