var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const installDir = property.get_server_install_dir()
const fileDir = property.get_server_file_dir()

var dir = installDir+fileDir;program
  .command('generate-wl')




program.parse(process.argv)


  const questions = [
    {
    type : 'list',
    name : 'dfn',
    message : 'Please select a file name to delete.',
    choices : []
    }
  ];
  const filelist = fs.readdirSync(dir);
  questions[0].choices = filelist;

  async function main(){
  const answer = await inquirer.prompt(questions)
  if(answer){
    fs.unlinkSync(dir+answer.dfn);
      console.log('File has been deleted.');
  }
}

module.exports.main = main;
