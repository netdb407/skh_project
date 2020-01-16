const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.mavenInstall = () => {
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.mavenFile}`)
}


module.exports.mavenDelete = () => {
  exec(`${cmds.deleteCmd} ${cmds.maven}`)
}
