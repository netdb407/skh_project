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

    if(opt.server == true){
      var ip = [property.get_server()]
    }else if(opt.node == true){
      var arr = property.get_nodes();
      var ip = arr.split(',');
    }


    var password = property.get_password();
    var rpmDir = property.get_rpm_dir();
    console.log('rpm 파일을 전송합니다.');

    // exec(`scp ${rpmDir}*.rpm root@${ip}:/root`)
    // exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${ip}:/root `)

    ip.forEach((i) => {
      exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${i}:/root `)



    const stdout = exec(`rpm -qa|grep sshpass`);
    //sshpass가 있다
     if(stdout != null){
       //다른거 설치
       //scp로 파일 보내고
       //sshpass로 원격연결해서
       //존재유무확인
       //버전체크
       //함수 이용해서 설치
       // for(ip){
       //   usiingSSH(ip[])
       // }

       //접속
       // exec(`sshpass -p ${password} ssh -o StrictHostKeyChecking=no root@${ip}`)
       //유무확인
       isInstalledPkg(opt);

     }

     //없다
     else{
       exec(`${cmds.installCmd} ${cmds.sshpassFile}`)
       //sshpass를 로컬에 설치하고
       //위에 과정 반복
       // exec(`sshpass -p ${password} ssh -o StrictHostKeyChecking=no root@${ip}`)
       isInstalledPkg(opt);
       // versionCheck();
       // installPackage();
     }

       });
  })

program.parse(process.argv)



function isInstalledPkg(opt){

  //sshpass로 -s,-n옵션 중 들어온거에 접속해야함
  //옵션 들어온거에 따라 sshpass에 dir을 달리 주고
  //sshpass에는 옵션마다 함수를 만들기

  //try catch : -p옵션은 -s또는 -n옵션이 필요하고, -d옵션은 -s/-n옵션이 무시됨
  //-s/-n옵션이 들어오면 해당 ip에 가서 패키지가 있는지 확인해야 함.
  //서버는 가서 확인하는 함수
  //노드는 for문으로 반복하기


    // exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.sshpassFile} `)
  //  exec(`sshpass -p ${password} ssh -o StrictHostKeyChecking=no root@${installDirectoryIP}`)
  //  exec(`mkdir yh`)
    //exec( `scp ${rpmDir}*.rpm root@${installDirectoryIP}:/root/yh`)


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



// function usingSSH(ip){
//   var password = property.get_password();
//   var rpmDir = property.get_rpm_dir();
//   exec( `scp ${rpmDir}*.rpm root@${ip}:/root/yh`)
//
//   exec(`sshpass -p ${password} ssh -o StrictHostKeyChecking=no root@${ip}`)
//   exec(`mkdir yh`)
//   // exec(`exit`)
//
//   isInstalledPkg();
// }




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
