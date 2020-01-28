var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
var dir = './Benchmarking/YCSB/workloads/';

program
  .command('generate-wl')




program.parse(process.argv)
//파일 변경 옵션 선택
var question1 = [
  {
    type : 'list',
    name : 'choice',
    message : '무엇을 변경하시겠습니까?',
    choices : ['파일이름','파일내용']
  },{
    type : 'input',
    name : 'original_name',
    message : '변경할 파일의 이름을 입력하세요.'
  }
];
//변경할 파일의 새로운 이름 입력
var rename = [
  {
    type : 'input',
    name : 'new_name',
    message : '새로운 이름을 입력하세요.'
  }
]
//type 선택
var question2 = [
  {
    type : 'list',
    name : 'type',
    message : 'type을 선택하세요',
    choices : ['YCSB','GRAPH'],
  }];
//YCSB 속성 입력
var q1 = [
  {
    type : 'input',
    name : 'Record_count',
    message : 'YCSB properties-Record count',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter : Number,
    default : 1000,
    }
  ,{
    type : 'input',
    name : 'Field_count',
    message : 'YCSB properties-Field count',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 10
  },{
    type : 'input',
    name : 'Field_length',
    message : 'YCSB properties-Field length',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 100
  },{
    type : 'input',
    name : 'minfieldlength',
    message : 'YCSB properties-minfieldlength',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 1
  },{
    type : 'list',
    name : 'readallfields',
    message : 'YCSB properties-readallfields',
    choices : ['true','false'],
    default : true
  },{
    type : 'list',
    name : 'writeallfields',
    message : 'YCSB properties-writeallfields',
    choices : ['true','false'],
    default : false
  },{
    type : 'input',
    name : 'readproportion',
    message : 'YCSB properties-readproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0.95
  },{
    type : 'input',
    name : 'updateproportion',
    message : 'YCSB properties-updateproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0.05
  },{
    type : 'input',
    name : 'insertproportion',
    message : 'YCSB properties-insertproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0
  },{
    type : 'input',
    name : 'scanproportion',
    message : 'YCSB properties-scanproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0
  },{
    type : 'input',
    name : 'readmodifywriteproportion',
    message : 'YCSB properties-readmodifywriteproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0
  },{
    type : 'list',
    name : 'requestdistribution',
    message : 'YCSB properties-requestdistribution',
    choices : ['uniform','zipfian','hotspot','sequential','exponential','latest'],
    default : 'uniform'
  },{
    type : 'input',
    name : 'minscanlength',
    message : 'YCSB properties-minscanlength',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 1
  },
  {
    type : 'input',
    name : 'maxscanlength',
    message : 'YCSB properties-maxscanlength',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 1000
  },{
    type : 'list',
    name : 'scanlengthdistribution',
    message : 'YCSB properties-scanlengthdistribution',
    choices : ['uniform','zipfian','hotspot','sequential','exponential','latest'],
    default : 'uniform'
  },{
    type : 'input',
    name : 'insertstart',
    message : 'YCSB properties-insertstart',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 0
  },{
    type : 'input',
    name : 'insertcount',
    message : 'YCSB properties-insertcount',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      if(value === 'Record_count value'){
        return true;
      } else{
        return valid || 'Please enter a number';
      }
    },
    default : 'Record_count value'
  },{
    type : 'input',
    name : 'zeropadding',
    message : 'YCSB properties-zeropadding',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 1
  },{
    type : 'list',
    name : 'insertorder',
    message : 'YCSB properties-insertorder',
    choices : ['ordered','hashed'],
  },{
    type : 'input',
    name : 'fieldnameprefix',
    message : 'YCSB properties-fieldnameprefix',
    default : 'field'
  },{
    type : 'checkbox',
    name : 'hdrhistogram.percentiles',
    message : 'hdrhistogram - percentiles',
    choices : [
      {
        name : 95,
        filter : Number,
        checked : true
      },{
        name : 99,
        filter : Number,
        checked : true
      },{
        name : 99.99,
        filter : Number
      },{
        name : 99.999,
        filter : Number
      },{
        name : 99.9999,
        filter : Number
      }
    ]
  },{
    type : 'list',
    name : 'hdrhistogram.fileoutput',
    message : 'hdrhistogram.fileoutput',
    choices : ['true','false'],
  },{
    type : 'input',
    name : 'histogram',
    message : 'histogram.buckets',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    default : 1000
  },{
    type : 'input',
    name : 'timeseries',
    message : 'timeseries.granularity',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    default : 1000
  }
];
// Graph benchmark 속성 입력
var q2 = [
  {
    type : 'input',
    name : 'Graph_benchmark',
    message : 'Graph benchmark properties',
  }
];

