#!/usr/bin/env node

const program = require('commander');
const api = require('./index.js')
const pkg =require('./package.json')
program
  .version(pkg.version)
  .option('-x, --x', 'what is the x') // 可以使用命令node cli -x
program
  .command('add')
  .description('add a task')
  .action((... args) => { // 可以使用子命令 node cli add example（参数）
    const words =args.slice(0,-1).join(' ')
    api.add(words).then(()=>{console.log('添加成功')},()=>{console.log('添加失败');})
  });
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(()=>{console.log('清除成功')},()=>{console.log('清除失败');})
  });

program.parse(process.argv);


if(process.argv.length === 2){
  void api.showAll()
}

