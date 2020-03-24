#!/usr/bin/env node

const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
const graphbenchAction = require('../lib/graphbench.js')
const chalk = require('chalk')
const error = chalk.bold.red('ERR!')

program
  .command('benchmark')
  .option('-d, --dbtype <dbtype>', `insert dbtype, choose from 'cassandra', 'arangodb', 'orientdb'`)
  .option('-r, --runtype <runtype>', `insert runtype, choose from 'load', 'run', 'loadrun'`)
  .option('-l, --loadsize <loadsize>', `insert load size [###M, ###G, ###T]`)
  .option('-w, --wlfile <wlfile>', `insert workload file type or name [type:news, contents, facebook, log, recommendation ..]`)
  // .option('-c --config <config>', `config 파일 입력`)
  .option('-n, --name <name>', `insert benchmark name`)
  .option('-o, --output <output>', `assign output directory (server, node)`)
  .option('-s, --timewindow <timewindow>', `insert time window(sec)`)
  .option('-t, --threads <threads>',`insert number of threads`)
  .option('-c, --casstracing <casstracing>',`set the cassandra tracing option to 'on', 'off'`)
  .action(function(opt){

    checkDBtype(opt)
})

program.parse(process.argv);


function checkDBtype(opt){
  let dbtypeInfo = chalk.magenta('dbtype')
  switch(opt.dbtype){
    case 'cassandra' :
      ycsbAction.ycsb(opt);
      break;
    case 'arangodb' :
      ycsbAction.ycsb(opt);
      break;
    case 'orientdb' :
      // graphbenchAction.graphbench(opt)
      ycsbAction.ycsb(opt);
      break;
    default :
      let dbtypeLine = `${error} ${dbtypeInfo} : invalid choice ${opt.dbtype}, (choose from 'cassandra', 'arangodb', 'orientdb')`
      console.log(dbtypeLine)
      break;
    }
}
