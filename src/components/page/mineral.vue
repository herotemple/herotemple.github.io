<template>
  <div class="mineral-composition">
    <el-card shadow="hover" class="card-container">
      <h2>矿物组成分析</h2>
      <el-select
        v-model="selectedSample"
        placeholder="选择样品"
        clearable
        @change="fetchMineralData"
        style="width: 240px; margin-bottom: 20px"
      >
        <el-option v-for="sample in sampleNames" :key="sample" :label="sample" :value="sample" />
      </el-select>

      <el-table :data="minerals" stripe style="width: 100%">
        <el-table-column prop="mineralName" label="矿物名称" width="180" />
        <el-table-column prop="percentage" label="含量(%)" width="120" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minerals: [],
      sampleNames: [],
      selectedSample: null,
    };
  },
  created() {
    this.fetchMineralData();
  },
  methods: {
    // 先获取全部数据，提取样品名称
    async fetchMineralData() {
      try {
        let url = "/api/mineral/list";
        if (this.selectedSample) {
          url = `/api/mineral/sample/${encodeURIComponent(this.selectedSample)}`;
        }
        const res = await this.$http.get(url);
        this.minerals = res.data;

        // 更新样品名称列表（只在没选样品时更新）
        if (!this.selectedSample) {
          const samples = new Set(res.data.map((item) => item.sampleName));
          this.sampleNames = Array.from(samples);
        }
      } catch (error) {
        this.$message.error("加载矿物数据失败");
      }
    },
  },
};
</script>

<style scoped>
.card-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
</style>
