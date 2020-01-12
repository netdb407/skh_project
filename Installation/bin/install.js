const program = require('commander');
const property = require('../../propertiesReader.js')
const versionChecking = require('../lib/versionCheck.js')
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')

module.exports.installPackage = (package, arg, dir) => {
   
   if(dir == 'server'){
     const dir = property.get_server()
     console.log(dir)
   }
   else{
     const dir = property.get_nodes()
     console.log(dir)
   }

  switch(arg, dir){
     case 'java' :

       versionChecking.versionCheck(arg);
       javaAction.javaInstall();
       break;

     case 'sshpass' :
       versionChecking.versionCheck(arg);
       console.log('1');
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

     default :
      versionChecking.versionCheck(arg);
      // console.log('default');
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
