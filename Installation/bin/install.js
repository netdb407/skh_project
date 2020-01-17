#!/usr/bin/env node

const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
const gitAction = require('../lib/git.js')
const mavenAction = require('../lib/maven.js')
const pythonAction = require('../lib/python.js')

program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .action(function Action(opt){
    checkHaveArg(opt.package);
  })

program.parse(process.argv)



function checkHaveArg(arg){
  try {
    const stdout = exec(`rpm -qa|grep ${arg}`);
    if(stdout != null){
      console.log('[info] ',arg, 'is a installed package.', '\nCheck version matching');
      versionCheck(arg);
    }
  } catch (err) {
    err.stdout;
    err.stderr;
    err.pid;
    err.signal;
    err.status;
    console.log('[info] ',arg, ' is not installed');
    console.log('[info] Install ', arg);
    installPackage(arg);
    console.log(arg, ' complete!');
  }
}




function versionCheck(arg){
  try {
    const stdout = exec(`rpm -qa|grep ${arg}`);
    var version
    switch(arg){
      case git :
        version = property.get_gitVersion()
        break;
      case maven :
        version = property.get_mavenVersion()
        break;
      case python :
        version = property.get_pythonVersion()
        break;
      case sshpass :
        version = property.get_sshpassVersion()
        break;
      case java :
        version = property.get_javaVersion()
        break;
    }
    if(stdout.includes(version)){
      console.log('[info] Version is matched');
    }
  } catch (err) {
    // err.stdout;
    // err.stderr;
    // err.pid;
    // err.signal;
    // err.status;
    console.log('[info] Version is not matched. Delete ', arg);
    deletePackage(arg);
    console.log(arg, ' Deletion completed', '\nInstall new version of ', arg);
    installPackage(arg);
    console.log(arg, ' complete!');
  }
}



function installPackage(package){
  // console.log('dir정보 : ', dir);
  switch(package){
      case 'java' :
        javaAction.javaInstall();
        break;
      case 'sshpass' :
        sshpassAction.sshpassInstall();
        break;
      case 'git' :
        gitAction.gitInstall();
       break;
      case 'maven' :
        mavenAction.mavenInstall();
        // mavenAction.mavenDelete();
       break;
      case 'python' :
        pythonAction.pythonInstall();
       break;
      default :
        console.log('[ERROR]', package,' is cannot be installed');
        break;
     }
 }

 function deletePackage(package){
   switch(package){
     case 'java' :
      javaAction.javaDelete();
      break;
     case 'sshpass' :
      sshpassAction.sshpassDelete();
      break;
     case 'git' :
      gitAction.gitDelete();
      break;
     case 'maven' :
      mavenAction.mavenDelete();
      break;
     case 'python' :
      pythonAction.pythonDelete();
      break;
     default :
      console.log('[ERROR]', package,'is cannot be installed.');
      break;
   }
 }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
