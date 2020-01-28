var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
var dir = './Benchmarking/YCSB/workloads/';

program
  .command('generate-wl')




program.parse(process.argv)

//삭제할 파일명 입력
var question = [
  {
  type : 'input',
  name : 'dfn',
  message : '삭제할 파일 이름을 입력하세요.'
  }
];
//파일 삭제
inquirer.prompt(question).then(answers => {
  fs.unlink(dir+answers.dfn,(err)=>{
    if(err) console.log('존재하지 않는 파일입니다.');
    else console.log('파일이 삭제되었습니다.');
  })
});
