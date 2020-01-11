#!/usr/bin/env node

const program = require('commander');
const installation = require('./Installation/bin/install.js')
const benchmarking = require('./Benchmarking/bin/benchmark.js')

const subprogram = require('./Benchmarking/lib/subcommander.js')

program
  .command('install')
  .arguments('<opt>')
  .option('-p, --package')
  .action(function installPackage(opt){
    //console.log(opt);
    installation.installPackage(opt);
  })


// program
//     .command('benchmark')
//     .arguments('<ycsb|graphbench>')
//     // .option('-d, --dbtype <dbtype>')
//     .action(function benchmarkTool(arg){
//         // benchmarking.test();
//         //
//       benchmarking.benchmarkTool(arg);
//     }
//
//       // console.log(opt);
//       //console.log(runtype);
//
//       // bencmhark.chooseDbtype(dbtype);
//     )


const benchmarkCommand = subprogram
        .command('benchmark')
        .forwardSubcommands();

          benchmarkCommand
            .command('ycsb')
            .option('-d, --dbtype <dbtype>')
            .option('-r, --runtype <runtype>')
            .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
            .option('-w --wlfile <wlfile>', `workload file을 입력`)
            .option('-c --config <config>', `config 파일 입력`)
            .option('-n, --name <name>', `name을 입력`)
            .option('-o, --output <output>', `output directory 지정`)
            .action(function(options){
                    console.log(options.dbtype);
                    // console.log(options.runtype);
                    //
                    // switch(options.dbtype){
                    //   case 'cassandra' :
                    //   console.log('cassandra');

                    // }
                  })

          benchmarkCommand
            .command('graphbench')
            .option('-d, --dbtype <dbtype>')




program.parse(process.argv);
subprogram.parse(process.argv);
