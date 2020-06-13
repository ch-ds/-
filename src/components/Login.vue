<template>
  <div class="login_container">
    <!-- 盒子 -->
    <div class="login_box">
      <h2 class="box_title">小卖部管理系统</h2>
      <!-- 登录表单 -->
      <el-form
        :model="LoginForm"
        :rules="LoginFormRules"
        ref="LoginFormRef"
        label-width="0"
        class='login_form'
      >
        <el-form-item prop="username">
          <el-input
            v-model="LoginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          class="input-group"
        >
          <el-input
            v-model="LoginForm.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            :type="pwdInputShow ? 'type' : 'password' "
          >
            <img
              :src="pwdInputShow ? require('../assets/images/showPwd.jpg') : require('../assets/images/hidePwd.jpg') "
              slot="suffix"
              @click="pwdInputShow = !pwdInputShow"
            >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login()"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm()"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 控制 密码框 的显示与隐藏
      pwdInputShow: false,
      // 登录表单的数据绑定的 用户名 和 密码
      LoginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置方法
    resetLoginForm () {
      this.$refs.LoginFormRef.resetFields()
    },
    // 登录功能
    login () {
      this.$refs.LoginFormRef.validate(valid => {
        if (!valid) return false
        console.log('登录成功')
      })
    }
  }
}
</script>

<style lang="scss">
.login_container {
  height: 100%;
  background-image: url('../assets/images/loginBgc.jpg');
  background-repeat: no-repeat;
  background-size:100% 100%;
  background-attachment: fixed;
}

.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .box_title {
    margin: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-image: linear-gradient(
      to right,
      rgb(162, 62, 134),
      rgb(136, 88, 180) 30%,
      rgb(111, 100, 221) 80%
    );
  }

  .login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.el-input {
  img {
    width: 20px;
    height: 20px;
    margin: 10px 0;
    cursor: pointer;
  }
}
</style>
