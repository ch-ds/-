const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// 导入router
const loginRouter = require('./router/login')
const roleRouter = require('./router/role')
const rightsRouter = require('./router/rights')
const goodsRouter = require('./router/goods')
const cateRouter = require('./router/cate')
const attributeRouter = require('./router/attribute')

const app = express()

// 设置跨域请求
app.all('*', (req,res,next) => {
  // 设置允许跨域的域名， *代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin','*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers','content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods','DELETE,PUT,POST,GET,OPTIONS')
  if(req.method.toLowerCase == 'options')
    res.send(200)
  else
    next()
})

app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
)
// 配置 body-parser 插件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 把路由挂在到 app 中
app.use(loginRouter)
app.use(roleRouter)
app.use(rightsRouter)
app.use(goodsRouter)
app.use(cateRouter)
app.use(attributeRouter)

app.listen(11111, function () {
  console.log('running......localhost:11111')
})
