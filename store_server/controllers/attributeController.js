const dbConfig = require('../untils/dbconfig')

// 根据 cate_id、attr_sel 获取对应的属性
getAttrById = async (req, res) => {
  let { cate_id, attr_sel } = req.params
  let sql = `SELECT * FROM attribute WHERE cate_id = ? and attr_sel = ?`
  let sqlArr = [cate_id, attr_sel]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  // 对获取到的 attr_value 提取出来为数组
  data.forEach((item) => {
    if (item.attr_value === null) {
      item.attr_value = []
    } else {
      item.attr_value = item.attr_value.split(',')
    }
  })
  res.send({
    msg: '获取属性成功',
    status: 200,
    data,
  })
}

// 根据 attr_id 修改 attr_value
updateAttrValueById = async (req, res) => {
  let { attr_id } = req.params
  let { attr_value } = req.body
  let sql = `UPDATE attribute SET attr_value = ? WHERE attr_id = ?`
  let sqlArr = [attr_value, attr_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '删除属性成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除属性失败',
      status: 400,
    })
  }
}

// 根据 cate_id,属性类型 添加属性
addAttrBySel = async (req, res) => {
  let { cate_id, attr_sel, attr_name } = req.body
  let sql = `INSERT INTO attribute (attr_sel,attr_name,cate_id) VALUE (?,?,?)`
  let sqlArr = [attr_sel, attr_name, cate_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '添加属性成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '添加属性失败',
      status: 400,
    })
  }
}

// 根据 attr_id 修改 attr_name
updateAttrNameById = async (req, res) => {
  let { attr_id } = req.params
  let { attr_name } = req.body
  console.log(attr_id, attr_name)
  let sql = `UPDATE attribute SET attr_name = ? WHERE attr_id = ?`
  let sqlArr = [attr_name, attr_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '修改属性成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '修改属性失败',
      status: 400,
    })
  }
}

// 根据 attr_id 删除属性
deleteAttrById = async (req, res) => {
  let { attr_id } = req.params
  let sql = `DELETE FROM attribute WHERE attr_id = ?`
  let sqlArr = [attr_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '删除属性成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除属性失败',
      status: 400,
    })
  }
}

module.exports = {
  getAttrById,
  updateAttrValueById,
  addAttrBySel,
  updateAttrNameById,
  deleteAttrById,
}
