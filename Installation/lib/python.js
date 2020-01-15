const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.pythonInstall = () => {
  console.log('python을 로컬에 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.pythonFile} `)
  console.log('python 설치완료');
}

module.exports.pythonDelete = () => {
  console.log('버전이 달라 기존 python을 삭제합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.python}`)
  console.log('python 삭제완료');
}
