const dbConfig = require('../untils/dbconfig')

// 根据 user_id 获取 role_id
getRoleIdByUserId = async (user_id) => {
  let sql = `SELECT role_id FROM users_roles WHERE user_id = ?`
  let sqlArr = [user_id]
  let data = await dbConfig.sySqlConnect(sql, sqlArr)
  return data[0].role_id
}
getRoleIdByUserId(1)

module.exports = {
  getRoleIdByUserId
}