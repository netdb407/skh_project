const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('../../cmds.js')



module.exports.javaInstall = (package, dir) => {
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.javaFile}`)
}


module.exports.javaDelete = () => {
  exec(`${cmds.javadeleteCmd} ${cmds.java}`)
}
