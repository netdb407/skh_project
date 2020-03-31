#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const chalk = require('chalk')
let ip //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();
ip = node_ip.split(',');
let countUN
let isOnCassandra = false
let setIntervalFunc
let tempArray = []
let sumtemp


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
  setIntervalFunc = setInterval(function(){
    let cmd = `ssh root@${ip} /home/skh/cassandra/bin/nodetool status`
    let checkcmd = exec(cmd)

    checkcmd.stdout.on('data', function(data){
      countUN = data.match(/UN/g);
      if(countUN != null){
        tempArray.push(countUN.length)
      }
    })

    checkcmd.on('exit', function(code){
      if(tempArray.length>0 && tempArray.length<4){
        sumtemp = tempArray.reduce((acc, cur, i) => {
          //console.log(acc, cur, i);
          let sum = acc + cur
          return sum;
        })
      }

      isOnCassandra = true
      clearInterval(setIntervalFunc);
      console.log('isOnCassandra : ', isOnCassandra);
      console.log('Now you can use cassandra from cluster nodes');

    })

  }, 3000);
}
