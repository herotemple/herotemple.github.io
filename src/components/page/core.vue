<template>
  <div class="core-sample-container">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="输入样本编号或采集地点"
        size="medium"
        class="search-input"
        clearable
        @input="fetchSamples"
      >
        <template #prefix>
          <span class="icon-wrapper">
            <i class="el-icon-search"></i>
          </span>
        </template>
      </el-input>
      <el-button type="success" icon="el-icon-plus" size="medium" @click="openAddDialog">添加样本</el-button>
    </div>

    <!-- 样本 ECharts 图表 -->
    <div ref="chart" class="chart-container"></div>

    <!-- 样本表格 -->
    <el-table
      :data="paginatedSamples"
      stripe
      border
      class="core-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="样本编号" width="120" />
      <el-table-column prop="location" label="采集地点" />
      <el-table-column prop="depth" label="深度/m" width="100" />
      <el-table-column prop="type" label="样本类型" width="120" />
      <el-table-column prop="sampleDate" label="采集日期" width="150" />
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="editSample(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteSample(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="5"
      :total="sampleList.length"
      @current-change="handlePageChange"
      style="text-align: right; margin-top: 15px;"
    />

    <!-- 添加/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="sampleForm" label-width="100px">
        <el-form-item label="样本编号">
          <el-input v-model="sampleForm.id" />
        </el-form-item>
        <el-form-item label="采集地点">
          <el-input v-model="sampleForm.location" />
        </el-form-item>
        <el-form-item label="深度（米）">
          <el-input v-model="sampleForm.depth" type="number" />
        </el-form-item>
        <el-form-item label="样本类型">
          <el-select v-model="sampleForm.type" placeholder="请选择">
            <el-option label="岩石" value="岩石" />
            <el-option label="矿物" value="矿物" />
            <el-option label="土壤" value="土壤" />
          </el-select>
        </el-form-item>
        <el-form-item label="采集日期">
          <el-date-picker
            v-model="sampleForm.sampleDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSample">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "CoreSample",
  data() {
    return {
      searchKeyword: "",
      dialogVisible: false,
      dialogTitle: "添加样本",
      sampleForm: {
        id: "",
        location: "",
        depth: "",
        type: "",
        sampleDate: ""
      },
      sampleList: [],
      currentPage: 1,
      pageSize: 5,
      chartInstance: null
    };
  },
  computed: {
    paginatedSamples() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.sampleList.slice(start, start + this.pageSize);
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.fetchSamples();
  },
  methods: {
    fetchSamples() {
      this.$http
        .get("/core/list", {
          params: { keyword: this.searchKeyword }
        })
        .then(response => {
          this.sampleList = response.data;
          this.updateChart();
        })
        .catch(error => {
          this.$message.error("获取样本数据失败：" + error);
        });
    },
    updateChart() {
      const typeCounts = {};
      this.sampleList.forEach(sample => {
        typeCounts[sample.type] = (typeCounts[sample.type] || 0) + 1;
      });

      const chartData = Object.entries(typeCounts).map(([type, count]) => ({
        name: type,
        value: count
      }));

      this.chartInstance.setOption({
        title: {
          text: "样本类型分布",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          bottom: "10%",
          left: "center"
        },
        series: [
          {
            name: "类型分布",
            type: "pie",
            radius: "50%",
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    openAddDialog() {
      this.dialogTitle = "添加样本";
      this.sampleForm = {
        id: "",
        location: "",
        depth: "",
        type: "",
        date: ""
      };
      this.dialogVisible = true;
    },
    editSample(row) {
      this.dialogTitle = "编辑样本";
      this.sampleForm = { ...row };
      this.dialogVisible = true;
    },
    deleteSample(id) {
      this.$confirm("确定要删除该样本吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`/core/delete/${id}`)
          .then(() => {
            this.$message.success("删除成功");
            this.fetchSamples();
          })
          .catch(() => {
            this.$message.error("删除失败");
          });
      });
    },
    saveSample() {
      this.$http
        .post("/core/save", this.sampleForm)
        .then(() => {
          this.$message.success("保存成功");
          this.dialogVisible = false;
          this.fetchSamples();
        })
        .catch(() => {
          this.$message.error("保存失败");
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.core-sample-container {
  background: #f0ede6;
  padding: 20px;
  border-radius: 10px;
  min-height: 90vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input .icon-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.search-input{
  width: 300px;
}

.core-table {
  background: #fffaf5;
  border-radius: 6px;
  font-family: "Segoe UI", sans-serif;
}

.table-header {
  background-color: #c8b39b !important;
  color: white !important;
  font-weight: bold;
}

.chart-container {
  width: 100%;
  height: 360px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 10px;
}
</style>
