const program = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const property = require('../propertiesReader.js')
// const PropertiesReader = require('properties-reader');
const orientMaster_IP = property.get_orientMaster_IP();
const profile_dir = property.get_profile_dir();
const relation_dir = property.get_relation_dir();
// async function sss(){
//   const std1 = exec(`ssh root@${orientMaster_IP} 'sed -i "s|"/root/ssdStorage/orientdb195/person/person_knows.csv"|"${profile_dir}"|"' /root/ssdStorage/orientdb195/bin/person.json`);
//   const std2 = exec(`ssh root@${orientMaster_IP} 'sed -i "s|"/root/ssdStorage/orientdb195/person/person_knows.csv"|"${relation_dir}"|"' /root/ssdStorage/orientdb195/bin/person_knows.json`);
//   std1;
//   std2;
//   console.log('변경완료');
// }
// sss();
// process.exit(1);


// server_orientdb_dir = orientdb193,orientdb194,orientdb195
// load_profile_dir = /root/ssdStorage/orientdb195/person/person_0_0.csv
// load_relation_dir = /root/ssdStorage/orientdb195/person/person_knows_person_0_0.csv


module.exports.change_NoSQLconfig = () => {
  exec(`ssh root@${orientMaster_IP} 'sed -i "s|"/root/ssdStorage/orientdb195/person/person_knows.csv"|"${profile_dir}"|"' /root/ssdStorage/orientdb195/bin/person.json`);
  exec(`ssh root@${orientMaster_IP} 'sed -i "s|"/root/ssdStorage/orientdb195/person/person_knows.csv"|"${relation_dir}"|"' /root/ssdStorage/orientdb195/bin/person_knows.json`);
  console.log(chalk.green.bold('[INFO]'), 'fix orient config complete!');
}
