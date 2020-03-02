var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const ycsbDir = property.get_server_ycsb_dir()
const wlfileDir = property.get_server_wlfile_dir()

var dir = ycsbDir+"/"+wlfileDir+"/";
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
