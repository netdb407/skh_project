const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
// const versionChecking = require('./versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
const gitAction = require('../lib/git.js')
const mavenAction = require('../lib/maven.js')
const pythonAction = require('../lib/python.js')
const serverInfo = property.get_server_install_dir()
const nodeInfo = property.get_node_install_dir()
// var pckInfo = null
// let haveArg


// module.exports.installPackage = (package, arg) => {
//   switch(arg){
//      case 'java' :
//        versionChecking.versionCheck(arg);
//        javaAction.javaInstall();
//        break;

program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `server에 설치, -p 옵션에만 적용`)
  .option('-n, --node', `node에 설치, -p 옵션에만 적용`)
  .action(function Action(opt){
    // pckInfo = opt.package
    // versionCheck(pckInfo);
    installPackage(opt.package)

    // var start = 1;
    // versionChecking.versionCheck(pckInfo)
    // versionCheck(pckInfo, haveArg);
    // console.log('have : ', haveArg);

    // versionCheck(pckInfo).then((x)=>{
    //   return x;
    // }).then(installPackage(pckInfo))


    // versionCheck(opt.package).then((info)=>{
    //     installPackage(info)
    //   })

    //
    // console.log('이거야');
    // console.log(haveArg);

    // if(typeof opt.server != "undefined"){
    //   installPackage(opt.package, serverInfo)
    // }else if(typeof opt.node != "undefined"){
    //   installPackage(opt.package, nodeInfo)
    // }

    //   .then(result => {
    //     console.log(result);
    //   });

    // console.log('server :', opt.server);
    // console.log('node : ', opt.node);

    // console.log('있으면 true, 없으면 false : ', versionChecking.haveArg);


    //dir는 들어오면 true, 안들어오면 false
    //dir중 not null인 것 을 인자로 넣어야 함..



    // var _promise = function (param) {
    //   return new Promise(function (resolve, reject){
    //     setTimeout(function (){
    //       if(param){
    //         resolve(console.log('해결'));
    //       }
    //       else{
    //         reject(console.log('실패'));
    //       }
    //     }, 2000);
    //   });
    // };
    //
    // _promise(typeof opt.server != "undefined")
    //   .then(installPackage(opt.package, serverInfo))
    //   .catch(function(){
    //     alert("에러")
    //   })

  })

program.parse(process.argv)





// function versionCheck(pckInfo){
//  const child = execFile(pckInfo, (err, stdout, stderr) => {
//    if(Object.keys(err).includes('errno')==true){
//      console.log('존재 유무 : 설치되지 않았습니다.');
//      console.log('설치 시작');
//      return pckInfo;
//      // installPackage();
//      // haveArg = false;
//      // console.log(haveArg);
//      // return haveArg
//
//    }
//    else if(typeof stderr == 'string'){
//      console.log('존재 유무 : 이미 존재하는 패키지입니다.');
//      console.log('실행 종료');
//      // haveArg = true;
//      // console.log(haveArg);
//      return 0;
//    }
//  })
// }





// function versionCheck(pckInfo, haveArg){
//  const child = execFile(pckInfo, (err, stdout, stderr) => {
//    if(Object.keys(err).includes('errno')==true){
//      console.log('존재 유무 : 설치되지 않았습니다.');
//      console.log('설치 시작');
//      // return pckInfo;
//      // installPackage();
//      haveArg = false;
//      // console.log(haveArg);
//      // return haveArg
//
//    }
//    else if(typeof stderr == 'string'){
//      console.log('존재 유무 : 이미 존재하는 패키지입니다.');
//      console.log('실행 종료');
//      haveArg = true;
//      // console.log(haveArg);
//      // return 0;
//    }
//  })
//  // return new Promise((resolve, reject)=>{
//  //   if(haveArg == true){
//  //     resolve(console.log('있음'))
//  //   }else{
//  //     reject(console.log('없음'))
//  //   }
//  // })
//
//
// }





// function versionCheck(pckInfo, haveArg){
//
//   new Promise((resolve, reject)=>{
//     versionCheck.function((err, arg)=>{
//       err ? reject(err) : resolve(arg)
//     })
//   }).then(arg => {
//     haveArg = arg;
//     console.log(haveArg);
//   })
//
//
// }
//
//
//





// function test(){
//   Promise.all([versionChecking.versionCheck(pckInfo), versionChecking.changeHaveArg()]).then(
//     function(values){
//       console.log(values);
//     }
//   )
// }
  installPackage(opt.package)
function installPackage(package){
  // console.log('dir정보 : ', dir);
  switch(package){
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
     }
 }




// function installDatabase(dbname){
//   // console.log('2');
//   // console.log(dbname);
// }
