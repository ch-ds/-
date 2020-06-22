const dbConfig = require('../untils/dbconfig')

// 根据 商品名称 模糊查询 商品分页数据
getGoodsList = async (req, res) => {
  // 获取 商品名称,页数,每页条数
  let { g_name = '', page, size } = req.query
  page = parseInt(page)
  size = parseInt(size)
  console.log('%' + g_name + '%', (page - 1) * size, size)
  let sql = `SELECT g_id,g_name,g_price,g_number, DATE_FORMAT(g_createTime, '%Y-%m-%d %H:%i:%S') AS g_createTime FROM goods WHERE g_name LIKE ? LIMIT ?,?`
  let sqlArr = [`%${g_name}%`, (page - 1) * size, size]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  // 根据 商品名称查询总数
  let total = await getGoodsTotal(g_name)
  res.send({
    msg: '查询商品成功',
    status: 200,
    data,
    total,
  })
}

// 根据 商品id 修改商品信息
updateGoodsById = async (req, res) => {
  // 获取 修改商品id值
  let { g_id } = req.params
  // 获取 修改商品的信息
  let { g_name, g_price, g_number } = req.body
  let sql = `UPDATE goods SET g_name = ?, g_price = ?, g_number = ? WHERE g_id = ? `
  let sqlArr = [g_name, g_price, g_number, g_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '修改商品信息成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '修改商品信息失败',
      status: 400,
    })
  }
}

// 根据 商品id 删除商品信息
deleteGoodsById = async (req, res) => {
  let { g_id } = req.params
  let sql = `DELETE FROM goods WHERE g_id = ?`
  let sqlArr = [g_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '删除商品成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除商品失败',
      status: 400,
    })
  }
}

// 根据 商品id 查询商品详情
getGoodsById = async (req,res) => {
  let {g_id} = req.params
  let sql = `SELECT * FROM goods WHERE g_id = ?`
  let sqlArr = [g_id]
  let data = await dbConfig.sySqlConnect(sql,sqlArr)
  res.send({
    status:200,
    msg:'获取信息详情成功',
    data
  })
}

// 添加商品
addGoods = async (req,res) => {
  let {g_name,g_price,g_number} = req.body
  let sql = `INSERT INTO goods (g_name,g_price,g_number) VALUE (?,?,?)`
  let sqlArr = [g_name,g_price,g_number]
  let data = await dbConfig.sySqlConnect(sql,sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '添加商品成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '添加商品失败',
      status: 400,
    })
  }
}

// 根据 商品名称查询总数
let getGoodsTotal = async (g_name = '') => {
  let sql = `SELECT count(*) as total FROM goods WHERE g_name LIKE ?`
  let sqlArr = [`%${g_name}%`]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data[0].total
}



module.exports = {
  getGoodsList,
  updateGoodsById,
  deleteGoodsById,
  getGoodsById,
  addGoods
}
