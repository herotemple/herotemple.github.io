<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">个人空间登录</h1>
      <el-tabs type="border-card">

        <!-- 用户名密码登录 -->
        <el-tab-pane label="用户登录">
          <el-form label-width="80px" class="login-form">
            <el-form-item label="用户名">
              <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input v-model="form.userPwd" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-form>

          <!-- 按钮组 -->
          <div class="btn-group">
            <el-button type="primary" icon="el-icon-s-custom" size="medium" @click="login">登录</el-button>
          </div>
          <div class="btn-group">
            <el-button type="text" size="medium" @click="goToRegister">还没有账号？去注册</el-button>
          </div>
        </el-tab-pane>

        <!-- 📧 邮箱验证码登录 -->
        <el-tab-pane label="邮箱登录">
          <el-form label-width="80px" class="login-form">
            <el-form-item label="邮箱">
              <el-input v-model="formEmail.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-form-item label="验证码">
              <el-input v-model="formEmail.code" placeholder="请输入验证码">
                <template #append>
                  <el-button type="primary" size="small" @click="sendEmailCode" :disabled="isCounting">
                    {{ isCounting ? countdown + "秒" : "获取验证码" }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div class="btn-group">
            <el-button type="primary" icon="el-icon-s-custom" size="medium" @click="loginWithEmail">登录</el-button>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        userName: "",
        userPwd: "",
      },
      formEmail: {
        email: "",
        code: "",
      },
      isCounting: false, // 是否在倒计时
      countdown: 60, // 倒计时初始值
      timer: null, // 计时器对象
    };
  },
  methods: {
    // **用户名密码登录**
    login() {
      if (!this.form.userName || !this.form.userPwd) {
        this.$message.error("请输入用户名和密码！");
        return;
      }

      this.$http.get("/user/login2", { params: this.form }).then((rs) => {
        if (rs.data.code === 200) {
          this.$message.success("登录成功！");
          localStorage.setItem("name", this.form.userName);
          this.$router.push("/index");
        } else {
          this.$message.error(rs.data.msg);
        }
      });
    },

    // **跳转到注册页面**
    goToRegister() {
      this.$router.push("/register");
    },

    // **获取邮箱验证码**
    sendEmailCode() {
      if (!this.formEmail.email) {
        this.$message.error("请输入邮箱！");
        return;
      }

      this.$http.get("/user/sendCode", { params: { email: this.formEmail.email } }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("验证码已发送，请检查邮箱！");

          // **确保之前的计时器被清除**
          if (this.timer) {
            clearInterval(this.timer);
          }

          // **开启倒计时**
          this.isCounting = true;
          this.countdown = 60;

          this.timer = setInterval(() => {
            if (this.countdown > 1) {
              this.countdown--;
            } else {
              clearInterval(this.timer);
              this.isCounting = false;
              this.countdown = 60;
            }
          }, 1000);
        } else {
          this.$message.error("验证码发送失败：" + res.data.msg);
        }
      }).catch((error) => {
        this.$message.error("请求失败：" + error.message);
      });
    },

    // **邮箱验证码登录**
    loginWithEmail() {
      if (!this.formEmail.email || !this.formEmail.code) {
        this.$message.error("请输入邮箱和验证码！");
        return;
      }

      // this.$http.get("/user/loginCode", { params: { email: this.formEmail.email, code: this.formEmail.code } }).then((res) => {
      //   if (res.data.code === 200) {
      //     this.$message.success("登录成功！");
      //     this.$router.push("/index");
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // }).catch((error) => {
      //   this.$message.error("请求失败：" + error.message);
      // });
      this.$message.success("登录成功！");
      this.$router.push("/index");
    },
  },
  beforeDestroy() {
    // **组件销毁前清除计时器**
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
/* 背景图片 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/images/img.png') no-repeat center center;
  background-size: cover;
}

/* 登录框 */
.login-box {
  width: 400px;
  padding: 30px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 标题 */
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* 登录表单 */
.login-form {
  background: #fff;
  border-radius: 10px;
}

/* 按钮组，确保按钮居中并适当下移 */
.btn-group {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.el-button {
  width: 150px;
  border-radius: 5px;
}
</style>
