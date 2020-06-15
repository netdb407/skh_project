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
let status = -1





check1(status, nodeIPArr, nodetool_ip)
  // .then(check2(status))
  // .then(check3(status))
  .then(res => {
    console.log('resss:', res);
    console.log('last :', chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
  })
  .catch(err => {
    setTimeout(function () {
       check1(status, nodeIPArr, nodetool_ip)

    }, 3000).then(res => {
      console.log('resss:', res);
      console.log('last :', chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
    })
  })



function check1(status, nodeIPArr, nodetool_ip) {
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
      //4
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
      console.log(chalk.green.bold('[INFO]'), 'check Node Status');
      let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
      let checkcmd = exec(statuscmd)

      let results = '';
      console.log('test!!');

      checkcmd.stdout.on('data', function(data){
        // console.log('stdout data======>', data);
        console.log('stdout!!');
        results += data.toString();
        // console.log('results : ', results);

        let temp = results.match('UN')
        if(temp !== null){
          tempArray.push(temp)
        }
        // console.log('before : ', status);
        if(tempArray.length ==3){
          console.log('check1 :', status);
          return resolve(status * -1);
        }
        //console.log('tempArray length ===>', tempArray.length);

      })



      checkcmd.stdin.on('data', function(data){
        console.log('stdin!!');
        results += data.toString();
        // console.log('results : ', results);

        let temp = results.match('UN')
        if(temp !== null){
          tempArray.push(temp)
        }
        if(tempArray.length ==3){
          console.log('check1 :', status);
          return resolve(status * -1);
        }
      })

      checkcmd.stderr.on('data', function(data){
        console.log('stderr!!');
        //상태확인 재실행

        return reject( console.log('error!') );

      })



    });
}



// function check2(status){
//   return new Promise(function(resolve, reject) {
//     status = 2
//     console.log('check2 : ', status);
//       return resolve( status);
//     // }
//   });
// }



// function check3(status) {
//     return new Promise(function(resolve, reject) {
//       // if(status == true){
//       console.log('check3 :', status);
//         return resolve( status);
//       // }
//     });
// }
