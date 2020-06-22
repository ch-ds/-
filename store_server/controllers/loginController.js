const dbConfig = require('../untils/dbconfig')

// 用户登录
login = (req, res) => {
  let { username, password } = req.body
  let sql = 'select * from users where username = ? and password = ?'
  let sqlArr = [username, password]
  dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
    if (err) {
      res.send({
        msg: 'sql语句出错',
        status: 400,
      })
    } else if (data == '') {
      res.send({
        msg: '用户名或密码错误',
        status: 400,
        data: [],
      })
    } else {
      res.send({
        msg: '登录成功',
        status: 200,
        data,
      })
    }
  })
}

// 根据 id 修改 status 值
updateStatusById = (req, res) => {
  let { id } = req.params
  let { status } = req.body
  let sql = `update users set status = ? where id = ?`
  let sqlArr = [status, id]
  dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
    if (err) {
      res.send({
        meta: {
          msg: '更新失败',
          status: 400,
        },
      })
    } else {
      res.send({
        meta: {
          msg: '更新成功',
          status: 200,
        },
      })
    }
  })
}

// 根据名字 模糊查询 users 表的数据
fuzzyUsersByUserame = async (req, res) => {
  let { username = '', page, size } = req.query
  // 转为 整型
  page = parseInt(page)
  size = parseInt(size)
  let sql = 'SELECT * FROM users WHERE username LIKE ? LIMIT ?,?'
  let sqlArr = ['%' + username + '%', (page - 1) * size, size]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  // 获取 角色名
  for (let value of data) {
    let roleId = await getRoleIdByUserId(value.id)
    let roleName = await getRoleNameByRoleId(roleId)
    value.roleName = roleName
  }
  // 获取 users表 总数
  let total = await getUsersTotal(username)
  res.send({
    msg: '查询成功',
    status: 200,
    total,
    data,
  })
}

// 添加用户
addUsers = async (req, res) => {
  let { username, password, email, phone } = req.body
  let sql = 'INSERT INTO users (username,password,email,phone) value(?,?,?,?)'
  let sqlArr = [username, password, email, phone]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  // 同时往users_roles表中插入数据
  let count = await addRoleIdByUserId(data.insertId)
  if (data.affectedRows == 1 && count == 1) {
    res.send({
      msg: '添加用户成功',
      status: 200,
      data,
    })
  } else {
    res.send({
      msg: '添加用户失败',
      status: 400,
      data,
    })
  }
}

// 根据 id 删除用户
deleteUsersById = async (req, res) => {
  let { id } = req.params
  let sql = `DELETE FROM users WHERE id = ?`
  let sqlArr = [id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows == 1) {
    res.send({
      msg: '删除用户成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除用户失败',
      status: 400,
    })
  }
}

// 根据 id 修改用户手机号和邮箱
updateUsersById = async (req, res) => {
  let { id } = req.params
  let { email, phone } = req.body
  let sql = `UPDATE users SET email = ?,phone = ? WHERE id = ?`
  let sqlArr = [email, phone, id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows == 1) {
    res.send({
      msg: '更新用户信息成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '更新用户信息失败',
      status: 400,
    })
  }
}

// 根据 id 查询用户信息
getUsersById = async (req, res) => {
  let { id } = req.params
  let sql = `select * from users where id = ?`
  let sqlArr = [id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.length == 1) {
    res.send({
      msg: '查询用户个人信息成功',
      status: 200,
      data,
    })
  } else {
    res.send({
      msg: '查询用户个人信息失败',
      status: 400,
    })
  }
}

// 根据 user_id 修改 role_id
updateRoleIdByUserId = async (req, res) => {
  let { id: user_id } = req.params
  let { role_id } = req.body
  let sql = `UPDATE users_roles SET role_id = ? WHERE user_id = ?`
  let sqlArr = [role_id, user_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows == 1) {
    res.send({
      msg: '修改用户角色名称成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '修改用户角色名称失败',
      status: 400,
    })
  }
}

// --------------------封装方法-------------------------
// 查询总数
let getUsersTotal = async (username = '') => {
  let sql = `SELECT COUNT(*) as count FROM users WHERE username LIKE ?`
  let sqlArr = ['%' + username + '%']
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data[0].count
}
// 根据 user_id 获取 角色名字
let getRoleIdByUserId = async (user_id) => {
  // 获取 权限id
  let sql = `SELECT role_id FROM users_roles WHERE user_id = ?`
  let sqlArr = [user_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data[0].role_id
}

// 根据 role_id 获取角色名称
let getRoleNameByRoleId = async (role_id) => {
  let sql = `SELECT r_name FROM roles WHERE r_id = ?`
  let sqlArr = [role_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data[0].r_name
}

// 根据 user_id 插入 默认role_id 进入users_roles表
let addRoleIdByUserId = async (user_id) => {
  // 获取刚插入数值的自增id
  let sql = `INSERT INTO users_roles (user_id) value(?)`
  let sqlArr = [user_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data.affectedRows
}

module.exports = {
  login,
  updateStatusById,
  fuzzyUsersByUserame,
  addUsers,
  deleteUsersById,
  updateUsersById,
  getUsersById,
  updateRoleIdByUserId,
}
