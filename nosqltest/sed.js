const program = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const property = require('../propertiesReader.js')
const PropertiesReader = require('properties-reader');

async function sss(){
  const std = exec(`ssh root@193.255.92.195 ${IO_watch_dir}/orientdb${dirnum[dirnum.length-1]}/bin/dserver.sh &`);
  console.log('--------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'orientdb run : ', chalk.blue.bold(i));
  console.log('--------------------------------------');
}
sss();
