<template>
  <div>
    <el-card shadow="hover">
      <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
        <el-button type="primary" @click="openDialog">新增记录</el-button>
      </div>

      <el-table :data="tableData" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="sampleId" label="样本编号" />
        <el-table-column prop="scanTime" label="扫描时间" />
        <el-table-column prop="device" label="设备" />
        <el-table-column prop="operator" label="操作员" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="mini" @click="editRecord(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRecord(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      top="15vh"
      custom-class="my-dialog"
      @close="handleDialogClose"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="样本编号">
          <el-input v-model="form.sampleId" placeholder="如 CS-001" />
        </el-form-item>
        <el-form-item label="扫描时间">
          <el-date-picker v-model="form.scanTime" type="datetime" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="设备">
          <el-input v-model="form.device" />
        </el-form-item>
        <el-form-item label="操作员">
          <el-input v-model="form.operator" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ScanRecord',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        id: null,
        sampleId: '',
        scanTime: '',
        device: '',
        operator: '',
        remarks: ''
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载所有扫描记录
    loadData() {
      this.$http.get('/scan/list').then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data
        } else {
          this.$message.error('数据加载失败')
        }
      })
    },

    // 打开新增弹窗
    openDialog() {
      this.form = {
        id: null,
        sampleId: '',
        scanTime: '',
        device: '',
        operator: '',
        remarks: ''
      }
      this.dialogVisible = true
    },

    // 编辑记录
    editRecord(row) {
      this.form = { ...row }
      this.dialogVisible = true
    },

    // 保存（新增或更新）
    saveRecord() {
      const isUpdate = this.form.id != null
      const url = isUpdate ? '/scan/update' : '/scan/add'
      const method = isUpdate ? 'put' : 'post'

      this.$http[method](url, this.form).then(res => {
        if (res.data.code === 200) {
          this.dialogVisible = false
          this.loadData()
          this.$message.success(res.data.message || '操作成功')
        } else {
          this.$message.error(res.data.message || '操作失败')
        }
      })
    },

    // 删除记录
    deleteRecord(id) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/scan/delete/${id}`).then(res => {
          if (res.data.code === 200) {
            this.loadData()
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },

    // 关闭弹窗回调（可根据需要扩展）
    handleDialogClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

.my-dialog {
  z-index: 99999 !important;
}

/* 遮罩层，确保层级低于弹窗高于其他内容 */
.v-modal {
  z-index: 99998 !important;
  background-color: rgba(0, 0, 0, 0.5); /* 遮罩颜色 */
}

.scan-container {
  background: #f7f5f2;
  padding: 20px;
  font-family: "Segoe UI", "PingFang SC", sans-serif;
  position: relative;
  z-index: 1;
}

.el-table th {
  background-color: #f3ede6;
  color: #4a3b2c;
  font-weight: bold;
}

.el-table td {
  color: #5a4433;
}
</style>
