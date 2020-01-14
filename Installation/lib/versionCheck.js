const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const property = require('../../propertiesReader.js')



module.exports.versionCheck = (arg) => {
  // console.log('version');
  // console.log(arg);

  const child = execFile(arg, (err, stdout, stderr) => {
    // console.log(err);
    // console.log('stdout');
    // console.log(stdout);
    // console.log('stderr');
    // console.log(stderr);

    
    //에러일때! 없는 옵션
    if(Object.keys(err).includes('errno')==true){
      console.log('error!');
    }


    //결과 담기
    //command not found : 없으니 설치
    //version : 숫자 저장해서 비교
    //같으면 종료, 다르면 삭제 후 재설치
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
