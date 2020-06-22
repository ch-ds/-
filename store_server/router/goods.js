const express = require('express')
const goodsController = require('../controllers/goodsController')

const router = express.Router()

// 根据 商品名称 模糊查询 商品分页数据
router.get('/goods', goodsController.getGoodsList)
// 根据 商品id 修改商品信息
router.put('/goods/:g_id', goodsController.updateGoodsById)
// 根据 商品id 删除商品信息
router.delete('/goods/:g_id', goodsController.deleteGoodsById)
// 根据 商品id 获取商品详情
router.get('/goods/:g_id', goodsController.getGoodsById)
// 添加商品
router.post('/goods', goodsController.addGoods)

module.exports = router
