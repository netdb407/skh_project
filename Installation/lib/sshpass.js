const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const cmds = require('../../cmds.js')


module.exports.sshpassInstall = () => {

  //프로젝트폴더 로컬에서 먼저 rpm파일 설치!!
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.sshpassFile} `)
  // //파일 보내기
  // sshpass -p 'P@ssw0rd' scp -o StrictHostKeyChecking=no hello.txt root@135.79.246.99:/root/hello.tx


  // //접속
  // sshpass -p 'P@ssw0rd' ssh -o StrictHostKeyChecking=no root@135.79.246.99

  // //명령어
  
  // //나가기?원래꺼로 접속
  //   sshpass -p 'P@ssw0rd' ssh -o StrictHostKeyChecking=no root@135.79.246.99

}


module.exports.sshpassDelete = () => {
  exec(`${cmds.deleteCmd} ${cmds.sshpass}`)
}
