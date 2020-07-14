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
//1. ���� ��ũ�ε� ������ �ԷµȰ� ���� ���� Ȯ��
// transformLoadsize(loadsize)
//���ɾ� �ҹ��̲����� ��ũ�ε� ������ ��� �ԷµǴ��� ���� �װŷ� �ޱ�
// �����ڰ� -l 3G �Է��� �Ǹ� 3G�� �����ؼ�
// ycsb �����ҋ� -p �ɼ� ���ڿ� �߰����ָ� �Ǵ� ����
// ycsb�ɼǿ� -p fieldcount=10 -p fieldlength=100 �̷������� �����ؼ� �ɼ� �߰�
//�ҹ��̲����� orientdb�� ��ũ�ε� ������ �Է��� �Ǹ�
//���Ʋ��� �Ѿ�� nosql-tests�� �����Ǵµ�
//�� ���̿��� ��ũ�ε� ����� �´°� ������ �ִ��� üũ�ϰ�
// ������ LDBC�� �����ؼ� nosql-tests�� �Ѱ��ֱ�
//��ũ�ε� ?

// ���� ���� Ȯ��

// let file = `${ycsb_exportfile_dir}/${opt.name}`
// fs.statSync(file);

//��ũ�ε� ��ġ ����
//��ũ�ε� ������ ��������
//��ũ�ε� ������ LDBC�� �̸� ����??

//-1) LDBC�� ������ �׷��� ��ũ�ε� �����ϴ� ��ġ ����
//-2) LDBC�� ������ �����صα�(test��)
//-3) �ش� ��ġ���� �Է����� ������ �������� �����Ͱ� �ִ��� üũ
//-4) ������ LDBC�� run.sh
// ./social_network/dynamic/person_knows_person_0_0.csv

//�ϴ� �Է� ������ ���ڿ� �°� params.ini ���� �����ؼ� ������ ������ ������ �ٸ��� �����ϰ�
//LDBC run �ؼ� person_knows_person_0_0 ������ ������
//���� �̸��� �������ش�!

// #set this to the Hadoop 3.2.1 directory
// export HADOOP_HOME=`pwd`/hadoop-3.2.1
// #set this to the repository's directory
// export LDBC_SNB_DATAGEN_HOME=`pwd`
// #limit Hadoop's log to error messages
// export HADOOP_LOGLEVEL=WARN

//params.ini�� �����ؼ� �����͸� ������
// ./run.sh

//-------------------------------------------------
//3. NoSQL Tests�� ������

//output data �� ./social_network/dynamic ���� �ȿ� person_knows_person_0_0.csv ��
//-------------------------------------------------






// 1. LDBC run
// 2. ���� �̸� ���� person_knows_person_0_0
// 3. ���� ���� ��ġ���� �Էµ� ������ ���� ���� ���� Ȯ��
// 4. ������ ������ nosql-tests�� �ѱ���
// 4. ������ params.ini �����ϰ� �ٽ� run.sh�ϰ� �̸� ����
// 5. ���� ������ ������ nosql-tests�� �ѱ���



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



  let initScaleFactor_cmd = `sed -i '1,2s|scaleFactor:${size}|scaleFactor:1|' /home/yh/skh_project/params.ini`
  exec(initScaleFactor_cmd)
  console.log(chalk.green.bold('[INFO]'), 'params.ini initialize');










  // //LDBC run ��ũ��Ʈ�� params.ini�� ������ �����丮�� ��ġ���־��� �ؼ� ldbc ������ �־����ҵ�
  //
  // //params.ini ����!
  // //params.ini�� �����ؼ� �����͸� ������
  //
  // // //#set this to the Hadoop 3.2.1 directory
  // // export HADOOP_HOME=`pwd`/hadoop-3.2.1
  // // //#set this to the repository's directory
  // // export LDBC_SNB_DATAGEN_HOME=`pwd`
  // // //#limit Hadoop's log to error messages
  // // export HADOOP_LOGLEVEL=WARN
  // // ./run.sh
  // let pwd = `/home/skh/yh/skh_project_yh/ldbc_snb_datagen`
  // let homecmd = `export HADOOP_HOME=${pwd}/hadoop-3.2.1`
  // console.log('?????????????');
  // console.log('HOMECMD', homecmd)
  // //export HADOOP_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen/hadoop-3.2.1
  // let homecmd1 = `export LDBC_SNB_DATAGEN_HOME=${pwd}`
  // console.log('HOMECMD1', homecmd1)
  // //export LDBC_SNB_DATAGEN_HOME=/home/skh/yh/skh_project_yh/ldbc_snb_datagen
  // let homecmd2 = `export HADOOP_LOGLEVEL=WARN`
  // console.log('HOMECMD2', homecmd2)
  // //export HADOOP_LOGLEVEL=WARN
  // let runcmd = `./run.sh`
  // ///home/skh/yh/skh_project_yh/ldbc_snb_datagen/run.sh
  // exec(homecmd)
  // exec(homecmd1)
  // exec(homecmd2)
  // exec(runcmd)
  //
  // //run.sh ���� export ���ִ°� ���Ⱑ �ȸ³�?
}


function check_GraphWL_exists(){
  // ���� ���� Ȯ��
  let file = `${ycsb_exportfile_dir}/${opt.name}`
  fs.statSync(file);
}

function change_GraphWLName(){
  //output data �� ./social_network/dynamic ���� �ȿ� person_knows_person_0_0.csv ��

}
