#!/usr/bin/env node

const async = require('async');
const program = require('commander');
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const cassandraAction = require('../lib/cassandra.js')

var nodes = property.get_nodes();
var node_arr = nodes.split(',');
var password = property.get_password();


program
  .command('install')
  .option('-p, --package <pkg>')
  .option('-d, --database <dbname>')
  .option('-s, --server', `install into server, only can use to -p option`)
  .option('-n, --node', `install into node, only can use to -p option`)
  .action(function Action(opt){
    installDatabase(opt, nodes, node_arr, password);
  })





program.parse(process.argv)


function installDatabase(opt, nodes, node_arr, password){
  console.log('node정보 : ', node_arr);
  switch(opt.database){
      case 'cassandra' :
	var dir = property.get_server_cassandra_dir()
	var install_address = property.get_server_cassandra_install_address()
	var node_dir = property.get_node_cassandra_dir()
	var version = property.get_cassandra_version()
	var file = property.get_cassandra_file()
	var cassandraHome = `${dir}${version}`
	var conf = `${cassandraHome}/conf/cassandra.yaml`
        var benchmark_dir = property.get_benchmark_dir()
	var fs = require('fs');



	var exists_cassandra = fs.existsSync(`${cassandraHome}`);
	var exists_tar = fs.existsSync(`${dir}${file}`);
	if(exists_cassandra==true){
         console.log('cassandra is already installed');
        }else{
          if(exists_tar==true){
           cassandraAction.cassandraDecompress(dir, file);
           console.log('[cassandra Decompress]');
          }else{
           cassandraAction.cassandraInstall(dir, install_address, file);
           console.log('[cassandra Install]');
           cassandraAction.cassandraDecompress(dir, file);
           console.log('[cassandra Decompress]');         
          }
        }
	

	var exists = fs.existsSync(`${conf}`);
        if(exists==true){
         cassandraAction.cassandraSetClusterEnv(conf, nodes, benchmark_dir);
         console.log('[cassandra Set Cluster Environments]');
	}else{
         console.log('conf file not found');
         break;
        }


        cassandraAction.cassandraCopy(node_arr, password, cassandraHome, node_dir, conf);
	console.log('[cassandra Copy&localhost set]');

	console.log('[cassandra Installed]');

      break;
   }
}
 
