#!/usr/bin/env node

const program = require('commander')
//const property = require('../propertiesReader.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec //로그 출력 x
const execSync =  require('child_process').execSync //로그 출력 o
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');
// const property = require('../propertiesReader.js');

let ldbc_homedir = '/home/skh/yh/skh_project_yh/ldbc_snb_datagen' //!!! InstallConfig에 추가
// let ldbc_homedir = property.get_ldbc_homedir(); ///home/skh/yh/skh_project_yh/ldbc_snb_datagen

let somin_wl = '150M' //이부분에 사용자가 입력한 값 들어가게 수정하기 !
let scaleFactor = 1
let graphWL_MB = 1
let isSuccess = 0 //success:1, fail:0


// module.exports.runLDBC = () => {
//
// }

runLDBC()

async function runLDBC(){
  try{
    let startTime = getTime();
    console.log(chalk.green.bold('[INFO]'), '*** Start Time :', startTime, '***');
    console.log('----------------------------------------------------------');

    let isRun = 0
    let sf = await make_scalefactor(somin_wl, scaleFactor, graphWL_MB)
    let isChangeSF = await change_params_ini(sf); //isSuccess 리턴
    if(isChangeSF == 1){ //isSuccess 리턴
      console.log(chalk.green.bold('[INFO]'), 'Starting run ldbcDatagen ...');
      isRun = await run_ldbcShell(); //isSuccess : 1
    }
    if(isRun == 1){ //isSuccess 리턴
      init_params_ini(sf);
      let endTime = getTime();
      console.log(chalk.green.bold('[INFO]'), '*** End Time :', endTime, '***');
      console.log('----------------------------------------------------------');
      // let totalTime = Number(endTime) - Number(startTime)
      // console.log(chalk.blue.bold('[INFO]'), '*** Total Time :', totalTime, '***');
    }
  }catch(error){
    console.log(chalk.red.bold('[ERROR]'), 'error..');
  }
}


function getTime(){
  let today = new Date();
  let time = today.toLocaleTimeString();
  return time
}

// 0.1 = 100M
// 0.3 = 300M
// 1 = 1G = 1000M
// 3 = 3G = 3*1000M = 3000M
// 10 = 10G = 10*1000M = 10000M
// 30 = 30G = 30*1000M = 30000M
// 100 = 100G = 100*1000M = 100000M
// 300 = 300G = 300*1000M = 300000M
// 1000 = 1000G = 1TB = 1000*1000M = 1000000M

function make_scalefactor(somin_wl, scaleFactor, graphWL_MB){
  return new Promise(function(resolve, reject){
    console.log(chalk.green.bold('[INFO]'), 'Input somin_wl :', chalk.blue.bold(somin_wl));
    let byte = somin_wl.slice(-1) //M
    let wlnumber = somin_wl.slice(0, -1) //100

    if(byte=='M'){
      graphWL_MB = wlnumber
    }else if(byte=='G'){
      graphWL_MB = wlnumber*1000
    }else if(byte=='T'){
      graphWL_MB = wlnumber*1000*1000
    }
    console.log(chalk.green.bold('[INFO]'), 'Graph Workload size(MB) :', chalk.blue.bold(graphWL_MB));

    if(graphWL_MB > 300*1000){
      scaleFactor = 1000
    }else if(graphWL_MB > 100*1000){
      scaleFactor = 300
    }else if(graphWL_MB > 30*1000){
      scaleFactor = 100
    }else if(graphWL_MB > 10*1000){
      scaleFactor = 30
    }else if(graphWL_MB > 3*1000){
      scaleFactor = 10
    }else if(graphWL_MB > 1000){
      scaleFactor = 3
    }else if(graphWL_MB > 300){
      scaleFactor = 1
    }else if(graphWL_MB > 100){
      scaleFactor = 0.3
    }else if(graphWL_MB > 3){
      scaleFactor = 0.1
    }
    console.log(chalk.green.bold('[INFO]'), 'scaleFactor :', chalk.blue.bold(scaleFactor));
    console.log('----------------------------------------------------------');
    return resolve(scaleFactor);
  })
}


