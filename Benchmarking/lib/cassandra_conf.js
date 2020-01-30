const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;




module.exports.cassandraConfig = (password, nodes, benchmark_conf, node_conf) => {

  for(var i in nodes){
     console.log('setting..',nodes[i]);
     var node = nodes[i];
     var fs = require('fs');
     var data =  fs.readFileSync(`${benchmark_conf}`, 'utf-8')
     var modify_localhost = data.replace(/localhost/g, `${node}`);
     fs.writeFileSync(`${benchmark_conf}`, modify_localhost, 'utf-8');
     exec(`sshpass -p ${password} scp -o StrictHostKeyChecking=no ${benchmark_conf} root@${node}:${node_conf}`)
     var fs = require('fs');
     var data =  fs.readFileSync(`${benchmark_conf}`, 'utf-8')
     console.log('??');
     var set_localhost = data.replace(new RegExp(node,'g'), 'localhost');
     var set_seed = set_localhost.replace('localhost', `${node}`);
     fs.writeFileSync(`${benchmark_conf}`, set_seed, 'utf-8');

  }

}

