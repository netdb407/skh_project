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
let statusArr = []
var Promise = require('promise');
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1

// function delay(item) {
//   return new Promise(function(resolve, reject){
//     setTimeout(function(){
//       console.log(item);
//       resolve();
//     },1000)
//   })
// }
//
// async function test(array) {
//   for(let i=0; i< array.length; i++){
//     await delay(array[i]);
//   }
//   console.log('Done');
// }
// test([1,2,3,4,5]);
//
//
//
// 반복분
//
//
//
// const doSomething = value =>
//   new Promise(resolve =>
//     setTimeout(() => resolve(value >= 5 ? 'ok': 'no'), 1000))
//
// const loop = value =>
//   doSomething(value).then(result => {
//     console.log(value)
//     if (result === 'ok') {
//       console.log('yay')
//     } else {
//       return loop(value + 1)
//     }
//   })
//
// loop(1).then(() => console.log('all done!'))
//
//


let checktemp1 = function check(status, nodeIPArr, nodetool_ip){
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
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');
    let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    let checkcmd = exec(statuscmd)

    let results = '';

    checkcmd.stdout.on('data', function(data){
      results += data.toString();
      let temp = results.match('UN')
      if(temp !== null){
        tempArray.push(temp)
      }
      // console.log('tempArray : ', tempArray.length);
      if(tempArray.length ==3){
        return resolve(status * -1);  //1
      }
    })


    checkcmd.stderr.on('data', function(data){
      console.log(chalk.red.bold('[ERROR]'), 'stderr error!!');
      return reject(status); //-1
    })
  });

}

let checktemp2 = function check2(status){
  successLog = console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
  failedLog = console.log(chalk.green.bold('[INFO]'), 'check cassandra again');
  setTimeout(function () {
    resolve(status == 1 ? successLog : failedLog);
  }, 2000)
      // setTimeout(() => resolve(value >= 5 ? 'ok': 'no'), 1000))
}


const loop = value =>
  doSomething(value).then(result => {
    console.log(value)
    if (result === 'ok') {
      console.log('yay')
    } else {
      return loop(value + 1)
    }
  })


let loop = status =>
  checktemp1(status).then(res => {
    checktemp2(res)
  })



checktemp1(status).then(res => {
  checktemp2(res)
})



// let checktemp2 = check2(status, nodeIPArr, nodetool_ip)
// .then(res => {
//   console.log('huuuu');
//   check2(res)
// })
// .then(res => {
//   console.log('res');
//   if(res == 1){
//     console.log('success');
//   }else{
//     console.log('failed');
//     return loop(status)
//   }
// })



















//
//
//
// successLog = console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
// failedLog = console.log(chalk.green.bold('[INFO]'), 'check cassandra again');
//
//
// setTimeout(() => {
//   check(status, nodeIPArr, nodetool_ip)
//   resolve(status == 1 ? successLog : failedLog), 2000)
// }
// const loop = value =>
// check(status, nodeIPArr, nodetool_ip)
//  .then(res => {
//    if res == 1
//     benchmarking
//   else
//    return loop(status)
//  })
//
//  loop(1).then(()=> console.log('start!');)
