#!/usr/bin/env node

const program = require('commander')
//const property = require('../propertiesReader.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');


// 폴더 자체에 깃에서 클론한거 만들어놓고
// params.ini도 만들어놓고
// 하둡도 설치해놓고
//
// 그다음에
// 실행 전에
// export HADOOP_CLIENT_OPTS 같은거 지정할건데 exec을 해주기




ldbcRun()

function ldbcRun(){
  let hadoop_cmd1 = `export HADOOP_CLIENT_OPTS="-Xmx2G"`
  let hadoop_cmd2 = `export HADOOP_HOME=/home/yh/ldbc_snb_datagen/hadoop-3.2.1`
  let setHome_cmd = `export LDBC_SNB_DATAGEN_HOME=/home/yh/ldbc_snb_datagen`
  let hadoop_cmd3 = `export HADOOP_LOGLEVEL=WARN`
  let params_cmd = `cp /home/yh/skh_project/ldbc_snb_datagen/params.ini /home/yh/skh_project`
  let run_cmd = `./ldbc_snb_datagen/tools/run.sh`



  //일단 params.ini 내용 바꾸는 부분만 다시 짜보자!

  //소민이꺼에서 입력되는 값의 크기(KB, MB, GB)에 따라 다르게 처리
  let somin_wl = '10GB' //10KB, 10MB
  let size = 10 //default?MB?

  if(somin_wl.includes('KB')){
    size = size*1
    console.log('WL size is KB');
  }
  if(somin_wl.includes('MB')){
    size = size*100
    console.log('WL size is MB');
  }
  if(somin_wl.includes('GB')){
    size = size*1000
    console.log('WL size is GB');
  }
  console.log('WL size : ', size);

  //params.ini 파일의 scaleFactor가 계속 변하는데 이걸 어떻게 바꾼담
  //쉘 스크립트 명령어에서 숫자에 접근하려면 머 써야하냐..
  //그냥 한줄 날려버리고 다시 추가할까
  //!!! 아니면 params.ini 파일을 덮어쓰기하고 다시 지우고? 다시 1로 셋팅할까?ㅋㅋㅋsize는 기억하니깐 그거로 다시 sed로 1로 바꾸는거지

  let fixScaleFactor_cmd = `sed -i '1,2s|scaleFactor:1|scaleFactor:${size}|' /home/yh/skh_project/params.ini`
  // let fixScaleFactor_cmd = `sed -i '1,2s|generator|,|\n|s|scaleFactor:${size}|' /home/yh/skh_project/params.ini`
  exec(fixScaleFactor_cmd)
  console.log(chalk.green.bold('[INFO]'), 'fix params.ini');

  // run.sh 다 끝난 뒤 .. params.ini 파일 초기화!
  exec(hadoop_cmd1)
  exec(hadoop_cmd2)
  exec(setHome_cmd)
  exec(hadoop_cmd3)
  console.log(chalk.green.bold('[INFO]'),'export setting complete!');
  exec(params_cmd)
  console.log(chalk.green.bold('[INFO]'),'copy params.ini to project directory');
  let run_exec = exec(run_cmd)
  run_exec.stdout.on('data', function(data){
    console.log(data);
    console.log(chalk.green.bold('[INFO]'),'run.sh complete!');
  })
  //깃에서 제공하는 내용이 좀 바뀌어서 output이 어떻게 생기는지 모르겠음. run.sh 실행 결과가 안나옴..
  //그전에 쓰던거 사용해야할지도 모름 ....

  //그전꺼 192에 있는거로 테스트해볼건데
  //params.ini scaleFactor 사이즈 조정하고 난 다음 output directory 가서 person_knows_person_0_0 크기 어떻게 달라지는지 보고
  //사이즈 다시 조정하기 !

  //결과파일 위치 윤아한테 주기? 접근하는 방법만 알면될거같구

  //내꺼도 module.exports 로 모듈화해서 소민이가 내 파일 import하고 함수로 쓸수있도록 하기 ! 

  let initScaleFactor_cmd = `sed -i '1,2s|scaleFactor:${size}|scaleFactor:1|' /home/yh/skh_project/params.ini`
  exec(initScaleFactor_cmd)
  console.log(chalk.green.bold('[INFO]'), 'params.ini initialize')
}


function check_GraphWL_exists(){
  let file = `${ycsb_exportfile_dir}/${opt.name}`
  fs.statSync(file);
}

function change_GraphWLName(){
  //output data �� ./social_network/dynamic ���� �ȿ� person_knows_person_0_0.csv ��

}
