const express = require('express')
const attributeController = require('../controllers/attributeController')

const router = express.Router()

// 根据 cate_id 及 attr_sel 获取对应属性
router.get('/attr/:cate_id/:attr_sel', attributeController.getAttrById)
// 根据 attr_id 修改 attr_value 的值
router.put('/attr/:attr_id', attributeController.updateAttrValueById)
// 根据 attr_sel 和 cate_id 添加属性参数
router.post('/attr', attributeController.addAttrBySel)
// 根据 attr_id 修改 attr_name
router.put('/attr/:attr_id/attr_name', attributeController.updateAttrNameById)
// 根据 attr_id 删除属性
router.delete('/attr/:attr_id', attributeController.deleteAttrById)

module.exports = router
