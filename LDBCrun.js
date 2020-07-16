#!/usr/bin/env node

const program = require('commander')
//const property = require('../propertiesReader.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');

//내꺼도 module.exports 로 모듈화해서 소민이가 내 파일 import하고 함수로 쓸수있도록 하기 !
// module.exports.ldbcRun = () => {
//   //나중에 내용 넣기 !
// }


let somin_wl = '100M' //10K, 10M //1MB = 1000KB //
let scaleFactor = 1
let success = 0 //success:1, fail:0


main()

async function main(){
  try{
    let sf = await make_scalefactor(somin_wl, scaleFactor)
    console.log('sf :', sf);
    let change = change_params_ini(sf); //success 리턴
    change.then((ch)=>{
      // console.log('ch:', ch);
      if(ch == 1){
        console.log(chalk.green.bold('[INFO]'), 'congratulation! success');

        let run = ldbcrun();
        run.then((r)=>{
          sf = 1
          change_params_ini(sf);
        })
      }
    })
  }catch(error){
    console.log(chalk.red.bold('[ERROR]'), 'error..');
  }
}



function make_scalefactor(somin_wl, scaleFactor){
  return new Promise(function(resolve, reject){
    console.log(chalk.green.bold('[INFO]'), 'Input somin_wl :', somin_wl);
    let byte = somin_wl.slice(-1) //M
    let wlnumber = somin_wl.slice(0, -1) //100
    let graphWL_MB = 1

    // 0.003 = 3M
    // 0.1 = 100M
    // 0.3 = 300M
    // 1 = 1G = 1000M
    // 3 = 3G = 3*1000M = 3000M
    // 10 = 10G = 10*1000M = 10000M
    // 30 = 30G = 30*1000M = 30000M
    // 100 = 100G = 100*1000M = 100000M
    // 300 = 300G = 300*1000M = 300000M
    // 1000 = 1000G = 1TB = 1000*1000M = 1000000M
    if(byte=='K'){
      graphWL_MB = wlnumber*0.001
      console.log(chalk.green.bold('[INFO]'), 'WL size is KB');
    }else if(byte=='M'){
      graphWL_MB = wlnumber
      console.log(chalk.green.bold('[INFO]'), 'WL size is MB');
    }else if(byte=='G'){
      graphWL_MB = wlnumber*1000
      console.log(chalk.green.bold('[INFO]'), 'WL size is GB');
    }

    if(1 <= graphWL_MB <= 3){
      scaleFactor = 0.003
    }else if(3 < graphWL_MB <= 100){
      scaleFactor = 0.1
    }else if(100 < graphWL_MB <= 300){
      scaleFactor = 0.3
    }else if(300 <= graphWL_MB <= 1000){
      scaleFactor = 1
    }else if(1000 < graphWL_MB <= 3*1000){
      scaleFactor = 3
    }else if(30*1000 < graphWL_MB <= 10*1000){
      scaleFactor = 10
    }else if(100*1000 < graphWL_MB <= 30*1000){
      scaleFactor = 30
    }else if(300*1000 < graphWL_MB <= 100*1000){
      scaleFactor = 100
    }else if(100*1000 < graphWL_MB <= 300*1000){
      scaleFactor = 300
    }else if(300*1000 < graphWL_MB <= 1000*1000){
      scaleFactor = 1000
    }
    console.log(chalk.green.bold('[INFO]'), 'WL size(MB) : ', graphWL_MB);
    console.log(chalk.green.bold('[INFO]'), 'scaleFactor :', scaleFactor);
    return resolve(scaleFactor);
  })
}




function change_params_ini(sf){
  return new Promise(function(resolve, reject){
    let fixScaleFactor_cmd = `sed -i '1,2s|scaleFactor:1|scaleFactor:${sf}|' /home/skh/yh/skh_project_yh/ldbc_snb_datagen/params.ini`
    // let fixScaleFactor_cmd = `sed -i '1,2s|generator|,|\n|s|scaleFactor:${size}|' /home/yh/skh_project/params.ini`
    exec(fixScaleFactor_cmd)
    console.log(chalk.green.bold('[INFO]'), 'fix params.ini');
    success = 1
    return resolve(success);
  })
}


function ldbcRun(){
  return new Promise(function(resolve, reject){
    let hadoop_cmd1 = `export HADOOP_CLIENT_OPTS="-Xmx2G"`
    let hadoop_cmd2 = `export HADOOP_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen/hadoop-3.2.1`
    let setHome_cmd = `export LDBC_SNB_DATAGEN_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen`
    let hadoop_cmd3 = `export HADOOP_LOGLEVEL=WARN`
    // let params_cmd = `yes|cp -rf /home/skh/yh/skh_project_yh/ldbc_snb_datagen/params-csv-basic.ini /home/skh/yh/skh_project_yh/params.ini`
    let run_cmd = `./ldbc_snb_datagen/run.sh`
    //mvn 필요!!

    // let scale_1 = await change_params_ini(scaleFactor)

    // //scaleFactor : 0.003, 0.1, 0.3, 1, 3, 10, 30, 100, 300, 1000 (GB)
    // let fixScaleFactor_cmd = `sed -i '1,2s|scaleFactor:1|scaleFactor:${scaleFactor}|' /home/skh/yh/skh_project_yh/ldbc_snb_datagen/params.ini`
    // // let fixScaleFactor_cmd = `sed -i '1,2s|generator|,|\n|s|scaleFactor:${size}|' /home/yh/skh_project/params.ini`
    // exec(fixScaleFactor_cmd)
    // console.log(chalk.green.bold('[INFO]'), 'fix params.ini');

    // run.sh 다 끝난 뒤 .. params.ini 파일 초기화!
    exec(hadoop_cmd1)
    exec(hadoop_cmd2)
    exec(setHome_cmd)
    exec(hadoop_cmd3)
    console.log(chalk.green.bold('[INFO]'),'export setting complete!');
    // exec(params_cmd)
    // console.log(chalk.green.bold('[INFO]'),'copy params.ini to project directory');
    let run_exec = exec(run_cmd)
    let result = ''
    run_exec.stdout.on('data', function(data){
      result += data
      console.log(result);
      // console.log(chalk.green.bold('[INFO]'),'run.sh complete!');
    })




    // let initScaleFactor_cmd = `sed -i '1,2s|scaleFactor:${scaleFactor}|scaleFactor:1|' /home/skh/yh/skh_project_yh/ldbc_snb_datagen/params.ini`
    // exec(initScaleFactor_cmd)
    // console.log(chalk.green.bold('[INFO]'), 'params.ini initialize')


    //async await으로 기다렸다가 파일 다 만들어지면 로그 찍고 윤아한테 전달 !
    //다 만들어지면 그냥 로그?찍고
    //윤아가 fs.readFile 로 읽어들이는게 나을듯
    let ldbc_output = '/home/skh/yh/skh_project_yh/ldbc_snb_datagen/social_network/dynamic/person_knows_person_0_0.csv'
    return resolve(ldbc_output)
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
