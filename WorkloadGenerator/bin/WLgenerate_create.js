
var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const ycsbDir = property.get_server_ycsb_dir()
const wlfileDir = property.get_server_wlfile_dir()

var dir = ycsbDir+"/"+wlfileDir+"/";
program
  .command('generate-wl')




program.parse(process.argv)

//파일 type&이름
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

//YCSB 속성
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
    name : 'fieldlength',
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
  }];

  var q3 = [
    {
    type : 'input',
    name : 'insertcount',
    message : 'YCSB properties-insertcount',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      if(value === 'Record_count value'){
        return true;
      } else {
        return valid || 'Please enter a number';
      }
    },
    filter : Number,
    default : ''
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
    name : 'hdrhistogram_percentiles',
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
    name : 'hdrhistogram_fileoutput',
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
//Graph benchmark 속성
var q2 = [
  {
    type : 'input',
    name : 'Graph_benchmark',
    message : 'Graph benchmark properties',
  }
];

inquirer.prompt(question).then(answers => {
    if(answers.type === 'YCSB'){
    inquirer.prompt(q1).then(answers1=>{
        q3[0].default = answers1.Record_count;
      inquirer.prompt(q3).then(answers1_2=>{
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
        console.log("insertcount = %s",answers1_2.insertcount);
        console.log("zeropadding = %s",answers1_2.zeropadding);
        console.log("insertorder = %s",answers1_2.insertorder);
        console.log("fieldnameprefix = %s",answers1_2.fieldnameprefix);
        console.log("hdrhistogram.percentiles = %s",answers1_2.hdrhistogram_percentiles);
        console.log("hdrhistogram.fileoutput = %s",answers1_2.hdrhistogram_fileoutput);
        console.log("histogram = %s",answers1_2.histogram);
        console.log("timeseries.granularity = %s",answers1_2.timeseries);
        console.log("********************************");

        var aa = ['type = '+answers.type+'\n'+
        'Recordcount = '+answers1.Record_count+'\n'+
        'Fieldcount = '+answers1.Field_count+'\n'+
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
        'insertcount = '+answers1_2.insertcount+'\n'+
        'zeropadding = '+answers1_2.zeropadding+'\n'+
        'insertorder = '+answers1_2.insertorder+'\n'+
        'fieldnameprefix = '+answers1_2.fieldnameprefix+'\n'+
        'hdrhistogram_percentiles = '+answers1_2.hdrhistogram_percentiles+'\n'+
        'hdrhistogram_fileoutput = '+answers1_2.hdrhistogram_fileoutput+'\n'+
        'histogram = '+answers1_2.histogram+'\n'+
        'timeseries_granularity = '+answers1_2.timeseries+'\n'
      ];
          fs.readdir(dir,function(err,filelist){
            for(i=0;i<filelist.length;i++){
              if(filelist[i]===answers.name){
                answers.name = answers.name+'0';
              }
            }
            fs.writeFile(dir + answers.name,aa,'utf-8',(err) => {
              if(err){
                console.log(err);
              }else {
                console.log(answers.name + ' 이름으로 파일저장 성공');
              }
            });
          });
       })
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
      fs.readdir(dir,function(err,filelist){
        for(i=0;i<filelist.length;i++){
          if(filelist[i]===answers.name){
            answers.name = answers.name+'0';
          }
        }
        fs.writeFile(dir + answers.name,bb,(err) => {
          if(err){
            console.log(err);
          }else {
            console.log(answers.name + ' 이름으로 파일저장 성공');
          }
        });
      });
    });
  }
  }
);
