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
  .option('-p, --package <pkgname>', `Install Package (Java, Python, Maven)`)
  .option('-d, --database <dbname>', `Install Database (Cassandra, Orient, Arango)`)
  .option('-s, --server', `Install into server, only can use with -p option`)
  .option('-n, --node', `Install into node, only can use with -p option`)
  .option('-a, --all', `Install all into server & node`)
  .action(function Action(opt){
    //case 1. -p + -s||-n

    exec(`chmod -R +x .`)
    if(opt.package && (opt.server || opt.node )){
      if(opt.server){
        ip = [property.get_server_IP()]
        installDir = property.get_server_install_dir(); // root/skh_project
      }else if(opt.node){
        ip = property.get_nodes_IP().split(',');
        installDir = property.get_node_install_dir(); // root/ssdStorage
        if(package == maven){
          return 0;
        }
      }
      ip.forEach(i =>{
        isInstalledPkg(i, opt.package, installDir, ip)
      })
    }

    //case 2. -d(-n으로 디폴트)
    if(opt.database){
      var nodes = property.get_nodes_IP();
      var node_arr = nodes.split(',');
      //installDir = property.get_node_install_dir(); // root/ssdStorage
      var db = opt.database
      installDatabase(db, nodes, node_arr);
    }
    //옵션 뒤에 인자 받는 경우 boolean 값으로 저장됨

    //case 3. -a
    if(opt.all){
      ip = property.get_nodes_IP().split(',');
      ip.push(property.get_server_IP());
      ip = ip.sort();
      packageAll = ['python', 'java', 'maven']
      // let idx = 0
      ip.forEach((i, idx) => {
        // console.log('???????', i, idx);
        if(idx != 0){
          if(packageAll.indexOf('maven') != -1)
            packageAll.splice(packageAll.indexOf('maven'),1)
          // console.log('packageAll===>', packageAll);
        }
        packageAll.forEach( pck => {
            isInstalledPkg(i, pck, installDir, ip)
        })
      });

      //아예 -a옵션은 패키지만 설치하는거로 설명을 바꿀까...
      var nodes = property.get_nodes_IP();
      var node_arr = nodes.split(',');
      ip = property.get_nodes_IP().split(',');
      //installDir = property.get_node_install_dir(); // root/ssdStorage
      databaseAll = ['cassandra']
      for(var db of databaseAll){
        installDatabase(db, nodes, node_arr);
      }
    }
 })
program.parse(process.argv)


