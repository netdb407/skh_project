var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
var dir = './Benchmarking/YCSB/workloads/';

var question = [
  {
    type : 'rawlist',
    name : 'start',
    message : '실행하실 프로그램을 선택하세요.',
    choices : ['create','update','delete'],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];

inquirer.prompt(question).then(answers =>{
  if(answers.start === 'create'){
    require('./WLgenerate_create.js');
  } else if (answers.start === 'update'){
    require('./WLgenerate_update.js');
  } else {
    require('./WLgenerate_delete.js');
  }
});
