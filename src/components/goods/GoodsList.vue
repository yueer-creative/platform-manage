<template>

  <el-card class="box-card">
    <!-- 面包屑 -->

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="search-row">
      <el-col>
        <!-- clearable为清除键 -->
        <el-input placeholder="请输入内容"
                  v-model="queryInfo.query"
                  clearable
                  @clear="loadGoodsList()"
                  class="input-search">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="searchGoods()"></el-button>
        </el-input>
        <!-- <el-button type="primary"
                   class="search-btn"
                   @click="$router.push({name:'goodsadd'})">添加商品</el-button> -->
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="goodslist"
              style="width: 100%">

      <el-table-column type="index"
                       label="#"
                       width="60">
      </el-table-column>

      <el-table-column prop="goodsName"
                       label="商品名称">
      </el-table-column>

      <el-table-column prop="goodsCategoryId"
                       label="商品类别"
                       :formatter="stateFormat">
      </el-table-column>

      <el-table-column prop="goodsOriginalprice"
                       label="真实价格(元)">
      </el-table-column>

      <el-table-column prop="goodsPrice"
                       label="价格(元)">
      </el-table-column>

      <el-table-column prop="goodsDate"
                       label="创建时间">
        <template slot-scope='scope'>
          {{scope.row.goodsDate | fmtdate}}
        </template>
      </el-table-column>

      <el-table-column label="商品状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.goodsStatus"
                     @change="goodsStatusChange(scope.row)"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :active-value="0"
                     :inactive-value="1">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop=""
                       label="操作">
        <template slot-scope='scope'>
          <el-row>
            <!-- <el-button size="mini"
                       plain
                       type="primary"
                       icon="el-icon-edit"
                       circle
                       @click='showEditCompileDia(scope.row)'></el-button> -->
            <el-button size="small"
                       plain
                       type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="showDeleCompileMsgBox(scope.row.goodsId)"></el-button>
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

    <!-- 弹出编辑商品列表对话框 -->
    <!-- <el-dialog title="编辑商品"
               :visible.sync="GoodsCompile">
      <el-form :model="form">
        <el-form-item label="商品名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.goodsName"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品类别"
                      :label-width="formLabelWidth">
          <el-input v-model="form.goodsCategoryId"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="真实价格(元)"
                      :label-width="formLabelWidth">
          <el-input v-model="form.goodsOriginalprice"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)"
                      :label-width="formLabelWidth">
          <el-input v-model="form.goodsPrice"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="GoodsCompile = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCompile()">确 定</el-button>
      </div>
    </el-dialog> -->

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        current: 1,
        limit: 5
      },

      total: 0,
      // 弹出编辑商品列表对话框
      GoodsCompile: false,
      // 商品表单数据
      form: {

      },
      formLabelWidth: '100px',
      goodslist: []
    }
  },
  created () {
    this.getGoodsList()

    this.initSetTimeout() // 调用每隔10秒刷新数据
  },
  methods: {
    // 每隔5秒刷新表格
    initSetTimeout () {
      setInterval(() => {
        this.getGoodsList()
      }, 5000)
    },
    // 根据商品类别id显示对应名称
    stateFormat (row, colmun) {
      if (row.goodsCategoryId === 1) {
        return '图书教材'
      } else if (row.goodsCategoryId === 2) {
        return '数码产品'
      } else if (row.goodsCategoryId === 3) {
        return '美妆衣物'
      } else if (row.goodsCategoryId === 4) {
        return '运动棋牌'
      } else if (row.goodsCategoryId === 5) {
        return '票劵小物'
      } else if (row.goodsCategoryId === 6) {
        return '文具办公'
      } else {
        return '校园代步'
      }
    },
    // 改变商品状态
    async goodsStatusChange (goods) {
      const res = await this.$http.post(`goodsStatusChange/${goods.goodsId}/${goods.goodsStatus}`)

      this.$message.success(res.data.message)
    },
    // 删除商品->发送请求
    showDeleCompileMsgBox (compileId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除的请求 :id
        const res = await this.$http.post(`goodsDelete/${compileId}`)
        console.log(res)
        if (res.data.code === 200) {
          this.queryInfo.current = 1
          this.getGoodsList()
          this.$message.success(res.data.message)
        } else {
          // 提示
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑商品->发送请求
    async editCompile () {
      const res = await this.$http.put('goodsUpdate/' + this.form.goods_id + '}', this.form)
      // console.log(res);
      // 关闭对哈框
      this.GoodsCompile = false
      if (res.data.meta.status === 200) {
        // 更新视图
        this.getGoodsList()
        // 提示
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 编辑商品
    showEditCompileDia (compile) {
      this.form = compile
      this.GoodsCompile = true
    },
    // 搜索
    searchGoods () {
      this.getGoodsList()
    },
    // 清空搜索框 重新获取数据
    loadGoodsList () {
      this.getGoodsList()
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.limit = val
      this.queryInfo.current = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.current = val
      this.getGoodsList()
    },

    async getGoodsList () {
      console.log(this.queryInfo.query)
      const res = await this.$http.get('goods', { params: this.queryInfo })

      if (res.data.code === 200) {
        // 1.给表格数据复制
        this.goodslist = res.data.data.records
        console.log(this.goodslist)
        // 2.给total赋值
        this.total = res.data.data.total
        // 3.提示
        // if (flag) {
        //   this.$message.success(res.data.message)
        //   // flag判断是否是第一次进入页面
        //   flag = false
        // }
      } else {
        this.$message.warning(res.data.message)
      }
    }
  }
}
</script>

<style>
.search-row {
  margin-top: 20px;
}
.input-search {
  width: 30%;
  float: left;
}
.search-btn {
  margin-left: 5px;
  float: left;
}
</style>
