const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.gitInstall = () => {
  console.log('git을 로컬에 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.gitFile} `)
  console.log('git 설치완료');
}

module.exports.gitDelete = () => {
  console.log('버전이 달라 기존 git을 삭제합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.git}`)
  console.log('git 삭제완료');
}
