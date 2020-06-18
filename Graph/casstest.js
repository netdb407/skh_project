#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const childProcess = require("child_process");
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
   runCassandra(ip);
   console.log('??');
  }
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
  console.log(chalk.green.bold('[INFO]'), 'check Node Status');
  checkNodeStatus(nodetool_ip)
  console.log('foundlength : ', found.length);
  while(found.length<2){
    checkNodeStatus(nodetool_ip)
  }
  console.log(chalk.blue.bold('[INFO]'), 'Now you can use cassandra from cluster nodes')
  // try{
  //  execute(checkNodeStatus(nodetool_ip));
  // }catch(e){
  //  //console.log(e)
  // };
 // while(found.length<3){
 //  console.log(chalk.yellow.bold('[INFO]'), 'Waiting for cassandra ON ...');
  // if(found.length<3){
//   setTimeout(checkNodeStatus(nodetool_ip), 3000);
  // }
  // }

}


function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise(function(resolve, reject) {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject();
        return;
      }
      if (standardError) {
        reject(standardError);
        return;
      }
      resolve(standardOutput);
    });
  });
}


async function runCassandra(ip){
  firewallcmd = `ssh root@${ip} systemctl stop firewalld`
  killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
  runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -fR`
  console.log('firewallcmd : ', firewallcmd);
  try{
   await execute(firewallcmd);
   console.log(chalk.green.bold('[INFO]'), 'stop firewall');
  }catch(e){
   //console.log(e)
  };
  try{
   await execute(killcmd);
  }catch(e){
   //console.log(e)
  };
  try{
   await execute(runcmd);
  }catch(e){
  //console.log(e)
  };
  console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
// try{
//    exec(`ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`)
//    exec(`ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -fR`)
//    console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
//  }
//  catch(e){ console.log(e); }
}

function checkNodeStatus(nodetoolIP){
  let cmd = `ssh root@${nodetoolIP} /root/ssdStorage/cassandra/bin/nodetool status`
  let checkcmd = exec(cmd)
  checkcmd.stdout.on('data', function(data){
    //console.log('data :', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    found = tempArray.filter(un => un == 0);
   // console.log(found);
    return found;
  })
}
