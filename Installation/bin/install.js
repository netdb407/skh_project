#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const progress = require('cli-progress');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js');
const cmds = require('../lib/cmds.js');


let ip;
let installDir;
let password     = property.get_password();
let rpmDirOrigin = property.get_rpm_dir_origin(); //프로젝트 폴더 rpm
let rpmDir       = property.get_rpm_dir(); //root/rpm
let package;
let stdout;
let packageAll;


program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .option('-a, --all', `install all package`)
  .action(function Action(opt){
    if(opt.package && (opt.server || opt.node )){
      ip = [property.get_serverIP()]
      installDir = property.get_server_install_dir(); //root/
      P_option(ip, opt.package)
    }
    if(opt.database){
      ip = property.get_nodeIP().split(',');
      installDir = property.get_node_install_dir(); //root/
    }
    //옵션 뒤에 인자 받는 경우 boolean 값으로 저장됨
    if(opt.all == true){
      ip = property.get_nodeIP().split(',');
      ip.push(property.get_serverIP());
      packageAll = ['sshpass', 'java', 'maven', 'python', 'git']
      //for문 돌면서 ip 배열 값들을 opt.package에 넣고 함수 호출
      //이중 for문? ㅡㅡ아닌데
      //패키지만 배열이면 되지않나

      //sshpass는 192만 까는건데?;;
      ip.forEach((i) => {
        packageAll.forEach((pck) => {
          P_option(i, pck)
        })
      })
      P_option(ip, opt.package)
    }
 })

program.parse(process.argv)





 function P_option (ip, package ){
   ip.forEach((i) => {
     console.log('-----------------------------------');
     console.log(chalk.green.bold('[INFO]'),'IP address is', i);
       try{
         exec(`rpm -qa|grep sshpass`)
       }
       catch{
         //sshpass가 없을때 (최초 설치)
         exec(`${cmds.installCmd} ${rpmDirOrigin}${cmds.sshpassFile}`)
         console.log(chalk.green.bold('[INFO]'), 'install sshpass to server Complete!');
       }
       if(package == 'maven'){
         makeMavenHome(i)
         return 0;
       }else{
         exec(`sshpass -p ${password} scp -r ${rpmDirOrigin}/${package} root@${i}:${installDir}`)
         console.log(chalk.green.bold('[INFO]'), 'Sending rpm file to',i,'complete! Ready to install other package.');
         isInstalledPkg(i, opt, rpmDir);
       }
   })



function makeMavenHome(i){
  exec(`sshpass -p ${password} scp /etc/profile root@${i}:${installDir}`)
  console.log(chalk.green.bold('[INFO]'), 'Sending /etc/profile to', i);
  exec(`sshpass -p ${password} ssh root@${i} cat ${installDir}profile > /etc/profile`)
  console.log(chalk.green.bold('[INFO]'), 'Ready to use Maven.');
}



function isInstalledPkg(i, opt, rpmDir){
  switch(opt.package){
    case 'git' :
      package = cmds.git;
      break;
    case 'java' :
      package = cmds.java;
      break;
    case 'sshpass' :
      package = cmds.sshpass;
      break;
    case 'python' :
      package = cmds.python;
      break;
    case 'maven' :
      package = cmds.maven;
      break;
    default :
      console.log(chalk.red.bold('[ERROR]'), opt.package,'is cannot be installed. Try again other package.');
      exec(`exit`)
      return 0;
  }
  try{
    stdout = exec(`sshpass -p ${password} ssh root@${i} "rpm -qa|grep ${package}"`)
    if(stdout!=null && opt.package != 'sshpass'){
      //sshpass가 이미 있는데 설치하라는 명령어가 들어오면 여기 지나가지 않음. 메인액션에서 끝남
      console.log(chalk.green.bold('[INFO]'),opt.package, 'is already installed.');
      console.log(chalk.green.bold('[INFO]'), 'Check the version is matching or not');
      versionCheck(i, opt, rpmDir);
    }
  }
  catch{
    //에러가 있으면 설치되지 않은 것. 명령어가 안먹음
    console.log(chalk.green.bold('[INFO]'), opt.package, 'is not installed');
    console.log(chalk.green.bold('[INFO]'), 'Install', opt.package);
    installPackage(i, opt, rpmDir);
  }
}




function versionCheck(i, opt, rpmDir){
  console.log(chalk.green.bold('[INFO]'), 'Start version check');
    switch(opt.package){
      case 'git' :
        var version = property.get_gitVersion()
        break;
      case 'maven' :
        var version = property.get_mavenVersion()
        break;
      case 'python' :
        var version = property.get_pythonVersion()
        break;
      case 'sshpass' :
        var version = property.get_sshpassVersion()
        break;
      case 'java' :
        var version = property.get_javaVersion()
        break;
    }
    stdout = exec(`sshpass -p ${password} ssh root@${i} "rpm -qa|grep ${package}"`).toString();
    if(stdout.includes(version)==true){
      console.log(chalk.green.bold('[INFO]'), 'Version is matched. Exit.');
      exec(`exit`)
    }else if(stdout.includes(version)==false){
      console.log(chalk.green.bold('[INFO]'), 'Version is not matched. Delete', opt.package);
      deletePackage(i, opt);
      console.log(chalk.green.bold('[INFO]'), 'Install new version of', opt.package);
      installPackage(i, opt, rpmDir);
    }
  }



  function installPackage(i, opt, rpmDir){
     exec(`sshpass -p ${password} ssh root@${i} ${cmds.installCmd} ${rpmDir}${opt.package}/*`)
     console.log(chalk.green.bold('[INFO]'), opt.package, 'Installation complete!');
     exec(`rm -rf rpm`)
     console.log('rpm 폴더 삭제');
     exec(`exit`)
   }



 function deletePackage(i, opt){
   switch(opt.package){
     case 'java' :
       package = cmds.java
       break;
     case 'python' :
       package = cmds.python
       break;
     case 'git' :
       package = cmds.git
       break;
     case 'maven' :
       package = cmds.maven
       break;
     case 'sshpass' :
       package = cmds.sshpass
       break;
     }
    if(opt.package == 'java'||'maven'){
      exec(`sshpass -p ${password} ssh root@${i} ${cmds.yumDeleteCmd} ${package}*`)
    }else{
      exec(`sshpass -p ${password} ssh root@${i} ${cmds.deleteCmd} ${package}`)
    }
    console.log(chalk.green.bold('[INFO]'), opt.package, 'Deletion complete!');
    exec(`exit`)
  }


  function installAll(){
    console.log('install all package~');
  }
