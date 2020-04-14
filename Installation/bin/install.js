#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const progress = require('cli-progress');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js');
const cmds = require('../lib/cmds.js');
const cassandraAction = require('../lib/cassandra.js')
const fs = require('fs');


let ip;
let installDir;
let rpm_dir_in_skhproject     = property.get_rpm_dir_in_skhproject(); //프로젝트 폴더 rpm
//let rpm_dir_in_ServerAndNode  = property.get_rpm_dir_in_ServerAndNode(); //root/
let packageName;
let stdout;
let packageAll;
let version;


program
  .command('install')
  .option('-p, --package <pkgname>', `Install Package (Git, Java, Python, Maven)`)
  .option('-d, --database <dbname>', `Install Database (Cassandra, Orient, Arango)`)
  .option('-s, --server', `Install into server, only can use with -p option`)
  .option('-n, --node', `Install into node, only can use with -p option`)
  .option('-a, --all', `Install all into server & node`)
  .action(function Action(opt){
    //case 1. -p + -s||-n
    if(opt.package && (opt.server || opt.node )){
      if(opt.server){
        ip = [property.get_server_IP()]
        installDir = property.get_server_install_dir(); // root/skh_project
      }else if(opt.node){
        ip = property.get_nodes_IP().split(',');
        installDir = property.get_node_install_dir(); // root/ssdStorage
      }

      isInstalledPkg(ip, opt.package, installDir)
    }

    //case 2. -d(-n으로 디폴트)
    if(opt.database){
      var nodes = property.get_nodes_IP();
      var node_arr = nodes.split(',');
      var password = property.get_password();
      ip = property.get_nodes_IP().split(',');
      //installDir = property.get_node_install_dir(); // root/ssdStorage
      console.log('opt ===>', opt);
      installDatabase(opt, nodes, node_arr, password);
    }
    //옵션 뒤에 인자 받는 경우 boolean 값으로 저장됨

    //case 3. -a
    if(opt.all){
      ip = property.get_nodes_IP().split(',');
      ip.push(property.get_server_IP());
      ip = ip.sort();
      // packageAll = ['git', 'python', 'java', 'maven']
      packageAll = ['git', 'python', 'java']
      for(var i of ip){
        for(var pck of packageAll){
            isInstalledPkg(i, pck, installDir)
        }
        break;
      }

      var nodes = property.get_nodes_IP();
      var node_arr = nodes.split(',');
      var password = property.get_password();
      ip = property.get_nodes_IP().split(',');
      //installDir = property.get_node_install_dir(); // root/ssdStorage
      console.log('opt ===>', opt);
      installDatabase(opt, nodes, node_arr, password);
    }
 })
program.parse(process.argv)



//java rpm 파일 바뀌었는데 테스트해보기 : 카산드라 돌릴 때 devel 버전이어야 하니까 지우고 다시 해보기


