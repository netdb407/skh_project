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
  .option('-s, --server', `server에 설치, -p 옵션에만 적용`)
  .option('-n, --node', `node에 설치, -p 옵션에만 적용`)
  .action(function Action(opt){
    checkHaveArg(opt.package);
  })

program.parse(process.argv)



function checkHaveArg(arg){
  try {
    const stdout = exec(`rpm -qa|grep ${arg}`);
    if(stdout != null){
      console.log(arg, '는 이미 존재하는 패키지입니다.', '\n버전을 확인합니다.');
      versionCheck(arg);
    }
  } catch (err) {
    err.stdout;
    err.stderr;
    err.pid;
    err.signal;
    err.status;
    console.log(arg, '는 설치되지 않았습니다.');
    console.log(arg, '를 설치합니다.');
    installPackage(arg);
    console.log(arg, ' 설치완료');
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
      console.log('버전이 일치합니다.');
    }
  } catch (err) {
    // err.stdout;
    // err.stderr;
    // err.pid;
    // err.signal;
    // err.status;
    console.log('버전이 일치하지 않아 기존', arg,'를 삭제합니다.');
    deletePackage(arg);
    console.log(arg, ' 삭제완료', '\n새로운 버전의', arg, '를 설치합니다.');
    installPackage(arg);
    console.log(arg, ' 설치완료');
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
        console.log('[ERROR]', package,'는 존재하지 않는 패키지입니다.');
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
      console.log('[ERROR]', package,'는 존재하지 않는 패키지입니다.');
      break;
   }
 }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
