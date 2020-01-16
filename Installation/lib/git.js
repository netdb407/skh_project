const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.gitInstall = () => {
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.gitFile} `)
}

module.exports.gitDelete = () => {
  exec(`${cmds.deleteCmd} ${cmds.git}`)
}
