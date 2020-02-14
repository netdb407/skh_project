var inquirer = require('inquirer');
var fs = require('fs');
const program = require('commander');
const property = require('../../propertiesReader.js')
const ycsbDir = property.get_server_ycsb_dir()
const wlfileDir = property.get_server_wlfile_dir()

var dir = ycsbDir+"/"+wlfileDir+"/";
const PropertiesReader = require('properties-reader');

var fileproperties ='';

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
    type : 'list',
    name : 'original_name',
    message : '변경할 파일의 이름을 선택하세요.',
    choices : []
  }
];

const filelist = fs.readdirSync(dir);
question1[1].choices = filelist;
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
    default : ''
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
    default : '',
  },{
    type : 'input',
    name : 'fieldlength',
    message : 'YCSB properties-Field length',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : '',
  },{
    type : 'input',
    name : 'minfieldlength',
    message : 'YCSB properties-minfieldlength',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : '',
  },{
    type : 'list',
    name : 'readallfields',
    message : 'YCSB properties-readallfields',
    choices : ['true','false'],
    default : '',
  },{
    type : 'list',
    name : 'writeallfields',
    message : 'YCSB properties-writeallfields',
    choices : ['true','false'],
    default : '',
  },{
    type : 'input',
    name : 'readproportion',
    message : 'YCSB properties-readproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default :'' ,
  },{
    type : 'input',
    name : 'updateproportion',
    message : 'YCSB properties-updateproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default :'',
  },{
    type : 'input',
    name : 'insertproportion',
    message : 'YCSB properties-insertproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : '',
  },{
    type : 'input',
    name : 'scanproportion',
    message : 'YCSB properties-scanproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : '',
  },{
    type : 'input',
    name : 'readmodifywriteproportion',
    message : 'YCSB properties-readmodifywriteproportion',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default : '',
  },{
    type : 'list',
    name : 'requestdistribution',
    message : 'YCSB properties-requestdistribution',
    choices : ['uniform','zipfian','hotspot','sequential','exponential','latest'],
    default :''
  },{
    type : 'input',
    name : 'minscanlength',
    message : 'YCSB properties-minscanlength',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default :''
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
    default :''
  },{
    type : 'list',
    name : 'scanlengthdistribution',
    message : 'YCSB properties-scanlengthdistribution',
    choices : ['uniform','zipfian','hotspot','sequential','exponential','latest'],
    default :''
  },{
    type : 'input',
    name : 'insertstart',
    message : 'YCSB properties-insertstart',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
    default :''
  }];
  var q2 =[
    {
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
    default :''
  },{
    type : 'list',
    name : 'insertorder',
    message : 'YCSB properties-insertorder',
    choices : ['ordered','hashed'],
  },{
    type : 'input',
    name : 'fieldnameprefix',
    message : 'YCSB properties-fieldnameprefix',
    default :''
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
    default :''
  },{
    type : 'input',
    name : 'timeseries',
    message : 'timeseries.granularity',
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    default :''
  }
];
// Graph benchmark 속성 입력
var q3 = [
  {
    type : 'input',
    name : 'Graph_benchmark',
    message : 'Graph benchmark properties',
  }
];

