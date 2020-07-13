const PropertiesReader = require('properties-reader');
const property = require('../../propertiesReader.js')
const chalk = require('chalk')
const exec = require('child_process').exec
const fs = require('fs')
const workload_dir = property.get_server_file2_dir() // Graph/workloads
const result_dir = property.get_server_file3_dir() // Graph/result
const ssdStorage_dir = property.get_IO_watch_dir()
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0
const orientdir = property.server_orientdb_dir();
let orientdbdir = orientdir.split(',')
const hosts = property.get_nodes_IP()
let ip = hosts.split(',')

module.exports.graphbench = (opt) => {

  runNosquTests(status)
  // console.log(opt);
  async function runNosquTests(status) {
    let name_status = await checkStatus_name(status, opt.name)
    // console.log('NAME', name)
    let time_status = await checkStatus_time(status, opt.time)
    // console.log('TIME', time)

    // name, time 등 등 옵션의 값들이 1일 때 =>
    if (name_status == 1 && time_status == 1) { //
      try {
        // console.log(`nosqltest1 orientdb -n ${opt.name} -t ${opt.time}`);
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'Start orientdb benchmarking');
        console.log('----------------------------------------------------------');
        let runexec = exec(`nosqltest1 orientdb -n ${opt.name} -t ${opt.time}`)

        runexec.stdout.on('data', function(data){
          console.log(data);
        })
        runexec.on('exit', function(data){
          try{
            ip.forEach((i) => {
              dirnum = i.split('.');
              const std = exec(`ssh root@${i} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/killOrient.sh`);
              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), 'orientdb run : ', chalk.blue.bold(i));
              console.log('--------------------------------------');
            });

          }catch (err) {
            console.error(err);
          }

        })

      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'There was an error and could not be executed.')
      console.log('----------------------------------------------------------');
    }
  }
}

function checkStatus_name(status, name) {
  return new Promise(function(resolve, reject) {
    let file = `./${workload_dir}${name}`
    // console.log('FILE', file)
    try {
      fs.statSync(file);
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'workload name :', chalk.blue.bold(name));
      console.log('----------------------------------------------------------');
      return resolve(status * -1) //success : 1
    } catch (err) {
      // console.error(err);
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'workload name :', 'invalid workload name', `'${name}'`)
      console.log('----------------------------------------------------------');
      return resolve(status) //fail : -1
    }
  });
}

function isNumber(s) { // 입력이 숫자인지 확인해주는 함수
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s == '' || isNaN(s)) return false;
  return true;
}

function checkStatus_time(status, time) {
  return new Promise(function(resolve, reject) {
      if (isNumber(time)) { // 입력이 숫자
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'settime :', chalk.blue.bold(time));
        console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else { // 입력이 숫자가 아님
        console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'settime :', `insert 'number' type.`)
        console.log('----------------------------------------------------------');
        return resolve(status) //fail : -1
      }
  });
}
