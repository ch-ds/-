<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs
          v-model="active"
          tab-position="left"
          @tab-click="tabHandleClick"
          :before-leave="tabBeforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息页 -->
            <el-form-item label="商品名称" prop="g_name">
              <el-input v-model="addForm.g_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="g_price">
              <el-input v-model="addForm.g_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="g_number">
              <el-input v-model="addForm.g_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="g_cate">
              <el-cascader v-model="addForm.g_cate" :options="cateList" :props="cascaderProps"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数页面 -->
            <el-form-item v-for="item in dynamicList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="addForm.attr_value" size="small">
                <el-checkbox
                  v-for="(itemAttr,index) in item.attr_value"
                  :key="index"
                  :label="itemAttr"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性页面 -->
            <el-form-item v-for="item in staticList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="addForm.attr_sValue" size="small">
                <el-checkbox
                  v-for="(itemAttr,index) in item.attr_value"
                  :key="index"
                  :label="itemAttr"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条的位置
      active: 0,
      // 添加表单
      addForm: {
        g_name: '',
        g_price: 0,
        g_number: 0,
        g_cate: [],
        attr_value: [],
        attr_sValue: []
      },
      // 添加表单验证规则
      addFormRules: {
        g_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        g_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        g_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        g_cate: [{ required: true, message: '请输入商品分类', trigger: 'blur' }]
      },
      // 商品分类数据
      cateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cate_name',
        value: 'cate_id',
        children: 'children'
      },
      // 动态属性的数据
      dynamicList: [],
      // 静态属性的数据
      staticList: []
    }
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('/cate')
      if (res.status !== 200) return this.$message.error('获取商品分类信息失败')
      this.cateList = res.data
    },
    // 获取商品属性
    async getAttr(attrSel) {
      const cateId = this.addForm.g_cate[this.addForm.g_cate.length - 1]
      const { data: res } = await this.$http.get(`/attr/${cateId}/${attrSel}`)
      if (res.status !== 200) return this.$message.error('获取属性失败')
      if (attrSel === 'dynamic') {
        this.dynamicList = res.data
      } else {
        this.staticList = res.data
      }
      console.log(this.staticList)
    },
    // 标签页离开前的函数
    tabBeforeLeave() {
      if (this.active === '0' && this.addForm.g_name.trim().length === 0) {
        this.$message.error('请输入商品名称')
        return false
      }
      if (this.active === '0' && this.addForm.g_cate.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 标签页点击事件
    tabHandleClick() {
      if (this.active === '1') {
        this.getAttr('dynamic')
      } else if (this.active === '2') {
        this.getAttr('static')
      }
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('有数据未填写')
          return false
        }
        const { data: res } = await this.$http.post('/goods', {
          g_name: this.addForm.g_name,
          g_price: this.addForm.g_price,
          g_number: this.addForm.g_number
        })
        if (res.status !== 200) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
.el-cascader {
  width: 25%;
}
</style>
