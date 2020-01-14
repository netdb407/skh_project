const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const versionChecking = require('../lib/versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
const haveArg = 0

// program
//   .option('-p, --package <pkg> <dir>')
//   .option('-d, --database <dbname>')
//   .action(function(opt){
//
//     //package가 들어오면(null이 아닐때)
//     if(!!opt.package){
//       installPackage(opt.package, opt.args[1]);
//     }
//     else if(!!opt.database){
//       installDatabase(opt.dbname);
//     }
//   })
//
// program.parse(process.argv)


program
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `server에 설치, -p 옵션에만 적용`)
  .option('-n, --node', `node에 설치, -p 옵션에만 적용`)
  .action(function(opt){

    //package가 들어오면(null이 아닐때)

    versionCheck(opt.package);

    if(haveArg == 'true'){
      console.log('true~');
    }else{
      console.log('false!');
    }
    //
    // //-p 옵션
    // if(!!opt.package && !opt.server && !opt.node){
    //   console.log('error : -s 또는 -n 옵션을 입력하세요.');
    // }
    // //-p, -s 옵션
    // else if(!!opt.package && !!opt.server){
    //   // console.log(opt.server);
    //   console.log('?');
    //   // versionChecking.versionCheck(opt.package);
    //   // installPackage(opt.package, opt.server);
    // }
    // //-p, -n 옵션
    // else if(!!opt.package && !!opt.node){
    //   installPackage(opt.package, opt.node);
    // }
    //
    // //-d 옵션
    // if(!!opt.database){
    //   installDatabase(opt.dbname);
    // }
    // //-d, -s옵션
    // else if(!!opt.database && !!opt.server || !!opt.database && !!opt.node){
    //   console.log('warning : -s 옵션은 -p옵션과 사용 가능.');
    // }


  })

program.parse(process.argv)


function versionCheck(arg){
  const child = execFile(arg, (err, stdout, stderr) => {

    //에러일때! 없는 옵션
    if(Object.keys(err).includes('errno')==true){
      const haveArg = 'false';
      console.log(haveArg);
      console.log('error!');
    }
    else{
      const haveArg = 'true';
      console.log(haveArg);
      console.log('IsOkay');
    }
  })
}

function installPackage(package, dir){
  if(dir == true){
    const directory = property.get_server_install_dir()
  }
  else{
    const directory = property.get_node_install_dir()
  }


  switch(package){
      case 'java' :
        // versionChecking.versionCheck(package);
        javaAction.javaInstall(package);
        break;

      case 'sshpass' :
        // versionChecking.versionCheck(package);
        console.log('sshpass');
        // sshpassAction.sshpassInstall();
        break;

      case 'git' :
       console.log('git');
       break;

      case 'maven' :
       console.log('maven');
       break;

      case 'python' :
       console.log('python');
       break;

      // default :
      //  versionChecking.versionCheck(package);
      //  // console.log('default');
      //  break;
     }
 }



function installDatabase(dbname){
  console.log('2');
  // console.log(dbname);
}
