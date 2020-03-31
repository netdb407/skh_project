#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const chalk = require('chalk')
let ip //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();
ip = node_ip.split(',');
let countNum=0
let count
let isOnCassandra = false
let test



for(var i of ip){
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(i));
  stopfirewalld(i);
  runCassandra(i);
}
console.log('----------------------------------------------------------');
console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
console.log(chalk.green.bold('[INFO]'), 'check Node Status');
checkNodeStatus(nodetool_ip);





function stopfirewalld(ip){
  try{
    exec(`ssh root@${ip} systemctl stop firewalld`)
    console.log(chalk.green.bold('[INFO]'), 'stop firewall');
  }
  catch(e){
    console.log(e);
  }
}



function runCassandra(ip){
  try{
    exec(`ssh root@${ip} /home/skh/cassandra/bin/cassandra -fR`)
    console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
  }
  catch(e){
    console.log(e);
  }
}




function checkNodeStatus(ip){
  test=setInterval(function(){
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
      if(countNum == 0){
        console.log('waiting for cassandra on...');
        console.log('isOnCassandra : ', isOnCassandra);
      }else if(countNum == 3){
        isOnCassandra = true
        console.log('Now you can use cassandra from cluster nodes');
        console.log('isOnCassandra : ', isOnCassandra, '\n\n\n');
      }
    })
    if(isOnCassandra){
      clearInterval(test);
    }
  }, 3000);
}


// var count =0
// var repeat = setInterval(function(){
//   console.log('setInterval');
//   count++;
//   if(count==5){
//     clearInterval(repeat);
//   }
// }, 3000)
