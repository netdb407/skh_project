const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')
const property = require('../../propertiesReader.js')

var dir = property.get_server_cassandra_dir()
var install_address = property.get_server_cassandra_install_address()
var node_dir = property.get_node_cassandra_dir()
var version = property.get_cassandra_version()
var file = property.get_cassandra_file()
var cassandraHome = `${dir}${version}/`
var conf = `${cassandraHome}conf/cassandra.yaml`
var nodes = property.get_nodes();
var password = property.get_password();

module.exports.cassandraInstall = () => {
  exec(`${cmds.wgetCmd} ${dir} ${install_address}${file}`)
}


module.exports.cassandraDecompress = () => {
  exec(`${cmds.decompress} ${dir}${file} -C ${dir}`)
  console.log('siba1')
}


module.exports.cassandraSetClusterEnv = (conf,seeds) => {
  console.log('conf, seeds :', conf, seeds)
  var fs = require('fs');
  fs.readFile(`${conf}`, 'utf-8', function(err, data){
      if (err) throw err;
      console.log('Set..cluster environment..')
      var modify_seed = data.replace('127.0.0.1', `${seeds}`);
      var modify_loba = modify_seed.replace('# listen_on_broadcast_address: false', 'listen_on_broadcast_address: true');
      var modify_rpc = modify_loba.replace('start_rpc: false', 'start_rpc: true');
      fs.writeFile(`${conf}`, modify_rpc, 'utf-8', function(err, data) {
          if (err) throw err;
      })
  })
} 


module.exports.cassandraCopy = (node) => {
    console.log(node)
    exec(`sshpass -p ${password} scp -o StrictHostKeyChecking=no -r ${cassandraHome} root@${node}:${node_dir}`)
}


