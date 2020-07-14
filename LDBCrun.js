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


ldbcRun()

function ldbcRun(){
  //LDBC run ��ũ��Ʈ�� params.ini�� ������ �����丮�� ��ġ���־��� �ؼ� ldbc ������ �־����ҵ�

  //params.ini ����!
  //params.ini�� �����ؼ� �����͸� ������

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

  //run.sh ���� export ���ִ°� ���Ⱑ �ȸ³�?
}


function check_GraphWL_exists(){
  // ���� ���� Ȯ��
  let file = `${ycsb_exportfile_dir}/${opt.name}`
  fs.statSync(file);
}

function change_GraphWLName(){
  //output data �� ./social_network/dynamic ���� �ȿ� person_knows_person_0_0.csv ��

}
