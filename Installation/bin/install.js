const program = require('commander');
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

module.exports.installPackage = (package, arg) => {
  switch(arg){
     case 'java' :
       versionChecking.versionCheck(arg);
       javaAction.javaInstall();
       break;

     case 'sshpass' :
       sshpassAction.sshpassInstall();
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
    }
}

function versionCheck(arg){
  const child = execFile(arg, (err, stdout, stderr) => {

module.exports.installDatabase = (db, arg) => {
  switch(arg){
    case 'cassandra' :
      console.log('cassandra');
      break;

    case 'arangodb' :
      console.log('arango');
      break;

    case 'orientdb' :
      console.log('orient');
      break;
  }
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
 })
}



function installDatabase(dbname){
  // console.log('2');
  // console.log(dbname);
}
