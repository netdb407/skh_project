const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.mavenInstall = () => {
  console.log('maven을 로컬에 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.mavenFile}`)
  console.log('maven 설치완료');
}


module.exports.mavenDelete = () => {
  console.log('버전이 달라 기존 maven을 삭제합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.maven}`)
  console.log('maven 삭제완료');
}
