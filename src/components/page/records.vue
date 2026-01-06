<template>
  <div class="financial-records">
    <!-- 标题 -->
    <h2>财务收支记录</h2>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button type="primary" @click="exportToExcel">导出 Excel</el-button>
      <el-button type="success" @click="openAddDialog">添加记录</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="records" border stripe>
      <el-table-column prop="date" label="日期" align="center" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column prop="income" label="收入 (¥)" align="center">
        <template slot-scope="scope">
          <span class="income-text">+{{ scope.row.income.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="outcome" label="支出 (¥)" align="center">
        <template slot-scope="scope">
          <span class="expense-text">-{{ scope.row.outcome.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="结余 (¥)" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.balance >= 0 ? 'balance-positive' : 'balance-negative'">
            {{ scope.row.balance.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="openEditDialog(scope.row)" size="mini" type="primary">编辑</el-button>
          <el-button @click="deleteRecord(scope.row.id)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ECharts 数据可视化 -->
    <div id="chart" style="width: 100%; height: 400px;"></div>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="添加/编辑财务记录" width="40%">
      <el-form :model="formData" ref="form" label-width="100px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收入 (¥)" prop="income">
          <el-input v-model="formData.income" type="number" placeholder="请输入收入金额"></el-input>
        </el-form-item>
        <el-form-item label="支出 (¥)" prop="outcome">
          <el-input v-model="formData.outcome" type="number" placeholder="请输入支出金额"></el-input>
        </el-form-item>
        <el-form-item label="结余 (¥)" prop="balance">
          <el-input v-model="formData.balance" type="number" placeholder="请输入结余金额" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      records: [], // 存储财务数据
      dialogVisible: false, // 控制对话框显示
      formData: { // 添加/编辑表单数据
        id: null,
        income: 0,
        outcome: 0,
        balance: 0,
        date: null
      }
    };
  },
  methods: {
    // 获取数据
    fetchData() {
      this.$http.get("/records/query")
        .then(response => {
          console.log("后端返回的数据：", response.data);
          this.records = response.data.map(item => ({
            id: item.id,
            income: parseFloat(item.income.replace("+", "")), // 去掉 `+` 并转换为数字
            outcome: parseFloat(item.outcome.replace("-", "")), // 去掉 `-`
            balance: parseFloat(item.all), // 直接转换
            date: item.date // 直接使用后端的 `date`
          }));
          console.log("转换后的数据：", this.records);
          this.renderChart(); // 渲染图表
        })
        .catch(error => {
          console.error("请求失败：", error);
        });
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return "无日期";
      return new Date(dateString).toLocaleString();
    },

    // 渲染 ECharts 图表
    renderChart() {
      let chartDom = document.getElementById("chart");
      let myChart = echarts.init(chartDom);
      let option = {
        title: {text: "财务收支趋势", left: "center"},
        tooltip: {trigger: "axis"},
        legend: {data: ["收入", "支出", "结余"], top: 30},
        xAxis: {
          type: "category",
          data: this.records.map(item => this.formatDate(item.date)), // X 轴日期
        },
        yAxis: {type: "value"},
        series: [
          {
            name: "收入",
            type: "line",
            smooth: true, // ✅ 让曲线变得光滑
            data: this.records.map(item => item.income),
          },
          {
            name: "支出",
            type: "line",
            smooth: true, // ✅ 让曲线变得光滑
            data: this.records.map(item => item.outcome),
          },
          {
            name: "结余",
            type: "line",
            smooth: true, // ✅ 让曲线变得光滑
            data: this.records.map(item => item.balance),
          }
        ],
      };
      myChart.setOption(option);
    },

    // 导出 Excel
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(
        this.records.map(item => ({
          "日期": this.formatDate(item.date),
          "收入 (¥)": item.income.toFixed(2),
          "支出 (¥)": item.outcome.toFixed(2),
          "结余 (¥)": item.balance.toFixed(2),
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "财务记录");

      // 生成 Excel 文件并下载
      const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
      const data = new Blob([excelBuffer], {type: "application/octet-stream"});
      saveAs(data, "财务记录.xlsx");
    },

    // 打开添加对话框
    openAddDialog() {
      this.formData = {id: null, income: 0, outcome: 0, balance: 0, date: null};
      this.dialogVisible = true;
    },

    // 打开编辑对话框
    openEditDialog(record) {
      this.formData = {...record};
      this.dialogVisible = true;
    },

    // 保存记录（新增或编辑）
    saveRecord() {
      if (!this.formData.date || this.formData.income === null || this.formData.outcome === null) {
        this.$message.error("请填写完整的财务信息！");
        return;
      }

      const payload = {
        id: this.formData.id,
        income: this.formData.income.toString(),
        outcome: this.formData.outcome.toString(),
        date: this.formData.date
      };

      if (this.formData.id) {
        // 编辑记录：使用 `id` 作为 URL 参数
        this.$http.post(`/records/update?id=${this.formData.id}`, payload, {
          headers: { "Content-Type": "application/json" }
        })
          .then(() => {
            this.fetchData();
            this.dialogVisible = false;
            this.$message.success("更新成功！");
          })
          .catch(error => {
            console.error("更新失败：", error);
            this.$message.error("更新失败！");
          });
      } else {
        // 新增记录
        this.$http.post("/records/add", JSON.stringify(payload), {
          headers: { "Content-Type": "application/json" }
        })
          .then(() => {
            this.fetchData();
            this.dialogVisible = false;
            this.$message.success("新增成功！");
          })
          .catch(error => {
            console.error("新增失败：", error);
            this.$message.error("新增失败！");
          });
      }
    },

    // 删除记录
    deleteRecord(id) {
      this.$http.post("/records/delete", {id})
        .then(() => {
          this.fetchData(); // 刷新数据
          this.$message.success("删除成功！");
        })
        .catch(error => {
          console.error("删除失败：", error);
          this.$message.error("删除失败！");
        });
    }
  },

  mounted() {
    this.fetchData(); // 进入页面获取数据
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
</style>
