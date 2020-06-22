<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框与按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.g_name"
            placeholder="请输入要搜索商品的名称"
            @keyup.enter.native="getGoodsList()"
            clearable
            @clear="getGoodsList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="g_name"></el-table-column>
        <el-table-column label="价格（元）" prop="g_price" width="100"></el-table-column>
        <el-table-column label="数量（件）" prop="g_number" width="100"></el-table-column>
        <el-table-column label="创建时间" prop="g_createTime"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editDialog(scope.row.g_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.g_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5,10,20,50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose()"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="g_name">
          <el-input v-model="editForm.g_name"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）" prop="g_price">
          <el-input v-model="editForm.g_price"></el-input>
        </el-form-item>
        <el-form-item label="数量（件)" prop="g_number">
          <el-input v-model="editForm.g_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品数据
      goodsList: [],
      // 搜索数据
      queryInfo: {
        g_name: '',
        page: 1,
        size: 5
      },
      // 商品总数
      total: 15,
      // 编辑商品对话框的 显示与隐藏
      editDialogVisible: false,
      // 编辑商品表单
      editForm: {},
      // 编辑商品表单验证规则
      editFormRules: {
        g_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        g_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        g_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryInfo
      })
      if (res.status !== 200) return this.$message.error(res.msg)
      console.log(res)
      this.goodsList = res.data
      this.total = res.total
    },
    // 改变 每页数量 触发事件
    handleSizeChange(size) {
      this.queryInfo.size = size
      this.getGoodsList()
    },
    // 改变 页数 触发事件
    handleCurrentChange(page) {
      this.queryInfo.page = page
      this.getGoodsList()
    },
    // 编辑商品 按钮
    async editDialog(id) {
      const { data: res } = await this.$http.get('/goods/' + id)
      if (res.status !== 200) return this.$message.error('获取商品信息失败')
      this.editForm = res.data[0]
      this.editDialogVisible = true
    },
    // 编辑商品对话框关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑商品功能
    editGoods() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          '/goods/' + this.editForm.g_id,
          {
            g_name: this.editForm.g_name,
            g_price: this.editForm.g_price,
            g_number: this.editForm.g_number
          }
        )
        if (res.status !== 200) return this.$message.error('编辑商品信息失败')
        this.$message.success(res.msg)
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },
    // 删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除该商品')
      }
      const { data: res } = await this.$http.delete('/goods/' + id)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      // 判断是否是最后一页最后一条数据
      if (this.goodsList.length === 1) this.queryInfo.page--
      this.getGoodsList()
    },
    // 添加商品按钮
    addGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
