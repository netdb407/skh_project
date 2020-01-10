const property = require('../../propertiesReader.js')
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;

module.exports.javaInstall = () => {

  const child = execFile('java', ['-version'], (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    // console.log(err);
    // console.log(stdout);
    console.log(stderr);


    // console.log(property.getJavaVersion());
console.log(property.getNodeInfo());


    if(stderr == null){
      console.log('JAVA를 설치합니다.');

      exec("rpm -ivh jre-8u231-linux-x64.rpm");


    }else if(stderr.includes('1.8.0_191')==true){
      console.log('이미 JAVA가 설치되어있습니다.');


    }else {
      console.log('기존 JAVA와 버전이 달라 삭제 후 새로 설치합니다.');

      //기존 JAVA 삭제
      //exec("rpm -e jre-8u231-linux-x64.rpm")
      exec("yum remove java")
      //JAVA 설치
      exec("rpm -ivh jre-8u231-linux-x64.rpm");

      // exec ("rpm -ivh sshpass-1.06-2.el7.x86_64.rpm");
      // exec("npm install --save meow");
    }
  });
}




// module.exports.javaInstall = () => {
//   // Function for downloading file using wget
//   var download_file_wget = function(file_url) {
//     // extract the file name
//     var file_name = url.parse(file_url).pathname.split('/').pop();
//     // compose the wget command
//     var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;
//     // excute wget using child_process' exec function
//
//     var child = exec(wget, function(err, stdout, stderr) {
//       if (err) throw err;
//       else console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
//     });
//   };
// }
