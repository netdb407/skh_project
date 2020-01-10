#!/usr/bin/env node

const program = require('commander');
const installation = require('./Installation/bin/install.js')
// const bencmhark = require('./Benchmark/bin/BMrun.js')


program
  .command('install')
  .arguments('<opt>')
  .option('-p, --package')
  .action(function installPackage(opt){
    //console.log(opt);
    installation.installPackage(opt);
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
