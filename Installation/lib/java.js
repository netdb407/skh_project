const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const cmds = require('./cmds.js')



module.exports.javaInstall = (package, dir) => {
  exec(`${cmds.installCmd} ${dir}${cmds.javaFile}`)
}


module.exports.javaDelete = () => {
  exec(`${cmds.yumDeleteCmd} ${cmds.java}`)
}
