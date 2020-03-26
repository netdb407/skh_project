const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const chalk = require('chalk')


let ip //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();




//cassandra 상태확인함수 최초로 하고
//상태확인함수 작성 UN일때 리턴
//193,194,195 cassandra 키기 : cassandra 설치 디렉토리(/home/skh/skh_project)에서 bin/cassandra -fR
//192에서 노드 디비 상태 확인 : cassandra 설치 디렉토리에서 bin/nodetool status
//status 결과로 나오는거 캐치 : 노드별로 UN이 오면 다 켜진 것
//DN은 안켜진 것
//UN일때 true?
//DN일때 false 불리언으로 리턴
//10초에 한번씩 결과 다시 보내주는거 : 디비 켜지는데 시간이 걸리니까


ip = node_ip.split(',');
// console.log(ip);

//193,194,195
function stopfirewalld(ip){
  exec(`ssh root@${ip} systemctl stop firewalld`)
}

function runCassandra(ip){
  exec(`ssh root@${ip} /home/skh/cassandra/bin/cassandra -fR`)
}

//193
var temp
var countNum=0
var count
function checkNodeStatus(ip){
  // exec(`ssh root@${ip} /home/skh/skh_project/apache-cassandra-3.11.5/bin/nodetool status`)
  let cmd = `ssh root@${ip} /home/skh/cassandra/bin/nodetool status`
  let checkcmd = exec(cmd)
  checkcmd.stdout.on('data', function(data){
    console.log(data);
    count = data.match(/UN/g);
    if(count!=null){
      countNum++
    }
  })
  checkcmd.on('exit', function(code){
    console.log('countnum:',countNum);
  })
}



for(var i of ip){
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(i));
  console.log(chalk.green.bold('[INFO]'), 'stop firewall');
  stopfirewalld(i);
  console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
  runCassandra(i);
}
console.log('----------------------------------------------------------');
console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
console.log(chalk.green.bold('[INFO]'), 'check Node Status');
checkNodeStatus(nodetool_ip);


console.log('countNum is', countNum);
