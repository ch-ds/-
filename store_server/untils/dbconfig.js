const mysql = require('mysql')
module.exports = {
  // 数据库配置
  config: {
    host: 'localhost',
    prot: '3306',
    user: 'root',
    password: 'root',
    database: 'store',
  },
  // 连接池
  sqlConnect(sql, sqlArr=[], callback) {
    let pool = mysql.createPool(this.config)
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('连接失败')
        // callback(err,null,null);
      } else {
        // 事件驱动回调
        conn.query(sql, sqlArr, callback)
        // 释放连接
        pool.releaseConnection(conn)
      }
    })
  },
  // promise回调函数
  sySqlConnect(sql, sqlArr=[]) {
    return new Promise((resolve, reject) => {
      let pool = mysql.createPool(this.config)
      pool.getConnection((err, conn) => {
        if (err) {
          reject(err)
        } else {
          // 事件驱动回调
          conn.query(sql, sqlArr, (err,data) => {
            if(err){
              reject(err)
            }else {
              resolve(data)
            }
          })
          // 释放连接
          pool.releaseConnection(conn)
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  },
}
