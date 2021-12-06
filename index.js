const db = require("./db");
const inquirer = require('inquirer')

module.exports.add = async (props)=>{  //异步用async await 来得到数据
  const list = await db.read()
  list.push({title:props,done:false})
  await db.write(list)

}

module.exports.clear =async ()=>{
  await db.write([])
}

function markASDone(list,index){
  list[index].done = true
  db.write(list)
}

function markASUndone (list,index){
  list[index].done = false
  db.write(list)
}

function updateTitle(list,index){
  inquirer.prompt(
    {
      type: 'input',
      name: 'title',
      message: "新的任务名",
      default:list[index].title //旧的任务名
    }
  ).then((answers) => {
    list[index].title =answers.title
    db.write(list)
  });
}

function remove(list,index){
  list.splice(index,1)
  db.write(list)
}

function askForAction(list,index){
    const actions={markASDone,markASUndone,updateTitle,remove}
  inquirer
    .prompt(
      {
        type:'list',
        name:'action',
        message:'请选择你的操作',
        choices:[
          {name:'退出',value:'quit'},
          {name: '标记为完成',value: 'markASDone'},
          {name: '标记为未完成',value: 'markASUndone'},
          {name: '更改任务名',value: 'updateTitle'},
          {name:'删除',value: 'remove'}
        ]
      }
    ).then(answer2 =>{
   const action =actions[answer2.action]
    action && action(list,index)
  })
}

function askForCreatTask(list){
  inquirer.prompt(
    {
      type: 'input',
      name: 'title',
      message: "新的任务名",
    }
  ).then((answers) => {
    list.push({
      title:answers.title,
      done:false
    })
    db.write(list)
  })
}

function printTask(list) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '请选择你要操作的任务',
        choices: [{name:'退出',value:'-1'},...list.map((task,index)=>{
          return {name:`${task.done ? '[X]' : '[_]'} ${index + 1} - ${task.title}`,value:index.toString()}
        }),{name:'+添加任务',value: '-2'}]
      },
    ])
    .then((answer) => {
      const index = parseInt(answer.index)
      if(index >= 0){
        askForAction(list,index)
      }else if(index === -2){
        //添加一个任务
        askForCreatTask(list)
      }
    });
}

module.exports.showAll =async ()=>{
  //读取之前的任务
  const list = await db.read()
  //打印之前的任务
  printTask(list)
}

