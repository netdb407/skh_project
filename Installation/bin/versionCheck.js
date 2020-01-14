const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
const haveArg = false;  //false: 설치안됨, true: 설치됨



function versionCheck(arg){
  const child = execFile(arg, (err, stdout, stderr) => {
    if(Object.keys(err).includes('errno')==true){
      console.log('존재 유무 : 설치되지 않았습니다.');
    }
    else if(typeof stderr == 'string'){
      //설치안됨 : stderr에 아무것도 안담김
      //설치됨 : typeof stderr == string

      // console.log(typeof stderr);
      // console.log(stdout);
      // console.log('stdout');
      // console.log(stderr);
      console.log('haveArg 좀 바뀌어라');
      const haveArg = true;
      console.log('존재 유무 : 이미 존재하는 패키지입니다.');
    }
  })
}

module.exports = {
  haveArg,
  versionCheck
}
