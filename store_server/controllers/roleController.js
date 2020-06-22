const dbConfig = require('../untils/dbconfig')

// 查询所有 roleName
getRoleName = async (req, res) => {
  let sql = `SELECT * FROM roles`
  const data = await dbConfig.sySqlConnect(sql)
  for (let role in data) {
    let pIdArr = await getRightsIdById(data[role].r_id)
    data[role].children = await getRightsById(pIdArr)
  }
  if (data.length === 0) {
    res.send({
      msg: '查询角色名称失败',
      status: 400,
      data,
    })
  } else {
    res.send({
      msg: '查询角色名称成功',
      status: 200,
      data,
    })
  }
}

// 根据 role的id 查询所拥有的权限
getRightsIdByRolesId = async (req, res) => {
  // 获取 r_id
  let { r_id } = req.params
  // 根据 r_id 获取所有的 p_id
  let rightsIdArr = await getRightsIdById(r_id)
  // 获取所有的父级节点
  let pIdArr = await getLeaveById(2)
  rightsIdArr = rightsIdArr.filter((item) => !pIdArr.includes(item))
  res.send({
    status: 200,
    msg: '获取该角色的拥有权限成功',
    data: rightsIdArr,
  })
}

// 添加 角色
addRole = async (req, res) => {
  let { r_name, r_describe = '' } = req.body
  let sql = `INSERT INTO roles (r_name, r_describe) value (?,?)`
  let sqlArr = [r_name, r_describe]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '添加角色成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '添加角色失败',
      status: 400,
    })
  }
}

// 根据 id 修改角色信息
updateRoleById = async (req, res) => {
  let { id } = req.params
  let { r_name, r_describe = '' } = req.body
  let sql = `UPDATE roles SET r_name = ?, r_describe = ? WHERE r_id = ?`
  let sqlArr = [r_name, r_describe, id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '修改角色信息成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '修改角色信息失败',
      status: 400,
    })
  }
}

// 根据 id 删除角色信息
deleteRoleById = async (req, res) => {
  let { id } = req.params
  let sql = `DELETE FROM roles WHERE r_id = ?`
  let sqlArr = [id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      msg: '删除角色成功',
      status: 200,
    })
  } else {
    res.send({
      msg: '删除角色失败',
      status: 400,
    })
  }
}

// 根据 id 修改对应权限
updateRightsByRolesId = async (req, res) => {
  // 获取 r_id 知道要修改权限的是哪个角色
  let { r_id } = req.params
  // 获取 rights_idArr 得到要修改的有哪些权限
  let { pIdArr } = req.body
  // 把所有关于 r_id 的权限删除
  await deleteRolesRightsByRolesId(r_id)
  // 然后再根据 r_id 添加对应的权限
  for (let pId of pIdArr) {
    let flag = await addRolesRights(r_id, pId)
    if (!flag) {
      res.send({
        msg: '修改权限失败,原因是在添加权限时错误',
        status: 200,
      })
    }
  }
  res.send({
    msg: '修改角色权限成功',
    status: 200,
  })
}

// 根据 roles_id 删除 roles_rights 表的数据
deleteRightsById = async (req, res) => {
  let { roles_id } = req.params
  let { rights_id } = req.body
  console.log(roles_id,rights_id)
  let sql = `DELETE FROM roles_rights WHERE roles_id = ? and rights_id = ? `
  let sqlArr = [roles_id, rights_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  if (data.affectedRows === 1) {
    res.send({
      status: 200,
      msg: '删除权限成功',
    })
  } else {
    res.send({
      status: 400,
      msg: '删除权限失败',
    })
  }
}

// 根据 roles_id 删除 roles_rights 的数据
let deleteRolesRightsByRolesId = async (roles_id) => {
  let sql = `DELETE FROM roles_rights WHERE roles_id = ?`
  let sqlArr = [roles_id]
  await dbConfig.sySqlConnect(sql, sqlArr)
}

// 根据 roles_id,rights_id 添加 roles_rights 的数据
let addRolesRights = async (roles_id, rights_id) => {
  let sql = `INSERT INTO roles_rights VALUES (?,?)`
  let sqlArr = [roles_id, rights_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data.affectedRows === 1 ? true : false
}

//根据 roles_id 查找所有相关的 rights_id
let getRightsIdById = async (roles_id) => {
  let sql = `SELECT rights_id FROM roles_rights WHERE roles_id = ?`
  let sqlArr = [roles_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  let rightsIdArr = []
  data.forEach((item) => {
    rightsIdArr.push(item.rights_id)
  })
  return rightsIdArr
}

// 根据 p_leave 查询 p_id
getLeaveById = async (p_leave) => {
  let sql = `SELECT p_id FROM rights WHERE p_leave != ?`
  let sqlArr = [p_leave]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  let pIdArr = []
  data.forEach((item) => {
    pIdArr.push(item.p_id)
  })
  return pIdArr
}

//根据 多个rights_id 查询 rights表 数据
let getRightsById = async (...idArr) => {
  if (idArr[0].length === 0) {
    idArr[0][0] = ''
  }
  let sql = `SELECT * FROM rights WHERE p_id IN (?)`
  let sqlArr = idArr
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  let maxLeave = await getMaxLeave()
  data.forEach((item) => {
    if (item.p_leave !== maxLeave) item.children = []
  })
  data = await getTreeRights(data, maxLeave)
  return data
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
  getRoleName,
  addRole,
  updateRoleById,
  deleteRoleById,
  updateRightsByRolesId,
  getRightsIdByRolesId,
  deleteRightsById,
}
