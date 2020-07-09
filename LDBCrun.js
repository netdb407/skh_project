#!/usr/bin/env node

const program = require('commander')
//const property = require('../propertiesReader.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');

//-------------------------------------------------
//1. 기존 워크로드 사이즈 입력된거 존재 유무 확인
// transformLoadsize(loadsize)
//명령어 소민이꺼에서 워크로드 사이즈 어떻게 입력되는지 보고 그거로 받기
// 사용자가 -l 3G 입력이 되면 3G를 계산해서
// ycsb 수행할떄 -p 옵션 인자에 추가해주면 되는 형식
// ycsb옵션에 -p fieldcount=10 -p fieldlength=100 이런식으로 계산해서 옵션 추가
//소민이꺼에서 orientdb와 워크로드 사이즈 입력이 되면
//윤아꺼로 넘어가서 nosql-tests가 실행되는데
//그 사이에서 워크로드 사이즈에 맞는게 기존에 있는지 체크하고
// 없으면 LDBC로 생성해서 nosql-tests에 넘겨주기
//워크로드 ?

// 파일 존재 확인

// let file = `${ycsb_exportfile_dir}/${opt.name}`
// fs.statSync(file);

//워크로드 위치 잡고
//워크로드 사이즈 가져오기
//워크로드 파일은 LDBC로 미리 생성??

//-1) LDBC로 생성한 그래프 워크로드 저장하는 위치 잡기
//-2) LDBC로 데이터 저장해두기(test용)
//-3) 해당 위치에서 입력으로 들어온 사이즈의 데이터가 있는지 체크
//-4) 없으면 LDBC로 run.sh
// ./social_network/dynamic/person_knows_person_0_0.csv

//일단 입력 들어온 인자에 맞게 params.ini 파일 수정해서 생성할 데이터 사이즈 다르게 적용하고
//LDBC run 해서 person_knows_person_0_0 파일을 만들고
//파일 이름을 변경해준다!

// #set this to the Hadoop 3.2.1 directory
// export HADOOP_HOME=`pwd`/hadoop-3.2.1
// #set this to the repository's directory
// export LDBC_SNB_DATAGEN_HOME=`pwd`
// #limit Hadoop's log to error messages
// export HADOOP_LOGLEVEL=WARN

//params.ini를 수정해서 데이터를 생성함
// ./run.sh

//-------------------------------------------------
//3. NoSQL Tests에 보내기

//output data 는 ./social_network/dynamic 폴더 안에 person_knows_person_0_0.csv 임
//-------------------------------------------------






// 1. LDBC run
// 2. 파일 이름 변경 person_knows_person_0_0
// 3. 파일 저장 위치에서 입력된 사이즈 파일 존재 유무 확인
// 4. 있으면 파일을 nosql-tests에 넘기기
// 4. 없으면 params.ini 변경하고 다시 run.sh하고 이름 변경
// 5. 새로 생성한 파일을 nosql-tests에 넘기기


ldbcRun()

function ldbcRun(){
  //LDBC run 스크립트는 params.ini와 동일한 디렉토리에 위치해있어야 해서 ldbc 폴더에 넣어야할듯

  //params.ini 변경!
  //params.ini를 수정해서 데이터를 생성함

  // //#set this to the Hadoop 3.2.1 directory
  // export HADOOP_HOME=`pwd`/hadoop-3.2.1
  // //#set this to the repository's directory
  // export LDBC_SNB_DATAGEN_HOME=`pwd`
  // //#limit Hadoop's log to error messages
  // export HADOOP_LOGLEVEL=WARN
  // ./run.sh
  let pwd = `/home/skh/yh/skh_project_yh/ldbc_snb_datagen`
  let homecmd = `export HADOOP_HOME=${pwd}/hadoop-3.2.1`
  console.log('?????????????');
  console.log('HOMECMD', homecmd)
  //export HADOOP_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen/hadoop-3.2.1
  let homecmd1 = `export LDBC_SNB_DATAGEN_HOME=${pwd}`
  console.log('HOMECMD1', homecmd1)
  //export LDBC_SNB_DATAGEN_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen
  let homecmd2 = `export HADOOP_LOGLEVEL=WARN`
  console.log('HOMECMD2', homecmd2)
  //export HADOOP_LOGLEVEL=WARN
  let runcmd = `./run.sh`
  ///home/skh/yh/skh_project_yh/ldbc_snb_datagen/run.sh
  exec(homecmd)
  exec(homecmd1)
  exec(homecmd2)
  exec(runcmd)

  //run.sh 전에 export 해주는거 동기가 안맞네?
}


function check_GraphWL_exists(){
  // 파일 존재 확인
  let file = `${ycsb_exportfile_dir}/${opt.name}`
  fs.statSync(file);
}

function change_GraphWLName(){
  //output data 는 ./social_network/dynamic 폴더 안에 person_knows_person_0_0.csv 임

}
