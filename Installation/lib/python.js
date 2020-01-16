const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')


module.exports.pythonInstall = () => {
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.pythonFile} `)
}

module.exports.pythonDelete = () => {
  exec(`${cmds.deleteCmd} ${cmds.python}`)
}
