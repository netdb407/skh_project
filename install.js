#!/usr/bin/env node

const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const cassandraAction = require('../lib/cassandra.js')

var nodes = property.get_nodes();
var node_arr = nodes.split(',');
var dir = property.get_server_cassandra_dir()
var install_address = property.get_server_cassandra_install_address()
var node_dir = property.get_node_cassandra_dir()
var version = property.get_cassandra_version()
var file = property.get_cassandra_fi
var cassandraHome = `${dir}${version}`
var conf = `${cassandraHome}/conf/cassandra.yaml`

program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .action(function Action(opt){
    installDatabase(opt, conf, nodes, node_arr);
  })





program.parse(process.argv)


function installDatabase(opt, conf, nodes, node_arr){
  //노드정보 불러오는 방법 수정하기
  console.log('node정보 : ', node_arr);
  switch(opt.database){
      case 'cassandra' :
        //cassandraAction.cassandraInstall();
        //console.log('[cassandra Install]');
        //cassandraAction.cassandraDecompress();
	//console.log('[cassandra Decompress]');
        //console.log('seeds:',nodes);
        cassandraAction.cassandraSetClusterEnv(conf, nodes);
	console.log('[cassandra Set Cluster Environments]');

        //for(var i in node_arr){
	//  console.log('노드정보:',node_arr[i]);
        //  cassandraAction.cassandraCopy(node_arr[i]);
        //  console.log('[cassandra Copy]')
	  //비밀번호 입력하지 않도록..
	  //환경설정 바꾸고 내보낼지, 내보내고 바꿀지 생각..
	  //로컬호스트는 내보내고 수정
      break;
   }
   console.log('cassandra installed');
 }
 
