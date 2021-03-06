#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const childProcess = require("child_process");
const chalk = require('chalk')
let nodeIPArr //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();
nodeIPArr = node_ip.split(',');
var Promise = require('promise');
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0


runExec(status, nodeIPArr, nodetool_ip)
checkStatus_Cass(status, nodeIPArr, nodetool_ip)



async function checkStatus_Cass(status, nodeIPArr, nodetool_ip){
  let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
  // console.log('resTemp : ', resTemp);
  let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
  console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
  if(isOK == 1){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
    console.log('----------------------------------------------------------');

  }else if(isOK == -1){
    console.log('----------------------------------------------------------');
    console.log(chalk.red.bold('[ERROR]'), 'check cassandra again .. waiting for 20 seconds');
    setTimeout(checkStatus_Cass, 1000 * 20, status, nodeIPArr, nodetool_ip)
  }else if(isOK == 0){
    console.log('----------------------------------------------------------');
    console.log(chalk.red.bold('[ERROR]'), 'stderr');
  }
}



function runExec(status, nodeIPArr, nodetool_ip) {
    return new Promise(function(resolve, reject) {
      nodeIPArr.forEach(function(ip){
        let firewallcmd = `ssh root@${ip} systemctl stop firewalld`

        //#수정하기! <hdd성능평가용으로 잠시 디렉토리 변경함> config에 cassandrahome
        // let runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -R`
        let runcmd = `ssh root@${ip} /root/ssdStorage/KNUT/test/cassandra/bin/cassandra -R`
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
        exec(firewallcmd)
        console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
        exec(runcmd)
        console.log(chalk.green.bold('[INFO]'), 'run Cassandra in', `${ip}`);
      })
      console.log('----------------------------------------------------------');
      return console.log(chalk.green.bold('[INFO]'), 'run exec complete!');
    });
}




function stdout_results(status, nodeIPArr, nodetool_ip){
  return new Promise(function(resolve, reject){
    console.log('----------------------------------------------------------');
    //console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');

    //#수정하기! <hdd성능평가용으로 잠시 디렉토리 변경함> config에 cassandrahome
    // let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/KNUT/test/cassandra/bin/nodetool status`
    let checkcmd = exec(statuscmd)

    let results = ''

    checkcmd.stdout.on('data', function(data){
      results += data.toString()
    })

    checkcmd.on('exit', function(code){
      //console.log('results : \n', results);
      return Promise.resolve(results)
    })

    checkcmd.stderr.on('data', function(data){
      return Promise.resolve(status*0)
    })

  });
}



function find_UN_DN(results){
  return new Promise(function(resolve, reject) {
  let unTemp = 0
  let dnTemp = 0

  let unTemp1 = results.toString().match(/UN/gi)
  if(unTemp1 !== null){
    unTemp = unTemp1.length
  }
  let dnTemp1 = results.toString().match(/DN/gi)
  if(dnTemp1 !== null){
    dnTemp = dnTemp1.length
  }

  console.log(chalk.green.bold('[INFO]'), 'UN:', unTemp, ', DN:', dnTemp)

  if(unTemp == 3){
    return Promise.resolve(status * -1) //success : 1
  }else{
    return Promise.resolve(status)  //fail : -1
  }
});
}
