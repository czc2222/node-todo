const db=require('../db.js')
const fs = require('fs');
jest.mock('fs');


describe('db',()=>{
  afterEach(()=>{
    fs.clearMock()
  })
  it('can  read',async ()=>{

    const data =[{title:'hi',done:true}]

    fs.setReadFileMock('/xxx',null,JSON.stringify(data))

    const list = await db.read('/xxx')

    expect(list).toStrictEqual(data) //对象相等 用 toStrictEqual

  })
  it('can write',async ()=>{
    let fakeFile
    fs.setWriteFileMock('/yyy',(file,data,callback)=>{
      fakeFile = data
      callback(null)
    })
    const list =[{title:'买可乐',done:true},{title: '买矿泉水',done: true}]
    await db.write(list,'/yyy')
    expect(fakeFile).toBe(JSON.stringify(list)+'\n')
  })
})