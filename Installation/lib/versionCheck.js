const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')



module.exports.versionCheck = (arg) => {
  // console.log('version');
  // console.log(arg);

  const child = execFile(arg, (err, stdout, stderr) => {
    // console.log(err);
    // console.log(stdout);
    // console.log(stderr);
    const temp = stdout
    console.log(temp);
    if(temp.includes('인식되지 않습니다')){
      console.log('wow');
    }
  })
  // let isOk = versionCheck("1.06", "1.05");
  // if(isOk)
  // {
  //   return;
  // }
  // else{
  //   지우고
  //   까는 함수 호출
  // }

//기존에 설치된거 버전 확인하는거.. bash? no such file

}
