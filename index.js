#!/usr/bin/env node

const program = require('commander')
const subprogram = require('./Benchmarking/lib/subcommander.js')


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

program.parse(process.argv)


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
            .action(function benchmarkTool(options){
              console.log(options.dbtype);
                    console.log(options._name);

                    benchmarking.benchmarkTool(options._name);

                    // console.log(options.runtype);
                    //
                    // switch(options.dbtype){
                    //   case 'cassandra' :
                    //   console.log('cassandra');
                    // }
                  })
            .parse(process.argv)

          benchmarkCommand
            .command('graphbench')
            .option('-d, --dbtype <dbtype>')
            .action(function benchmarkTool(options){
                    console.log(options._name);
                    benchmarking.benchmarkTool(options._name);

                    // console.log(options.runtype);
                    //
                    // switch(options.dbtype){
                    //   case 'cassandra' :
                    //   console.log('cassandra');

                    // }
                  })
            .parse(process.argv);


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




// subprogram.parse(process.argv);
