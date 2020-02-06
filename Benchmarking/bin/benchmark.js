const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
const graphbenchAction = require('../lib/graphbench.js')

program
  .command('benchmark')
  .option('-d, --dbtype <dbtype>', `dbtype을 입력 (cassandra, arangodb, orientdb)`)
  .option('-r, --runtype <runtype>', `runtype을 입력 (load, run, loadrun)`)
  .option('-l, --loadsize <loadsize>', `load size를 입력 (###M, ###G, ###T)`)
  .option('-w --wlfile <wlfile>', `workload file을 입력`)
  // .option('-c --config <config>', `config 파일 입력`)
  .option('-n, --name <name>', `name을 입력`)
  .option('-o, --output <output>', `output directory 지정`)
  .option('-t, --timewindow <timewindow>', `time window 지정(sec)`)
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
      console.log('[ERROR] dbtype : (cassandra, arangodb, orientdb)를 입력해주세요.')
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
