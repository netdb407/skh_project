#!/usr/bin/env node

const program = require('commander');
const installation = require('./Installation/bin/install.js')
// const bencmhark = require('./Benchmark/bin/BMrun.js')


program
  .command('install <package|db> <arg>')
  // .arguments('<opt>')
  // .option('-p, --package')
  // .option('-d, --database')
  .action(function installPackage(opt, arg){
    if(opt == 'package'){
      installation.installPackage(opt, arg);
    }
    else{
      installation.installDatabase(opt, arg);
    }
  })


program.parse(process.argv);





// program
//     .command('benchmark')
//     .action(function benchmark(){
          //const bencmhark = require('./Benchmark/bin/BMrun.js')
//       bencmhark
//     })
//
// program.parse(process.argv);
