const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const javaVersion = property.get_java();

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

      exec("rpm -ivh jre-8u231-linux-x64.rpm");


    }else if(stderr.includes(javaVersion)==true){
      console.log('이미 JAVA가 설치되어있습니다.');


    }else {
      console.log('기존 JAVA와 버전이 달라 삭제 후 새로 설치합니다.');

      //기존 JAVA 삭제
      //exec("rpm -e jre-8u231-linux-x64.rpm")
      exec("yum remove java")
      //JAVA 설치
      exec("rpm -ivh jre-8u231-linux-x64.rpm");
    }
  });
}
