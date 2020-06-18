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

    setTimeout(() => resolve(value == 1 ? 'ok': 'no'), 1000))

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
