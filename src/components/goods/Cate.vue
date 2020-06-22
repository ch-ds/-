<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        stripe
        border
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 分类级别模板 -->
        <template slot="cate_leave" slot-scope="scope">
          <el-tag v-if="scope.row.cate_leave === 1">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cate_leave === 2">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-detele"
            @click="deleteCate(scope.row.cate_id)"
          >删除</el-button>
        </template>
      </tree-table>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose()"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" @keyup.enter.native="addCate()"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cascaderKeys"
            :options="cascaderList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品分类对话框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose()"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name" @keyup.enter.native="editCate()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 商品分类表格的行数据信息
      columns: [
        {
          label: '分类名称',
          prop: 'cate_name'
        },
        {
          label: '分类级别',
          type: 'template',
          template: 'cate_leave'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      // 添加商品分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加商品 表单
      addForm: {},
      // 添加商品 表单验证规则
      addFormRules: {
        cate_name: [
          { required: true, message: '请输出商品分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      cascaderList: [],
      // 添加商品分类的分类id
      cascaderKeys: [],
      // 添加商品分类的 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cate_name',
        value: 'cate_id',
        children: 'children',
        checkStrictly: 'true'
      },
      // 编辑商品分类对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑商品 表单
      editForm: {},
      // 编辑商品 表单验证规则
      editFormRules: {
        cate_name: [
          { required: true, message: '请输出商品分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('/cate')
      if (res.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.cateList = res.data
    },
    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类,是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除商品分类')
      }
      // 确定删除，发起请求
      const { data: res } = await this.$http.delete('/cate/' + id)
      if (res.status !== 200) return this.$message.error('删除商品分类失败')
      this.$message.success('已成功删除商品分类')
      this.getCateList()
    },
    // 添加商品分类按钮事件
    async showAddDialog() {
      const { data: res } = await this.$http.get('/cate/cascader')
      if (res.status !== 200) return this.$message.error('获取商品分类失败')
      this.cascaderList = res.data
      this.addDialogVisible = true
    },
    // 添加商品分类对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 级联选择器选中时触发事件
    handleChange() {
      // 当没有选中目录时
      if (this.cascaderKeys.length === 0) {
        this.addForm.cate_cid = ''
        this.addForm.cate_leave = 1
      } else if (this.cascaderKeys.length === 1) {
        // 当选中 一级目录时
        this.addForm.cate_cid = this.cascaderKeys[0]
        this.addForm.cate_leave = 2
      } else {
        // 当选中 二级目录时
        this.addForm.cate_cid = this.cascaderKeys[1]
        this.addForm.cate_leave = 3
      }
    },
    // 添加商品
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/cate', this.addForm)
        if (res.status !== 200) return this.$message.error('添加商品分类失败')
        this.$message.success('添加商品分类成功')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮 事件
    showEditDialog(cateInfo) {
      this.editForm = {
        cate_id: cateInfo.cate_id,
        cate_name: cateInfo.cate_name
      }
      this.editDialogVisible = true
    },
    // 编辑商品分类对话框关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改商品信息
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          '/cate/' + this.editForm.cate_id,
          {
            cate_name: this.editForm.cate_name
          }
        )
        if (res.status !== 200) return this.$message.error('修改商品信息失败')
        this.$message.success('修改商品信息成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    }
  }
}
</script>
