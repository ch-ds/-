<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cascaderKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="cascaderHandleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="attr_sel" @tab-click="tabsHandleClick()">
        <!-- 动态参数页 -->
        <el-tab-pane label="动态参数" name="dynamic">
          <el-row>
            <el-col>
              <el-button type="primary" @click="addDialogVisible = true" :disabled="buttonFlag">添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 动态参数表格 -->
          <el-table :data="dynamicList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_value"
                  :key="index"
                  @close="dynamicTagHandleClose(scope.row.attr_id,index)"
                  closable
                >{{item}}</el-tag>
                <!-- 添加动态参数 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row.attr_id)"
                  @blur="handleInputConfirm(scope.row.attr_id)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row.attr_id)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页 -->
        <el-tab-pane label="静态属性" name="static">
          <!-- 静态属性参数页面 -->
          <el-row>
            <el-col>
              <el-button type="primary" @click="addDialogVisible = true" :disabled="buttonFlag">添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 静态属性表格 -->
          <el-table :data="staticList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_value"
                  :key="index"
                  @close="dynamicTagHandleClose(scope.row.attr_id,index)"
                  closable
                >{{item}}</el-tag>
                <!-- 添加静态参数 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row.attr_id)"
                  @blur="handleInputConfirm(scope.row.attr_id)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row.attr_id)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClose()"
    >
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器选中 数组
      cascaderKeys: [],
      // 级联选择器配置对象
      cascaderProps: {
        label: 'cate_name',
        value: 'cate_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 标签页的 选择值
      attr_sel: 'dynamic',
      // 动态属性的数据
      dynamicList: [],
      // 静态属性的数据
      staticList: [],
      // tagNew输入框的值
      inputValue: '',
      // 添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单数据
      addForm: {},
      // 添加表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑对话框的表单数据
      editForm: {},
      // 添加表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取全部商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('/cate')
      if (res.status !== 200) return this.$message.error('获取商品分类信息失败')
      this.cateList = res.data
    },
    // 获取商品属性
    async getAttr() {
      const cateId = this.cascaderKeys[this.cascaderKeys.length - 1]
      const { data: res } = await this.$http.get(
        `/attr/${cateId}/${this.attr_sel}`
      )
      if (res.status !== 200) return this.$message.error('获取属性失败')
      res.data.forEach(item => {
        item.inputVisible = false
      })
      if (this.attr_sel === 'dynamic') {
        this.dynamicList = res.data
      } else {
        this.staticList = res.data
      }
    },
    // 级联选择器选择触发函数
    cascaderHandleChange() {
      // 获取选中的 选中数组中的最后一个 cate_id
      this.getAttr()
    },
    // tabs标签页触发函数
    tabsHandleClick() {
      this.getAttr()
    },
    // tag标签删除事件
    async dynamicTagHandleClose(id, index) {
      let attr
      if (this.attr_sel === 'dynamic') {
        attr = this.dynamicList
      } else {
        attr = this.staticList
      }
      // 根据 id 查找出  dynamicList 中的 对应数据
      const info = attr.filter(item => item.attr_id === id)
      // 根据 index 删除 数据的属性数组的值
      info[0].attr_value.splice(index, 1)
      // 将数组转成字符串
      const attrValue = info[0].attr_value.join(',')
      const { data: res } = await this.$http.put('/attr/' + id, {
        attr_value: attrValue
      })
      if (res.status !== 200) return this.$message.error('修改属性参数失败')
      this.$message.success('修改属性参数成功')
    },
    // 点击 +new tag 的按钮事件
    showInput(id) {
      let attr
      if (this.attr_sel === 'dynamic') {
        attr = this.dynamicList
      } else {
        attr = this.staticList
      }
      const index = attr.findIndex(item => item.attr_id === id)
      attr[index].inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 添加 tag 事件
    async handleInputConfirm(id) {
      let attr
      if (this.attr_sel === 'dynamic') {
        attr = this.dynamicList
      } else {
        attr = this.staticList
      }
      const index = attr.findIndex(item => item.attr_id === id)
      if (this.inputValue.trim() === '') {
        this.inputValue = ''
        attr[index].inputVisible = false
        return false
      }
      // 根据 index 删除 数据的属性数组的值
      attr[index].attr_value.push(this.inputValue)
      // 将数组转成字符串
      const attrValue = attr[index].attr_value.join(',')
      const { data: res } = await this.$http.put('/attr/' + id, {
        attr_value: attrValue
      })
      if (res.status !== 200) return this.$message.error('修改属性参数失败')
      this.$message.success('修改属性参数成功')
      this.inputValue = ''
      attr[index].inputVisible = false
    },
    // 添加对话框关闭事件
    addFormClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
    },
    // 添加属性
    addAttr() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 获取当前选择的id
        const cateId = this.cascaderKeys[this.cascaderKeys.length - 1]
        this.addForm.cate_id = cateId
        this.addForm.attr_sel = this.attr_sel
        const { data: res } = await this.$http.post('/attr', this.addForm)
        if (res.status !== 200) return this.$message.error('添加属性失败')
        this.$message.success('添加属性成功')
        this.getAttr()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮
    showEditDialog(info) {
      this.editDialogVisible = true
      this.editForm = info
    },
    // 编辑功能
    editAttr() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          `/attr/${this.editForm.attr_id}/attr_name`,
          {
            attr_name: this.editForm.attr_name
          }
        )
        if (res.status !== 200) return this.$message.error('修改属性失败')
        this.$message.success('修改属性成功')
        this.getAttr()
        this.editDialogVisible = false
      })
    },
    // 删除功能
    async deleteAttr(attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性,是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.delete('/attr/' + attrId)
      if (res.status !== 200) return this.$message.error('删除属性失败')
      this.$message.success('删除属性成功')
      this.getAttr()
    }
  },
  computed: {
    titleText() {
      if (this.attr_sel === 'dynamic') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    buttonFlag() {
      return this.cascaderKeys.length === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 0 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
