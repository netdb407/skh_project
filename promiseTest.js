#!/usr/bin/env node

// 소민이가 실행하는 상태확인 함수 1개 => checkCassON()
//
// checkCassON()함수 => return promise 객체
// 1. 노드3개를 돌며 방화벽 해제
// 2. 노드 3개를 돌며 카산드라 켜기(그 전에 kill?)
// 3. 상태 출력해서 UN을 담는 배열 생성하고 배열 길이로 true/false 체크
//
// checkCassON()을 이용해서 변수 생성 => statusCass
//
// statusCass로 .then(카산드라 벤치마크 수행), .catch(checkCassON()함수 재실행)
//
//
//
// function checkCassON(nodeIP, nodetool_ip){
//   //for문 ?
//   1. 193, 194, 195 방화벽 해제
//   2. 193, 194, 195 kill
//   3. 193, 194, 195 카산드라 켜기
//   4. nodetool 193에서 nodetool status로 상태 출력하고 배열 생성
//   5. 배열 길이로 statusCass 변수 생성 : true/false
// }
//
// statusCass.then(카산드라 벤치마킹), .catch(checkCassON()재실행)
//
// -----------------------------------------------------------------
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
let statusCass = false




function checkCassON(nodeIPArr, nodetool_ip){
// const checkcas = (nodeIPArr, nodetool_ip) => {
  return new Promise((resolve, reject) => {
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
  //4
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
  console.log(chalk.green.bold('[INFO]'), 'check Node Status');
  let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
  let checkcmd = exec(statuscmd)

  let results = '';

  checkcmd.stdout.on('data', function(data){
    // console.log('stdout data======>', data);

    results += data.toString();
    //console.log('results : ', results);

    let temp = results.match('UN')
    if(temp !== null){
      tempArray.push(temp)
    }
    console.log('tempArray length ===>', tempArray.length);
    if(tempArray.length ==3){
      statusCass = true
    }
    console.log('statusCass ===> : ', statusCass);
    resolve(statusCass);
  })

  checkcmd.stderr.on('data', function(data){
    console.log('stderr data====>', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    statusArr = tempArray.filter(un => un == 0);
    console.log('===> stderr_statusArr : ', statusArr);
    if(statusArr.length ==3){
      statusCass = true
    }
    reject( console.log('error!') );
  })

})
}





function getStatus(){
  return new Promise(function(resolve, reject){

    if(res == true){
      resolve( console.log('please ..'));
    }else{
      reject(console.log('sdsd ..'));
    }
  })
}



checkCassON(nodeIPArr, nodetool_ip)
  .then(getStatus())
  .then(res => console.log('ressssssss:', res))





//
// let statustest = getStatus(statusCass)
//
// console.log('====>statustest : ', statustest);
//
//
//
// statustest.then(result =>{
//   console.log('result: ', result);
//   if(result){
//     console.log(chalk.green.bold('[INFO]'), 'start cassandra benchmarking');
//   }else{
//     console.log(chalk.green.bold('[INFO]'), 'try again nodetool status');
//   }
// })



// function checkCassON(nodeIPArr, nodetool_ip){
//   return new Promise(function(resolve, reject){
//     //1~3
//     nodeIPArr.forEach(function(ip){
//       let firewallcmd = `ssh root@${ip} systemctl stop firewalld`
//       // let killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
//       let runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -R`
//       console.log('----------------------------------------------------------');
//       console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
//       exec(firewallcmd)
//       console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
//       // exec(killcmd)
//       exec(runcmd)
//       console.log(chalk.green.bold('[INFO]'), 'run Cassandra in', `${ip}`);
//     })
//     //4
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
//     console.log(chalk.green.bold('[INFO]'), 'check Node Status');
//     let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
//     let checkcmd = exec(statuscmd)
//
//     let results = '';
//
//     checkcmd.stdout.on('data', function(data){
//       // console.log('stdout data======>', data);
//
//       results += data.toString();
//       //console.log('results : ', results);
//
//       let temp = results.match('UN')
//       if(temp !== null){
//         tempArray.push(temp)
//       }
//       console.log('tempArray length ===>', tempArray.length);
//       if(tempArray.length ==3){
//         statusCass = true
//       }
//       console.log('statusCass ===> : ', statusCass);
//       return resolve(statusCass);
//     })
//
//     checkcmd.stdin.on('data', function(data){
//       console.log('stdin data====>', data);
//       const testdata = data.split(' ');
//       tempArray.push(testdata.indexOf('UN'));
//       statusArr = tempArray.filter(un => un == 0);
//       console.log('===> stdin_statusArr : ', statusArr);
//       if(statusArr.length ==3){
//         statusCass = true
//       }
//     })
//
//     checkcmd.stderr.on('data', function(data){
//       console.log('stderr data====>', data);
//       const testdata = data.split(' ');
//       tempArray.push(testdata.indexOf('UN'));
//       statusArr = tempArray.filter(un => un == 0);
//       console.log('===> stderr_statusArr : ', statusArr);
//       if(statusArr.length ==3){
//         statusCass = true
//       }
//       return reject( console.log('error!') );
//     })
//
//   })
// }

// let checktest = checkCassON(nodeIPArr, nodetool_ip)
// statusCass = checktest
// console.log('#######   statusCass : ', statusCass);


//
// function success(result){
//   console.log('success');
// }
// function failure(error){
//   console.log('fail');
// }
//
//
// checkCassON(nodeIPArr, nodetool_ip).then(result => success(result))


// checkCassON().then(success, failure);
