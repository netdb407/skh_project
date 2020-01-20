var inquirer = require('inquirer');
var fs = require('fs');
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
    name : 'Graph_benchmark',
    message : 'Graph benchmark properties',
  }
];

inquirer.prompt(question).then(answers => {
  if(answers.type === 'YCSB'){
    inquirer.prompt(q1).then(answers1=> {
      console.log("********************************");
      console.log("type is %s",answers.type);
      console.log("File name is %s",answers.name);
      console.log("----properties----");
      console.log("record count is %s",answers1.Record_count);
      console.log("Thread count is %s",answers1.Thread_count);
      console.log("Request distribution is %s",answers1.Request_distribution);
      console.log("et_cetera is %s",answers1.et_cetera);
      console.log("********************************");

      var aa = ['type = '+answers.type+'\n'+
      'Record count = '+answers1.Record_count+'\n'+
      'Thread count = '+answers1.Thread_count+'\n'+
      'Request distribution = '+answers1.Request_distribution+'\n'+
      'ETC = '+answers1.et_cetera];
      fs.writeFile('D:/' + answers.name,aa,(err) => {
        if(err){
          console.log(err);
        }else {
          console.log('파일저장 성공');
        }
      });
  });
  } else {
    inquirer.prompt(q2).then(answers2 => {
      console.log("********************************");
      console.log("type is %s",answers.type);
      console.log("File name is %s",answers.name);
      console.log("----properties----");
      console.log("Graph benchmark is %s",answers2.Graph_benchmark);
      console.log("********************************");

      var bb = ['type = ' + answers.type+'\n'+'Graph benchmark = '+answers2.Graph_benchmark];
      fs.writeFile('D:/' + answers.name,bb,(err) => {
        if(err){
          console.log(err);
        }else {
          console.log('파일저장 성공');
        }
      });
    });
  }
  }
);
