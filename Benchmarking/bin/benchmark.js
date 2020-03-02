const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
const graphbenchAction = require('../lib/graphbench.js')
const chalk = require('chalk');

program
  .command('benchmark')
  .option('-d, --dbtype <dbtype>', `dbtype을 입력해주세요. [cassandra, arangodb, orientdb]`)
  .option('-r, --runtype <runtype>', `runtype을 입력해주세요. [load, run, loadrun]`)
  .option('-l, --loadsize <loadsize>', `load size를 입력해주세요. [###M, ###G, ###T]`)
  .option('-w, --wlfile <wlfile>', `workload file의 type 또는 이름을 입력해주세요. [type:news, contents, facebook, log, recommendation ..]`)
  // .option('-c --config <config>', `config 파일 입력`)
  .option('-n, --name <name>', `benchmark name을 입력해주세요.`)
  .option('-o, --output <output>', `output directory를 지정해주세요.`)
  .option('-s, --timewindow <timewindow>', `time window(sec)를 지정해주세요.`)
  .option('-t, --threads <threads>',`threads 수를 지정해주세요.`)
  .action(function(opt){

    checkDBtype(opt)
})

program.parse(process.argv);


function checkDBtype(opt){
  // console.log(opt);
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
      console.log(chalk.red.bold('[ERROR]'), 'dbtype : insert (cassandra, arangodb, orientdb)를 입력해주세요.')
      break;
    }
}

// module.exports.benchmarkTool = (arg) => {
// // console.log(arg.dbtype);
//
//   switch(arg){
//     case 'cassandra' :
//       require('../lib/ycsb.js');
//       // console.log('함수 실행 전');
//       // ycsbAction.ycsbRun();
//       break;
//     case 'graphbench' :
//       graphbenchAction.graphbenchRun();
//       break;
//
//   }
// }
