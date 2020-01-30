const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;




module.exports.cassandraConfig = (password, nodes, benchmark_conf, node_conf) => {

  for(var i in nodes){
     console.log('setting..',nodes[i]);
     var node = nodes[i];
     exec(`sshpass -p ${password} scp -o StrictHostKeyChecking=no ${benchmark_conf} root@${node}:${node_conf}`)
  }

}


