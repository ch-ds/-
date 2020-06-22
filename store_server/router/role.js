const express = require('express')
const roleController = require('../controllers/roleController')

const router = express.Router()

// 获取 roles 信息接口
router.get('/roles', roleController.getRoleName)
// 添加 roles 接口
router.post('/roles',roleController.addRole)
// 根据 id 修改 roles
router.put('/roles/:id',roleController.updateRoleById)
// 根据 id 删除 roles
router.delete('/roles/:id',roleController.deleteRoleById)
// 根据 id 修改权限
router.put('/roles/:r_id/rights',roleController.updateRightsByRolesId)
// 根据 id 查询权限
router.get('/roles/:r_id/rights',roleController.getRightsIdByRolesId)
// 根据 RightsId 删除权限
router.delete('/roles/:roles_id/rights',roleController.deleteRightsById)



module.exports = router
