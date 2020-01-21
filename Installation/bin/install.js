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
    checkHaveArg(opt);
  })

program.parse(process.argv)



function checkHaveArg(opt){
  // if(opt.server == true){
  //   console.log('?');
  //
  //   console.log(property.get_nodes());
  //   console.log('??');
  // }
  //sshpass로 -s,-n옵션 중 들어온거에 접속해야함
  //옵션 들어온거에 따라 sshpass에 dir을 달리 주고
  //sshpass에는 옵션마다 함수를 만들기

  try {
    const stdout = exec(`rpm -qa|grep ${opt.package}`);
    if(stdout != null){
      console.log('[info]',opt.package, 'is a installed package.', '\nCheck version matching');
      versionCheck(opt);
    }
  } catch (err) {
    err.stdout;
    err.stderr;
    err.pid;
    err.signal;
    err.status;
    console.log('[info]',opt.package, 'is not installed');
    console.log('[info] Install', opt.package);
    installPackage(opt);
    console.log(opt.package, 'complete!');
  }
}




function versionCheck(opt){
  try {
    const stdout = exec(`rpm -qa|grep ${opt.package}`);
    var version
    switch(opt.package){
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
    console.log('[info] Version is not matched. Delete', opt.package);
    deletePackage(opt);
    console.log(opt.package, 'Deletion completed', '\nInstall new version of', opt.package);
    installPackage(opt);
    console.log(opt.package, 'complete!');
  }
}



function installPackage(opt){
  // console.log('dir정보 : ', dir);
  switch(opt.package){
      case 'java' :
        javaAction.javaInstall();
        break;
      case 'sshpass' :
        sshpassAction.sshpassInstall(opt.server, opt.node);
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
        console.log('[ERROR]', opt.package,'is cannot be installed');
        break;
     }
 }

 function deletePackage(opt){
   switch(opt.package){
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
      console.log('[ERROR]', opt.package,'is cannot be installed.');
      break;
   }
 }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
