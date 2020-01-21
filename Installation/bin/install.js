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
      var ip = [property.get_serverIP()]
      var installDir = property.get_server_install_dir();
    }else if(opt.node == true){
      var ipArr = property.get_nodeIP();
      var ip = ipArr.split(',');
      var installDir = property.get_node_install_dir();
    }

    var password = property.get_password();
    var rpmDir = property.get_rpm_dir();


    ip.forEach((i) => {
      console.log('-----------------------------------');
      console.log('[info] IP address is', i);
      //sshpass가 있다
      try{
        const stdout = exec(`rpm -qa|grep sshpass`);
         if(stdout != null){
           exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${i}:${installDir}`)
           console.log('[info] Sending rpm file to',i,'complete!');
           isInstalledPkg(opt);
         }
      }
      //sshpass가 없다
      catch(err){
        console.log('We need sshpass to install the package.');
        exec(`${cmds.installCmd} ${rpmDir}${cmds.sshpassFile}`)
        console.log('[info] sshpass installation complete!');
        exec(`sshpass -p ${password} scp ${rpmDir}*.rpm root@${i}:${installDir}`)
        console.log('[info] Sending rpm file to',i,'complete!');
        isInstalledPkg(opt);
      }
    });
  })

program.parse(process.argv)




function isInstalledPkg(opt){
  try {
    const stdout = exec(`rpm -qa|grep ${opt.package}`);
    if(stdout != null){
      console.log('[info]',opt.package, 'is already installed.', '\n[info] Check the version is matching or not');
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
  }
}




function versionCheck(opt){
  console.log('start version check');
  try {
    console.log(opt.package);
    switch(opt.package){
      var stdout = exec(`rpm -qa|grep ${opt.package}`);
      // var version
      case git :
        var version = property.get_gitVersion()
        break;
      case maven :
        var version = property.get_mavenVersion()
        break;
      case python :
        var version = property.get_pythonVersion()
        break;
      case sshpass :
        var version = property.get_sshpassVersion()
        break;
      case java :
        var version = property.get_javaVersion()
        break;
    }
    console.log(version);
    console.log('stdout : ', stdout);
    if(stdout.includes(version)==true){
      console.log('[info] Version is matched');
    }
    if(stdout.includes(version)==false){
      console.log('[info] Version is not matched. Delete', opt.package);
      deletePackage(opt);
      console.log('[info] Install new version of', opt.package);
      installPackage(opt);
    }
  } catch (err) {
    err.stdout;
    err.stderr;
    err.pid;
    err.signal;
    err.status;
    // console.log('[info] Version is not matched. Delete', opt.package);
    // deletePackage(opt);
    // console.log('[info] Install new version of', opt.package);
    // installPackage(opt);
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
