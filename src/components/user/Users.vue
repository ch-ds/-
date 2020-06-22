<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.username"
            clearable
            @clear="searchClick()"
            @keyup.enter.native="searchClick()"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchClick()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = !addDialogVisible">添加用户</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="userStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                circle
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                circle
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="addDialogClose()"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClose()"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配用户权限"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClose()"
      width="50%"
      :close-on-click-modal="false"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.roleName}}</p>
        <p>
          分配新角色：
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.r_id"
              :label="item.r_name"
              :value="item.r_id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 查询内容
      queryInfo: {
        // 模糊查询值
        username: '',
        // 第几页
        page: 1,
        // 每页显示数据
        size: 2
      },
      // 总数据
      total: 3,
      // 表格数据
      userList: [],
      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户信息的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 ~ 10 个之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6 ~ 15 个之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改对话框的表单数据
      editForm: {
        id: '',
        username: '',
        email: '',
        phone: ''
      },
      // 修改用户个人信息表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 空值 分配权限 对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 分配权限用户数据
      userInfo: {},
      // 所有权限名称
      roleList: [],
      // 修改后roleName的id值
      roleId: ''
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 获取 所有用户
    async getUsers() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      console.log('所有用户的信息:', res)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.userList = res.data
      this.total = res.total
    },
    // 模糊查询按钮功能
    searchClick() {
      this.queryInfo.page = 1
      this.getUsers()
    },
    // 监听状态值开关
    async userStatusChange(userInfo) {
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/status`,
        {
          status: userInfo.status
        }
      )
      console.log(res)
    },
    // 每页条数 发生改变时触发函数
    handleSizeChange(size) {
      this.queryInfo.size = size
      this.getUsers()
    },
    // 当前页 发生变化时触发函数
    handleCurrentChange(page) {
      this.queryInfo.page = page
      console.log(this.queryInfo)
      this.getUsers()
    },
    // 关闭添加用户对话框,清楚Form表单数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // 隐藏对话框
        this.addDialogVisible = false
        // 刷新数据
        this.getUsers()
      })
    },
    // 点击修改用户信息按钮
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/users/' + id)
      this.editForm = res.data[0]
      // this.editForm.username = res.data[0].username
      // this.editForm.email = res.data[0].email
      // this.editForm.phone = res.data[0].phone
      // this.editForm.id = res.data[0].id
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 关闭 修改用户对话框,清空Form表单数据
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户个人信息
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          '/users/' + this.editForm.id,
          {
            email: this.editForm.email,
            phone: this.editForm.phone
          }
        )
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // 关闭修改用户个人信息弹窗
        this.editDialogVisible = false
        // 重新渲染数据
        this.getUsers()
      })
    },
    // 删除用户 按钮
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除!')
      // 进行删除操作
      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      // 删除成功后重置数据
      // 1.判断是不是最后一页
      if (this.userList.length === 1) this.queryInfo.page--
      this.getUsers()
    },
    // 分配角色 按钮事件
    async showRoleDialog(userInfo) {
      const { data: res } = await this.$http.get('/roles')
      if (res.status !== 200) return this.$message.error(res.msg)
      // 将 roles 表的数据赋值给 roleList
      this.roleList = res.data
      // 将 用户信息 赋值给userInfo
      this.userInfo = userInfo
      // 显示对话框
      this.setRoleDialogVisible = true
    },
    // 分配角色对话框关闭时间
    setRoleDialogClose() {
      this.userInfo = {}
      this.roleId = ''
    },
    // 修改用户 权限名称
    async setRole() {
      if (!this.roleId) return this.$message.info('请选择分配权限名称')
      const { data: res } = await this.$http.put(`/users/${this.userInfo.id}/role`, {
        role_id: this.roleId
      })
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getUsers()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
