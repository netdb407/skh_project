const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')



module.exports.javaInstall = (package, dir) => {
  console.log('java를 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.javaFile}`)
  console.log('설치완료');
}


module.exports.javaDelete = () => {
  exec(`${cmds.javadeleteCmd} ${cmds.java}`)
  console.log('java 삭제완료');
}
