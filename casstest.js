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


main()

function main(){
  for(var ip of nodeIPArr){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
   runCassandra(ip);
   // test(ip);
  }
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
  console.log(chalk.green.bold('[INFO]'), 'check Node Status');
  var testarr = makeStatusArr(nodetool_ip)
  testarr.then((res) => {
    console.log('in main', res);
    checkNodeStatus(nodetool_ip)
  })
  .catch((err)=>{
    console.log('in main', err);
  })





    // checkNodeStatus(nodetool_ip).then((res) => {
    //   console.log('res : \n', res);
    //   return checkNodeStatus(nodetool_ip);
    // }).then((res)=>{
    //   console.log('promise어렵다');
    //   return console.log('다른함수쓰기');
    // })
    // console.log('statusArr in main', statusArr);
    // .then(function(result) {
    //   console.log('result in main', result);
    //   return result + 10;
    // })
    // .catch(function(err) {
    //   console.log(err);
    // })

  // console.log('in main', statusArr);
  // console.log('statusArrlength : ', statusArr.length);
//  while(statusArr.length<2){
//    checkNodeStatus(nodetool_ip)
//  }
  //console.log(chalk.blue.bold('[INFO]'), 'Now you can use cassandra from cluster nodes')
  // try{
  //  execute(checkNodeStatus(nodetool_ip));
  // }catch(e){
  //  //console.log(e)
  // };
 // while(statusArr.length<3){
 //  console.log(chalk.yellow.bold('[INFO]'), 'Waiting for cassandra ON ...');
  // if(statusArr.length<3){
//   setTimeout(checkNodeStatus(nodetool_ip), 3000);
  // }
  // }




}








function on_child_stdout(data) {
 	var str = data.toString(),
        lines = str.split(/\n/g);
	for (var i in lines) {
	  if (! lines[i]) {
        console.log(lines[i]);
	  }
	}
};

function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise(function(resolve, reject) {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject();
        return;
      }
      if (standardError) {
        reject(standardError);
        return;
      }
      resolve(standardOutput);
    });
  });
}



function runCassandra(ip){
  firewallcmd = `ssh root@${ip} systemctl stop firewalld`
  killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
  runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -fR`
  // console.log('firewallcmd : ', firewallcmd);
  // try{
  //  await execute(firewallcmd);
   console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
  // }catch(e){
  //  //console.log(e)
  // };
  // try{
  //  await execute(killcmd);
  // }catch(e){
  //  //console.log(e)
  // };
  // try{
  //  await execute(runcmd);
  // }catch(e){
  // //console.log(e)
  // };
  // exec(firewallcmd)
  // //exec(killcmd)
  // exec(runcmd)


  console.log(chalk.green.bold('[INFO]'), 'run Cassandra in', `${ip}`);
// try{
//    exec(`ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`)
//    exec(`ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -fR`)
//    console.log(chalk.green.bold('[INFO]'), 'run Cassandra');
//  }
//  catch(e){ console.log(e); }
}


// let myFirstPromise = new Promise((resolve, reject) => {
//   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
//   // In this example, we use setTimeout(...) to simulate async code.
//   // In reality, you will probably be using something like XHR or an HTML5 API.
//   setTimeout(function(){
//     resolve("Success!"); // Yay! Everything went well!
//   }, 250);
// });
//
// myFirstPromise.then((successMessage) => {
//   // successMessage is whatever we passed in the resolve(...) function above.
//   // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//   console.log("Yay! " + successMessage);
// });


function makeStatusArr(nodetoolIP){
  let cmd = `ssh root@${nodetoolIP} /root/ssdStorage/cassandra/bin/nodetool status`
  let checkcmd = exec(cmd)
  checkcmd.stdout.on('data', function(data){
    console.log('###stdout data : \n', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    statusArr = tempArray.filter(un => un == 0);
    console.log(statusArr, 'from stdout');
    // return statusArr;
  })
  checkcmd.stdin.on('data', function(data){
    console.log('###stdin data : \n', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    statusArr = tempArray.filter(un => un == 0);
    console.log(statusArr, 'from stdin');
    // return statusArr;
  })
  checkcmd.stderr.on('data', function(data){
    console.log('###stderr data : \n', data);
    const testdata = data.split(' ');
    tempArray.push(testdata.indexOf('UN'));
    statusArr = tempArray.filter(un => un == 0);
    console.log(statusArr, 'from stderr');
  })
  return statusArr
}

function checkNodeStatus(nodetoolIP, callback){
  let promiseTest = new Promise( (resolve, reject)=>{
    setTimeout(()=>{
      resolve('in resolve', statusArr);
  },3000);
  })

  console.log('promise in checkStatus', statusArr);

  promiseTest.then((res) => {
      console.log('in then..', res);
  })
  .catch((err) => {
      console.log('in catch', err);
  });
}






var _promise = function (param) {
	return new Promise(function (resolve, reject) {
		// 비동기를 표현하기 위해 setTimeout 함수를 사용
		window.setTimeout(function () {
			// 파라메터가 참이면,
			if (param) {
				// 해결됨
				resolve("해결 완료");
			}
			// 파라메터가 거짓이면,
			else {
				// 실패
				reject(Error("실패!!"));
			}
		}, 3000);
	});
};

//Promise 실행
_promise(true)
.then(function (text) {
	// 성공시
	console.log(text);
}, function (error) {
	// 실패시
	console.error(error);
});
