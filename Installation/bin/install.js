#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const progress = require('cli-progress');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js');
const cmds = require('../lib/cmds.js');
const cassandraAction = require('../lib/cassandra.js')


let ip;
let installDir;
let rpmDirOrigin = property.get_rpm_dir_origin(); //프로젝트 폴더 rpm
let rpmDir       = property.get_rpm_dir(); //root/rpm
let packageName;
let stdout;
let packageAll;
let version;


program
  .command('install')
  .option('-p, --package <pck>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .option('-a, --all', `install all package`)
  .action(function Action(opt){
    if(opt.package && (opt.server || opt.node )){
      if(opt.server){
        ip = [property.get_server_IP()]
      }else if(opt.node){
        ip = property.get_nodes_IP().split(',');
      }
      installDir = property.get_server_install_dir(); //root/
      P_option(ip, opt.package, installDir)
    }
    if(opt.database){
      var nodes = property.get_nodes_IP();
      var node_arr = nodes.split(',');
      var password = property.get_password();
      ip = property.get_nodes_IP().split(',');
      installDir = property.get_node_install_dir(); //root/
      installDatabase(opt, nodes, node_arr, password);
    }
    //옵션 뒤에 인자 받는 경우 boolean 값으로 저장됨
    if(opt.all == true){
      ip = property.get_nodes_IP().split(',');
      ip.push(property.get_server_IP());
      packageAll = ['java', 'maven', 'python', 'git']
      ip.forEach((i) => {
        packageAll.forEach((pck) => {
          P_option(i, pck, installDir)
        })
      })
    }
 })

program.parse(process.argv)





 function P_option (ip, package, installDir){
   ip.forEach((i) => {
     console.log('-----------------------------------');
     console.log(chalk.green.bold('[INFO]'),'IP address is', i);
       if(package == 'maven'){
         makeMavenHome(i)
         return 0;
       }
       // else if(package == 'python'){
       //   makePythonLink(i)
       //   return 0;
       // }
       else{

         //fs써서 존재유무 확인 ! 
         exec(`scp -r ${rpmDirOrigin}/${package} root@${i}:${installDir}`)
         console.log(chalk.green.bold('[INFO]'), 'Sending rpm file to',i,'complete! Ready to install other package.');
         isInstalledPkg(i, package, rpmDir);
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


// function makePythonLink(i){
//   //python link 잡아주기
//   exec(`ssh root@${i} ln -s /usr/bin/python3 /usr/bin/python`)
//   console.log(chalk.green.bold('[INFO]'), 'Ready to use Python.');
//   //file exist
//   //link의 존재 유무 파악하고 있으면 하지 않기?
//   //fs 쓰기? 이름 같은거 찾기
//   //if(fs 써서 이름 같은거 있는지){
//   //없으면 심볼릭 링크 생성
//   //}있으면 종료
//
// }


function isInstalledPkg(i, package, rpmDir){
  switch(package){
    case 'git' :
      packageName = cmds.git;
      break;
    case 'java' :
      packageName = cmds.java;
      break;
    case 'python' :
      packageName = cmds.python;
      break;
    case 'maven' :
      packageName = cmds.maven;
      break;
    default :
      console.log(chalk.red.bold('[ERROR]'), package,'is cannot be installed. Try again other package.');
      exec(`exit`)
      return 0;
  }
  try{
    stdout = exec(`ssh root@${i} "rpm -qa|grep ${packageName}"`).toString();
    if(stdout!=null){
      console.log(chalk.green.bold('[INFO]'), package, 'is already installed.');
      console.log(chalk.green.bold('[INFO]'), 'Check the version is matching or not ...');
      versionCheck(i, package, rpmDir);
    }
  }
  catch(e){
    console.log(e);
    console.log(chalk.green.bold('[INFO]'), package, 'is not installed');
    console.log(chalk.green.bold('[INFO]'), 'Install', package);
    installPackage(i, package, rpmDir);
  }
}




function versionCheck(i, package, rpmDir){
  console.log(chalk.green.bold('[INFO]'), 'Start version check ...');
    switch(package){
      case 'git' :
        version = property.get_gitVersion()
        break;
      case 'maven' :
        version = property.get_mavenVersion()
        break;
      case 'python' :
        version = property.get_pythonVersion()
        break;
      case 'java' :
        version = property.get_javaVersion()
        break;
    }
    stdout = exec(`ssh root@${i} "rpm -qa|grep ${package}"`).toString();
    if(stdout.includes(version)==true){
      if(package = 'python'){
        exec(`ssh root@${i} ln -s /usr/bin/python3 /usr/bin/python`)
        console.log(chalk.green.bold('[INFO]'), 'Ready to use Python.');
      }
      console.log(chalk.green.bold('[INFO]'), 'Version is matched. Exit.');
    }else if(stdout.includes(version)==false){
      console.log(chalk.green.bold('[INFO]'), 'Version is not matched. Delete', package);
      deletePackage(i, package);
      console.log(chalk.green.bold('[INFO]'), 'Install new version of', package);
      installPackage(i, package, rpmDir);
    }
  }



  function installPackage(i, package, rpmDir){
     exec(`ssh root@${i} ${cmds.installCmd} ${rpmDir}${package}/*`)
     console.log(chalk.green.bold('[INFO]'), package, 'Installation complete!');
     exec(`rm -rf rpm`)
     console.log('rpm 폴더 삭제');
     exec(`exit`)
   }



 function deletePackage(i, package){
   switch(package){
     case 'java' :
       packageName = cmds.java
       break;
     case 'python' :
       packageName = cmds.python
       break;
     case 'git' :
       packageName = cmds.git
       break;
     case 'maven' :
       packageName = cmds.maven
       break;
     }
    if(package == 'java'||'maven'){
      exec(`ssh root@${i} ${cmds.yumDeleteCmd} ${packageName}*`)
    }else{
      exec(`ssh root@${i} ${cmds.deleteCmd} ${packageName}`)
    }
    console.log(chalk.green.bold('[INFO]'), package, 'Deletion complete!');
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
           console.log(chalk.green.bold('[INFO]'), 'cassandraFile is already exist');
          }else{
            if(exists_tar==true){
             cassandraAction.cassandraDecompress(dir, file);
             console.log(chalk.green.bold('[INFO]'), '[cassandra Decompress]');
            }else{
             cassandraAction.cassandraInstall(dir, install_address, file);
             console.log(chalk.green.bold('[INFO]'), '[cassandra Install]');
             cassandraAction.cassandraDecompress(dir, file);
             console.log(chalk.green.bold('[INFO]'), '[cassandra Decompress]');
            }
          }

  	var exists = fs.existsSync(`${conf}`);
          if(exists==true){
           cassandraAction.cassandraSetClusterEnv(conf, nodes, benchmark_dir);
           console.log(chalk.green.bold('[INFO]'), 'cassandra Set Cluster Environments');
  	}else{
           console.log(chalk.red.bold('[Error]'), 'conf file not found');
           break;
          }

          cassandraAction.cassandraCopy(node_arr, password, cassandraHome, node_dir, conf);
  	console.log(chalk.green.bold('[INFO]'), 'cassandra Copy&localhost set');
  	console.log(chalk.green.bold('[INFO]'), 'cassandra Installed');
        break;
     }
  }





  function installAll(){
    console.log('install all package~');
  }
