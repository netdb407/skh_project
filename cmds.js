// //user정보
const javaInstallCmd = 'rpm -ivh java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
const javaDeleteCmd = 'yum remove java'

const sshpassInstallCmd = 'rpm -ivh sshpass-1.06-2.el7.x86_64.rpm'
const sshpassDeleteCmd = 'rpm -e sshpass'


module.exports = {
  javaInstallCmd : javaInstallCmd,
  javaDeleteCmd : javaDeleteCmd,

  sshpassInstallCmd : sshpassInstallCmd,
  sshpassDeleteCmd : sshpassDeleteCmd
}
