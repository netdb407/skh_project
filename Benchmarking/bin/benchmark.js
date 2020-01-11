// const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
console.log('왜 실행되지?');
module.exports.benchmarkTool = (arg) => {
console.log(arg);
  switch(arg){
    case 'ycsb' :
      // require('../lib/ycsb.js');
      ycsbAction.ycsbRun();
      break;
  }

}
