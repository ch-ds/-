<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <span>小卖部后台管理系统</span>
      </div>
      <el-button type="info" @click="$router.push('/login')">退出</el-button>
    </el-header>

    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <!-- 导航栏菜单 -->
        <el-menu
          :default-active="$router.currentRoute.path"
          router
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.pName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.pName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 假数据，到时候用后台渲染成真数据
      menuList: [
        {
          id: 100,
          pName: '用户管理',
          children: [
            {
              id: 101,
              pName: '用户列表',
              path: 'users'
            }
          ]
        },
        {
          id: 102,
          pName: '权限管理',
          children: [
            {
              id: 103,
              pName: '角色列表',
              path: 'roles'
            },
            {
              id: 104,
              pName: '权限列表',
              path: 'rights'
            }
          ]
        },
        {
          id: 105,
          pName: '商品管理',
          children: [
            {
              id: 106,
              pName: '商品列表',
              path: 'goods'
            },
            {
              id: 107,
              pName: '分类参数',
              path: 'params'
            },
            {
              id: 108,
              pName: '商品分类',
              path: 'categories'
            }
          ]
        }
      ],
      // 功能模块对应的图标
      iconsObj: {
        100: 'iconfont icon-users',
        109: 'iconfont icon-tijikongjian',
        105: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju'
      },
      // 菜单是否折叠
      isCollapse: false
    }
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  }
}
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
}

.el-header {
  font-size: 20px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
    > img {
      height: 50px;
    }
    > span {
      color: #fff;
      margin-left: 15px;
    }
  }
}

.el-aside {
  // height: 100%;
  background: #333744;

  .toggle-button {
    background: #4a5064;
    color: #fff;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    cursor: pointer;
  }

  .el-menu {
    border-right: 0;
  }

  .iconfont {
    margin-right: 10px;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
