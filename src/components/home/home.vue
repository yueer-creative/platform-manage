<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">这里是左上角</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">
            <h3 class="middle">这里是中间</h3>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a class="loginout"
               @click.prevent="handleLoginout()"
               href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside"
                width="200px">
        <!-- 侧边栏  -->

        <!-- 开启路由模式 -->
        <el-menu :unique-opened="true"
                 :router="true">
          <!-- 1 -->
          <el-submenu index="1">

            <template slot="title">
              <i class="el-icon-location menu-icon"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="users">
              <i class="el-icon-info"></i>
              <span>用户列表</span>
            </el-menu-item>

          </el-submenu>

          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location menu-icon"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location menu-icon"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location menu-icon"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 主题内容  -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  // 获取token
  // if token 渲染
  // else 登录
  beforeCreate () {
    const token = localStorage.getItem('token')

    if (!token) {
      this.$router.push({ name: 'login' })
    }
  },

  methods: {
    handleLoginout () {
      // 1.清理token
      localStorage.clear()
      // 2.提示
      this.$message.success('退出成功')
      // 3.返回登录页
      this.$router.push({ name: 'login' })
    }
  }

}
</script>

<style>
.container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height 会影响其中表格表头的高度 */
  line-height: 20px;
}
.loginout {
  text-decoration: none;
}
.middle {
  line-height: 20px;
  text-align: center;
}
.menu-icon {
  margin-left: -60px;
}
</style>
