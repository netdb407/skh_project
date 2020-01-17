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
  },
  {
    type : 'input',
    name : 'name',
    message : 'File 이름을 입력하세요.',
  },
];

var q1 = [

  {
    type : 'input',
    name : 'Record_count',
    message : 'YCSB properties-Record count',
  },
  {
    type : 'input',
    name : 'Thread_count',
    message : 'YCSB properties-Thread count',
  },
  {
    type : 'input',
    name : 'Request_distribution',
    message : 'YCSB properties-Request distribution',
  },
  {
    type : 'input',
    name : 'et_cetera',
    message : 'YCSB properties-Etc',
  }
];

var q2 = [
  {
    type : 'input',
    name : 'Graph benchmark properties',
    message : 'Graph benchmark properties',
    value : 'Graph benchmark properties'
  }
];

inquirer.prompt(question).then(answers => {
  if(answers.type === 'YCSB'){
    inquirer.prompt(q1).then(answers1=> {
      console.log("********************************");
      console.log("type is %s",answers.type);
      console.log("File name is %s",answers.name);
      console.log("----properties----");
      console.log("record count is %s",answers1.record_count);
      console.log("Thread count is %s",answers1.Thread_count);
      console.log("Request distribution is %s",answers1.Request_distribution);
      console.log("et_cetera is %s",answers1.et_cetera);
      console.log("********************************");
  });
  } else {
    inquirer.prompt(q2).then(answers2 => {
    });
  }
  }
);