function isInstalledPkg(i, package, installDir, ip){
  // ip.forEach((i) => {
   console.log('----------------------------------------------------------');
   console.log(chalk.green.bold('[INFO]'), 'Installation', chalk.blue.bold(package), 'into IP address', chalk.blue.bold(i));
   installDir = i==property.get_server_IP()? property.get_server_install_dir() : property.get_node_install_dir();
   switch(package){
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
      // try{
      //   var res = exec(`ssh root@${i} ls ${installDir}${package}`).toString();
      //   res.contain("File exists")
      //   if(res){
      //     console.log(chalk.green.bold('[INFO]'), 'directory exists');
      //   } //디렉토리 있음
      //   else{
      //     exec(`ssh root@${i} mkdir -p ./skh_project/package/maven`)
      //     exec(`ssh root@${i} mkdir -p ./skh_project/package/java`)
      //     exec(`ssh root@${i} mkdir -p ./skh_project/package/python`)
      //     // `scp <JDK PATH> root@${i}:/PATH/TO/TARGET`
      //   } //없음
      // }
      // catch(e){
      //   //노드와 서버에 /root/ssdStorage/skh_project/package/*가 있어야 함.
      //   console.log(chalk.green.bold('[INFO]'), 'file or directory does not exist');
      //   // exec(`scp -r ${rpm_dir_in_skhproject}${package} root@${i}:${installDir}`)
      //   exec(`scp -r ${rpm_dir_in_skhproject}${package} root@${i}:${installDir}`)
      //   console.log(chalk.green.bold('[INFO]'), 'Sending rpm file to', i,'complete! Ready to install other package.');
      // }


      // if(package == 'java'||'maven'){


      // try{
      //   stdout = exec(`ssh root@${i} "rpm -qa|grep ${packageName}"`).toString();
      //   if(stdout!=null){
      //     console.log(chalk.green.bold('[INFO]'), package, 'is already installed.');
      //     console.log(chalk.green.bold('[INFO]'), 'Check the version is matching or not ...');
      //     versionCheck(i, package, installDir, ip);
      //   }
      // }
      // catch(e){
        installPackage(i, package, installDir, ip);
      // }
    // }

    // })
  // }

  // export JAVA_HOME=/root/ssdStorage/skh_project/jdk1.8.0_121
  // export MAVEN_HOME=/root/ssdStorage/skh_project/Installation/rpm/maven
  // export PATH=$PATH:$JAVA_HOME/bin
  // export PATH=$PATH:$MAVEN_HOME/bin


      // if(package == 'git'||'java'||'maven'){
        try{
          stdout = exec(`ssh root@${i} "rpm -qa|grep ${packageName}"`).toString();
          if(stdout!=null){
            console.log(chalk.green.bold('[INFO]'), package, 'is already installed.');
            console.log(chalk.green.bold('[INFO]'), 'Check the version is matching or not ...');
            versionCheck(i, package, installDir);
          }
          if(package == 'maven'){
            makeMavenHome(i)
          }
        }
        catch(e){
          installPackage(i, package, installDir);
        }
      // }


    console.log(chalk.green.bold('[INFO]'), 'Ready to use Maven.');
  }

  // /etc/profile 에 추가
  // export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-2.el8_1.x86_64/jre/
  // export MAVEN_HOME=/root/maven
  // export PATH=$PATH:$JAVA_HOME/bin
  // export PATH=$PATH:$MAVEN_HOME/bin


  function makeMavenHome(i){
    exec(`scp /etc/profile root@${i}:${installDir}`)
    console.log(chalk.green.bold('[INFO]'), 'Sending /etc/profile to', i);
    exec(`ssh root@${i} cat ${installDir}profile > /etc/profile`)
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





function versionCheck(i, package, installDir, ip){
  console.log(chalk.green.bold('[INFO]'), 'Start version check ...');
    switch(package){
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
      installPackage(i, package, installDir, ip);
    }
  }

  // export JAVA_HOME=/root/ssdStorage/skh_project/jdk1.8.0_121/
  // export MAVEN_HOME=/root/maven
  // export PATH=$PATH:$JAVA_HOME/bin
  // export PATH=$PATH:$MAVEN_HOME/bin

  function installPackage(i, package, installDir, ip, opt){
   switch(package){
     case 'java' :
     var mirror1 = 'https://files-cdn.liferay.com/mirrors/download.oracle.com/otn-pub/java/jdk/8u121-b13/jdk-8u121-linux-x64.tar.gz'
     console.log(chalk.green.bold('[INFO]'), 'waiting for download java build ... It takes about 20 min');
       // exec(`ssh root@${i} wget https://download.java.net/openjdk/jdk8u41/ri/openjdk-8u41-b04-linux-x64-14_jan_2020.tar.gz ${installDir}${package}`)
       // console.log('i1===>', i);
       // console.log('ip[0]===>', ip[0]);
       // console.log('ip[1]===>', ip[1]);
      if(i == property.get_server_IP()) {
        // console.log('???1');
       exec(`wget ${mirror1} -P ${installDir}${package}`)
       exec(`tar -xvf ${installDir}${package}/jdk-8u121-linux-x64.tar.gz -C ${installDir}${package}`)
        exec(`./envSet.sh JAVA_HOME ${installDir}${package}/jdk1.8.0_121`)
        //exec(`echo 'export JAVA_HOME=${installDir}${package}/jdk1.8.0_121' >> /etc/profile`)
        //exec(`echo 'export PATH=$PATH:$JAVA_HOME/bin' >> /etc/profile`)
        //exec(`source /etc/profile`)
      }
      else{
        // console.log('???2');
        // console.log('i2===>', i);
        // console.log('node!');
        exec(`scp -r ${installDir}${package}/jdk1.8.0_121 root@${i}:${installDir}${package}/`)
        exec(`scp -r /etc/profile root@${i}:/etc/profile`)
      }
      console.log(chalk.green.bold('[INFO]'), 'complete');
      //tar파일 압축 해제 해야 함..
       break;
     case 'python' :
       makePythonLink(i);
       break;
     case 'maven' :
       makeMavenHome(i)
       break;
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




function installDatabase(db, nodes, node_arr){
    // console.log('node정보 : ', node_arr);
    switch(db){
      //193,194,195에 설치
        case 'cassandra' :
  	       var dir = property.get_server_cassandra_dir()
  	       var node_dir = property.get_node_cassandra_dir()
  	       var version = property.get_cassandra_version()
  	       var cassandraHome = `${dir}${version}`
  	       var conf = `${cassandraHome}/conf/cassandra.yaml`
    	     var update_conf = property.get_update_conf_path()
        	 var exists = fs.existsSync(`${conf}`);
                if(exists==true){
                 cassandraAction.cassandraSetClusterEnv(conf, nodes);
                 console.log(chalk.green.bold('[INFO]'), 'cassandra Set Cluster Environments');
              	}else{
                  console.log(chalk.red.bold('[Error]'), 'conf file not found');
                  break;
                }
          cassandraAction.cassandraCopy(nodes, node_arr, cassandraHome, node_dir, conf, update_conf);
  	      console.log(chalk.green.bold('[INFO]'), 'cassandra Installed');
          break;

        case 'arango' :
        //193,194,195에 설치
          node_arr.forEach(i=>{
            console.log(chalk.green.bold('[INFO]'), 'Check if ArangoDB is installed in', chalk.blue.bold(i));
            try{
              stdout = exec(`ssh root@${i} "rpm -qa|grep arango"`).toString();
              if(stdout!=null){
                console.log(chalk.green.bold('[INFO]'),'ArangoDB is already installed in', chalk.blue.bold(i));
              }
            }
            catch{
              exec(`ssh root@${i} wget -P /root/ https://download.arangodb.com/9c169fe900ff79790395784287bfa82f0dc0059375a34a2881b9b745c8efd42e/arangodb36/Enterprise/Linux/arangodb3e-3.6.3-1.1.x86_64.rpm`)
              exec(`ssh root@${i} rpm -ivh /root/arangodb3e-3.6.3-1.1.x86_64.rpm`)
              exec(`ssh root@${i} rm -rf /root/arangodb3e-3.6.3-1.1.x86_64.rpm`)
              console.log(chalk.green.bold('[INFO]'), 'Install ArangoDB Complete!');
            }
          })
        break;

        case 'orient' :
        //@@@ 192에서 파일 수정하고 scp로 193,194,195에서 파일 덮어씌우기
        //193,195는 아랑고 테스트 중, 194는 죽었음
        //192나 rnd컴으로 테스트하기
        //rnd 컴으로 오리엔트 설치하고 클러스터 설정 해보기?
        //에트리 컴으로 오리엔트 클러스터 해보기 203.255.92.38, 39, 40, 41

        //192에서 server.sh변경하고 scp로 덮어씌우는거????
        //38에서 변경할 파일 : /bin/server.sh, /config/hazelcast, /config/default-distributed-db-config.json, /config/orientdb-server-config.xml

        //1. tar파일 scp로 전송 : 38 ----> 39,40,41
        //2. 38에서 /bin/server/sh 파일 수정 ---> 39에 보내보기

        //쉘 스크립트 배쉬 파일 만들어서 실행시켜버리기 ! 원격으로 한대씩






        //-----------------step 1.-----------------
        //java 192, 193, 194, 195에 설치되어 있어야 함
        // install -p java 부분 수정해서 네대 다 설치하기!
        //java home설정

        // /opt/orientdb-3.0.27.tar.gz 있으니까 풀어서 쓰기
        //  sudo tar -zxvf opt/orientdb-3.0.27.tar.gz -C /opt
        exec(`sudo tar -zxvf opt/orientdb-3.0.27.tar.gz -C /opt`)
        //-----------------step 2.-----------------
        // sudo vi /root/ssdStorage/orientdb194/bin/server.sh
        exec(`sudo vi /root/ssdStorage/orientdb194/bin/server.sh`)
        //orientdb194/bin/server.sh 파일 열고 키 잡아서 value 변경(메모리 사이즈 변경)
        // ### ORIENTDB_OPTS_MEMORY="-Xms2G -Xmx2G" -> "-Xms256m –Xmx512m

        //-----------------step 3.-----------------
        // 3,4,5 모두 설정
        // ### ORIENTDB_DIR="YOUR_ORIENTDB_INSTALLATION_PATH" -> ORIENTDB_DIR="/root/ssdStorage/orientdb194"
        // ### ORIENTDB_USER="USER_YOU_WANT_ORIENTDB_RUN_WITH" -> ORIENTDB_USER="orientdb"
        // ### sudo chmod 640 /root/ssdStorage/orientdb194/config/orientdb-server-config.xml
        // ### sudo cp /root/ssdStorage/orientdb194/bin/orientdb.service /etc/systemd/system

        //-----------------step 4.-----------------
        // root/ssdStorage/orientdb194/config/hazelcast 열고
        // name=project, password=1234로 수정
        // ip 추가해주기 3대 다 193,194,195


        //-----------------step 5.-----------------
        // /root/ssdStorage/orientdb194/config/default-distributed-db-config.json 열고
        // readQuorum : 1 -> 2로 변경
        //servers : {}에 추가하기
        // "orientdb193" : "master"
        // "orientdb194" : "master"
        // "orientdb195" : "replica"

        //-----------------step 6.-----------------
        // /root/ssdStorage/orientdb194/config/orientdb-server-config.xml 열고
        //<parameters>에서 value="false" -> "true"로 변경
        // properties에 값 추가
        // <entry value="1" name="db.pool.min"/>
        // <entry value="50" name="db.pool.max"/>
        // <entry value="100000" name="cache.size"/>


          break;
     }
  }



// function execShellCommand(cmd) {
//  const exec = require('child_process').exec;
//  return new Promise((resolve, reject) => {
//   exec(cmd, (error, stdout, stderr) => {
//    if (error) {
//     console.warn(error);
//    }
//    resolve(stdout? stdout : stderr);
//   });
//  });
// }
//
// const javaInfo = await execShellCommand('java -version');
// console.log(javaInfo);
