<template>
  <div class="core-section-container">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="输入段编号或样本ID"
        size="medium"
        class="search-input"
        clearable
        @input="fetchSections"
      >
        <template #prefix>
          <span class="icon-wrapper">
            <i class="el-icon-search"></i>
          </span>
        </template>
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="medium" @click="openAddDialog">添加岩心段</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="sectionList"
      stripe
      border
      class="core-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="sectionId" label="段编号" width="120" />
      <el-table-column prop="coreId" label="样本ID" width="100" />
      <el-table-column prop="startDepth" label="起始深度/m" />
      <el-table-column prop="endDepth" label="结束深度/m" />
      <el-table-column prop="sectionType" label="段类型" />
      <el-table-column prop="recordDate" label="记录日期" />
      <el-table-column prop="description" label="段描述" />
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="editSection(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteSection(scope.row.sectionId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        layout="prev, pager, next"
        :page-size="5"
        :total="filteredSections.length"
        @current-change="changePage"
        background
      />
    </div>

    <!-- 图表展示 -->
    <div id="sectionChart" style="height: 400px; margin-top: 30px;"></div>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="sectionForm" label-width="100px">
        <el-form-item label="段编号">
          <el-input v-model="sectionForm.sectionId" />
        </el-form-item>
        <el-form-item label="样本ID">
          <el-input v-model="sectionForm.coreId" />
        </el-form-item>
        <el-form-item label="起始深度">
          <el-input v-model="sectionForm.startDepth" type="number" />
        </el-form-item>
        <el-form-item label="结束深度">
          <el-input v-model="sectionForm.endDepth" type="number" />
        </el-form-item>
        <el-form-item label="段类型">
          <el-select v-model="sectionForm.sectionType" placeholder="请选择">
            <el-option label="砂岩" value="砂岩" />
            <el-option label="页岩" value="页岩" />
            <el-option label="灰岩" value="灰岩" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录日期">
          <el-date-picker
            v-model="sectionForm.recordDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="段描述">
          <el-input
            type="textarea"
            v-model="sectionForm.description"
            :rows="3"
            placeholder="请输入段描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSection">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "CoreSection",
  data() {
    return {
      searchKeyword: "",
      dialogVisible: false,
      dialogTitle: "添加岩心段",
      sectionForm: {
        sectionId: "",
        coreId: "",
        startDepth: "",
        endDepth: "",
        sectionType: "",
        recordDate: "",
        description: "" // 新增字段
      },
      allSections: [],
      currentPage: 1,
      sectionList: []
    };
  },
  computed: {
    filteredSections() {
      const keyword = this.searchKeyword.trim();
      if (!keyword) return this.allSections;
      return this.allSections.filter(item =>
        item.sectionId.includes(keyword) || item.coreId.includes(keyword)
      );
    }
  },
  mounted() {
    this.fetchSections();
  },
  methods: {
    fetchSections() {
      this.$http.get("/section/list", {
        params: { keyword: this.searchKeyword }
      })
        .then(res => {
          this.allSections = res.data;
          this.changePage(1);
          this.renderChart();
        })
        .catch(() => this.$message.error("获取数据失败"));
    },
    changePage(page) {
      this.currentPage = page;
      const start = (page - 1) * 5;
      this.sectionList = this.filteredSections.slice(start, start + 5);
    },
    openAddDialog() {
      this.dialogTitle = "添加岩心段";
      this.sectionForm = {
        sectionId: "",
        coreId: "",
        startDepth: "",
        endDepth: "",
        sectionType: "",
        recordDate: "",
        description: "" // 初始化新增字段
      };
      this.dialogVisible = true;
    },
    editSection(row) {
      this.dialogTitle = "编辑岩心段";
      this.sectionForm = { ...row };
      this.dialogVisible = true;
    },
    deleteSection(id) {
      this.$confirm("确定删除该岩心段？", "提示", { type: "warning" }).then(() => {
        this.$http.delete(`/section/delete/${id}`)
          .then(() => {
            this.$message.success("删除成功");
            this.fetchSections();
          })
          .catch(() => this.$message.error("删除失败"));
      });
    },
    saveSection() {
      this.$http.post("/section/save", this.sectionForm)
        .then(() => {
          this.$message.success("保存成功");
          this.dialogVisible = false;
          this.fetchSections();
        })
        .catch(() => this.$message.error("保存失败"));
    },
    renderChart() {
      const chartDom = document.getElementById("sectionChart");
      if (!chartDom) return;
      const myChart = echarts.init(chartDom);

      const typeCount = {};
      this.allSections.forEach(s => {
        typeCount[s.sectionType] = (typeCount[s.sectionType] || 0) + 1;
      });

      // 雷达图指标配置
      const indicators = Object.entries(typeCount).map(([type, count]) => ({
        name: type,
        max: Math.max(...Object.values(typeCount)) + 1 // 最大值比最大数量大1，方便显示
      }));

      const dataValues = Object.values(typeCount);

      const option = {
        title: { text: "岩心段类型分布", left: "center" },
        tooltip: {},
        radar: {
          center: ['50%', '60%'],
          indicator: indicators,
          shape: 'circle',
          splitNumber: 5,
          name: {
            textStyle: {
              color: '#333',
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#ccc']
            }
          },
          splitArea: {
            areaStyle: {
              color: ['#f7f6f3', 'transparent']
            }
          }
        },
        series: [{
          name: '段类型数量',
          type: 'radar',
          data: [
            {
              value: dataValues,
              name: '数量分布',
              areaStyle: {
                color: 'rgba(160, 132, 92, 0.5)'
              },
              lineStyle: {
                color: '#a0845c',
                width: 2
              },
              itemStyle: {
                color: '#a0845c'
              }
            }
          ]
        }]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.core-section-container {
  background: #f7f6f3;
  padding: 20px;
  border-radius: 10px;
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
  background: #ffffff;
  border-radius: 6px;
}

.table-header {
  background-color: #a0845c !important;
  color: white !important;
  font-weight: bold;
}

.pagination-container {
  margin-top: 10px;
  text-align: right;
}
</style>
