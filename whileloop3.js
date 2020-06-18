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


const doSomething = value =>
  new Promise(resolve =>
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


    checkcmd.stdin.on('data', function(data){
      results += data.toString();
      let temp = results.match('UN')
      if(temp !== null){
        tempArray.push(temp)
      }
      // console.log('tempArray : ', tempArray.length);
      if(tempArray.length ==3){
        status * -1
      }
    })

    checkcmd.stderr.on('data', function(data){
      console.log(chalk.red.bold('[ERROR]'), 'stderr error!!');
    })
  });

    setTimeout(() => resolve(status == 1 ? 'ok': 'no'), 1000))

const loop = value =>
  doSomething(value).then(result => {
    console.log(value)
    if (result === 'ok') {
      return value * -1
    } else {
      check()
      return loop(value)
    }
  })

loop(-1).then((res) => {
  console.log('RES', res);
  // console.log('all done!');
  if(res == 1){
    console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
  }else{
    console.log(chalk.red.bold('[INFO]'), 'check cassandra again');
  }
})