async function main2(){
  const answer = await inquirer.prompt(question1);
  var fileproperties = PropertiesReader(dir+answer.original_name);
  console.log(fileproperties);
  q1[0].default = fileproperties.path().Recordcount;
  q1[1].default = fileproperties._properties.Fieldcount;
  q1[2].default = fileproperties._properties.fieldlength;
  q1[3].default = fileproperties._properties.minfieldlength;
  q1[4].default = fileproperties._properties.readallfields;
  q1[5].default = fileproperties._properties.writeallfields;
  q1[6].default = fileproperties._properties.readproportion;
  q1[7].default = fileproperties._properties.updateproportion;
  q1[8].default = fileproperties._properties.insertproportion;
  q1[9].default = fileproperties._properties.scanproportion;
  q1[10].default = fileproperties._properties.readmodifywriteproportion;
  q1[11].default = fileproperties._properties.requestdistribution;
  q1[12].default = fileproperties._properties.minscanlength;
  q1[13].default = fileproperties._properties.maxscanlength;
  q1[14].default = fileproperties._properties.scanlengthdistribution;
  q1[15].default = fileproperties._properties.insertstart;
  q2[1].default = fileproperties._properties.zeropadding;
  q2[2].default = fileproperties._properties.insertorder;
  q2[3].default = fileproperties._properties.fieldnameprefix;
  q2[4].default = fileproperties._properties.hdrhistogram_percentiles;
  q2[5].default = fileproperties._properties.hdrhistogram_fileoutput;
  q2[6].default = fileproperties._properties.histogram;
  q2[7].default = fileproperties._properties.timeseries_granularity;

  if(answer.choice === '파일이름'){
    var fsExists = fs.existsSync(dir+answer.original_name);
    if(fsExists){
      inquirer.prompt(rename).then(answer1 => {
        if(answer1){
          fs.renameSync(dir+answer.original_name,dir+answer1.new_name);
          console.log('이름이 변경되었습니다.');
        }
        else {
          console.log('존재하지 않는 파일 이름입니다.');
        }
      });
    }
  } else {
    inquirer.prompt(question2).then(answer2 =>{
      if(answer2.type === 'YCSB'){
        inquirer.prompt(q1).then(answer2_1 => {
          q2[0].default = answer2_1.Record_count;
          inquirer.prompt(q2).then(answer2_1_1 => {
            if(answer2_1){
              var aa = ['type = '+answer2.type+'\n'+
              'Recordcount = '+answer2_1.Record_count+'\n'+
              'Fieldcount = '+answer2_1.Field_count+'\n'+
              'fieldlength = '+answer2_1.fieldlength+'\n'+
              'minfieldlength = '+answer2_1.minfieldlength+'\n'+
              'readallfields = '+answer2_1.readallfields+'\n'+
              'writeallfields = '+answer2_1.writeallfields+'\n'+
              'readproportion = '+answer2_1.readproportion+'\n'+
              'updateproportion = '+answer2_1.updateproportion+'\n'+
              'insertproportion = '+answer2_1.insertproportion+'\n'+
              'scanproportion = '+answer2_1.scanproportion+'\n'+
              'readmodifywriteproportion = '+answer2_1.readmodifywriteproportion+'\n'+
              'requestdistribution = '+answer2_1.requestdistribution+'\n'+
              'minscanlength = '+answer2_1.minscanlength+'\n'+
              'maxscanlength = '+answer2_1.maxscanlength+'\n'+
              'scanlengthdistribution = '+answer2_1.scanlengthdistribution+'\n'+
              'insertstart = '+answer2_1.insertstart+'\n'+
              'insertcount = '+answer2_1_1.insertcount+'\n'+
              'zeropadding = '+answer2_1_1.zeropadding+'\n'+
              'insertorder = '+answer2_1_1.insertorder+'\n'+
              'fieldnameprefix = '+answer2_1_1.fieldnameprefix+'\n'+
              'hdrhistogram_percentiles = '+answer2_1_1.hdrhistogram_percentiles+'\n'+
              'hdrhistogram_fileoutput = '+answer2_1_1.hdrhistogram_fileoutput+'\n'+
              'histogram = '+answer2_1_1.histogram+'\n'+
              'timeseries_granularity = '+answer2_1_1.timeseries+'\n'
            ];
              fs.readFile(dir+answer.original_name,'utf8',function(err,data){
                if(err) throw err;

                fs.writeFile(dir+answer.original_name,aa,function(err,data){
                  if(err) throw err;
                  console.log("파일수정완료");
                });
              });
            }
          });
        })
      }
      else{
        inquirer.prompt(q3).then(answer2_2 => {
          if(answer2_2){
            var bb = ['type = ' + answer2.type+'\n'+'Graph benchmark = '+answer2_2.Graph_benchmark];
            fs.readFile(dir+answer.original_name,'utf8',function(err,data){
              if(err) throw err;
              fs.writeFile(dir+answer.original_name,bb,function(err,data){
                if(err) throw err;
                console.log("파일수정완료");
              });
            });
          }
        });
      }
    });
  }
// };
};
module.exports.main2 = main2;
