#!/usr/bin/env node

const program = require('commander');
const installation = require('./Installation/bin/install.js')
const benchmarking = require('./Benchmarking/bin/benchmark.js')


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
    .arguments('<ycsb|graphbench>')
    .option('-d, --dbtype <dbtype>')
    .action(function benchmarkTool(arg){
        // benchmarking.test();
        //
      benchmarking.benchmarkTool(arg);
    }

      // console.log(opt);
      //console.log(runtype);

      // bencmhark.chooseDbtype(dbtype);
    )

program.parse(process.argv);
