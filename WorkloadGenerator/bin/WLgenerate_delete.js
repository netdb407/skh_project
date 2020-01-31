var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
var dir = './Benchmarking/YCSB/workloads/';
var deleteFiles = {};
program
  .command('generate-wl')




program.parse(process.argv)


  const questions = [
    {
    type : 'list',
    name : 'dfn',
    message : '삭제할 파일 이름을 입력하세요',
    choices : []
    }
  ];
  const filelist = fs.readdirSync(dir);
  questions[0].choices = filelist;

  async function main(){
  const answer = await inquirer.prompt(questions)
  if(answer){
    fs.unlinkSync(dir+answer.dfn);
      console.log('파일이 삭제되었습니다.');
  }
}

module.exports.main = main;
