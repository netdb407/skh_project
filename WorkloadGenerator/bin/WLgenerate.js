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
  },{
    type : 'input',
    name : 'name',
    message : 'File 이름을 입력하세요.',
    default : 'workloads',
  }];

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
    default : 1000
  },{
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
    type : 'input',
    name : 'scanlengthdistribution',
    message : 'YCSB properties-scanlengthdistribution',
    // validate: function(value) {
    //   var valid = !isNaN(parseFloat(value));
    //   return valid || 'Please enter a number';
    // },
    // filter: Number,
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
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : 1000
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
      console.log("type = %s",answers.type);
      console.log("File name = %s",answers.name);
      console.log("----properties----");
      console.log("record count = %s",answers1.Record_count);
      console.log("Field count = %s",answers1.Field_count);
      console.log("fieldlength = %s",answers1.fieldlength);
      console.log("minfieldlength = %s",answers1.minfieldlength);
      console.log("readallfields = %s",answers1.readallfields);
      console.log("writeallfields = %s",answers1.writeallfields);
      console.log("readproportion = %s",answers1.readproportion);
      console.log("updateproportion = %s",answers1.updateproportion);
      console.log("insertproportion = %s",answers1.insertproportion);
      console.log("scanproportion = %s",answers1.scanproportion);
      console.log("readmodifywriteproportion = %s",answers1.readmodifywriteproportion);
      console.log("requestdistribution = %s",answers1.requestdistribution);
      console.log("minscanlength = %s",answers1.minscanlength);
      console.log("maxscanlength = %s",answers1.maxscanlength);
      console.log("scanlengthdistribution = %s",answers1.scanlengthdistribution);
      console.log("insertstart = %s",answers1.insertstart);
      console.log("insertcount = %s",answers1.insertcount);
      console.log("zeropadding = %s",answers1.zeropadding);
      console.log("insertorder = %s",answers1.insertorder);
      console.log("fieldnameprefix = %s",answers1.fieldnameprefix);
      console.log("hdrhistogram.percentiles = %s",answers1.hdrhistogram.percentiles);
      console.log("hdrhistogram.fileoutput = %s",answers1.hdrhistogram.fileoutput);
      console.log("histogram = %s",answers1.histogram);
      console.log("timeseries.granularity = %s",answers1.timeseries);
      console.log("********************************");

      var aa = ['type = '+answers.type+'\n'+
      'Record count = '+answers1.Record_count+'\n'+
      'Field count = '+answers1.Field_count+'\n'+
      'fieldlength = '+answers1.fieldlength+'\n'+
      'minfieldlength = '+answers1.minfieldlength+'\n'+
      'readallfields = '+answers1.readallfields+'\n'+
      'writeallfields = '+answers1.writeallfields+'\n'+
      'readproportion = '+answers1.readproportion+'\n'+
      'updateproportion = '+answers1.updateproportion+'\n'+
      'insertproportion = '+answers1.insertproportion+'\n'+
      'scanproportion = '+answers1.scanproportion+'\n'+
      'readmodifywriteproportion = '+answers1.readmodifywriteproportion+'\n'+
      'requestdistribution = '+answers1.requestdistribution+'\n'+
      'minscanlength = '+answers1.minscanlength+'\n'+
      'maxscanlength = '+answers1.maxscanlength+'\n'+
      'scanlengthdistribution = '+answers1.scanlengthdistribution+'\n'+
      'insertstart = '+answers1.insertstart+'\n'+
      'insertcount = '+answers1.insertcount+'\n'+
      'zeropadding = '+answers1.zeropadding+'\n'+
      'insertorder = '+answers1.insertorder+'\n'+
      'fieldnameprefix = '+answers1.fieldnameprefix+'\n'+
      'hdrhistogram.percentiles = '+answers1.hdrhistogram.percentiles+'\n'+
      'hdrhistogram.fileoutput = '+answers1.hdrhistogram.fileoutput+'\n'+
      'histogram = '+answers1.histogram+'\n'+
      'timeseries.granularity = '+answers1.timeseries+'\n'
    ];

        fs.writeFile('./Benchmarking/YCSB/workloads/' + answers.name,aa,(err) => {
          if(err){
            console.log(err);
          }else {
            console.log('파일저장 성공');
          }
        });
      })
  } else {
    inquirer.prompt(q2).then(answers2 => {
      console.log("********************************");
      console.log("type is %s",answers.type);
      console.log("File name is %s",answers.name);
      console.log("----properties----");
      console.log("Graph benchmark is %s",answers2.Graph_benchmark);
      console.log("********************************");

      var bb = ['type = ' + answers.type+'\n'+'Graph benchmark = '+answers2.Graph_benchmark];
      fs.writeFile('./Benchmarking/YCSB/workloads/' + answers.name,bb,(err) => {
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
