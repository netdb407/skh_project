#!/usr/bin/env node
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const program = require('commander');
const chalk = require('chalk');
const property = require('../propertiesReader.js')
const PropertiesReader = require('properties-reader');
const installDir = property.get_server_install_dir_WL()
const fileDir = property.get_server_file2_dir()
const fileDir1 = property.get_server_file3_dir()
const host = property.get_orientMaster_IP()
const orientdir = property.server_orientdb_dir();
const dir = installDir + fileDir;
const dir2 = installDir + fileDir1;
const IO_watch_dir = property.get_IO_watch_dir();
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
var underscore = require('underscore');
var async = require('async');
var hosts = property.get_nodes_IP();

// .............................................................................
// parse command-line options
// .............................................................................

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('orientdb', 'orientdb benchmark')
  .option('n',{
    alias : 'name',
    demand : false,
    default : 'workloads',
    describe : 'file name',
    type : 'string',
  })
  .requiresArg('n')
  .option('t',{
    alias : 'time',
    demand : false,
    default : 10000,
    describe : 'settime',
    type : 'integer',
  })
  .requiresArg('t')
  .boolean('d')
  .argv
;

// .............................................................................
// checks the arguments
// .............................................................................
var databases = argv._;
var debug = argv.d;
var filename = argv.n;
var settime = argv.t;
var fileproperties = PropertiesReader(dir+filename);
var ip = hosts.split(',');
var orientdbdir = orientdir.split(',');
var opt = fileproperties._properties.operations;
var agg = fileproperties._properties.Aggregation;
var nei = fileproperties._properties.Neighbors;
var sssp = fileproperties._properties.SSSP;
var read = fileproperties._properties.read;
var funcname='';
var cvll= uvll = dvll = cell = uell = dell = aggl = neil = ssspl = readl = 0;
var ctime = utime = dtime = cetime = uetime = detime = aggtime = neitime = sssptime = readtime = 0;
var rdt = [];
let aggt = [];
let neit = [];
let ssspt = [];
let readt = [];
let ids = [];
let consist = [];
let fcon = [];
let tdata = [];
var rconsist= {};
var today = new Date();
var total = 0;
var finish2 = 0;
var st = settime;
var x = 1;
var database = databases[0];
var desc;
try {
  desc = require('./' + database + '/description');
} catch (err) {
  console.log('ERROR database %s is unknown (%s)', database, err);
  process.exit(1);
}
// .............................................................................
// random generation
// .............................................................................
var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;
}
// .............................................................................
// start database and check db status
// .............................................................................
async function dbstart(){
  return new Promise(function(resolve,reject){
    ip.forEach((i) => {
    console.log('--------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'orientdb run : ', chalk.blue.bold(i));
    console.log('--------------------------------------');
    dirnum = i.split('.');
    const std = exec(`ssh root@${i} nohup ${IO_watch_dir}/orientdb${dirnum[dirnum.length-1]}/bin/dserver.sh &`);
    });
    return resolve();
  })
}

async function statusCheck(){
  return new Promise(function(resolve,reject){
    const stdout = exec(`ssh root@203.255.92.195 tail -20 ${IO_watch_dir}/orientdb195/log/orient-server.log.0`);
    stdout.stdout.on('data', function(data) {
      let a = 0
      let a1 = data.toString().match(/ONLINE/gi)
      if(a !== null){
        a = a1.length
      }
      console.log('Status is complete! ONLINE:', a)
    })
  })
}

dbstart().then(function(result){
  statuscheck().then(function(result){


    if(a=9){
      start();
    }else {
      console.log('failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
  });
})
// .............................................................................
// execute tests for the given database
// .............................................................................
function start(){
  desc.startup(host, function (db) {
    var timefun = setInterval(function(){
       st = settime*x;
        ++x;
    },settime);
    console.log('INFO start');
    async function test1(){
      var start = Date.now();
      finish2 = 0;
      console.log('INFO executing random for %d elements',opt);
      for(a=0;a<opt;a++){
        var start2 = Date.now();
        await benchmarkrandom(desc, db);
        var finish = Date.now()-start2;
        rconsist['R'] = st;
        rconsist['time']=finish;
        rconsist['name'] = funcname;
        rconsist['count'] = a+1;
        consist.push(JSON.stringify(rconsist));
        rdt.push(finish);
      }
      finish2 = Date.now()-start;
    }
    async function test2(){
      var start = Date.now();
      finish2 = 0;
      console.log('INFO executing aggregate for %d elements',agg);
      for(a=0;a<agg;a++){
        var start2 = Date.now();
        await benchmarkAggregation(desc, db);
        var finish = Date.now()-start2;
        rconsist['R'] = st;
        rconsist['time']=finish;
        rconsist['name'] = 'AGGREGATION';
        rconsist['count'] = a+1;
        consist.push(JSON.stringify(rconsist));
        aggt.push(finish);
      }
      finish2 = Date.now()-start;
    }
    async function test3(){
      var start = Date.now();
      finish2 = 0;
      console.log('INFO executing neighbors for %d elements', nei);
      for(a = 0 ; a < nei;a++){
        var start2 = Date.now();
        await benchmarkNeighbors(desc, db);
        var finish = Date.now()-start2;
        rconsist['R'] = st;
        rconsist['time']=finish;
        rconsist['name'] = 'NEIGHBORS';
        rconsist['count'] = a+1;
        consist.push(JSON.stringify(rconsist));
        neit.push(finish);
      }
      finish2 = Date.now()-start;
    }
    async function test4(){
      var start = Date.now();
      finish2 = 0;
      console.log('INFO executing shortestpath for %d elements',sssp);
      for(a = 0 ; a < sssp;a++){
        var start2 = Date.now();
        await benchmarkShortestPath(desc, db);
        var finish = Date.now()-start2;
        rconsist['R'] = st;
        rconsist['time']=finish;
        rconsist['name'] = 'SHORTESTPATH';
        rconsist['count'] = a+1;
        consist.push(JSON.stringify(rconsist));
        ssspt.push(finish);
      }
      finish2 = Date.now()-start;
    }
    async function test5(){
      var start = Date.now();
      finish2 = 0;
      console.log('INFO executing read for %d elements',read);
      for(a = 0 ; a < read;a++){
        var start2 = Date.now();
        await benchmarkSingleRead(desc, db);
        var finish = Date.now()-start2;
        rconsist['R'] = st;
        rconsist['time']=finish;
        rconsist['name'] = 'READ';
        rconsist['count'] = a+1;
        consist.push(JSON.stringify(rconsist));
        readt.push(finish);
      }
      finish2 = Date.now()-start;
    }
    var name = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate()+'_.csv';
    test1().then(function(result){
      console.log('-------------------------------------------');
      console.log('Total Time : '+finish2+' ms');
      console.log('Average : '+finish2/opt+' ms');
      console.log('-------------------------------------------');
      test2().then(function(result){
        console.log('-------------------------------------------');
        console.log('Total Time : '+finish2+' ms');
        console.log('Average : '+finish2/agg+' ms');
        console.log('-------------------------------------------');
        test3().then(function(result){
          console.log('-------------------------------------------');
          console.log('Total Time : '+finish2+' ms');
          console.log('Average : '+finish2/nei+' ms');
          console.log('-------------------------------------------');
          test4().then(function(result){
            console.log('-------------------------------------------');
            console.log('Total Time : '+finish2+' ms');
            console.log('Average : '+finish2/sssp+' ms');
            console.log('-------------------------------------------');
            test5().then(function(result){
              console.log('-------------------------------------------');
              console.log('Total Time : '+finish2+' ms');
              console.log('Average : '+finish2/read+' ms');
              console.log('-------------------------------------------');

              for(var z=0;z<consist.length;z++){
                fcon.push(JSON.parse(consist[z]));
              }

              for(var j=1;j<=x;j++){
                for(var i=0;i<fcon.length;i++){
                  if(fcon[i]['R']===settime*j){
                    if(fcon[i]['name']==='Createvertex'){
                      ++cvll;
                      ctime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='Updatevertex'){
                      ++uvll;
                      utime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='Deletevertex'){
                      ++dvll;
                      dtime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='Createedge'){
                      ++cell;
                      cetime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='Updateedge'){
                      ++uell;
                      uetime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='Deleteedge'){
                      ++dell;
                      detime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='AGGREGATION'){
                      ++aggl;
                      aggtime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='NEIGHBORS'){
                      ++neil;
                      neitime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='SHORTESTPATH'){
                      ++ssspl;
                      sssptime+=fcon[i]['time'];
                    }else if(fcon[i]['name']==='READ'){
                      ++readl;
                      readtime+=fcon[i]['time'];
                    }
                  }
                }
                tdata.push({'TIME':(settime*j/1000),'NAME':'CREATEVERTEX','COUNT':cvll,'AVG':ctime/cvll?ctime/cvll:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'UPDATEVERTEX','COUNT':uvll,'AVG':utime/uvll?utime/uvll:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'DELETEVERTEX','COUNT':dvll,'AVG':dtime/dvll?dtime/dvll:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'CREATEEDGE','COUNT':cell,'AVG':cetime/cell?cetime/cell:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'UPDATEEDGE','COUNT':uell,'AVG':uetime/uell?uetime/uell:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'DELETEEDGE','COUNT':dell,'AVG':detime/dell?detime/dell:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'AGGREGATION','COUNT':aggl,'AVG':aggtime/aggl?aggtime/aggl:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'NEIGHBORS','COUNT':neil,'AVG':neitime/neil?neitime/neil:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'SHORTESTPATH','COUNT':ssspl,'AVG':sssptime/ssspl?sssptime/ssspl:0});
                tdata.push({'TIME':(settime*j/1000),'NAME':'READ','COUNT':readl,'AVG':readtime/readl?readtime/readl:0});
                cvll=ctime=uvll=dvll=dtime=cell=cetime=uell=uetime=dell=detime=aggl=aggtime=neil=neitime=ssspl=sssptime=readl=readtime=0;
            }

              let opArr = ['CREATEVERTEX', 'UPDATEVERTEX','DELETEVERTEX','CREATEEDGE','UPDATEEDGE','DELETEEDGE','AGGREGATION','NEIGHBORS','SHORTESTPATH','READ'];
              let sortArr = [[],[],[],[],[],[],[],[],[],[]];

              for(i=0;i<tdata.length;i++){
                let idx = opArr.indexOf(tdata[i]['NAME'])
                if(tdata[i]['COUNT']!=0){
                  sortArr[idx].push(tdata[i])
                }
              }

              fs.readdir(dir2,function(err,filelist){
                for(i=0;i<filelist.length;i++){
                  if(filelist[i]===name){
                    var tname = name.split('.');
                    name = tname[0]+'0.csv';
                  }
                }
                var csvWriter = createCsvWriter({
                  path : dir2+ name,
                  header:[
                    {id : 'TIME',title : 'TIME'},
                    {id : 'NAME',title : 'NAME'},
                    {id : 'COUNT',title : 'COUNT'},
                    {id : 'AVG',title : 'AVG'},
                  ]
                });
                csvWriter.writeRecords(sortArr[0])
                .then(function(result){
                  csvWriter.writeRecords(sortArr[1])
                  .then(function(reuslt){
                    csvWriter.writeRecords(sortArr[2])
                    .then(function(result){
                      csvWriter.writeRecords(sortArr[3])
                      .then(function(result){
                        csvWriter.writeRecords(sortArr[4])
                        .then(function(result){
                          csvWriter.writeRecords(sortArr[5])
                          .then(function(result){
                            csvWriter.writeRecords(sortArr[6])
                            .then(function(result){
                              csvWriter.writeRecords(sortArr[7])
                              .then(function(result){
                                csvWriter.writeRecords(sortArr[8])
                                .then(function(result){
                                  csvWriter.writeRecords(sortArr[9])
                                  .then(function(result){
                                    console.log('file name = '+name);
                                    process.exit(0);
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                });
              });
            })
          })
        })
      })
    },function(err){
      console.log(err);
    });
  });
}


// .............................................................................
// random
// .............................................................................

async function benchmarkrandom(desc, db) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';
    var start3 = Date.now();
    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);
        var rd = generateRandom(0,100);
        var cv = parseInt(fileproperties._properties.Create_vertex);
        var uv = parseInt(fileproperties._properties.Update_vertex);
        var dv = parseInt(fileproperties._properties.Delete_vertex);
        var ce = parseInt(fileproperties._properties.Create_edge);
        var ue = parseInt(fileproperties._properties.Create_edge);
        var de = parseInt(fileproperties._properties.Create_edge);
        var sum = parseInt(cv+uv+dv+ce+ue+de);
         async function randomreal(){
          if(rd < (cv/sum*100)){
            await createvertex(desc, db, resolve, reject);
            funcname = 'Createvertex';
          } else if(rd < (cv/sum*100)+(uv/sum*100)){
            await updatevertex(desc, db, resolve, reject);
            funcname = 'Updatevertex';
          } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)){
            await deletevertex(desc, db, resolve, reject);
            funcname = 'Deletevertex';
          } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)){
            await createedge(desc, db, resolve, reject);
            funcname = 'Createedge';
          } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)){
            await updateedge(desc, db, resolve, reject);
            funcname = 'Updateedge';
          } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)+(de/sum*100)){
            await deleteedge(desc, db, resolve, reject);
            funcname = 'Deleteedge';
          }
        };
        var finish=Date.now()-start3;
        if (debug) {
          console.log('RESULT', result);
        }
        randomreal().then(function(result){
          return resolve();
        });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// createvertex
// .............................................................................
 function createvertex(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';
    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);
        desc.getid(db, coll, function(err, results){
           for(i=0;i<Object(results).length;i++){
             ids[i]+=results[i]['id']
             ids[i] = ids[i].replace('undefined','');
           }
           var g = generateRandom(0,1);
           var firstName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
           var lastName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
           var locationIP =generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300);
           var bu = generateRandom(0,4);
           var bday = new Date(generateRandom(1985,1999),generateRandom(1,12),generateRandom(1,30));
           var d = new Date(generateRandom(2000,2019),generateRandom(1,12),generateRandom(1,30));
           function getTimeStamp(a) {
             var d = a;
             var s =
                leadingZeros(d.getFullYear(), 4) + '-' +
                leadingZeros(d.getMonth() + 1, 2) + '-' +
                leadingZeros(d.getDate(), 2) + ' ' +
                leadingZeros(d.getHours(), 2) + ':' +
                leadingZeros(d.getMinutes(), 2) + ':' +
                leadingZeros(d.getSeconds(), 2);
                return s;
            }
          function leadingZeros(n, digits) {
            var zero = '';
            n = n.toString();
            if (n.length < digits) {
              for (i = 0; i < digits - n.length; i++)
                zero += '0';
            }
            return zero + n;
          }
          var birthday = getTimeStamp(bday);
          var creationDate =getTimeStamp(d);
           if(g=1){
             var gender = 'male';
           } else {
             var gender = 'female' ;
           }
           var flag = true;
           while(flag){
             var id = 'P'+generateRandom(10,10000000000);
             for(var j=0;j<ids.length;j++){
               if (id===ids[j]){
                 break;
               }
             }
             if(id!=ids[ids.length-1]){
               flag=false;
             }
           }
           if(bu=0){
             var browserUsed = 'chrome';
           } else if(bu=1){
             var browserUsed = 'InternetExplorer';
           } else if(bu=2){
             var browserUsed = 'Firefox';
           } else if(bu=3){
             var browserUsed = 'Opera';
           } else {
             var browserUsed = 'Safari';
           }
           browserUsed =browserUsed;
           desc.createvertex(db, coll,gender,firstName,lastName, id,locationIP,browserUsed,creationDate,birthday, function(err, doc){
             if (err) return reject(err);
             if (debug) {
               console.log('RESULT', doc);
             }
             return resolve();
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
    return resolve();
  });
}

// .............................................................................
// Updatevertex
// .............................................................................

function updatevertex(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';
    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);
        desc.getid(db, name, function(err, results){
           for(i=0;i<Object(results).length;i++){
             ids[i]+=results[i]['id']
             ids[i] = ids[i].replace('undefined','');
           }
           var g = generateRandom(0,1);
           var firstName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
           var lastName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
           var locationIP =generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300);
           var bu = generateRandom(0,4);
           var bday = new Date(generateRandom(1985,1999),generateRandom(1,12),generateRandom(1,30));
           var d = new Date(generateRandom(2000,2019),generateRandom(1,12),generateRandom(1,30));
           function getTimeStamp(a) {
             var d = a;
             var s =
                leadingZeros(d.getFullYear(), 4) + '-' +
                leadingZeros(d.getMonth() + 1, 2) + '-' +
                leadingZeros(d.getDate(), 2) + ' ' +
                leadingZeros(d.getHours(), 2) + ':' +
                leadingZeros(d.getMinutes(), 2) + ':' +
                leadingZeros(d.getSeconds(), 2);
                return s;
            }
          function leadingZeros(n, digits) {
            var zero = '';
            n = n.toString();
            if (n.length < digits) {
              for (i = 0; i < digits - n.length; i++)
                zero += '0';
            }
            return zero + n;
          }
          var birthday = getTimeStamp(bday);
          var creationDate =getTimeStamp(d);
           if(g=1){
             var gender = 'male';
           } else {
             var gender = 'female' ;
           }
           var flag = true;
           while(flag){
             var id = 'P'+generateRandom(100,10000000000);
             for(var j=0;j<ids.length;j++){
               if (id===ids[j]){
                 break;
               }
             }
             if(id!=ids[ids.length-1]){
               flag=false;
             }
           }
           if(bu=0){
             var browserUsed = 'chrome';
           } else if(bu=1){
             var browserUsed = 'InternetExplorer';
           } else if(bu=2){
             var browserUsed = 'Firefox';
           } else if(bu=3){
             var browserUsed = 'Opera';
           } else {
             var browserUsed = 'Safari';
           }
           browserUsed =browserUsed;
           desc.updatevertex(db, coll,gender,firstName,lastName, id,locationIP,browserUsed,creationDate,birthday, function(err, doc){
             if (err) return reject(err);
             if (debug) {
               console.log('RESULT', doc);
             }
             return resolve();
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// deletevertex
// .............................................................................

function deletevertex(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';

    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);
        desc.getid(db, name, function(err, results){
           for(i=0;i<Object(results).length;i++){
             ids[i]+=results[i]['id']
             ids[i] = ids[i].replace('undefined','');
           }
           var j = generateRandom(0,ids.length);
           var id = ids[j];
           desc.deletevertex(db, coll,'P7339849119', function(err, doc){
             if (err) return reject(err);
             if (debug) {
               console.log('RESULT', doc);
             }
             return resolve();
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// createedge
// .............................................................................

function createedge(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var nameP = 'Relations';
    var nameR = 'Profiles';

    try {
      desc.getCollection(db, nameP, function (err, collP) {
        if (err) return reject(err);
        desc.getCollection(db, nameR, function (err, collR) {
          if (err) return reject(err);
          desc.getcount(db,collR,function(err,record){
            if (err) return reject(err);
            var record = record[0]['count'];
            var a = generateRandom(0,record);
            var flag = true;
            while(flag){
              var b = generateRandom(0,record);
              if (a!=b){
                flag = false;
              }
            }
            desc.getrecord(db,collR,a,function(err,result1){
              desc.getrecord(db,collR,b,function(err,result2){
                var ida = result1[0]['id'];
                var idb = result2[0]['id'];
                desc.createedge(db, collP,collR,ida,idb, function(err, doc){
                  if (err) return reject(err);
                  if (debug) {
                    console.log('RESULT', doc);
                  }
                  return resolve();
                });
              });
            });
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// updateedge
// .............................................................................

function updateedge(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var nameP = 'Relations';
    var nameR = 'Profiles';
    var rinfo = [];
    try {
      desc.getCollection(db, nameP, function (err, collP) {
        if (err) return reject(err);
        desc.getCollection(db, nameR, function (err, collR) {
          if (err) return reject(err);
          desc.getcount(db,collP,function(err,record1){
            if (err) return reject(err);
            var record1 = record1[0]['count'];
            desc.getcount(db,collR,function(err,record2){
              var record2 = record2[0]['count'];
              if (err) return reject(err);
              var a = generateRandom(0,record1-1);
              var b = generateRandom(0,record2-1);
              desc.getrecordR(db,collP,a,function(err,result1){
                desc.getrecord(db,collR,b,function(err,result2){
                  var ida = result1[0]['ID1'];
                  var idb = result2[0]['id'];
                  desc.deleteedge(db, collP,a,function(err, doc){
                    desc.createedge(db, collP,collR,ida,idb, function(err, doc){
                      if (err) return reject(err);
                      if (debug) {
                        console.log('RESULT', doc);
                      }
                      return resolve();
                    });
                  });
                });
              });
            })
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// deleteedge
// .............................................................................

function deleteedge(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var nameP = 'Relations';
    var nameR = 'Profiles';
    var rinfo = [];
    try {
      desc.getCollection(db, nameP, function (err, collP) {
        if (err) return reject(err);
        desc.getCollection(db, nameR, function (err, collR) {
          if (err) return reject(err);
          desc.getcount(db,collR,function(err,record){
            if (err) return reject(err);
            var record = record[0]['count'];
            var a = generateRandom(0,record-1);
            desc.deleteedge(db, collP,a ,function(err, doc){
              if (err) return reject(err);
              if (debug) {
                console.log('RESULT', doc);
              }
              return resolve();
            });
           })
         });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
// .............................................................................
// signle read
// .............................................................................

function benchmarkSingleRead(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';
    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);
        desc.getcount(db,coll,function(err,record){
          var record = record[0]['count'];
          if (err) return reject(err);
          var b = generateRandom(0,record-1);
          desc.getrecord(db,coll,b,function(err,result){
            var id = result[0]['id'];
            desc.getDocument(db, coll, id, function (err, doc) {
              if (err) return reject(err);
              if (debug) {
                console.log('RESULT', doc);
              }
              return resolve();
            });
          });
        });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}

// .............................................................................
// aggregation
// .............................................................................

function benchmarkAggregation(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var name = 'Profiles';

    try {
      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);

        desc.aggregate(db, coll, function (err, result) {
          if (err) return reject(err);
          if (debug) {
            console.log('RESULT', result);
          }
          return resolve();
        });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}

// .............................................................................
// neighbors
// .............................................................................

function benchmarkNeighbors(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var nameP = 'Profiles';
    var nameR = 'Relations';

    try {
      desc.getCollection(db, nameP, function (err, collP) {
        if (err) return reject(err);
        desc.getCollection(db, nameR, function (err, collR) {
          if (err) return reject(err);
          desc.getcount(db,collP,function(err,record){
            if (err) return reject(err);
            var record = record[0]['count'];
            var myPaths = 0;
            var a = generateRandom(0,record);
            desc.getrecord(db,collP,a,function(err,result1){
              var ida = result1[0]['id'];
              desc.neighbors(db, collP, collR,ida, function (err, result) {
                if (err) return reject(err);
                if (debug) {
                  console.log('RESULT', result);
                }
                return resolve();
              });
            });
          })
        });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}

// .............................................................................
// shortest path
// .............................................................................

function benchmarkShortestPath(desc, db, resolve, reject) {
  return new Promise(function(resolve,reject){
    var nameP = 'Profiles';
    var nameR = 'Relations';

    try {

      desc.getCollection(db, nameP, function (err, collP) {
        if (err) return reject(err);

        desc.getCollection(db, nameR, function (err, collR) {
          if (err) return reject(err);
          desc.getcount(db,collP,function(err,record){
            if (err) return reject(err);
            var record = record[0]['count'];
            var myPaths = 0;
            var a = generateRandom(0,record);
            var flag = true;
            while(flag){
              var b = generateRandom(0,record);
              if (a!=b){
                flag = false;
              }
            }
            desc.getrecord(db,collP,a,function(err,result1){
              desc.getrecord(db,collP,b,function(err,result2){
                var ida = result1[0]['id'];
                var idb = result2[0]['id'];
                desc.shortestPath(db, collP, collR,ida, idb, function (err, result) {
                  if (err) return reject(err);
                  if (debug) {
                    console.log('RESULT', result);
                  }
                  return resolve();
                });
              });
            });
          })
        });
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  })
}
