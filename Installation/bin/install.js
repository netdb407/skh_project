const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const versionChecking = require('./versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
const serverInfo = property.get_server_install_dir()
const nodeInfo = property.get_node_install_dir()
var pckInfo = null

program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `server에 설치, -p 옵션에만 적용`)
  .option('-n, --node', `node에 설치, -p 옵션에만 적용`)
  .action(function Action(opt){
    pckInfo = opt.package

    // var start = 1;
    versionChecking.versionCheck(pckInfo)
    //   .then(result => {
    //     console.log(result);
    //   });

    // console.log('server :', opt.server);
    // console.log('node : ', opt.node);

    // console.log('있으면 true, 없으면 false : ', versionChecking.haveArg);


    //dir는 들어오면 true, 안들어오면 false
    //dir중 not null인 것 을 인자로 넣어야 함..

    if(typeof opt.server != "undefined"){
      installPackage(opt.package, serverInfo)
    }else if(typeof opt.node != "undefined"){
      installPackage(opt.package, nodeInfo)
    }
  })

program.parse(process.argv)



// function test(){
//   Promise.all([versionChecking.versionCheck(pckInfo), versionChecking.changeHaveArg()]).then(
//     function(values){
//       console.log(values);
//     }
//   )
// }

function installPackage(package, dir){
  console.log('dir정보 : ', dir);
  switch(package, dir){
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
