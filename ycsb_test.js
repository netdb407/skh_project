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
      //datatemp = data
      count = data.match(/UN/g);
      //로그 출력 안하니까 훨 빠르다!
      // console.log(datatemp);

      if(count != null){
        //console.log('countlength :', count.length);


        tempArray.push(count.length)

      }



      //배열에 countlength를 한개씩 넣어주고 총 합이 3이 되면 종료?
      //reduce 함수 이용?

    })



    checkcmd.on('exit', function(code){

     // count = datatemp.search(/UN/g);

     // count = datatemp.match(/UN/g);

     // let tempVar = datatemp.includes("UN")
     // console.log('tempVar:', tempVar);



      //match보다 split이 빠르데!
      //includes함수도 있음
      //exec() vs match() vs test() vs search() vs indexOf()
      //search, match
      //!!! 뭘 쓰든 존나 느리다 !
      //그치만 계속 로그를 찍으면서 count 하는 건 불필요해 보임


      //console.log('count : ', count);



      // if(count!==null){
      //   countNum++
      // }

      // if(count!=-1){
      //   countNum++
      // }
      //





      //console.log('countNum :', countNum, '\n\n\n');

      //console.log('tempArray:',tempArray);

//카산드라 킨지 얼마 안되었을 때 no initial value 만 체크하면 됨 !!!!! 아싸~

      //console.log('arraylength:',tempArray.length);
      if(tempArray.length>0 && tempArray.length<4){
        sumtemp = tempArray.reduce((acc, cur, i) => {
          //console.log(acc, cur, i);
          let sum = acc + cur
          return sum;
        })
      }
      
      isOnCassandra = true
      clearInterval(test);
      console.log('isOnCassandra : ', isOnCassandra);
      console.log('Now you can use cassandra from cluster nodes');

      // else if(sumtemp === 3){
      //   isOnCassandra = true
      //   clearInterval(test);
      //   console.log('isOnCassandra : ', isOnCassandra);
      //   console.log('Now you can use cassandra from cluster nodes');
      // }

    })

  }, 3000);
}

//stdout 로그를 출력 안하니까 훨씬 빠르게 UN을 찾고 끝남
//하지만 노드 중 일부 카산드라가 꺼졌다가 다시 켜지는 경우에는 프로세스 종료가 안됨 !!


// var count =0
// var repeat = setInterval(function(){
//   console.log('setInterval');
//   count++;
//   if(count==5){
//     clearInterval(repeat);
//   }
// }, 3000)
