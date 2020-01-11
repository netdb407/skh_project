// const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')
const graphbenchAction = require('../lib/graphbench.js')


module.exports.benchmarkTool = (options) => {
// console.log(arg);
  switch(options.dbtype){
    case 'cassandra' :
      // require('../lib/ycsb.js');
      // console.log(options);
      ycsbAction.ycsbRun(options);
      break;
    case 'arangodb' :
      ycsbAction.ycsbRun();
      break;
    case 'orientdb' :
      graphbenchAction.graphbenchRun();
      break;

  }

}