inquirer.prompt(question1).then(answers => {
  //파일 이름 변경
  if(answers.choice ==='파일이름'){
    fs.exists(dir+answers.original_name,function(exists){
      if(exists){
        inquirer.prompt(rename).then(answers1 => {
          fs.rename(dir+answers.original_name,dir+answers1.new_name,function(err){
            if(err) throw err;
            else console.log('이름이 변경되었습니다.');
          });
        });
      } else {
        console.log('존재하지 않는 파일 이름입니다.');
      }
    });
    // 파일 내용 변경
  } else {
    inquirer.prompt(question2).then(answers2 => {
      //YCSB 속성
      if(answers2.type === 'YCSB'){
        inquirer.prompt(q1).then(answers2_1=>{
          if(answers2_1.insertcount!=Number){
            answers2_1.insertcount=answers2_1.Record_count;
          }
          var aa = ['type = '+answers2.type+'\n'+
          'Record count = '+answers2_1.Record_count+'\n'+
          'Field count = '+answers2_1.Field_count+'\n'+
          'fieldlength = '+answers2_1.fieldlength+'\n'+
          'minfieldlength = '+answers2_1.minfieldlength+'\n'+
          'readallfields = '+answers2_1.readallfields+'\n'+
          'writeallfields = '+answers2_1.writeallfields+'\n'+
          'readproportion = '+answers2_1.readproportion+'\n'+
          'updateproportion = '+answers2_1.updateproportion+'\n'+
          'insertproportion = '+answers2_1.insertproportion+'\n'+
          'scanproportion = '+answers2_1.scanproportion+'\n'+
          'readmodifywriteproportion = '+answers2_1.readmodifywriteproportion+'\n'+
          'requestdistribution = '+answers2_1.requestdistribution+'\n'+
          'minscanlength = '+answers2_1.minscanlength+'\n'+
          'maxscanlength = '+answers2_1.maxscanlength+'\n'+
          'scanlengthdistribution = '+answers2_1.scanlengthdistribution+'\n'+
          'insertstart = '+answers2_1.insertstart+'\n'+
          'insertcount = '+answers2_1.insertcount+'\n'+
          'zeropadding = '+answers2_1.zeropadding+'\n'+
          'insertorder = '+answers2_1.insertorder+'\n'+
          'fieldnameprefix = '+answers2_1.fieldnameprefix+'\n'+
          'hdrhistogram.percentiles = '+answers2_1.hdrhistogram.percentiles+'\n'+
          'hdrhistogram.fileoutput = '+answers2_1.hdrhistogram.fileoutput+'\n'+
          'histogram = '+answers2_1.histogram+'\n'+
          'timeseries.granularity = '+answers2_1.timeseries+'\n'
        ];
        fs.writeFile(dir+answers.original_name,aa,(err) => {
          if(err){
            console.log(err);
          }else {
            console.log('파일저장 성공');
          }
        });
      });
  } else {
    //Graph benchmark 속성
    inquirer.prompt(q2).then(answers2_2 => {
      var bb = ['type = ' + answers2.type+'\n'+'Graph benchmark = '+answers2_2.Graph_benchmark];
      fs.writeFile(dir + answers.original_name,bb,(err) => {
        if(err){
          console.log(err);
        }else {
          console.log('파일저장 성공');
        }
      });
    });
  }
})
}
});
