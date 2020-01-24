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
    let password  = property.get_password();
    let rpmDir    = property.get_rpm_dir();
    // let stdout;

    if(opt.server == true){
      ip = [property.get_serverIP()]
      installDir = property.get_server_install_dir();
    }else if(opt.node == true){
      ip = property.get_nodeIP().split(',');
      installDir = property.get_node_install_dir();
    }

    ip.forEach((i) => {
      console.log('-----------------------------------\n[info] IP address is', i);
      // console.log('[info] IP address is', i);
      // stdout = exec(`rpm -qa|grep sshpass`).toString();
      // if(stdout == undefined){
      //   exec(`${cmds.installCmd} ${installDir}${cmds.sshpassFile}`)
      //   console.log('[info] install sshpass to server Complete!');
      // }
      //   exec(`sshpass -p ${password} scp -r ${rpmDir} root@${i}:${installDir}`)
      //   console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
      //   isInstalledPkg(opt, installDir);

        try{
          // stdout = exec(`rpm -qa|grep sshpass`).toString();
          exec(`rpm -qa|grep sshpass`)
        }
        catch{
          exec(`${cmds.installCmd} ${installDir}${cmds.sshpassFile}`)
          console.log('[info] install sshpass to server Complete!');
        }
        exec(`sshpass -p ${password} scp -r ${rpmDir} root@${i}:${installDir}`)
        console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
        isInstalledPkg(opt, installDir);

      // try{
      //   stdout = exec(`rpm -qa|grep sshpass`).toString();
      //   // console.log('typeof : ', typeof stdout);
      //   console.log(stdout);
      //   console.log(stdout.includes('sshpass'));
      //                 exec(`sshpass -p ${password} scp -r ${rpmDir} root@${i}:${installDir}`)
      //                 console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
      //                 isInstalledPkg(opt, installDir);
      // }
      // catch{
      //   console.log(stdout==undefined);
      //   console.log(stdout.includes('sshpass'));
      //   exec(`${cmds.installCmd} ${installDir}${cmds.sshpassFile}`)
      //   console.log('install sshpass to server Complete!');
      //   // exec(`${cmds.installCmd} ${installDir}${cmds.sshpassFile}`)
      //   // console.log('install sshpass to server Complete!');
      //   // exec(`sshpass -p ${password} scp -r ${rpmDir} root@${i}:${installDir}`)
      //   // console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
      //   // isInstalledPkg(opt, installDir);
      // }
      // exec(`sshpass -p ${password} scp -r ${rpmDir} root@${i}:${installDir}`)
      // console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
      // isInstalledPkg(opt, installDir);

      })
    })

program.parse(process.argv)


// function install_ssh_toServer(ip){
//   exec(`${cmds.installCmd} ${rpmDir}${cmds.sshpassFile}`)
//   console.log('install sshpass to server Complete!');
// }
// function if_sshpass_notInstalled(){
//   exec(`${cmds.installCmd} ${installDir}${cmds.sshpassFile}`)
//   console.log('install sshpass to server Complete!');
// }

function isInstalledPkg(opt, dir){

  try{
    exec(`rpm -qa|grep ${opt.package}`).toString();
    // var buf = Buffer.from(stdout);
    // var output = buf.toString();
    // console.log('isInstallPkg, output: ', output);
    // console.log('pck type :', typeof output);
    //에러가 없으면 설치된것
    
    console.log('[info]',opt.package, 'is already installed.', '\n[info] Check the version is matching or not');
    versionCheck(opt, dir);
  }
  catch{
    //에러가 있으면 설치되지 않은 것. 명령어가 안먹음
    console.log('[info]',opt.package, 'is not installed');
    console.log('[info] Install', opt.package);
    installPackage(opt, dir);
  }
}




function versionCheck(opt, dir){
  console.log('[info] Start version check');
  // try {
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

    const stdout = exec(`rpm -qa|grep ${opt.package}`);
    var buf = Buffer.from(stdout);
    var output = buf.toString();
    // console.log('versionCheck, output: ', output);
    if(output.includes(version)==true){
      console.log('[info] Version is matched');
    }else if(output.includes(version)==false){
      console.log('[info] Version is not matched. Delete', opt.package);
      deletePackage(opt);
      console.log('[info] Install new version of', opt.package);
      installPackage(opt, dir);
    }
  }


  // catch (err) {
  //   err.stdout;
  //   err.stderr;
  //   err.pid;
  //   err.signal;
  //   err.status;
  // }

  function installPackage(opt, dir){
    switch(opt.package){
        case 'java' :
          exec(`${cmds.installCmd} ${dir}${cmds.javaFile}`)
          break;
        case 'sshpass' :
          exec(`${cmds.installCmd} ${dir}${cmds.sshpassFile}`)
          break;
        case 'git' :
          exec(`${cmds.installCmd} ${dir}${cmds.gitFile}`)
         break;
        case 'maven' :
          exec(`${cmds.installCmd} ${dir}${cmds.mavenFile}`)
         break;
        case 'python' :
          exec(`${cmds.installCmd} ${dir}${cmds.pythonFile}`)
         break;
        default :
          console.log('[ERROR]', opt.package,'is cannot be installed');
          break;
       }
       console.log('[info]', opt.package, 'Installation complete!');
   }



   function deletePackage(opt){
     switch(opt.package){
       case 'java' :
        exec(`${cmds.yumDeleteCmd} ${cmds.java}`)
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
       default :
        console.log('[ERROR]', opt.package,'is cannot be installed.');
        break;
     }
     console.log('[info]', opt.package, 'Deletion complete!');
   }




// function installPackage(opt){
//   // console.log('dir정보 : ', dir);
//   switch(opt.package){
//       case 'java' :
//         javaAction.javaInstall();
//         break;
//       case 'sshpass' :
//         sshpassAction.sshpassInstall();
//         break;
//       case 'git' :
//         gitAction.gitInstall();
//        break;
//       case 'maven' :
//         mavenAction.mavenInstall();
//         // mavenAction.mavenDelete();
//        break;
//       case 'python' :
//         pythonAction.pythonInstall();
//        break;
//       default :
//         console.log('[ERROR]', opt.package,'is cannot be installed');
//         break;
//      }
//      console.log('[info]', opt.package, 'Installation complete!');
//  }
//
//  function deletePackage(opt){
//    switch(opt.package){
//      case 'java' :
//       javaAction.javaDelete();
//       break;
//      case 'sshpass' :
//       sshpassAction.sshpassDelete();
//       break;
//      case 'git' :
//       gitAction.gitDelete();
//       break;
//      case 'maven' :
//       mavenAction.mavenDelete();
//       break;
//      case 'python' :
//       pythonAction.pythonDelete();
//       break;
//      default :
//       console.log('[ERROR]', opt.package,'is cannot be installed.');
//       break;
//    }
//    console.log('[info]', opt.package, 'Deletion complete!');
//  }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
