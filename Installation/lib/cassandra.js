const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')

module.exports.cassandraInstall = (dir,install_address,file) => {
  exec(`${cmds.wgetCmd} ${dir} ${install_address}${file}`)
}


module.exports.cassandraDecompress = (dir,file) => {
  exec(`${cmds.decompress} ${dir}${file} -C ${dir}`)
}


module.exports.cassandraSetClusterEnv = (conf, seeds, benchmark_dir) => {
  var fs = require('fs');
  var data =  fs.readFileSync(`${conf}`, 'utf-8')
  var modify_seed = data.replace('127.0.0.1', `${seeds}`);
  var modify_loba = modify_seed.replace('# listen_on_broadcast_address: false', 'listen_on_broadcast_address: true');
  var modify_rpc = modify_loba.replace('start_rpc: false', 'start_rpc: true');
  fs.writeFileSync(`${conf}`, modify_rpc, 'utf-8');
  exec(`${cmds.copy} ${conf} ${benchmark_dir}`)
} 


module.exports.cassandraCopy = (nodes, password, cassandraHome, node_dir, conf) => {

  for(var i in nodes){
     console.log('install...',nodes[i]);
     var node = nodes[i];
     var fs = require('fs');
     var data =  fs.readFileSync(`${conf}`, 'utf-8')
     var set_node = data.replace(/localhost/g, `${node}`);
     fs.writeFileSync(`${conf}`, set_node, 'utf-8');
     exec(`sshpass -p ${password} scp -o StrictHostKeyChecking=no -r ${cassandraHome} root@${node}:${node_dir}`)
     var fs = require('fs');
     var data =  fs.readFileSync(`${conf}`, 'utf-8')
     var set_localhost = data.replace(new RegExp(node,'g'), 'localhost');
     var set_seed = set_localhost.replace('localhost', `${node}`);
     fs.writeFileSync(`${conf}`, set_seed, 'utf-8');
  }

}



