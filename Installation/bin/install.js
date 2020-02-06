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
      P_option(ip, opt.package, installDir)
    }
    if(opt.database){
      ip = property.get_nodeIP().split(',');
      installDir = property.get_node_install_dir(); //root/
      installDatabase(opt, nodes, node_arr, password);
    }
    //옵션 뒤에 인자 받는 경우 boolean 값으로 저장됨
    if(opt.all == true){
      ip = property.get_nodeIP().split(',');
      ip.push(property.get_serverIP());
      packageAll = ['java', 'maven', 'python', 'git']
      ip.forEach((i) => {
        packageAll.forEach((pck) => {
          P_option(i, pck, installDir)
        })
      })
    }
 })

program.parse(process.argv)





 function P_option (ip, pck, installDir){
   ip.forEach((i) => {
     console.log('-----------------------------------');
     console.log(chalk.green.bold('[INFO]'),'IP address is', i);
       if(package == 'maven'){
         makeMavenHome(i)
         return 0;
       }else{
         exec(`scp -r ${rpmDirOrigin}/${package} root@${i}:${installDir}`)
         exec(`exit`)
         console.log(chalk.green.bold('[INFO]'), 'Sending rpm file to',i,'complete! Ready to install other package.');
         isInstalledPkg(i, opt, rpmDir);
       }
   })
}


function makeMavenHome(i){
  exec(`scp /etc/profile root@${i}:${installDir}`)
  console.log(chalk.green.bold('[INFO]'), 'Sending /etc/profile to', i);
  exec(`ssh root@${i} cat ${installDir}profile > /etc/profile`)
  exec(`exit`)
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
  //수정!
  try{
    stdout = exec(`ssh root@${i} "rpm -qa|grep ${package}"`)
    if(stdout!=null){
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
  exec(`exit`)
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
      case 'java' :
        var version = property.get_javaVersion()
        break;
    }
    stdout = exec(`ssh root@${i} "rpm -qa|grep ${package}"`).toString();
    if(stdout.includes(version)==true){
      console.log(chalk.green.bold('[INFO]'), 'Version is matched. Exit.');
      exec(`exit`)
    }else if(stdout.includes(version)==false){
      console.log(chalk.green.bold('[INFO]'), 'Version is not matched. Delete', opt.package);
      deletePackage(i, opt);
      console.log(chalk.green.bold('[INFO]'), 'Install new version of', opt.package);
      installPackage(i, opt, rpmDir);
    }
    exec(`exit`)
  }



  function installPackage(i, opt, rpmDir){
     exec(`ssh root@${i} ${cmds.installCmd} ${rpmDir}${opt.package}/*`)
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
     }
    if(opt.package == 'java'||'maven'){
      exec(`ssh root@${i} ${cmds.yumDeleteCmd} ${package}*`)
    }else{
      exec(`ssh root@${i} ${cmds.deleteCmd} ${package}`)
    }
    console.log(chalk.green.bold('[INFO]'), opt.package, 'Deletion complete!');
    exec(`exit`)
  }




  function installDatabase(opt, nodes, node_arr, password){
    console.log('node정보 : ', node_arr);
    switch(opt.database){
        case 'cassandra' :
  	var dir = property.get_server_cassandra_dir()
  	var install_address = property.get_server_cassandra_install_address()
  	var node_dir = property.get_node_cassandra_dir()
  	var version = property.get_cassandra_version()
  	var file = property.get_cassandra_file()
  	var cassandraHome = `${dir}${version}`
  	var conf = `${cassandraHome}/conf/cassandra.yaml`
    var benchmark_dir = property.get_benchmark_dir()
  	var fs = require('fs');

  	var exists_cassandra = fs.existsSync(`${cassandraHome}`);
  	var exists_tar = fs.existsSync(`${dir}${file}`);
  	if(exists_cassandra==true){
           console.log('cassandra is already installed');
          }else{
            if(exists_tar==true){
             cassandraAction.cassandraDecompress(dir, file);
             console.log('[cassandra Decompress]');
            }else{
             cassandraAction.cassandraInstall(dir, install_address, file);
             console.log('[cassandra Install]');
             cassandraAction.cassandraDecompress(dir, file);
             console.log('[cassandra Decompress]');
            }
          }

  	var exists = fs.existsSync(`${conf}`);
          if(exists==true){
           cassandraAction.cassandraSetClusterEnv(conf, nodes, benchmark_dir);
           console.log('[cassandra Set Cluster Environments]');
  	}else{
           console.log('conf file not found');
           break;
          }

          cassandraAction.cassandraCopy(node_arr, password, cassandraHome, node_dir, conf);
  	console.log('[cassandra Copy&localhost set]');

  	console.log('[cassandra Installed]');

        break;
     }
  }





  function installAll(){
    console.log('install all package~');
  }
