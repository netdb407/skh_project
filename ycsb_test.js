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
let datatemp


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
  test = setInterval(function(){
    let cmd = `ssh root@${ip} /home/skh/cassandra/bin/nodetool status`
    let checkcmd = exec(cmd)

    checkcmd.stdout.on('data', function(data){
      datatemp = data
      console.log(datatemp);
    })

    checkcmd.on('exit', function(code){

     // count = datatemp.search(/UN/g);
     count = datatemp.match(/UN/g);
     // let tempVar = datatemp.includes("UN")
     // console.log('tempVar:', tempVar);



      //match보다 split이 빠르데!
      //includes함수도 있음
      //exec() vs match() vs test() vs search() vs indexOf()
      //search, match
      //!!! 뭘 쓰든 존나 느리다 !
      //그치만 계속 로그를 찍으면서 count 하는 건 불필요해 보임


      console.log('count : ', count);



      if(count!==null){
        countNum++
        console.log(count.length);
      }

      // if(count!=-1){
      //   countNum++
      // }
      //




      console.log('isOnCassandra : ', isOnCassandra);
      console.log('countNum :', countNum, '\n\n\n');

      if(countNum === 3){
        isOnCassandra = true
        clearInterval(test);
        console.log('Now you can use cassandra from cluster nodes');
      }
    })

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
