// const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
const graphbenchAction = require('../lib/graphbench.js')

module.exports.benchmarkTool = (arg) => {
console.log(arg);

  switch(arg){
    case 'ycsb' :
      // require('../lib/ycsb.js');
      console.log('함수 실행 전');
      ycsbAction.ycsbRun();
      break;
    case 'graphbench' :
      graphbenchAction.graphbenchRun();
      break;

  }
}
