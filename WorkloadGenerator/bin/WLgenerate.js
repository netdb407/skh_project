var inquirer = require('inquirer');

const program = require('commander');

program
  .command('generate-wl')



program.parse(process.argv)

var question = [
  {
    type : 'list',
    name : 'type',
    message : 'type을 선택하세요',
    choices : ['YCSB','GRAPH'],
  }
];

var q1 = [
  {
    type : 'input',
    name : 'File name',
    message : 'File 이름을 입력하세요.',
  },
  {
    type : 'input',
    name : 'Record count',
    message : 'YCSB properties-Record count',
  },
  {
    type : 'input',
    name : 'Thread count',
    message : 'YCSB properties-Thread count',
  },
  {
    type : 'input',
    name : 'Request distribution',
    message : 'YCSB properties-Request distribution',
  },
  {
    type : 'input',
    name : 'Etc',
    message : 'YCSB properties-Etc',
  }
];

var q2 = [
  {
    type : 'input',
    name : 'File name',
    message : 'File 이름을 입력하세요.',
  },
  {
    type : 'input',
    name : 'Graph benchmark properties',
    message : 'Graph benchmark properties',
    value : 'Graph benchmark properties'
  }
];

inquirer.prompt(question).then(answers => {
  if(question.type ==='YCSB'){
    inquirer.prompt(q2).then(answers1 => {
      console.log(answers,answers1);
    });
  } else {
    inquirer.prompt(q1).then(answers2 => {
      console.log(answers,answers2);
    });
  }
  }
);
