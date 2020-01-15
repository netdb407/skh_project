const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const sshpassVersion = property.get_sshpass();
const cmds = require('../../cmds.js')


module.exports.sshpassInstall = () => {

  //프로젝트폴더 로컬에서 먼저 rpm파일 설치!!
  console.log('sshpass를 로컬에 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.sshpassFile} `)
  // exec(cmds.sshpassInstallCmd);
  console.log('설치완료');
  // //파일 보내기
  // sshpass -p 'P@ssw0rd' scp -o StrictHostKeyChecking=no hello.txt root@135.79.246.99:/root/hello.tx
  //

  // //접속
  // sshpass -p 'P@ssw0rd' ssh -o StrictHostKeyChecking=no root@135.79.246.99
  //
  // //명령어
  //
  // //나가기?원래꺼로 접속
  //   sshpass -p 'P@ssw0rd' ssh -o StrictHostKeyChecking=no root@135.79.246.99



  // const child = execFile('sshpass', ['-V'], (err, stdout, stderr) => {
  //
  //
  //   if (err) {
  //     throw err;
  //   }
  //
  //   try{
  //     if(stdout.includes(sshpassVersion)==true){
  //       console.log('이미 sshpass가 설치되어있습니다.');
  //     }
  //
  //     else{
  //       console.log('설치된 sshpass와 버전이 달라 삭제 후 새로 설치합니다.');
  //       var exec = require('child_process').execSync;
  //       //기존 JAVA 삭제
  //       exec(cmds.sshpassDeleteCmd)
  //       //JAVA 설치
  //       exec(cmds.sshpassInstallCmd);
  //     }
  //   }
  //   catch(exception){
  //     console.log('sshpass를 설치합니다.');
  //
  //     exec(cmds.sshpassInstallCmd);
  //   }
  //
  // });
}