function isInstalledPkg(i, package, installDir){
  ip.forEach((i) => {
   console.log('----------------------------------------------------------');
   console.log(chalk.green.bold('[INFO]'), 'Installation', chalk.blue.bold(package), 'into IP address', chalk.blue.bold(i));
   installDir = i==property.get_server_IP()? property.get_server_install_dir() : property.get_node_install_dir();
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
       // exec(`exit`)
       // return 0;
   }
      try{
        exec(`ssh root@${i} ls ${installDir}${package}`).toString();
        console.log(chalk.green.bold('[INFO]'), 'directory exists');
      }
      catch(e){
        console.log(chalk.green.bold('[INFO]'), 'file or directory does not exist');
        exec(`scp -r ${rpm_dir_in_skhproject}${package} root@${i}:${installDir}`)
        console.log(chalk.green.bold('[INFO]'), 'Sending rpm file to', i,'complete! Ready to install other package.');
      }
      // if(package == 'git'||'java'||'maven'){
      try{
        stdout = exec(`ssh root@${i} "rpm -qa|grep ${packageName}"`).toString();
        if(stdout!=null){
          console.log(chalk.green.bold('[INFO]'), package, 'is already installed.');
          console.log(chalk.green.bold('[INFO]'), 'Check the version is matching or not ...');
          versionCheck(i, package, installDir);
        }
      }
      catch(e){
        installPackage(i, package, installDir);
      }
      if(package == 'maven'){
        makeMavenHome(i)
      }
    // }

    })
  }

  // /etc/profile 에 추가
  // export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-2.el8_1.x86_64/jre/
  // export MAVEN_HOME=/root/maven
  // export PATH=$PATH:$JAVA_HOME/bin
  // export PATH=$PATH:$MAVEN_HOME/bin


  function makeMavenHome(i){
    exec(`scp /etc/profile root@${i}:${installDir}`)
    console.log(chalk.green.bold('[INFO]'), 'Sending /etc/profile to', i);
    //exec(`ssh root@${i} cat ${installDir}profile > /etc/profile`)
    exec(`ssh root@${i} chmod +x /root/maven/bin/mvn`)
    exec(`ssh root@${i} source /etc/profile`)

    exec(`exit`)
    console.log(chalk.green.bold('[INFO]'), 'Ready to use Maven.');
  }



function makePythonLink(i){
  exec(`ssh root@${i}`)
  exec(`rm -f /usr/bin/python`)
  exec(`ln -s /usr/bin/python2.7 /usr/bin/python`)
  console.log(chalk.green.bold('[INFO]'), 'Make Symbolic link. Ready to use python');
}





function versionCheck(i, package, installDir){
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
    if(stdout.includes(version)){
      if(package == 'python'){
        makePythonLink(i);
      }else{
        console.log(chalk.green.bold('[INFO]'), 'Version is matched. Nothing has changed.');
      }
    }else{
      console.log(chalk.green.bold('[INFO]'), 'Version is not matched. Delete', package);
      deletePackage(i, package);
      console.log(chalk.green.bold('[INFO]'), 'Install new version of', package);
      installPackage(i, package, installDir);
    }
  }



  function installPackage(i, package, installDir){
   if(package == 'git'|'python'){
     exec(`ssh root@${i} ${cmds.installCmd} ${installDir}${package}/*`)
     console.log(chalk.green.bold('[INFO]'), package, 'Installation complete!');
       // exec(`rm -rf ${installDir}${package}`)
       // console.log(chalk.green.bold('[INFO]'), 'rpm 폴더 삭제');
     if(package == 'python'){
        makePythonLink(i);
     }
     exec(`exit`)
   }
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
    //python은 delete아니지않나?symbolic인데
    console.log(chalk.green.bold('[INFO]'), package, 'Deletion complete!');
    exec(`exit`)
  }




  function installDatabase(opt, nodes, node_arr, password){
    console.log('node정보 : ', node_arr);
    switch(opt.database){
        case 'cassandra' :
  	var dir = property.get_server_cassandra_dir()
  	var node_dir = property.get_node_cassandra_dir()
  	var version = property.get_cassandra_version()
  	var cassandraHome = `${dir}${version}`
  	var conf = `${cassandraHome}/conf/cassandra.yaml`
    	var update_conf = property.get_update_conf_path()
  	var fs = require('fs');


  	var exists = fs.existsSync(`${conf}`);
          if(exists==true){
           cassandraAction.cassandraSetClusterEnv(conf, nodes);
           console.log(chalk.green.bold('[INFO]'), 'cassandra Set Cluster Environments');
  	}else{
           console.log(chalk.red.bold('[Error]'), 'conf file not found');
           break;
          }

        cassandraAction.cassandraCopy(nodes, node_arr, password, cassandraHome, node_dir, conf, update_conf);
  	console.log(chalk.green.bold('[INFO]'), 'cassandra Installed');
        break;
     }
  }
