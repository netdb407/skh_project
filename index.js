#!/usr/bin/env node

const program = require('commander');
const installation = require('./Installation/bin/install.js')

console.log('1');
const bencmharking = require('./Benchmarking/bin/benchmark.js')
console.log('2');

program
  .command('install')
  .arguments('<opt>')
  .option('-p, --package')
  .action(function installPackage(opt){
    //console.log(opt);
    installation.installPackage(opt);
  })


program
    .command('benchmark')
    .action(function benchmarking(){
        benchmarking.test();
    }

      // console.log(opt);
      //console.log(runtype);

      // bencmhark.chooseDbtype(dbtype);
    )

program.parse(process.argv);
