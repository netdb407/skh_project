const program = require('commander')
//const ycsbAction = require('../lib/ycsb.js')
//const graphbenchAction = require('../lib/graphbench.js')
const property = require('../../propertiesReader.js')
const cassandraAction = require('../lib/cassandra_conf.js')

var nodes = property.get_nodes();
var node_arr = nodes.split(',');
var password = property.get_password();


program
  .command('benchmark')
  .option('-d, --dbtype <dbtype>', `dbtype을 입력 (cassandra, arangodb, orientdb)`)
  .option('-r, --runtype <runtype>', `runtype을 입력 (load, run, loadrun)`)
  .option('-l, --loadsize <loadsize>', `load size를 입력 (###M, ###G, ###T)`)
  .option('-w, --wlfile <wlfile>', `workload file을 입력`)
  .option('-c, --config <config>', `config 파일 입력`)
  .option('-n, --name <name>', `name을 입력`)
  .option('-o, --output <output>', `output directory 지정`)
  .action(function(opt){
    //conf확인
    checkConf(opt)	
    //conf변경하고 DB실행
    //checkDBtype(opt)
})

program.parse(process.argv)

function checkConf(opt){
  switch(opt.config){
    case 'cassandra' :
      //송희 추가
      var version = property.get_cassandra_version()
      var nodes = property.get_nodes()
      var node_dir = property.get_node_cassandra_dir()
      var node_cassandraHome = `${node_dir}/${version}`
      var node_conf = `${node_cassandraHome}/conf/cassandra.yaml`
      var benchmark_dir = property.get_benchmark_dir()
      var benchmark_conf = `${benchmark_dir}cassandra.yaml` 

      var fs = require('fs');
      var exists = fs.existsSync(`${benchmark_conf}`);
      if(exists==true){
       cassandraAction.cassandraConfig(password, node_arr, benchmark_conf, node_conf);
       console.log('[set cassandra configuration]');
      }else{
       console.log('conf file not found');
       break;
      }
      break;
    default :
      console.log('[ERROR] config : (cassandra, arangodb, orientdb)를 입력해주세요.')
      break;
    }
}





