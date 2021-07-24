<template>
  <el-card class="box-card">
    <!-- 面包屑 -->

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="search-row">
      <el-col>
        <el-button type="success"
                   class="search-btn"
                   @click="showAddCategoryDia()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="category"
              style="width: 50%">

      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>

      <el-table-column prop="categoryId"
                       label="分类ID"
                       width="150">
      </el-table-column>

      <el-table-column prop="categoryName"
                       label="分类名"
                       width="250">
      </el-table-column>

      <el-table-column prop=""
                       label="操作">
        <template slot-scope='scope'>
          <el-row>
            <el-button size="small"
                       plain
                       type="primary"
                       icon="el-icon-edit"
                       circle
                       @click='showEditCompileDia(scope.row)'></el-button>
            <el-button size="small"
                       plain
                       type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="showDeleCompileMsgBox(scope.row.categoryId)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryInfo.current"
                   :page-sizes="[3, 5, 7, 9]"
                   :page-size="queryInfo.limit"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>

    <!-- 添加种类弹窗 -->
    <el-dialog title="添加种类"
               :visible.sync="dialogFormVisibleAdd"
               width="40%">
      <el-form :model="form">
        <el-form-item label="种类名"
                      label-width="70px"
                      prop="userName">
          <el-input v-model="form.categoryName"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCategory()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑种类弹窗 -->
    <el-dialog title="编辑用户"
               :visible.sync="dialogFormVisibleEdit"
               width="40%">
      <el-form :model="form">
        <el-form-item label="种类Id"
                      label-width="100px"
                      prop="userName">
          <el-input v-model="form.categoryId"
                    autocomplete="off"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="种类名称"
                      label-width="100px"
                      prop="userAccount">
          <el-input v-model="form.categoryName"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCategory()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        current: 1,
        limit: 7
      },

      total: 0,
      // 种类表单数据
      form: {
        categoryName: ''
      },
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,

      formLabelWidth: '100px',
      category: []
    }
  },

  created () {
    // flag判断是否是第一次进入页面
    const flag = true
    this.getCategoryList(flag)
  },
  methods: {
    // 删除种类
    showDeleCompileMsgBox (categoryId) {
      this.$confirm('删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.post(`categoryDelete/${categoryId}`)
        console.log(res)
        if (res.data.code === 200) {
          this.queryInfo.current = 1
          this.getCategoryList()

          this.$message.success(res.data.message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 编辑种类->发送请求
    async editCategory () {
      const res = await this.$http.post('categoryUpdate', this.form)
      // console.log(res);
      // 关闭对话框
      this.dialogFormVisibleEdit = false
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.queryInfo.current = 1
        this.getCategoryList()
      } else {
        this.$message.error(res.data.data.msg)
      }
    },
    showEditCompileDia (compile) {
      this.form = compile
      this.dialogFormVisibleEdit = true
    },

    // 添加商品种类
    async addCategory () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post('categoryAdd', this.form)
      console.log(res)

      if (res.data.code === 200) {
        // 提示成功
        this.$message.success(res.data.message)
        // 更新视图
        this.getCategoryList()
        // 清空文本框
        this.form = {}
      } else {
        this.$message.warning(res.data.message)
      }
    },
    // 显示添加种类弹窗
    showAddCategoryDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)

      this.queryInfo.limit = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)

      this.queryInfo.current = val
      this.getCategoryList()
    },

    // 获取种类列表
    async getCategoryList (flag) {
      const res = await this.$http.get('category', { params: this.queryInfo })

      if (res.data.code === 200) {
        // 1.给表格数据复制
        this.category = res.data.data.records
        console.log(this.category)
        // 2.给total赋值
        this.total = res.data.data.total
        // 3.提示
        if (flag) {
          this.$message.success(res.data.message)
          // flag判断是否是第一次进入页面
          flag = false
        }
      } else {
        this.$message.warning(res.data.message)
      }
    }
  }
}
</script>

<style>
</style>
