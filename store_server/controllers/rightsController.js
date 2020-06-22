const dbConfig = require('../untils/dbconfig')

// 查找所有的权限
getRights = async (req, res) => {
  let sql = 'SELECT * FROM rights'
  let data = await dbConfig.sySqlConnect(sql)
  res.send({
    msg: '查找所有权限成功',
    status: 200,
    data
  })
}

// 查找所有的权限 以 Tree 形式返回
getRightsByTree = async (req, res) => {
  let sql = 'SELECT * FROM rights'
  let data = await dbConfig.sySqlConnect(sql)

  let maxLeave = await getMaxLeave()
  data.forEach((item) => {
    if (item.p_leave !== maxLeave) item.children = []
  })
  data = getTreeRights(data, maxLeave)
  res.send({
    msg: '查找所有权限成功',
    status: 200,
    data
  })
}

// 将子类数据添加到对应数据的 children 属性中
let getTreeRights = (data, p_leave) => {
  for (let i = 0; i < data.length; i++) {
    // 查找所有 item.p_leave === p_leave 的数据
    if (data[i].p_leave === p_leave) {
      // 得到他们的 p_pid
      let p_pid = data[i].p_pid
      // 往 data 数据里的 p_pid 添加children属性
      let res = data.filter((subItem) => subItem.p_id === p_pid)
      res[0].children.push(data[i])
      data.splice(i, 1)
      i--
    }
  }
  if (p_leave !== 1) {
    getTreeRights(data, p_leave - 1)
  }
  return data
}

// 查找 rights 表中 p_leave 最大值
let getMaxLeave = async () => {
  let sql = `SELECT max(p_leave) as maxLeave FROM rights`
  let data = await dbConfig.sySqlConnect(sql)
  return data[0].maxLeave
}



module.exports = {
  getRights,
  getRightsByTree
}
