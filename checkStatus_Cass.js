#!/usr/bin/env node

const property = require('./propertiesReader.js')
const exec =  require('child_process').exec
const childProcess = require("child_process");
const chalk = require('chalk')
let nodeIPArr //split array
let node_ip = property.get_nodes_IP();
let nodetool_ip = property.get_nodetool_IP();
nodeIPArr = node_ip.split(',');
let statusArr = []
var Promise = require('promise');
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0



runExec(status, nodeIPArr, nodetool_ip)
checkStatus_Cass(status, nodeIPArr, nodetool_ip)

// async function checkStatus_Cass(status, nodeIPArr, nodetool_ip){
//   runExec(status, nodeIPArr, nodetool_ip)
//   let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
//   // console.log('resTemp : ', resTemp);
//
//   let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
//
//   //20초 기다리기!!
//   //isOK 값에 따라 실행시키는걸 함수로 짠 다음에 setTimeout안에 넣기
//   //상태확인만 계속하기 ! 켜지말고 !!!
//   console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
//   if(isOK == 1){
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
//     console.log('----------------------------------------------------------');
//   }else if(isOK == -1){
//     let killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
//     exec(killcmd)
//     console.log('----------------------------------------------------------');
//     console.log(chalk.red.bold('[ERROR]'), 'kill cassandra process');
//   }else if(isOK == 0){
//     console.log('stderr~!!!');
//   }
//
// }
//





async function checkStatus_Cass(status, nodeIPArr, nodetool_ip){
  // runExec(status, nodeIPArr, nodetool_ip)
  let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
  // console.log('resTemp : ', resTemp);
  let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
  console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
  if(isOK == 1){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');

    setTimeout(function(){console.log('YCSB running code')}, 5000);
    console.log('----------------------------------------------------------');
  }else if(isOK == -1){
    console.log('----------------------------------------------------------');
    console.log(chalk.red.bold('[ERROR]'), 'check cassandra again');
    checkStatus_Cass(status, nodeIPArr, nodetool_ip)
  }else if(isOK == 0){
    console.log('stderr~!!!');
  }
}



function runExec(status, nodeIPArr, nodetool_ip) {
    return new Promise(function(resolve, reject) {
      nodeIPArr.forEach(function(ip){
        let firewallcmd = `ssh root@${ip} systemctl stop firewalld`
        // let killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
        let runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -R`
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
        exec(firewallcmd)
        console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
        // exec(killcmd)
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
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');
    let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    // let checkcmd = setTimeout(exec(statuscmd), 5000);
    let checkcmd = exec(statuscmd)
    // console.log('CHECKCMD', checkcmd)


    //20초
    // let isOK = await setTimeout(find_UN_DN(resTemp), 5000);

    let results = ''

    checkcmd.stdout.on('data', function(data){
      results += data.toString()
    })

    checkcmd.on('exit', function(code){
      //console.log('results : \n', results);
      return resolve(results)
    })

    checkcmd.stderr.on('data', function(data){
      return resolve(status*0)
    })

  });
}



function find_UN_DN(results){
  return new Promise(function(resolve, reject) {
  // console.log('nodetool status results: \n', results);
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
    return resolve(status * -1) //success : 1
  }else{
    return resolve(status)  //fail : -1
  }
});
}
