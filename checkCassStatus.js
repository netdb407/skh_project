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
// checkNodeStatus(nodetool_ip);

// while(tempArray.length < 3){
//   setTimeout(function (){
//     console.log('setTimeout');
//       checkNodeStatus(nodetool_ip)
//       console.log('왜 반복을 안하지');
//     }, 3000)
// }


// function test(){
//   checkNodeStatus(nodetool_ip)
// }
//
// var test2 = setInterval(test, 3000)
// setTimeout(function(){
//   clearInterval(test2)
// }, 5000)
//
// if(tempArray.length < 3){
//   setTimeout(function (){
//     console.log('setTimeout');
//       checkNodeStatus(nodetool_ip)
//       console.log('왜 반복을 안하지');
//     }, 3000)
// }else if(tempArray.length == 3){
//   clearTimeout()
//   console.log('Now you can use cassandra from cluster nodes');
// }

function test(){
  checkNodeStatus(nodetool_ip)
}


//var test = checkNodeStatus(nodetool_ip)
setTimeout(test, 3000);






// setTimeout(function (){
//   console.log('setTimeout');
//     checkNodeStatus(nodetool_ip)
//     console.log('왜 반복을 안하지');
//   }, 3000)


//조건에 맞으면 종료시키고
//맞지 않으면 다시 실행
//
// if(tempArray.length !== 3){
//
// }else if(tempArray.length == 3){
//
// }






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
  //console.log('setTimeout');
  let cmd = `ssh root@${ip} /home/skh/cassandra/bin/nodetool status`
  let checkcmd = exec(cmd)
  checkcmd.stdout.on('data', function(data){
    countUN = data.match(/UN/g);
    if(countUN != null && tempArray.length < 4){
      tempArray.push(countUN.length)
       console.log('tempArray:', tempArray);
       console.log('tempArrayLength:', tempArray.length);
       console.log('waiting for cassandra on...');

      // while(tempArray.length < 3){
      //   tempArray.push(countUN.length)
      //   //console.log('tempArray:', tempArray);
      //   //console.log('tempArrayLength:', tempArray.length);
      //   console.log('waiting for cassandra on...');
      // }


    }
    if(tempArray.length == 3){
      console.log('Now you can use cassandra from cluster nodes');
    }
  })


  // setTimeout(function(){
  //
  //
  //   // checkcmd.on('exit', function(code){
  //   //   // if(tempArray.length>0 && tempArray.length<4){
  //   //   //   sumtemp = tempArray.reduce((acc, cur, i) => {
  //   //   //     //console.log(acc, cur, i);
  //   //   //     let sum = acc + cur
  //   //   //     return sum;
  //   //   //   })
  //   //   // }
  //   //   if(tempArray.length==3){
  //   //     isOnCassandra = true
  //   //     clearTimeout(setIntervalFunc);
  //   //     console.log('isOnCassandra : ', isOnCassandra);
  //   //     console.log('Now you can use cassandra from cluster nodes');
  //   //   }
  //   //
  //   // })
  // }, 3000);
}

// function finish(){
//   if(tempArray.length == 3){
//     console.log('Now you can use cassandra from cluster nodes');
//   }
// }

// while(tempArray.length <4){
//   console.log('waiting for cassandra on...');
//   console.log('tempArrayLength:', tempArray.length);
//
//
//   // setTimeout(function (){
//   //   checkNodeStatus(nodetool_ip)
//   // }, 1000)
// }
// console.log('Now you can use cassandra from cluster nodes');
