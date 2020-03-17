var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
var updateFiles = require('./WLgenerate_update.js');
const installDir = property.get_server_install_dir()
const fileDir = property.get_server_file_dir()

var dir = installDir+fileDir;
program
  .command('generate-wl')




program.parse(process.argv)


  const questions = [
    {
    type : 'list',
    name : 'dfn',
    message : 'Please select the file you want to check.',
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
        message : 'Do you want to modify it?',
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
