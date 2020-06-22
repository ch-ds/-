import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入公共css
import './assets/css/global.css'
// 导入 字体图标
import './assets/fonts/iconfont.css'

// 导入axios
import axios from 'axios'
// 导入 tree-table 树形表格
import TreeTable from 'vue-table-with-tree-grid'

// 配置 axios 的请求根路径
axios.defaults.baseURL = 'http://localhost:11111'
Vue.prototype.$http = axios

// 注册 tree-table 的依赖
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
