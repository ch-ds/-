<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.p_id"
              type="flex"
              align="middle"
              :class="['bg_bottom', index1 === 0 ? 'bg_top' : '']"
            >
              <!-- 渲染1级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="deleteRightsById(scope.row.r_id,item1.p_id)"
                  closable
                  v-if="item1.p_leave === 0"
                >{{item1.p_name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限区域 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.p_id"
                  :class="index2 === item1.children.length-1 ? '' : 'bg_bottom'"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="5">
                    <el-tag
                      @close="deleteRightsById(scope.row.r_id,item2.p_id)"
                      closable
                      type="success"
                      v-if="item2.p_leave === 1"
                    >{{item2.p_name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级区域 -->
                  <el-col :span="19">
                    <el-tag
                      @close="deleteRightsById(scope.row.r_id,item3.p_id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.p_id"
                    >{{item3.p_name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="r_name" label="角色名称"></el-table-column>
        <el-table-column prop="r_describe" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.r_id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="small"
              icon="el-icon-setting"
              @click="setRightsDialog(scope.row.r_id)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="r_name">
          <el-input v-model="addForm.r_name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="r_describe">
          <el-input v-model="addForm.r_describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="r_name">
          <el-input v-model="editForm.r_name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="r_describe">
          <el-input v-model="editForm.r_describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="editRightsDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="setRightsDialogClose"
    >
      <el-tree
        :data="rightsTree"
        :props="rightsTreeProps"
        show-checkbox
        node-key="p_id"
        default-expand-all
        check-on-click-node
        :expand-on-click-node="false"
        :default-checked-keys="defRightsList"
        ref="rightsTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色信息
      roleList: [],
      // 添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 添加角色表单数据
      addForm: {},
      // 添加角色表单验证规则
      addFormRules: {
        r_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 编辑角色对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑角色表单数据
      editForm: {},
      // 编辑角色表单验证数据
      editFormRules: {
        r_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 分配权限对话框的 显示与隐藏
      editRightsDialogVisible: false,
      // 所有权限
      rightsTree: [],
      // Tree 控件显示配置
      rightsTreeProps: {
        // 显示节点的名称
        label: 'p_name',
        // 子树节点的名称
        children: 'children'
      },
      // Tree控件 默认选中
      defRightsList: [],
      updateRightsId: ''
    }
  },
  created() {
    this.getRole()
  },
  methods: {
    // 获取所有角色信息
    async getRole() {
      console.log('.....')
      const { data: res } = await this.$http.get('/roles')
      this.roleList = res.data
      console.log(res.data)
    },
    // 添加角色对话框关闭时的事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/roles', this.addForm)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getRole()
        this.addDialogVisible = false
      })
    },
    // 编辑角色对话框关闭事件
    editDialogClose() {
      this.editForm = {}
    },
    // 编辑按钮 事件
    showEditDialog(roleInfo) {
      this.editForm = roleInfo
      this.editDialogVisible = true
    },
    // 编辑角色
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          '/roles/' + this.editForm.r_id,
          {
            r_name: this.editForm.r_name,
            r_describe: this.editForm.r_describe
          }
        )
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getRole()
        this.editDialogVisible = false
      })
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除角色')
      }
      const { data: res } = await this.$http.delete('/roles/' + id)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getRole()
    },
    // 分配权限对话框 关闭事件
    setRightsDialogClose() {
      this.defRightsList = []
      this.updateRightsId = ''
    },
    // 点击分配权限 按钮
    async setRightsDialog(id) {
      this.updateRightsId = id
      // 展示所有的 权限列表
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.status !== 200) return this.$message.error(res.msg)
      this.rightsTree = res.data
      // 默认选中该角色的权限列表
      const { data: defRes } = await this.$http.get(`/roles/${id}/rights`)
      if (defRes.status !== 200) return this.$message.error(defRes.msg)
      console.log(defRes)
      this.defRightsList = defRes.data
      this.editRightsDialogVisible = true
    },
    // 分配权限
    async setRights() {
      // 需要修改的id数组
      const pIdArr = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.put(
        `/roles/${this.updateRightsId}/rights`,
        {
          pIdArr
        }
      )
      if (res.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success(res.msg)
      this.getRole()
      this.editRightsDialogVisible = false
    },
    // 根据 rights_id 删除权限
    async deleteRightsById(rolesId, rightsId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      console.log(rightsId)
      const { data: res } = await this.$http.delete(
        `/roles/${rolesId}/rights`,
        {
          data: { rights_id: rightsId }
        }
      )
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getRole()
    }
  }
}
</script>

<style lang="scss" scoped>
.bg_bottom {
  border-bottom: 1px solid #eee;
}
.bg_top {
  border-top: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}
</style>
