var inquirer = require('inquirer');
var prompts = new Rx.Subject();

inquirer.prompt(prompts);

prompt.next({
  type : 'list',
  name : 'type',
  message : 'type을 선택하세요',
  choices : ['YCSB','GRAPH'],
});

prompt.next({
  type : 'input',
  name : 'File name',
  message : 'File 이름을 입력하세요.',
});

if(type.choices==='YCSB'){
  prompt.next({
    type : 'input',
    name : 'Record count',
    message : 'YCSB properties-Record count',
  });
  prompt.next({
    type : 'input',
    name : 'Thread count',
    message : 'YCSB properties-Thread count',
  });
  prompt.next({
    type : 'input',
    name : 'Request distribution',
    message : 'YCSB properties-Request distribution',
  });
  prompt.next({
    type : 'input',
    name : 'Etc',
    message : 'YCSB properties-Etc',
  });
} else {
  prompt.next({
    type : 'input',
    name : 'Graph benchmark properties',
    message : 'Graph benchmark properties',
    value : 'Graph benchmark properties'
  });
}

prompts.complete();
