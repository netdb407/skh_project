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
const cmds = require('../lib/cmds.js')

program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .action(function Action(opt){
    let ip;
    let installDir;
    let password     = property.get_password();
    let rpmDirOrigin = property.get_rpm_dir_origin(); //프로젝트 폴더 rpm
    let rpmDir       = property.get_rpm_dir(); //root/rpm

    if(opt.server == true){
      ip = [property.get_serverIP()]
      installDir = property.get_server_install_dir(); //root/
    }else if(opt.node == true){
      ip = property.get_nodeIP().split(',');
      installDir = property.get_node_install_dir(); //root/
    }

    ip.forEach((i) => {
      console.log('-----------------------------------\n[info] IP address is', i);
        try{
          exec(`rpm -qa|grep sshpass`)
        }
        catch{
          //sshpass가 없을때 (최초 설치)
          exec(`${cmds.installCmd} ${rpmDirOrigin}${cmds.sshpassFile}`)
          console.log('[info] install sshpass to server Complete!');
        }
        exec(`sshpass -p ${password} scp -r ${rpmDirOrigin} root@${i}:${installDir}`)
        console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
        isInstalledPkg(opt, rpmDir);
      })
    })

program.parse(process.argv)



function isInstalledPkg(opt, rpmDir){
  let package;
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
      console.log('[ERROR]', opt.package,'is cannot be installed. Try again other package.');
      return 0;
  }
  try{
    console.log('왜이상한데로 빠지냐고', package);
    exec(`rpm -qa|grep ${package}`)
    //다른 파일 중에 git 결과 나오네;;git-core여야하는데
    //입력이 git으로 들어오니까 rpm -qa|grep git 하는데 이러면 git-core가 없어도 에러가 나지 않음;;;;어케
    //입력된거랑 파일명 일치하게 바꿔주자
    //switch문 돌리기


    console.log('없는데 에러 안나?');
    if(opt.package != 'sshpass'){
      //sshpass가 이미 있는데 설치하라는 명령어가 들어오면 여기 지나가지 않음. 메인액션에서 끝남
      console.log('[info]',opt.package, 'is already installed.', '\n[info] Check the version is matching or not');
      versionCheck(opt, rpmDir);
    }
  }
  catch{
    //에러가 있으면 설치되지 않은 것. 명령어가 안먹음
    console.log('[info]',opt.package, 'is not installed');
    console.log('[info] Install', opt.package);
    installPackage(opt, rpmDir);
  }
}




function versionCheck(opt, rpmDir){
  let stdout;
  console.log('[info] Start version check');
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
    stdout = exec(`rpm -qa|grep ${opt.package}`).toString();
    if(stdout.includes(version)==true){
      console.log('[info] Version is matched. Exit.');
    }else if(stdout.includes(version)==false){
      console.log('[info] Version is not matched. Delete', opt.package);
      deletePackage(opt);
      console.log('[info] Install new version of', opt.package);
      installPackage(opt, rpmDir);
    }
  }



  function installPackage(opt, rpmDir){
    switch(opt.package){
        case 'java' :
          exec(`${cmds.installCmd} ${rpmDir}${cmds.javaFile}`)
          break;
        case 'sshpass' :
          exec(`${cmds.installCmd} ${rpmDir}${cmds.sshpassFile}`)
          break;
        case 'git' :
          exec(`${cmds.installCmd} ${rpmDir}${cmds.gitFile}`)
         break;
        case 'maven' :
          exec(`${cmds.installCmd} ${rpmDir}${cmds.mavenFile}`)
         break;
        case 'python' :
          exec(`${cmds.installCmd} ${rpmDir}${cmds.pythonFile}`)
         break;
       }
       console.log('[info]', opt.package, 'Installation complete!');
       exec(`rm -rf rpm`)
       console.log('rpm 폴더 삭제');
   }



   function deletePackage(opt){
     switch(opt.package){
       case 'java' :
        exec(`${cmds.yumDeleteCmd} ${cmds.java}*`)
        break;
       case 'sshpass' :
        exec(`${cmds.deleteCmd} ${cmds.sshpass}`)
        break;
       case 'git' :
        exec(`${cmds.deleteCmd} ${cmds.git}`)
        break;
       case 'maven' :
        exec(`${cmds.yumDeleteCmd} ${cmds.maven}`)
        break;
       case 'python' :
        exec(`${cmds.deleteCmd} ${cmds.python}`)
        break;
     }
     console.log('[info]', opt.package, 'Deletion complete!');
   }
