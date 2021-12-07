
const fs = jest.createMockFromModule('fs'); //声明这是一个jest假模块
const _fs =jest.requireActual('fs')   // 真正的fs

Object.assign(fs,_fs)  //将右边_fs，全部复制到fs

//读
let readMocks ={}

fs.setReadFileMock=(path, error, data)=>{
    readMocks[path]=[error,data]
}
fs.readFile =(path,options,callback)=>{ //给真正的_fs.readFile包装一层假的fs.readFile
  if(callback === undefined){ //只传两个参数的时候
    callback = options
  }
  if(path in readMocks){//如果路径存在在mocks中
     callback(...readMocks[path])  //将对应路径的 error,data callback 出去
  }else {//如果不在
    _fs.readFile(path,options,callback)
  }

}

//写
let writeMocks={}
fs.setWriteFileMock=(file,fn)=>{
  writeMocks[file] = fn
}
fs.writeFile=(file,data,options,callback)=>{
  if(file in writeMocks){
     writeMocks[file](file,data,options,callback)
  }else {
    _fs.writeFile(file,data,options,callback)
  }
}

//清除数据
fs.clearMock =()=>{
  readMocks ={}
  writeMocks ={}
}

module.exports = fs