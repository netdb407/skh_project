var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const ycsbDir = property.get_server_ycsb_dir()
const wlfileDir = property.get_server_wlfile_dir()
var updateFiles = require('./WLgenerate_update.js');

var dir = ycsbDir+"/"+wlfileDir+"/";
program
  .command('generate-wl')




program.parse(process.argv)


  const questions = [
    {
    type : 'list',
    name : 'dfn',
    message : '확인하고 싶은 파일을 선택하세요.',
    choices : []
    }
  ];
  const filelist = fs.readdirSync(dir);
  questions[0].choices = filelist;

  async function main3(){
  const answer = await inquirer.prompt(questions);
  if(answer){
    fs.readFile(dir+answer.dfn,'utf-8',(err,data)=>{
      if(err){
        console.log(err);
      }
      console.log(data);
      inquirer.prompt([{
        type : 'confirm',
        name : 'updateQ',
        message : '수정하시겠습니까?',
        default : false
        }
      ]).then(answers =>{
        if(answers.updateQ === true){
          updateFiles.main2();
        }
      });
    });
  }
}

module.exports.main3 = main3;
