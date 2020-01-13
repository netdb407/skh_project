const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const javaVersion = property.get_java();
const javaInstallCmd = 'rpm -ivh java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
const javaDeleteCmd = 'yum remove java'


module.exports.javaInstall = () => {

  const child = execFile('java', ['-version'], (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    // console.log(err);
    // console.log(stdout);
    console.log(stderr);

    if(stderr == null){
      console.log('JAVA를 설치합니다.');

      exec(javaInstallCommand);


    }else if(stderr.includes(javaVersion)==true){
      console.log('이미 JAVA가 설치되어있습니다.');


    }else {
      console.log('기존 JAVA와 버전이 달라 삭제 후 새로 설치합니다.');

      //기존 JAVA 삭제
      //exec("rpm -e jre-8u231-linux-x64.rpm")
      exec(javaDeleteCommand)
      //JAVA 설치
      exec(javaInstallCommand);
    }
  });
}
