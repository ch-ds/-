const express = require('express')
const loginController = require('../controllers/loginController')

const router = express.Router()

// 模糊查询用户接口
router.get('/users',loginController.fuzzyUsersByUserame)
// 修改 status 状态码接口
router.put('/users/:id/status',loginController.updateStatusById)
// 登录接口
router.post('/login',loginController.login)
// 添加用户接口
router.post('/users',loginController.addUsers)
// 更新用户信息接口
router.put('/users/:id',loginController.updateUsersById)
// 删除用户接口
router.delete('/users/:id',loginController.deleteUsersById)
// 查询用户个人信息
router.get('/users/:id',loginController.getUsersById)
// 修改 用户角色名称 接口
router.put('/users/:id/role', loginController.updateRoleIdByUserId)

module.exports = router
