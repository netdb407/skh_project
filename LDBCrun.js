#!/usr/bin/env node

const program = require('commander')
//const property = require('../propertiesReader.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');
// const property = require('../propertiesReader.js');

let ldbc_homedir = '/home/skh/yh/skh_project_yh/ldbc_snb_datagen' //!!! InstallConfig에 추가
// let ldbc_homedir = property.get_ldbc_homedir(); ///home/skh/yh/skh_project_yh/ldbc_snb_datagen


let scaleFactor = 1
let isSuccess = 0 //success:1, fail:0
let initParam = 1
let somin_wl = '80M' //이부분에 사용자가 입력한 값 들어가게 수정하기 !

//내꺼도 module.exports 로 모듈화해서 소민이가 내 파일 import하고 함수로 쓸수있도록 하기 !
// module.exports.run_ldbcShell = () => {
//   //나중에 내용 넣기 !
// }



runLDBC()

async function runLDBC(){
  try{
    let sf_tmp = await make_graphWL_MB(somin_wl, scaleFactor)
    let run = 0
    // console.log('sf_tmp:', sf_tmp);
    let sf = await make_scalefactor(sf_tmp)
    // console.log('sf:',sf);
    let change = await change_params_ini(sf); //isSuccess 리턴
    // console.log('change : ', change);
    if(change == 1){ //isSuccess 리턴
      console.log(chalk.green.bold('[INFO]'), 'Starting run ldbcDatagen ...');
      run = await run_ldbcShell(); //success : 1
      // console.log('run : ', run);
    }
    if(run == 1){ //isSuccess 리턴
      init_params_ini(sf);
    }
  }catch(error){
    console.log(chalk.red.bold('[ERROR]'), 'error..');
  }
}



function make_graphWL_MB(somin_wl, scaleFactor){
  return new Promise(function(resolve, reject){
    console.log(chalk.green.bold('[INFO]'), 'Input somin_wl :', somin_wl);
    let byte = somin_wl.slice(-1) //M
    let wlnumber = somin_wl.slice(0, -1) //100
    let graphWL_MB = 1

    if(byte=='K'){
      graphWL_MB = wlnumber*0.001
    }else if(byte=='M'){
      graphWL_MB = wlnumber
    }else if(byte=='G'){
      graphWL_MB = wlnumber*1000
    }
    return resolve(graphWL_MB);
  })
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

function make_scalefactor(graphWL_MB){
  return new Promise(function(resolve, reject){
    graphWL_MB = parseFloat(graphWL_MB)
    console.log(chalk.green.bold('[INFO]'), 'graphWL_MB : ', graphWL_MB);
    if(graphWL_MB >= 300*1000){
      scaleFactor = 1000
    }else if(graphWL_MB >= 100*1000){
      scaleFactor = 300
    }else if(graphWL_MB >= 30*1000){
      scaleFactor = 100
    }else if(graphWL_MB >= 10*1000){
      scaleFactor = 30
    }else if(graphWL_MB >= 3*1000){
      scaleFactor = 10
    }else if(graphWL_MB >= 1000){
      scaleFactor = 3
    }else if(graphWL_MB >= 300){
      scaleFactor = 1
    }else if(graphWL_MB >= 100){
      scaleFactor = 0.3
    }else if(graphWL_MB >= 3){
      scaleFactor = 0.1
    }
    console.log(chalk.green.bold('[INFO]'), 'scaleFactor :', scaleFactor);
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


function run_ldbcShell(){
  return new Promise(function(resolve, reject){
    let hadoop_cmd1 = `export HADOOP_CLIENT_OPTS="-Xmx2G"`
    let hadoop_cmd2 = `export HADOOP_HOME=${ldbc_homedir}/hadoop-3.2.1`
    let setHome_cmd = `export LDBC_SNB_DATAGEN_HOME=${ldbc_homedir}`
    let hadoop_cmd3 = `export HADOOP_LOGLEVEL=WARN`
    let run_cmd = `./run.sh`
    //mvn 필요!!

    exec(hadoop_cmd1)
    exec(hadoop_cmd2)
    exec(setHome_cmd)
    exec(hadoop_cmd3)
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
