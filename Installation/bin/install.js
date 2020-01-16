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
    CheckHaveArg(opt.package);
  })

program.parse(process.argv)



function CheckHaveArg(arg){
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
    console.log(arg, '는 설치되지 않았습니다.','\n',arg,'를 설치합니다.');
    installPackage(arg);
    console.log(arg, ' 설치완료');
  }
}



// function CheckHaveArg(arg){
//   const stdout = exec(`rpm -qa|grep ${arg}`);
//   if(stdout != null){
//     console.log(arg, '는 이미 존재하는 패키지입니다.', '\n버전을 확인합니다.');
//     versionCheck(arg);
//   }
//   else if(stdout == null){
//     console.log(arg, '는 설치되지 않았습니다.', '\n', arg, '를 설치합니다.');
//     installPackage(arg);
//     console.log(arg, ' 설치완료');
//   }
//
//
//   try {
//     const stdout = exec(`rpm -qa|grep ${arg}`);
//     if(stdout != null){
//       console.log(arg, '는 이미 존재하는 패키지입니다.', '\n버전을 확인합니다.');
//       versionCheck(arg);
//     }
//   } catch (err) {
//     err.stdout;
//     err.stderr;
//     err.pid;
//     err.signal;
//     err.status;
//     console.log(arg, '는 설치되지 않았습니다.', '\n', arg, '를 설치합니다.');
//     installPackage(arg);
//     console.log(arg, ' 설치완료');
//
//       // etc
//   }
//
//
// }



//
// function CheckHaveArg(arg){
//   const child = execFile(arg, (err, stdout, stderr) => {
//     console.log('err : ', err);
//     console.log('stdout :', stdout);
//     console.log('stderr :', stderr);
//     console.log('설치되어있으면 err은 null', err == null);
//
//     if(err != null){
//       console.log(arg, '는 설치되지 않았습니다.', '\n', arg, '를 설치합니다.');
//       installPackage(arg);
//       console.log(arg, ' 설치완료');
//       // versionCheck(arg);
//     }
//     else if(err == null){
//       console.log(arg, '는 이미 존재하는 패키지입니다.', '\n버전을 확인합니다.');
//       versionCheck(arg);
//     }
//   })




  //maven : -v, --version
  //java : -version
  //git : --version (설치되어있을 시 버전정보 stdout으로 빠짐)
  //python : -V
  //sshpass : -V
function versionCheck(arg){
  if(arg == 'git'||'maven'){
    const child = execFile(arg, ['--version'], (err, stdout, stderr) => {
      // console.log('err : ', err);
      // console.log('stdout :', stdout);
      // console.log('stderr :', stderr);
      var version = arg == 'git'? property.get_gitVersion() : property.get_mavenVersion()
      console.log('버전일치여부 : ', stdout.includes(version));
      //버전 일치
      if(stdout.includes(version)){
        console.log('버전이 일치합니다.');
      }
      //버전 불일치
      else{
        console.log('버전이 일치하지 않아 기존', arg,'를 삭제합니다.');
        deletePackage(arg);
        console.log(arg, ' 삭제완료', '\n새로운 버전의', arg, '를 설치합니다.');
        installPackage(arg);
        console.log(arg, ' 설치완료');
      }
    })
  }

  else if(arg == 'python'||'sshpass'){
    // console.log('err : ', err);
    // console.log('stdout :', stdout);
    // console.log('stderr :', stderr);
    const child = execFile(arg, ['-V'], (err, stdout, stderr) => {
      var version = arg == 'python'? property.get_pythonVersion() : property.get_sshpassVersion()
      //버전 일치
      if(stderr.includes(version)){
        console.log('버전이 일치합니다.');
      }
      //버전 불일치
      else{
        console.log('버전이 일치하지 않아 기존', arg,'를 삭제합니다.');
        deletePackage(arg);
        console.log(arg, ' 삭제완료', '\n새로운 버전의', arg, '를 설치합니다.');
        // console.log('새로운 버전의 ', arg, '를 설치합니다.');
        installPackage(arg);
        console.log(arg, ' 설치완료');
      }
    })
  }

  else if(arg == 'java'){
    const child = execFile(arg, ['-version'], (err, stdout, stderr) => {
      var version = property.get_javaVersion()
      //버전 일치
      if(stderr.includes(version)){
        console.log('버전이 일치합니다.');
      }
      //버전 불일치
      else{
        console.log('버전이 일치하지 않아 기존', arg,'를 삭제합니다.');
        deletePackage(arg);
        console.log(arg, ' 삭제완료', '\n새로운 버전의', arg, '를 설치합니다.');
        installPackage(arg);
        console.log(arg, ' 설치완료');
      }
     })
    }

  else{
    console.log(arg, '는 없는 패키지입니다.');
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
