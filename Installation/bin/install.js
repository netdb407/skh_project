

const program = require('commander');
const javaAction = require('../lib/java.js')
const sshpassAction = require('../lib/sshpass.js')

program
    .command('package')
    .arguments('<java|sshpass>')
    .action(function installPackage(opts){
      switch(opts){
        case 'java' :
          javaAction.javaInstall()
          break;

        case 'sshpass' :
          sshpassAction.sshpassInstall();
          break;
      }
    })


program.parse(process.argv);
