const dbConfig = require('../untils/dbconfig')

// 查询所有的商品分类
getTreeCate = async (req, res) => {
  // 获取所有的商品分类
  let sql = `SELECT * FROM cate`
  let data = await dbConfig.sySqlConnect(sql)
  // 获取最大的 cate_leave 值
  let maxLeave = await getMaxLeave()
  // 将 子商品分类 添加到对应的 商品分类的 children属性中
  data.forEach((item) => {
    if (item.cate_leave !== maxLeave) {
      item.children = []
    }
  })
  getTreeCateByLeave(data, maxLeave)
  res.send({
    msg: '获取树形商品成功',
    status: 200,
    data,
  })
}

//
getCascaderCate = async (req, res) => {
  // 获取所有的商品分类
  let sql = `SELECT * FROM cate`
  let data = await dbConfig.sySqlConnect(sql)
  // 获取最大的 cate_leave 值
  let maxLeave = (await getMaxLeave()) - 1
  // 将 子商品分类 添加到对应的 商品分类的 children属性中
  for (let i = 0; i < data.length; i++) {
    if (data[i].cate_leave > maxLeave) {
      data.splice(i, 1)
      i--
      continue
    }
    if (data[i].cate_leave !== maxLeave) {
      data[i].children = []
    }
  }
  getTreeCateByLeave(data, maxLeave)
  res.send({
    msg: '获取树形商品成功',
    status: 200,
    data,
  })
}

// 根据 商品分类id 删除商品分类
deleteCateById = async (req, res) => {
  let { cate_id } = req.params
  let sql = `DELETE FROM cate WHERE cate_id = ?`
  let sqlArr = [cate_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '删除商品分类成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除商品分类失败',
      status: 400,
    })
  }
}

// 根据 商品分类id 修改商品分类信息
updateCateById = async (req, res) => {
  let { cate_id } = req.params
  let { cate_name } = req.body
  let sql = `UPDATE cate SET cate_name = ? WHERE cate_id = ?`
  let sqlArr = [cate_name, cate_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '修改商品分类信息成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '修改商品分类信息失败',
      status: 400,
    })
  }
}

// 添加商品
addCate = async (req, res) => {
  let { cate_name, cate_leave, cate_cid } = req.body
  let sql = `INSERT INTO cate (cate_name,cate_leave,cate_cid) value (?,?,?)`
  let sqlArr = [cate_name, cate_leave, cate_cid]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '添加商品分类成功',
      status: 200,
    })
  }else {
    res.send({
      msg: '添加商品分类失败',
      status: 400,
    })
  }
}

// 递归商品分类,将子类添加到对应的类别中
let getTreeCateByLeave = (data, leave) => {
  // 循环遍历data数组
  for (let i = 0; i < data.length; i++) {
    // 判断是否是最小子目录
    if (data[i].cate_leave === leave) {
      // 是最小子目录,将该数据添加到对应父级目录的children属性中
      // 查找 对应的父级 目录
      let res = data.filter((item) => item.cate_id === data[i].cate_cid)
      // 将 子目录数据 添加到 父目录数据的 children 属性中
      res[0].children.push(data[i])
      // 并删除当前目录
      data.splice(i, 1)
      // 然后将i--,这样不会跳过
      i--
    }
  }
  // 判断是否是最小目录
  if (leave > 2) {
    getTreeCateByLeave(data, leave - 1)
  }
}

// 查找商品的最大leave值,也就是商品的最小的子目录
let getMaxLeave = async () => {
  let sql = `SELECT MAX(cate_leave) AS cate_leave FROM cate`
  let data = await dbConfig.sySqlConnect(sql)
  return data[0].cate_leave
}

module.exports = {
  getTreeCate,
  deleteCateById,
  updateCateById,
  getCascaderCate,
  addCate,
}
