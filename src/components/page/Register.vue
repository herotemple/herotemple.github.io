<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="title">用户注册</h1>
      <el-form ref="registerForm" :model="form" :rules="rules" label-width="80px" class="register-form">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入英文用户名"></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="userPwd">
          <el-input v-model="form.userPwd" type="password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <!-- 按钮组 -->
        <div class="btn-group">
          <el-button type="primary" size="medium" @click="register">注册</el-button>
          <el-button type="text" size="medium" @click="goToLogin">已有账号？去登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form: {
        userName: "",
        email: "",
        userPwd: "",
        confirmPassword: "",
        role: "user", // 默认用户角色
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { pattern: /^[A-Za-z]+$/, message: "用户名必须是英文", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: ["blur", "change"] },
        ],
        userPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/,
            message: "密码必须是8位，并且包含数字和英文",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {required: true, message: "请再次输入密码", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.userPwd) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 注册
    register() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          // 调用后端接口
          this.$http
            .post("/user/add", {
              userName: this.form.userName,
              email: this.form.email,
              userPwd: this.form.userPwd,
              role: this.form.role, // 角色信息
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success("注册成功，请登录！");
                this.$router.push("/login"); // 跳转登录页面
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$message.error("注册失败，请重试！");
            });
        } else {
          this.$message.error("请填写完整的注册信息");
          return false;
        }
      });
    },

    // 跳转到登录页面
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* 背景 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/images/img.png') no-repeat center center;
  background-size: cover;
}

/* 注册框 */
.register-box {
  width: 400px;
  padding: 30px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 标题 */
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* 按钮组 */
.btn-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.el-button {
  width: 48%;
  border-radius: 5px;
}
</style>
