// //user정보
const installCmd = 'rpm -ivh'

const javadeleteCmd = 'yum remove'
const sshpassDeleteCmd = 'rpm -e'

const java = 'java'
const sshpass = 'sshpass'

const javaFile = 'java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
const sshpassFile = 'sshpass-1.06-2.el7.x86_64.rpm'
const mavenFile = 'maven-local-5.3.0-1.el8.noarch.rpm'
const pythonFile = 'platform-python-3.6.8-2.el8_0.0.1.x86_64.rpm'
const gitFile = 'git-core-2.18.1-3.el8.x86_64.rpm'

const rpmDir = './Installation/rpm/'




module.exports = {
  installCmd,
  javadeleteCmd,
  sshpassDeleteCmd,
  java,
  sshpass,
  javaFile,
  sshpassFile,
  mavenFile,
  pythonFile,
  gitFile,
  rpmDir
}
