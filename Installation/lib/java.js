const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')



module.exports.javaInstall = (package, dir) => {
  console.log('java를 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.javaFile}`)
  console.log('설치완료');
}


module.exports.javaDelete = () => {
  console.log('버전이 달라 기존 java를 삭제합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.java}`)
  console.log('java 삭제완료');
}
