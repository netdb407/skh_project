#!/usr/bin/env node
const program = require('commander');
const property = require('./propertiesReader.js')
const javaAction = require('./Installation/lib/java.js')
const sshpassAction = require('./Installation/lib/sshpass.js')
// const bencmhark = require('./Benchmark/bin/BMrun.js')
// console.log('1');

// install.installpackage();


// program
//     .command('install <package|database> <java|sshpass>')
//     // .command('install <database> <dbname>')
//     // .command('benchmark')
//     .action((opt1, opt2) => {
//
//       if(opt1 == 'package'){
//         console.log('package!!');
//       }else{
//         console.log('database!!');
//       }
//
//       if(opt2 == 'java'){
//         console.log('java@');
//       }else{
//         console.log('sshpass');
//       }
//         // java, sshpass
//     })

    //   function install(){
    //   const install = require('./Installation/bin/install.js')
    //   install
    //   console.log('2');
    // })



// console.log(property.getNodeInfo());

program
  .command('install <package> <java|sshpass>')
  .action(function install(opt1, opt2){
    if(opt2 == 'java'){
      // console.log('java');
      javaAction.javaInstall()

    }else{
      // console.log('ssh');
      sshpassAction.sshpassInstall();
    }
  })





program.parse(process.argv);




//
// program
//   .command('install')

// program
//     .command('benchmark')
//     .action(function benchmark(){
          //const bencmhark = require('./Benchmark/bin/BMrun.js')
//       bencmhark
//     })
//
// program.parse(process.argv);
