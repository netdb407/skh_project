const program = require('commander')
const property = require('../../propertiesReader.js')
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
const java_exporter = property.get_java_exporter()
const maven_exporter = property.get_maven_exporter()
const path_exporter = property.get_path_exporter()
const home_exporter = property.get_home_exporter()
const server_ycsb_dir = property.get_server_ycsb_dir()
const server_wlfile_dir = property.get_server_wlfile_dir()
const server_IP = property.get_server_IP()
const nodes_IP = property.get_nodes_IP()
const ycsb_exporter = property.get_ycsb_exporter()
const ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()
const IO_tracer_dir = property.get_IO_tracer_dir()
const IO_watch_dir = property.get_IO_watch_dir()
const IO_output_dir = property.get_IO_output_dir()
const error = chalk.red('ERR!')
let dbtypeLine = '', runtypeLine = '', wlfileLine = '', loadsizeLine = '', loadsizeCmd = '',
threadLine = '', timewindowLine = '', cassandraTracingLine = '', cassandraTracingCmd = ''


module.exports.graphbench = (opt) => {
  var Client = require('ssh2').Client;

  var conn = new Client();
  conn.on('ready', function() {
    console.log('Client :: ready');
    conn.exec('uptime', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: '203.255.92.193',
    port: 22,
    username: 'netddb',
    password: 'netdb3230'
    // privateKey: require('fs').readFileSync('/home/skh/.ssh/known_hosts')
  });

//   var node_ssh = require('node-ssh');
//   var ssh = new node_ssh();
//
//
//   const password = 'netdb3230'
//
//   ssh.connect({
//     host: '203.255.92.193',
//     username: 'root',
//     port: 22,
//     password,
//     tryKeyboard: true,
//     onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
//         if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
//           finish([password])
//         }
//       }
//   })
//
//
//   ssh.putFiles([{ local: '/root/nodetest', remote: '/root/' }]).then(function() {
// 	   console.log("DONE");
//   }, function(error) {
//   	console.log(error);
//   }).then(function(){
// 	   ssh.dispose();  //커넥션 종료
// })
//




      // var node_ssh = require('node-ssh');
      // var ssh = new node_ssh();
      // var conn = ssh.connect({
      //   host: '203.255.92.193',
      //   username: 'root',
      //   password : 'netdb3230'
      // })
      //
  //     console.log('123');
  //
  //         //명령어 보내기
  //   ssh.execCommand('/opt/orientdb193/bin/console.sh', { }).then(function(result) {
  //   	console.log('결과: ' + result.stdout);
  //   	console.log('에러: ' + result.stderr);
  //       ssh.dispose();//커넥션 종료
  //   });
  // console.log('123');
  //
  // console.log('orientdb');
    // try{
    //   console.log('run');
    //   const stdout = execSync(`ssh root@203.255.92.193 /opt/orientdb193/bin/console.sh`)
    //   console.log(`stdout: ${stdout}`);
    // }catch(err){
    //   console.log('error');
    // }


}
