// sshpass install : rpm -ivh 파일명
// sshpass delete : rpm -e sshpass
// git install : rpm -ivh 파일명
// git delete : rpm -e git-core-2.18.1-3.el8.x86_64
// java install : rpm -ivh 파일명
// java delete : yum remove java (rpm -e로 지우면 dependency때문에 못지움)
// python install : rpm -ivh 파일명
// python delete : rpm -e platform-python 하면 dependencies엄청 걸려서 x
// maven install : rpm -ivh 파일명(dependencies 쩔음)
// maven delete : rpm -e maven

const installCmd = 'rpm -ivh'
const deleteCmd = 'rpm -e' //git, sshpass
const yumDeleteCmd = 'yum remove'

//dependencies걸려있는 애들은 yum remove 패키지명* 로 관련된거 다 지워버리기
const java = 'java'
const sshpass = 'sshpass'
const maven = 'maven-local-5.3.0-1.el8.noarch'
const python = 'platform-python-3.6.8-2.el8_0.0.1.x86_64'
const git = 'git-core'

//rpm 설치 파일 정보
const javaFile = 'java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
const sshpassFile = 'sshpass-1.06-2.el7.x86_64.rpm'
const mavenFile = 'maven-local-5.3.0-1.el8.noarch.rpm'
const pythonFile = 'platform-python-3.6.8-2.el8_0.0.1.x86_64.rpm'
const gitFile = 'git-core-2.18.1-3.el8.x86_64.rpm'




module.exports = {
  installCmd,
  deleteCmd,
  yumDeleteCmd,

  java,
  sshpass,
  git,
  maven,
  python,

  rpmDir,
  javaFile,
  sshpassFile,
  mavenFile,
  pythonFile,
  gitFile
}
