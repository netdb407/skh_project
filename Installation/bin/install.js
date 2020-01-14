const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
const versionChecking = require('./versionCheck.js')


program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `server에 설치, -p 옵션에만 적용`)
  .option('-n, --node', `node에 설치, -p 옵션에만 적용`)
  .action(function Action(opt){

    versionChecking.versionCheck(opt.package);
    console.log('server :', opt.server);
    console.log('node : ', opt.node);

    console.log('있으면 true, 없으면 false : ', versionChecking.haveArg);
    //dir는 들어오면 true, 안들어오면 false
    //dir중 not null인 것 을 인자로 넣어야 함..

    if(typeof opt.server != "undefined"){
      const serverInfo = property.get_server_install_dir()
      installPackage(opt.package, serverInfo)
    }else if(typeof opt.node != "undefined"){
      const nodeInfo = property.get_node_install_dir()
      installPackage(opt.package, nodeInfo)
    }
  })

program.parse(process.argv)



function installPackage(package, dir){
  console.log('dir정보 뜨기');
  console.log(dir);

  switch(package){
      case 'java' :
        javaAction.javaInstall(package);
        break;
      case 'sshpass' :
        console.log('sshpass.js 마저 개발하시요');
        // sshpassAction.sshpassInstall();
        break;
      case 'git' :
       console.log('git.js 마저 개발하시요');
       break;
      case 'maven' :
       console.log('maven.js 마저 개발하시요');
       break;
      case 'python' :
       console.log('python.js 마저 개발하시요');
       break;
     }
 }



function installDatabase(dbname){
  console.log('2');
  // console.log(dbname);
}
