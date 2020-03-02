var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const ycsbDir = property.get_server_ycsb_dir()
const wlfileDir = property.get_server_wlfile_dir()

var dir = ycsbDir+"/"+wlfileDir+"/";

var question = [
  {
    type : 'list',
    name : 'start',
    message : '실행하실 프로그램을 선택하세요.',
    choices : ['create','update','read','delete']
  }
];

inquirer.prompt(question).then(answers =>{
  //파일 생성
  if(answers.start === 'create'){
    require('./WLgenerate_create.js');
  }
  //파일 수정
  else if (answers.start === 'update'){
    const updateFiles = require('./WLgenerate_update.js');
    updateFiles.main2();
  //파일 읽기
}else if(answers.start ==='read'){
    const readFiles = require('./WLgenerate_read');
    readFiles.main3();
  }
  //파일 삭제
  else {
    var deleteFiles = require('./WLgenerate_delete.js');
    deleteFiles.main();
      }
  }
);
