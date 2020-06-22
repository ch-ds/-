import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Users = () => import('../components/user/Users.vue')
const Roles = () => import('../components/power/Roles.vue')
const Rights = () => import('../components/power/Rights.vue')
const Goods = () => import('../components/goods/Goods.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')
const AddGoods = () => import('../components/goods/Add.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
