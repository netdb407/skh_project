// const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')

module.exports.benchmarkTool = (arg) => {

  switch(arg){
    case 'ycsb' :
      // require('../lib/ycsb.js');
      ycsbAction.ycsbRun();
      break;
  }

}
