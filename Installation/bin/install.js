

const program = require('commander');
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')
//
// console.log('3');

// program
//     .command('package')
//     .arguments('<java|sshpass>')
//     .action(function installPackage(opts){
//       // console.log('4');
//       switch(opts){
//         case 'java' :
//           javaAction.javaInstall();
//           break;
//
//         case 'sshpass' :
//           sshpassAction.sshpassInstall();
//           break;
//       }
//     })
//
// program.parse(process.argv);



module.exports.installPackage = (opts) => {
  console.log('ww');
  switch(opts){
         case 'java' :
           javaAction.javaInstall();
           break;

         case 'sshpass' :
           sshpassAction.sshpassInstall();
           break;
       }
}
