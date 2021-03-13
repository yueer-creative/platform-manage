<template>
  <el-card class="box-card">
    <!-- 1。面包屑 -->
    <!-- /首页  /用户管理 / 用户列表-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2。搜索 -->
    <el-row class="search-row">
      <el-col>
        <el-input @clear="loadUserlist()"
                  clearable
                  placeholder="请输入内容"
                  v-model="query"
                  class="input-search">
          <el-button slot="append"
                     @click="serchUser()"
                     icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success"
                   class="search-btn"
                   @click="showAddUserDia">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 3。表格 -->
    <el-table :data="userlist"
              style="width: 100%"
              border
              class="el-table">
      <el-table-column label="#"
                       width="60"
                       type="index">
      </el-table-column>
      <el-table-column prop="username"
                       label="用户名"
                       width="120">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="电话">
      </el-table-column>

      <el-table-column label="创建时间">

        <!-- 如果单元格内显示的内容不是字符串（文字），需要给被现实的内同外层包裹一个个template -->
        <!-- template内部需要用数据 则要设置slot-scope属性 该属性的值是要用数据的数据源
        （create_time的数据源为userlist）-->
        <!-- slot-scope得知userlist其实就是el-table绑定的数据userlist
            userlist.row -> 数组中的每个对象
         -->
        <!-- slot-scope会去上一级自动找数据源 “”中的内容写什么都行  -->
        <!-- <template slot-scope="userlist">
          {{userlist.row.create_time | fmtdate}}
        </template> -->
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>
      </el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"
                     @change="changeMsgState(scope.row)"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="address"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="small"
                     circle
                     plain
                     @click="showEditUserDia(scope.row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="small"
                     circle
                     plain
                     @click="showDeleUserMsgBox(scope.row.id)"></el-button>
          <el-button type="success"
                     icon="el-icon-check"
                     size="small"
                     circle
                     plain
                     @click="showSetUserRoleDia(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4。分页 -->
    <el-pagination class="
                     el-pagination"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[2, 4, 6, 8]"
                   :page-size="2"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="dialogFormVisibleAdd"
               width="40%">
      <el-form :model="form">
        <el-form-item label="用户名"
                      label-width="100px">
          <el-input v-model="form.username"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码"
                      label-width="100px">
          <el-input v-model="form.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      label-width="100px">
          <el-input v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      label-width="100px">
          <el-input v-model="form.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户"
               :visible.sync="dialogFormVisibleEdit"
               width="40%">
      <el-form :model="form">
        <el-form-item label="用户名"
                      label-width="100px">
          <el-input v-model="form.username"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱"
                      label-width="100px">
          <el-input v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      label-width="100px">
          <el-input v-model="form.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名:"
                      label-width="100px">
          <span class="dialog-span">{{currUserNmae}}</span>
        </el-form-item>

        <el-form-item label="角色:"
                      label-width="100px">
          <!-- 如果外层标签的值(currRoleId) 和 option的value一样，就会显示该option的label值 -->
          {{currRoleId}}
          <el-select v-model="currRoleId"
                     placeholder="请选择活动区域"
                     class="dialog-select">
            <el-option label="请选择"
                       :value="-1"></el-option>
            <el-option :label="item.roleName"
                       :value="item.id"
                       v-for="(item, i) in roles"
                       :key="i"></el-option>

          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary"
                   @click="serRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      // 表格绑定的数据
      // username: "admin"
      // email: "adsfad@qq.com"
      // mobile: "12345678"
      // create_time: 1486720211
      // mg_state: true
      // id: 500
      // role_name: "超级管理员"
      userlist: [],
      // 分页相关数据
      total: -1,
      pagenum: 1,
      pagesize: 2,

      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      // 表单属性
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      currRoleId: -1,
      currUserId: -1,
      currUserNmae: '',
      roles: []
    }
  },

  created () {
    // flag判断是否是第一次进入页面
    const flag = true
    this.getUserList(flag)
  },

  methods: {
    // 分配角色 - 更改角色
    async serRole () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, { rid: this.currRoleId })
      console.log(res)
      this.dialogFormVisibleRol = false
    },
    // 分配角色 - 打开对话框
    async showSetUserRoleDia (user) {
      this.currUserNmae = user.username
      // 给currUserID赋值
      this.currUserId = user.id
      // 获取所有角色
      const res1 = await this.$http.get('roles')
      this.roles = res1.data.data
      // 获取当前角色的角色id->rid
      const res = await this.$http.get(`users/${user.id}`)
      this.currRoleId = res.data.data.rid

      this.dialogFormVisibleRol = true
    },
    // 修改状态
    async changeMsgState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
    },
    // 编辑用户 - 发送请求
    async editUser () {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)

      this.dialogFormVisibleEdit = false
      this.getUserList()
      console.log(res)
    },
    // 编辑用户 - 显示对话框
    showEditUserDia (user) {
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    // 删除用户 - 弹窗
    showDeleUserMsgBox (userId) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.pagenum = 1
          this.getUserList()

          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 添加用户 - 发送请求
    async addUser () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post('users', this.form)
      console.log(res)
      const { meta: { status, msg } } = res.data
      if (status === 201) {
        // 提示成功
        this.$message.success(msg)
        // 更新视图
        this.getUserList()
        // 清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 添加用户 - 显示对话框
    showAddUserDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },

    loadUserlist () {
      this.getUserList()
    },
    serchUser () {
      // 按照input绑定的query参数发送请求
      this.getUserList()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)

      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)

      this.pagenum = val
      this.getUserList()
    },
    // 获取用户列表
    async getUserList (flag) {
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common.Authorization = AUTH_TOKEN

      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
      const { meta: { status, msg }, data: { users, total } } = res.data
      if (status === 200) {
        // 1.给表格数据复制
        this.userlist = users
        // 2.给total赋值
        this.total = total
        // 3.提示
        if (flag) {
          this.$message.success(msg)
          // flag判断是否是第一次进入页面
          flag = false
        }
      } else {
        this.$message.warning(msg)
      }
    }

    // isFirst (flag) {
    //   flag = false
    //   return flag
    // }

  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.input-search {
  width: 30%;
  float: left;
}
.search-btn {
  margin-left: 5px;
  float: left;
}
.search-row {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  float: left;
}
.dialog-span {
  display: block;
  text-align: left;
}
.dialog-select {
  display: block;
  text-align: left;
  width: 70%;
}
</style>
