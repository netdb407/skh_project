var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
var dir = './Benchmarking/YCSB/workloads/';

var question = [
  {
    type : 'list',
    name : 'start',
    message : '실행하실 프로그램을 선택하세요.',
    choices : ['create','update','delete']
  }
];

inquirer.prompt(question).then(answers =>{
  //파일 생성
  if(answers.start === 'create'){
    require('./WLgenerate_create.js');
  }
  //파일 수정
  else if (answers.start === 'update'){
    require('./WLgenerate_update.js');
  }
  //파일 삭제
  else {
    var deleteFiles = require('./WLgenerate_delete.js');
    deleteFiles.main();
      }
  }
);
