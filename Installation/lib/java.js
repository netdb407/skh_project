const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')
const javaVersion = property.get_java();
const cmds = require('../../cmds.js')
// const javaInstallCmd = 'rpm -ivh' + dir+'java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
// const javaInstallCmd = 'rpm -ivh java-1.8.0-openjdk-devel-1.8.0.232.b09-0.el8_0.x86_64.rpm'
// const javaDeleteCmd = 'yum remove java'



module.exports.javaInstall = (package, dir) => {
  console.log('java를 설치합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.javaFile}`)
  console.log('설치완료');

  // console.log('www');
  // console.log("${cmds.javaInstallCmd}"");
  // console.log(cmds.javaInstallCmd);

  // const child = execFile('java', ['-version'], (err, stdout, stderr) => {
  //   if (err) {
  //     throw err;
  //   }
  // console.log('www');

  //   const child = execFile(package, (err, stdout, stderr) => {
  //     // installCmd + dir + javaFile
  //     // `${installCmd} ${dir} ${javaFile}`
  //
  //
  //     // console.log(stderr);
  //     // if (err) {
  //     //   throw err;
  //     // }
  //   // console.log(err);
  //   // console.log('stdout');
  //   // console.log(stdout);
  //   // console.log('stderr');
  //   // console.log(stderr);
  //
  //   if(stderr == null){
  //     console.log('JAVA를 설치합니다.');
  //
  //     exec(cmds.javaInstallCmd);
  //
  //
  //   }else if(stderr.includes(javaVersion)==true){
  //     console.log('이미 JAVA가 설치되어있습니다.');
  //
  //
  //   }else {
  //     console.log('기존 JAVA와 버전이 달라 삭제 후 새로 설치합니다.');
  //
  //     //기존 JAVA 삭제
  //     //exec("rpm -e jre-8u231-linux-x64.rpm")
  //     exec(cmds.javaDeleteCmd)
  //     //JAVA 설치
  //     exec(cmds.javaInstallCmd);
  //   }
  //
  // });
}


module.exports.javaDelete = () => {
  console.log('버전이 달라 기존 java를 삭제합니다.');
  exec(`${cmds.installCmd} ${cmds.rpmDir}${cmds.java}`)
  console.log('java 삭제완료');
}
