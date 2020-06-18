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
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1




testtt(status, nodeIPArr, nodetool_ip)

async function testtt(status, nodeIPArr, nodetool_ip){
  runExec(status, nodeIPArr, nodetool_ip)
  let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
  // console.log('resTemp : ', resTemp);
  let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1
  console.log(chalk.green.bold('[INFO]'), 'Success:1, Failed:-1');
  console.log('isOK : ', isOK);
  if(isOK == 1){
    console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
  }else{
    console.log(chalk.red.bold('[ERROR]'), 'check cassandra again');
    testtt(status, nodeIPArr, nodetool_ip)
  }
}







// while (good == false) {
  // check(status, nodeIPArr, nodetool_ip)
  //   .then(res => {
  //     // good = true
  //     console.log('then resolve res :', res);  //1
  //     if(res == 1){
  //       return console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
  //     }else{
  //       //함수 재실행 setTimeout
  //       console.log(chalk.yellow.bold('[INFO]'), 'check cassandra again');
  //       check(status, nodeIPArr, nodetool_ip)
  //     }
  //   })

    // .catch(err => {
    //   console.log('catch err res : ', err);
    //   console.log('----------------------------------------------------------');
    //   console.log(chalk.yellow.bold('[INFO]'), 'check cassandra again');
    //   console.log('status : ', err); // -1
    //   // setTimeout(function () {
    //   if(err == -1){
    //     check(status, nodeIPArr, nodetool_ip)
    //     // .then(res2 => {
    //     //   console.log('res2 : ', res2);
    //     //   if(res == 1){
    //     //     return console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
    //     //   }
    //     // })
    //   }
    //
    //   //   console.log('status : ', err);
    //   //   //재귀호출 ..
    //   // }, 3000)
    //   // loop_cnt += 1
    //   return err
    // })

// }



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
      return console.log('run complete!');
    });
}





function stdout_results(status, nodeIPArr, nodetool_ip){
  return new Promise(function(resolve, reject){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');
    let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    let checkcmd = exec(statuscmd)

    let results = ''

    checkcmd.stdout.on('data', function(data){
      results += data.toString()
    })

    checkcmd.on('exit', function(code){
      //console.log('results : \n', results);
      return resolve(results)
    })

    checkcmd.stderr.on('data', function(data){
      return resolve(console.log('stderr error!'))
    })

  });
}

// function stdoutTest(status, nodeIPArr, nodetool_ip){
//   return new Promise(function(resolve, reject){
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
//     console.log(chalk.green.bold('[INFO]'), 'check Node Status');
//     let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
//     let checkcmd = exec(statuscmd)
//
//     let results = ''
//     let unArray = []
//     let dnArray = []
//     // console.log('?');
//
//     checkcmd.stdout.on('data', function(data){
//       console.log('data : ', data);
//       results += data.toString()
//       // console.log('results : ', results);
//       return resolve(results);
//     })
//
//     // checkcmd.stderr.on('data', function(data){
//     //   console.log(chalk.red.bold('[ERROR]'), 'stderr error!!');
//     //   return reject(status); //-1
//     // })
//
//     // checkcmd.on('exit', function(data){
//     //   // console.log('data : ', data);
//     //   // results += data.toString()
//     //   console.log('results12 : ', results);
//     // })
//
// });
// }




function find_UN_DN(results){
  return new Promise(function(resolve, reject) {
  console.log('nodetool status results: \n', results);
  let unTemp = 0
  let dnTemp = 0

  let unTemp1 = results.toString().match(/UN/gi)
  if(unTemp1 !== null){
    unTemp = unTemp1.length
  }
  console.log('count UN : ', unTemp)

  let dnTemp1 = results.toString().match(/DN/gi)
  if(dnTemp1 !== null){
    dnTemp = dnTemp1.length
  }
  console.log('count DN : ', dnTemp);

  if(unTemp == 3){
    return resolve(status * -1) //success : 1
  }else{
    return resolve(status)  //fail : -1
  }
});
}
