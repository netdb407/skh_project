const program = require('commander');
const versionChecking = require('../lib/versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')

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


// module.exports.installAll = (opt, arg) => {
//   console.log('all');
// }