function change_params_ini(sf){
  return new Promise(function(resolve, reject){
    let fixScaleFactor_cmd = `sed -i '1,2s|scaleFactor:1|scaleFactor:${sf}|' ${ldbc_homedir}/params.ini`
    let fixSFcmd = exec(fixScaleFactor_cmd)

    fixSFcmd.on('exit', function(code){
      isSuccess = 1
      console.log(chalk.green.bold('[INFO]'), 'fix params.ini');
      console.log('----------------------------------------------------------');
      return resolve(isSuccess);
    })

  })
}


function init_params_ini(sf){
  // console.log('sf :', `${sf}`);
  return new Promise(function(resolve, reject){
    let initScaleFactor_cmd = `sed -i '1,2s|scaleFactor:${sf}|scaleFactor:1|' ${ldbc_homedir}/params.ini`
    let initSFcmd = exec(initScaleFactor_cmd)

    initSFcmd.on('exit', function(code){
      isSuccess = 1
      console.log(chalk.green.bold('[INFO]'), 'initialize params.ini');
      console.log('----------------------------------------------------------');
      return resolve(isSuccess);
    })
  })
}

// ldbc_homedir = '/home/skh/yh/skh_project_yh/ldbc_snb_datagen'
function run_ldbcShell(){
  return new Promise(function(resolve, reject){
    let mkdir1 = `mkdir -p ${ldbc_homedir}/social_network`
    let mkdir2 = `mkdir -p ${ldbc_homedir}/social_network/dynamic`

    let hadoop_cmd1 = `export HADOOP_CLIENT_OPTS="-Xmx2G"`
    let hadoop_cmd2 = `export HADOOP_HOME=${ldbc_homedir}/hadoop-3.2.1`
    // let hadoop_cmd2 = `export HADOOP_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen/hadoop-3.2.1`
    let setHome_cmd = `export LDBC_SNB_DATAGEN_HOME=${ldbc_homedir}`
    // let setHome_cmd = `export LDBC_SNB_DATAGEN_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen`
    let hadoop_cmd3 = `export HADOOP_LOGLEVEL=WARN`
    let run_cmd = `./run.sh`
    //mvn 필요!!

    execSync(mkdir1)
    execSync(mkdir2)

    // try{
    //   var res = exec(`ls ${ldbc_homedir}/social_network`).toString();
    //   if(res.contain("File exists")){
    //     console.log(chalk.green.bold('[INFO]'), 'directory exists');
    //   } //디렉토리 있음
    //   else{
    //     exec(`mkdir -p ${ldbc_homedir}/social_network`)
    //   } //없음
    // }
    // catch(e){
    //   console.log(chalk.green.bold('[INFO]'), 'file or directory does not exist');
    //   exec(`mkdir -p ${ldbc_homedir}/social_network`)
    // }


    execSync(hadoop_cmd1)
    execSync(hadoop_cmd2)
    execSync(setHome_cmd)
    execSync(hadoop_cmd3)
    console.log(chalk.green.bold('[INFO]'),'export setting complete!');

    let run_exec = exec(run_cmd)
    let result = ''
    run_exec.stdout.on('data', function(data){
      result += data
      // console.log(result);
    })
    // let ldbc_output = '/home/skh/yh/skh_project_yh/ldbc_snb_datagen/social_network/dynamic/person_knows_person_0_0.csv'
    run_exec.on('exit', function(code){
      console.log(chalk.green.bold('[INFO]'),'run ldbcDatagen complete!');
      console.log('----------------------------------------------------------');
      return resolve(isSuccess)
    })
  })
}


// function check_GraphWL_exists(){
//   let file = `${ycsb_exportfile_dir}/${opt.name}`
//   fs.statSync(file);
// }
//
// function change_GraphWLName(){
//   //output data    ./social_network/dynamic       ȿ  person_knows_person_0_0.csv
//
// }
