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

    if(opt.server == true){
      ip = [property.get_serverIP()]
      installDir = property.get_server_install_dir();
    }else if(opt.node == true){
    //  var ipArr = property.get_nodeIP();
      ip = property.get_nodeIP().split(',');
      installDir = property.get_node_install_dir();
    }

    ip.forEach((i) => {
      console.log('-----------------------------------');
      console.log('[info] IP address is', i);

        // const stdout = exec(`rpm -qa|grep sshpass`)
        //               .toString()
        //               .map(x=>{
        //                 //sshpass가 없으면
        //                   if(x == null){
        //                     install_ssh_toServer(i);
        //                   }
        //                   //sshpass가 이미 있으면
        //                   exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${i}:${installDir}`)
        //                   console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
        //                   isInstalledPkg(opt);
        //               })


        const stdout = exec(`rpm -qa|grep sshpass`)
                      .toString()

                        //sshpass가 없으면
                          if(stdout == null){
                            install_ssh_toServer(i);
                          }
                          //sshpass가 이미 있으면
                          exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${i}:${installDir}`)
                          console.log('[info] Sending rpm file to',i,'complete! Ready to install other package.');
                          isInstalledPkg(opt);



  })
})

program.parse(process.argv)


function install_ssh_toServer(ip){
  exec(`${cmds.installCmd} ${rpmDir}${cmds.sshpassFile}`)
  console.log('install sshpass to server Complete!');
}


function isInstalledPkg(opt){
  try{
    const stdout = exec(`rpm -qa|grep ${opt.package}`);
    var buf = Buffer.from(stdout);
    var output = buf.toString();
    // console.log('isInstallPkg, output: ', output);
    // console.log(typeof output);
    //에러가 없으면 설치된것
    console.log('[info]',opt.package, 'is already installed.', '\n[info] Check the version is matching or not');
    versionCheck(opt);
  }
  catch{
    //에러가 있으면 설치되지 않은 것. 명령어가 안먹음
    console.log('[info]',opt.package, 'is not installed');
    console.log('[info] Install', opt.package);
    installPackage(opt);
  }
}




function versionCheck(opt){
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
      installPackage(opt);
    }
  }


  // catch (err) {
  //   err.stdout;
  //   err.stderr;
  //   err.pid;
  //   err.signal;
  //   err.status;
  // }




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
     console.log('[info]', opt.package, 'Installation complete!');
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
   console.log('[info]', opt.package, 'Deletion complete!');
 }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
