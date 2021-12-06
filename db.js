const userHomeDir = require("os").homedir(); //系统默认的 home目录
const homeDir = process.env.HOME || userHomeDir //process.env.HOME 系统变量中设置的home目录
const p = require('path')
const dbPath = p.join(homeDir, '.todo') //数据存储入径
const fs = require('fs')


const db = {
  read(path = dbPath) {
    //读取或者创建文件 a+ 可以读写的功能 有error跟data两个回调
    return new Promise((resolve, reject) => { //由于里面是异步的函数 只能用Promise 获取返回值
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if (error) { return reject(error) }
          //初始化
          let list
          try {// 如果有数据
            list = JSON.parse(data.toString())
          } catch (error2) {// 如果没有数据
            list = []
          }
          resolve(list)


      })
    })

  },
  write(props, path = dbPath) {

    return new Promise(((resolve, reject) => {
        const string = JSON.stringify(props)
        fs.writeFile(path, string + '\n', (error) => { //写数据 只有error回调
          if (error) { return reject(error) }
          resolve()

        })
      }
    ))
  }


}
module.exports = db