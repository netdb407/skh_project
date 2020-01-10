

const program = require('commander');
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')

module.exports.installPackage = (opt) => {
  switch(opt){
         case 'java' :
           javaAction.javaInstall();
           break;

         case 'sshpass' :
           sshpassAction.sshpassInstall();
           break;
       }
}
