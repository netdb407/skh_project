const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const cmds = require('./cmds.js')


module.exports.sshpassInstall = () => {
  // console.log('this', server, node);
  //프로젝트폴더 로컬에서 먼저 rpm파일 설치!!
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.sshpassFile} `)

  //192,193,194,195에 sshpass 먼저 깔기
  //그담에 다른 rpm 파일 깔기..

  // var installDirectoryIP = server == true? property.get_server() : property.get_nodes();
  // // console.log('this',server, node, installDir);
  // var password = property.get_password();
  // var rpmDir = property.get_rpm_dir();
  // // sshpass -p password ssh -o StrictHostKeyChecking=no root@nodes
  // // console.log('원격으로', installDirectoryIP,'에 접속한 뒤 rpm 설치 파일을 전송합니다..');
  // console.log('원격으로', installDirectoryIP, '에 접속합니다.');
  // // exec(`sshpass -p ${password} scp -o StrictHostKeyChecking=no root@${installDirectoryIP} `)
  // exec(`sshpass -p ${password} ssh -o StrictHostKeyChecking=no root@${installDirectoryIP}`)
  // console.log('rpm 파일을 설치할 디렉토리를 만듭니다.');
  // exec(`mkdir yh`)
  // console.log('rpm 파일을 전송합니다.');
  // exec( `scp ${rpmDir}*.rpm root@${installDirectoryIP}:/root/yh`)
  // // exec(`scp -o StrictHostKeyChecking=no ${rpmDir}*.rpm root@${installDirectoryIP}:/root/yh `)

  console.log('complete!');

  // mkdir yh

  //프로젝트 폴더 통채로 보내기?
  // //파일 보내기(*보낼 디렉토리에 폴더명이 존재해야함)


  // exec( `scp ${rpmDir}*.rpm root@${installDirectoryIP}:/root/yh`)

  // sshpass -p 'netdb3230' scp -o StrictHostKeyChecking=no /home/skh/yh/skh_project/Installation/rpm/*.rpm root@203.255.92.193:/root/yh

  //scp 로 파일 다 보내기
  //sshpass는 접속만하기 한대에서

   // scp /home/me/wow.html abc@111.222.333.444:/home/abc/
   // `scp ${rpmDir}*.rpm root@${installDirectoryIP}:/root/yh`


  // rpm 설치 함수 호출
  //
  //
  //
  // //나가기?원래꺼로 접속
  // exit하고 ctrl+shift+R
  //   sshpass -p 'P@ssw0rd' ssh -o StrictHostKeyChecking=no root@135.79.246.99
}



module.exports.sshpassDelete = () => {
  exec(`${cmds.deleteCmd} ${cmds.sshpass}`)
}
