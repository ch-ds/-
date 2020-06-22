const express = require('express')
const cateController = require('../controllers/cateController')

const router = express.Router()

// 获取 树形 商品分类
router.get('/cate',cateController.getTreeCate)
router.get('/cate/cascader',cateController.getCascaderCate)
// 根据 id 删除商品分类
router.delete('/cate/:cate_id',cateController.deleteCateById)
// 根据 id 修改商品信息
router.put('/cate/:cate_id',cateController.updateCateById)
// 添加商品分类
router.post('/cate',cateController.addCate)


module.exports = router
