<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 表格区域 -->
      <el-table :data="rightList" width="100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="p_name"></el-table-column>
        <el-table-column label="路径" prop="p_path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.p_leave == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.p_leave == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightList: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    // 获取所有权限列表
    async getRights() {
      const { data: res } = await this.$http.get('/rights')
      if (res.status !== 200) return this.$message.error(res.msg)
      this.rightList = res.data
    }
  }
}
</script>
