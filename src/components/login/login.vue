<template>
  <div class="login-wrap">
    <el-form class="login-form"
             :label-position="labelPosition"
             label-width="80px"
             :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn"
                 type="primary"
                 @click.prevent="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'top',
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      // 希望让异步代码看起来像同步代码(美观)
      // ES7 asyncc+await

      const res = await this.$http.post('login', this.formdata)
      // console.log(res)
      const {
        data,
        meta: { msg, status }
      } = res.data

      if (status === 200) {
        // 登录成功
        // 0. 保存token
        localStorage.setItem('token', data.token)
        // 1. 跳转home
        this.$router.push({
          name: 'home'
        })
        // 提示成功
        this.$message.success(msg)
      } else {
        // 不成功
        this.$message.warning(msg)
      }
      // this.$http.post('login', this.formdata).then((res) => {
      //   // console.log(res)
      //   const {
      //     // data,
      //     meta: { msg, status }
      //   } = res.data

      //   if (status === 200) {
      //     // 登录成功
      //     // 1. 跳转home
      //     this.$router.push({
      //       name: 'home'
      //     })
      //     // 提示成功
      //     this.$message.success(msg)
      //   } else {
      //     // 不成功
      //     this.$message.warning(msg)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}

.login-wrap .login-btn {
  margin-top: 10%;
  height: 60px;
  width: 100%;
}
</style>
