const program = require('commander');
const property = require('../../propertiesReader.js')
const versionChecking = require('../lib/versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')


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

    //-p, -s 옵션
    if(!!opt.package && !!opt.server){
      // console.log(opt.server);
      installPackage(opt.package, opt.server);
    }
    //-p, -n 옵션
    else if(!!opt.package && !!opt.node){
      installPackage(opt.package, opt.node);
    }
    //-p 옵션
    else{
      console.log('error : -s 또는 -n 옵션을 입력하세요.');
    }


    //-d 옵션
    if(!!opt.database){
      installDatabase(opt.dbname);
    }
    //-d, -s옵션
    else if(!!opt.database && !!opt.server || !!opt.database && !!opt.node){
      console.log('warning : -s 옵션은 -p옵션과 사용 가능.');
    }


  })

program.parse(process.argv)




function installPackage(package, dir){
  // console.log(package);
  // console.log(dir);
  // console.log(dir);
  if(dir == true){
    // console.log('true');
    // console.log(dir);
    // console.log('wow');
    const directory = property.get_server_install_dir()
    // console.log(directory);
  }
  else{
    const directory = property.get_node_install_dir()
    // console.log(directory);
  }


  switch(package){
      case 'java' :
        // versionChecking.versionCheck(package);
        javaAction.javaInstall();
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
