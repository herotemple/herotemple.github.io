<template>
  <div>
    <h1 >合同信息管理</h1>
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item label="员工姓名">
        <el-input v-model="studentQuery.empName"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="studentQuery.sex">
          <el-option label="男"  value="男"></el-option>
          <el-option label="女"  value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item >
        <el-button type="success" @click="queryemp">查询</el-button>
        <el-button type="success" @click="addPage">新增</el-button>
      </el-form-item>
    </el-form>


    <el-table border :data="list" style="width:100%">
      <el-table-column label="编号" prop="id"   width="60px"></el-table-column>
      <el-table-column label="姓名" prop="empName" width="150px"></el-table-column>
      <el-table-column label="性别" prop="sex"	width="150px"></el-table-column>
      <el-table-column label="职务" prop="job"	width="150px"></el-table-column>
      <el-table-column label="学历" prop="xueli"	width="150px"></el-table-column>
      <el-table-column label="电话" prop="phone"	width="150px"></el-table-column>
      <el-table-column>
        <template slot-scope="x">
          <el-button type="success" size="mini" @click="query(x.$index,x.row)">查看</el-button>
          <el-button type="warning" size="mini" @click="edit(x.$index,x.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(x.$index,x.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div align="right">
      <el-pagination
        @size-change="selectChange"
        @current-change="pageChange"
        :current-page="form.page"
        :page-sizes="[5,10,15,20]"
        :page-size="form.row"
        :total="form.total"
        layout="sizes,prev,pager,next,jumper,total"
      ></el-pagination>
    </div>

    <!-- 详情- 对话框组件 -->
    <el-dialog :visible.sync="isQuery" width="30%" title="员工信息详情">
      <el-form label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.empName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="form.job" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-input v-model="form.xueli" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑- 对话框组件 -->
    <el-dialog :visible.sync="isShow" width="30%" title="学生信息编辑">
      <el-form label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="updateForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="updateForm.empName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="updateForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="updateForm.job"></el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-input v-model="updateForm.xueli"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="success" size="mini" @click="updateEmp">保存</el-button>
          <el-button type="success" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增- 对话框组件 -->
    <el-dialog :visible.sync="addShow" width="30%" title="学生信息新增">
      <el-form label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="addForm.empName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="addForm.job"></el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-input v-model="addForm.xueli"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="success" size="mini" @click="saveEmp">保存</el-button>
          <el-button type="success" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "LIst",
  data(){
    return{
      //修改
      updateForm:{
        id:"",
        empName:"",
        sex:"",
        phone:"",
        job:"",
        xueli:""
      },
      //新增
      addForm:{
        empName:"",
        sex:"",
        phone:"",
        job:"",
        xueli:""
      },
      studentQuery:{ //定义的是查询的参数
        empName:"",
        sex:""
      },
      list:[],
      isShow:false, //编辑对话框是否显示
      isQuery:false,//详情对话框是否显示
      addShow:false,
      form:{
        id:"",
        name:"",
        xueli:"",
        age:"",
        birthday:"",
        page:1,//页码
        row:5,//每页显示条数
        total:10,//总条数
        totalPage:3//总页码
      },
    }
  },
  mounted(){
    //生命周期函数
    this.queryemp();
  },
  methods:{
    //定义修改函数
    updateEmp(){
      const self = this;
      this.$http.get("/emp/update",{params:this.updateForm})
        .then(function (rs){
          if(rs.data.code==200){
            self.isShow = false;
            self.queryemp();
          }
        })
    },
    //定义保存函数
    saveEmp(){
      const self = this;
      this.$http.get("/emp/add",{params:this.addForm})
        .then(function (rs){
          console.log(rs.data);
          if(rs.data.code==200){
            self.addShow = false;
            self.queryemp();
          }
        })
    },
    //定义查询函数
    queryemp(){
      //定义一个axios请求
      const self = this;
      this.$http.get("/emp/query",{params:this.studentQuery})
        .then(function (rs){
          //打印控制台数据
          console.log(rs.data.data);
          if(rs.data.code==200){
            self.list = rs.data.data;
            console.log(self.list);
          }
        })
    },
    edit(index, row){
      this.isShow = true; // 打开编辑对话框
      this.updateForm = JSON.parse(JSON.stringify(row)); // 深拷贝数据
    },
    del(index, row) {
      const self = this;
      // 弹出确认框
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消删除",
        type: "warning"
      })
        .then(() => {
          // 调用删除接口
          this.$http
            .get("/emp/delete", { params: { id: row.id } }) // 传递员工 id
            .then(function (rs) {
              if (rs.data.code == 200) {
                // 删除成功，刷新员工列表
                self.queryemp();
                // 提示删除成功
                self.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                // 删除失败提示
                self.$message({
                  message: rs.data.message || "删除失败",
                  type: "error"
                });
              }
            })
            .catch(function (error) {
              // 请求失败提示
              self.$message({
                message: "请求失败，请检查网络或后端服务",
                type: "error"
              });
            });
        })
        .catch(() => {
          // 用户取消删除
          self.$message({
            message: "已取消删除",
            type: "info"
          });
        });
    },
    query:function(index,x){
      this.isQuery = true;
      this.form= x;
    },
    addPage:function(){
      this.addShow = true;
    },
    selectChange:function(val){//分页下拉框触发的事件,val下拉框选中条数
      //把选中的每页条数赋值给分页参数对象的每页条数
      this.form.row = val;
      //调用后端的查询方法
    },
    pageChange:function(page){//选中页码触发的事件,page值选中的页码
      this.form.page=page;
      //调用后端的查询方法
    }
  }
}
</script>

<style scoped>

</style>
