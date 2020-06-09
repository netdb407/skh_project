#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const chalk = require('chalk')
let nodeIPArr //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();
nodeIPArr = node_ip.split(',');
let tempArray = []
let found = []

main()

function main(){
  for(var ip of nodeIPArr){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
    stopfirewalld(ip);
    runCassandra(ip);
  }
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
  console.log(chalk.green.bold('[INFO]'), 'check Node Status');

  checkNodeStatus(nodetool_ip);
 // while(found.length<3){

   if(found.length<3){
      console.log(chalk.yellow.bold('[INFO]'), 'Waiting for cassandra ON ...');
  //   setTimeout(checkNodeStatus(nodetool_ip), 3000);
  }else{
    console.log(chalk.blue.bold('[INFO]'), 'Now you can use cassandra from cluster nodes')
  }
  // }
}

function stopfirewalld(ip){
  try{
    exec(`ssh root@${ip} systemctl stop firewalld`)
    console.log(chalk.green.bold('[INFO]'), 'stop firewall');
  }
  catch(e){ console.log(e); }
}

function runCassandra(ip){
  try{

    exec(`ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -fR`)
    console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
  }
  catch(e){ console.log(e); }
}

function checkNodeStatus(nodetoolIP){
  let cmd = `ssh root@${nodetoolIP} /root/ssdStorage/cassandra/bin/nodetool status`
  let checkcmd = exec(cmd)
  checkcmd.stdout.on('data', function(data){
    //console.log('data :', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    found = tempArray.filter(un => un == 0);
    //console.log(found);
    return found;
  })
}
