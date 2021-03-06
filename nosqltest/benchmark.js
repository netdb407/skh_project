#!/usr/bin/env node
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const program = require('commander');
const property = require('../propertiesReader.js')
const PropertiesReader = require('properties-reader');
const fileDir = property.get_server_file2_dir()
const fileDir1 = property.get_server_file3_dir()
const host = property.get_orientMaster_IP()
const installDir = property.get_home_dir()
const dir = installDir+"/"+ fileDir;
const dir2 = installDir+"/"+ fileDir1;
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
    default : '',
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
  .option('s',{
    alias : 'filesize',
    demand : true,
    default : '',
    describe : 'filesize',
    type : 'string',
  })
  .requiresArg('s')
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
var v = argv.s;
var fileproperties = PropertiesReader(dir+filename);
var ip = hosts.split(',');
var opt = fileproperties._properties.operations;
var agg = fileproperties._properties.Aggregation;
var nei = fileproperties._properties.Neighbors;
var sssp = fileproperties._properties.SSSP;
var read = fileproperties._properties.read;
var funcname='';
var cvll= uvll = dvll = cell = uell = dell = aggl = neil = ssspl = readl = 0;
var ctime = utime = dtime = cetime = uetime = detime = aggtime = neitime = sssptime = readtime = 0;
var id=public=completion_percentage=gender= region =  registration = last_login =  age ='';
var consist = [];
var fcon = [];
var tdata = [];
var rconsist= {};
var today = new Date();
var total = 0;
var finish2 = 0;
var st = settime;
var x = 1;
var database = databases[0];
var desc;
var action = 0;
var clusterIds;
var clusterCounts=[];
var clusterIds2;
var clusterCounts2=[];
var vCount = 0;
var eCount = 0;
var collP, collR ='';
var a,b,c,d = 0;
var errcount = 0;
var cverr = uverr = dverr = ceerr = ueerr = deerr = 0;
var ratotalTime = 0;
var raMax = [];
var atotalTime = 0;
var aMax = [];
var ntotalTime = 0;
var nMax = [];
var stotalTime = 0;
var sMax = [];
var retotalTime = 0;
var reMax = [];
try {
  desc = require('./' + database + '/description');
} catch (err) {
  console.log('ERROR database %s is unknown (%s)', database, err);
  process.exit(1);
}
// .............................................................................
// function
// .............................................................................
//random function
var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;
}
//date setting
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
// .............................................................................
// start database and check db status
// .............................................................................
start();
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
    //db 종류마다 다른 이름 부여
    if(v.substring(0,4)=='LDBC'){
      collP = 'LDBCP';
      collR = 'LDBCR';
    }
    else if(v=='pokec'){
      collP = 'pokecP';
      collR = 'pokecR';
    }
    else {
      collP = 'LivejournalP';
      collR = 'LivejournalR';
    }
    //class의 cluster별 개수 입력 & 전체 개수 입력
    async function test0(){
      await cluster(desc,db);
    }
    async function test(flag,name){
      var start = Date.now();
      finish2 = 0;
      switch (name) {
        case 'AGGREGATION':
          console.log('[info] executing AGGREGATION for %d elements',agg);
          console.log('--------------------------------------------------');
          var countt = 1;
          var interval = setInterval(function(){
            console.log('AGGREGATION : %d Percent complete....',(countt/parseInt(agg)*100).toFixed(2));
            console.log('--------------------------------------------------');
          },100000);
          for(action=0;action<agg;action++){
            var start2 = Date.now();
            await benchmarkAggregation(desc, db);
            var finish = Date.now()-start2;
            rconsist['R'] = st;
            rconsist['time']=finish;
            rconsist['name'] = name;
            consist.push(JSON.stringify(rconsist));
            countt++;
          }
          finish2 = Date.now()-start;
          atotalTime = finish2;
          break;
        case 'NEIGHBORS':
          console.log('[info] executing NEIGHBORS for %d elements',nei);
          console.log('--------------------------------------------------');
          var countt = 1;
          var interval = setInterval(function(){
            console.log('NEIGHBORS : %d Percent complete....',(countt/parseInt(nei)*100).toFixed(2));
            console.log('--------------------------------------------------');
          },10000);
          for(action=0;action<nei;action++){
            var start2 = Date.now();
            await benchmarkNeighbors(desc, db);
            var finish = Date.now()-start2;
            rconsist['R'] = st;
            rconsist['time']=finish;
            rconsist['name'] = name;
            consist.push(JSON.stringify(rconsist));
            countt++;
          }
          finish2 = Date.now()-start;
          ntotalTime = finish2;
          break;
        case 'SHORTESTPATH':
          console.log('[info] executing SHORTESTPATH for %d elements',sssp);
          console.log('--------------------------------------------------');
          var countt = 1;
          var interval = setInterval(function(){
            console.log('SHORTESTPATH : %d Percent complete....',(countt/parseInt(sssp)*100).toFixed(2));
            console.log('--------------------------------------------------');
          },100000);
          for(action=0;action<sssp;action++){
            var start2 = Date.now();
            await benchmarkShortestPath(desc, db);
            var finish = Date.now()-start2;
            rconsist['R'] = st;
            rconsist['time']=finish;
            rconsist['name'] = name;
            consist.push(JSON.stringify(rconsist));
            countt++;
          }
          finish2 = Date.now()-start;
          stotalTime = finish2;
          break;
        case 'READ':
          console.log('[info] executing READ for %d elements',read);
          console.log('--------------------------------------------------');
          var countt = 1;
          var interval = setInterval(function(){
            console.log('READ : %d Percent complete....',(countt/parseInt(read)*100).toFixed(2));
            console.log('--------------------------------------------------');
          },100000);
          for(action=0;action<read;action++){
            var start2 = Date.now();
            await benchmarkSingleRead(desc, db);
            var finish = Date.now()-start2;
            rconsist['R'] = st;
            rconsist['time']=finish;
            rconsist['name'] = name;
            consist.push(JSON.stringify(rconsist));
            countt++;
          }
          finish2 = Date.now()-start;
          retotalTime = finish2;
          break;
        default:
          console.log('[info] executing random for %d elements',opt);
          console.log('--------------------------------------------------');
          var countt = 1;
          var interval = setInterval(function(){
            console.log('RANDOM : %d Percent complete.... , errorCount : %d',(countt/parseInt(opt)*100).toFixed(2), errcount);
            console.log('--------------------------------------------------');
          },100000);
          for(action=0;action<opt;action++){
            errcount = cverr+uverr+dverr+ceerr+ueerr+deerr;
            var start2 = Date.now();
            await benchmarkrandom(desc, db);
            var finish = Date.now()-start2;
            rconsist['R'] = st;
            rconsist['time']=finish;
            rconsist['name'] = funcname;
            rconsist['CreateVertexError']= cverr;
            rconsist['UpdateVertexError']= uverr;
            rconsist['DeleteVertexError']= dverr;
            rconsist['CreateEdgeError']= ceerr;
            rconsist['UpdateEdgeError']= ueerr;
            rconsist['DeleteEdgeError']= deerr;
            consist.push(JSON.stringify(rconsist));
            countt++;
          }
          finish2 = Date.now()-start;
          ratotalTime = finish2;
          console.log('ERRCOUNT : ' + errcount);
      }
      clearInterval(interval);
      console.log('--------------------------------------------------');
      console.log('Total Time : '+finish2+' ms');
      console.log('Average : '+finish2/flag+' ms');
      console.log('--------------------------------------------------');
    }
    var name = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate()+'_.csv';
    test0().then(function(result){
      test(opt,funcname).then(function(result){
        test(agg,'AGGREGATION').then(function(result){
          test(nei,'NEIGHBORS').then(function(result){
            test(sssp,'SHORTESTPATH').then(function(result){
              test(read,'READ').then(function(result){
                for(var z=0;z<consist.length;z++){
                  fcon.push(JSON.parse(consist[z]));
                }
                for(var j=1;j<=x;j++){
                  for(var i=0;i<fcon.length;i++){
                    if(fcon[i]['R']===settime*j){
                      if(fcon[i]['name']==='Createvertex'){
                        ++cvll;
                        ctime+=fcon[i]['time'];
                        raMax.push(ctime);
                      }else if(fcon[i]['name']==='Updatevertex'){
                        ++uvll;
                        utime+=fcon[i]['time'];
                        raMax.push(utime);
                      }else if(fcon[i]['name']==='Devarevertex'){
                        ++dvll;
                        dtime+=fcon[i]['time'];
                        raMax.push(dtime);
                      }else if(fcon[i]['name']==='Createedge'){
                        ++cell;
                        cetime+=fcon[i]['time'];
                        raMax.push(cetime);
                      }else if(fcon[i]['name']==='Updateedge'){
                        ++uell;
                        uetime+=fcon[i]['time'];
                        raMax.push(uetime);
                      }else if(fcon[i]['name']==='Deleteedge'){
                        ++dell;
                        detime+=fcon[i]['time'];
                        raMax.push(detime);
                      }else if(fcon[i]['name']==='AGGREGATION'){
                        ++aggl;
                        aggtime+=fcon[i]['time'];
                        aMax.push(aggtime);
                      }else if(fcon[i]['name']==='NEIGHBORS'){
                        ++neil;
                        neitime+=fcon[i]['time'];
                        nMax.push(neitime);
                      }else if(fcon[i]['name']==='SHORTESTPATH'){
                        ++ssspl;
                        sssptime+=fcon[i]['time'];
                        sMax.push(sssptime);
                      }else if(fcon[i]['name']==='READ'){
                        ++readl;
                        readtime+=fcon[i]['time'];
                        reMax.push(readtime);
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

                  cvll=ctime=uvll=utime=dvll=dtime=cell=cetime=uell=uetime=dell=detime=aggl=aggtime=neil=neitime=ssspl=sssptime=readl=readtime=0;
                }
                function compareNumbers(a, b) {
                  return b - a;
                }
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                raMax.sort(compareNumbers);
                aMax.sort(compareNumbers);
                nMax.sort(compareNumbers);
                sMax.sort(compareNumbers);
                reMax.sort(compareNumbers);
                var raMax1 = raMax.slice(0,5);
                var aMax1 = aMax.slice(0,5);
                var nMax1 = nMax.slice(0,5);
                var sMax1 = sMax.slice(0,5);
                var reMax1 = reMax.slice(0,5);

                var opArr = ['CREATEVERTEX', 'UPDATEVERTEX','DELETEVERTEX','CREATEEDGE','UPDATEEDGE','DELETEEDGE','AGGREGATION','NEIGHBORS','SHORTESTPATH','READ'];
                var sortArr = [[],[],[],[],[],[],[],[],[],[]];

                for(i=0;i<tdata.length;i++){
                  var idx = opArr.indexOf(tdata[i]['NAME']);
                  if(tdata[i]['COUNT']!=0){
                    sortArr[idx].push(tdata[i])
                  }
                }
                var total_max=[
                  {'TIME':'RANDOM TOTAL Time','NAME':ratotalTime/1000?ratotalTime/1000:0,'COUNT':'  Max Time Top 5','AVG':raMax1.toString()},
                  {'TIME':'AGGREGATION TOTAL Time','NAME':atotalTime/1000?atotalTime/1000:0,'COUNT':'  Max Time Top 5','AVG':aMax1.toString()},
                  {'TIME':'NEIGHBORS TOTAL Time','NAME':ntotalTime/1000?ntotalTime/1000:0,'COUNT':'  Max Time Top 5','AVG':nMax1.toString()},
                  {'TIME':'SHORTESTPATH TOTAL Time','NAME':stotalTime/1000?stotalTime:0,'COUNT':'  Max Time Top 5','AVG':sMax1.toString()},
                  {'TIME':'READ TOTAL Time','NAME':retotalTime/1000?retotalTime/1000:0,'COUNT':'  Max Time Top 5','AVG':reMax1.toString()}
                ]
                //현재 날짜로 파일이름 생성
                fs.readdir(dir2,function(err,filelist){
                  if(filelist.length!=0){
                    for(i=0;i<filelist.length;i++){
                      if(filelist[i]===name){
                        var tname = name.split('.');
                        name = tname[0]+'0.csv';
                      }
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
                  // csv형식으로 파일 저장
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
                                      csvWriter.writeRecords(total_max)
                                      .then(function(result){
                                        console.log('file name = '+name);
                                        process.exit(0);
                                        db.close();
                                      })
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
            },function(err){
              console.log(err);
            });
          })
        })
      })
    })
  });
// .............................................................................
// cluster list
// .............................................................................
  async function cluster(desc, db) {
    return new Promise(function(resolve,reject){
      var collP, collR ='';
      if(v.substring(0,4)=='LDBC'){
        collP = 'LDBCP';
        collR = 'LDBCR';
        // collP = 'LDBCP100';
        // collR = 'LDBCR100';
      }
      else if(v=='pokec'){
        collP = 'pokecP';
        collR = 'pokecR';
      }
      else {
        collP = 'LivejournalP';
        collR = 'LivejournalR';
      }
      var start3 = Date.now();
      try {
        db.class.list()
         .then(
            function(classes){
              for(var n = 0; n<classes.length;n++){
                if(classes[n]['name']==collR){
                  clusterIds = classes[n]['clusterIds'];
                }
              }
              for(var n=0;n<clusterIds.length;n++){
                clusterIds[n]=parseInt(clusterIds[n]);
                desc.cluster(db,clusterIds[n],function(err,results){
                  clusterCounts.push(parseInt(results));
                  if(clusterCounts.length==clusterIds.length){
                    return resolve();
                  }
                })
              }
            }
         );
         db.class.list()
          .then(
             function(classes){
               for(var n = 0; n<classes.length;n++){
                 if(classes[n]['name']==collP){
                   clusterIds2 = classes[n]['clusterIds'];
                 }
               }
               for(var n=0;n<clusterIds2.length;n++){
                 clusterIds2[n]=parseInt(clusterIds2[n]);
                 desc.cluster(db,clusterIds2[n],function(err,results){
                   clusterCounts2.push(parseInt(results));
                   if(clusterCounts2.length==clusterIds2.length){
                     return resolve();
                   }
                 })
               }
             }
          );
         desc.getcount(db,collP,function(err,record1){
           vCount = parseInt(record1);
         })
         desc.getcount(db,collR,function(err,record2){
           eCount = parseInt(record2);
         })
      } catch (err) {
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }
  // .............................................................................
  // random
  // .............................................................................
    async function benchmarkrandom(desc, db) {
      return new Promise(function(resolve,reject){
        var start3 = Date.now();
        try {
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
              vCount+=1;
            } else if(rd < (cv/sum*100)+(uv/sum*100)){
              await updatevertex(desc, db, resolve, reject);
              funcname = 'Updatevertex';
            } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)){
              await deletevertex(desc, db, resolve, reject);
              funcname = 'Deletevertex';
              eCount-=1;
            } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)){
              await createedge(desc, db, resolve, reject);
              funcname = 'Createedge';
              eCount+=1;
            } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)){
              await updateedge(desc, db, resolve, reject);
              funcname = 'Updateedge';
            } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)+(de/sum*100)){
              await deleteedge(desc, db, resolve, reject);
              funcname = 'Deleteedge';
              eCount -=1;
            }
          };
          var finish=Date.now()-start3;
          randomreal().then(function(result){
            return resolve();
          })
        } catch (err) {
          console.log('ERROR %s', err);
          return resolve();
        }
      })
    }
  // .............................................................................
  // createvertex
  // .............................................................................
  function createvertex(desc, db, resolve, reject) {
   return new Promise(function(resolve,reject){
     var name = '';
     try {
       if(collP == 'LDBCP'){
         var g = generateRandom(0,1);   //gender
         var firstName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
         var lastName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
         var locationIP =generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300)+'.'+generateRandom(0,300);
         var bu = generateRandom(0,4);  //browser
         var bday = new Date(generateRandom(1985,1999),generateRandom(1,12),generateRandom(1,30));
         var d = new Date(generateRandom(2000,2019),generateRandom(1,12),generateRandom(1,30));
         var birthday = getTimeStamp(bday);
         var creationDate =getTimeStamp(d);
          if(g=1){
            var gender = 'male';
          } else {
            var gender = 'female' ;
          }
          var id = '';
          id = 'P'+generateRandom(10,1000000000000);
          desc.getid(db,collP,id,function(err,result){
            if(result.length!=0){
              id = 'P'+generateRandom(10,1000000000000);
            }
          })
          var browserUsed = '';
          if(bu=0){
            browserUsed = 'chrome';
          } else if(bu=1){
            browserUsed = 'InternetExplorer';
          } else if(bu=2){
            browserUsed = 'Firefox';
          } else if(bu=3){
            browserUsed = 'Opera';
          } else {
            browserUsed = 'Safari';
          }
          db.let('createvertex',function(p){
            p.create('vertex',collP)
            .set({
              gender :gender,
              firstName :firstName,
              lastName :lastName,
              id :id,
              locationIP:locationIP,
              browserUsed:browserUsed,
              creationDate:creationDate,
              birthday:birthday
            })
          })
          .commit().return('$createvertex').all()
          .then(
            function(results){
              //edge증가되었으므로 같은 클러스터에 1개 추가
              for(var n = 0; n <clusterIds;n++){
                if(clusterIds[n]==results[0]['@rid']['cluster']){
                  clusterCounts[n]+=1;
                }
              }
              return resolve();
            }
          ).catch(function(err){
            cverr+=1;
            db.reload();
            return resolve();
          })
        } else {
          gender = generateRandom(0,1);
          public = generateRandom(0,1);
          completion_percentage = generateRandom(0,1);
          region = String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
          age = generateRandom(20,50);
          last_login = new Date(generateRandom(1985,1999),generateRandom(1,12),generateRandom(1,30));
          registration = new Date(generateRandom(2000,2019),generateRandom(1,12),generateRandom(1,30));
          last_login = getTimeStamp(last_login);
          registration =getTimeStamp(registration);
          var id = '';
          id = 'P'+generateRandom(10,1000000000000);
          desc.getid(db,collP,id,function(err,result){
             if(result.length!=0){
               id = 'P'+generateRandom(10,1000000000000);
             }
           })
           db.let('createvertex',function(p){
             p.create('vertex',collP)
             .set({
               gender :gender,
               public :public,
               completion_percentage :completion_percentage,
               id :id,
               region:region,
               last_login:last_login,
               registration:registration,
               age:age
             })
           })
           .commit().return('$createvertex').all()
           .then(
             function(results){
               //edge증가되었으므로 같은 클러스터에 1개 추가
               for(var n = 0; n <clusterIds;n++){
                 if(clusterIds[n]==results[0]['@rid']['cluster']){
                   clusterCounts[n]+=1;
                 }
               }
               return resolve();
             }
           ).catch(function(err){
             cverr+=1;
             db.reload();
             return resolve();
           })
         }
       } catch (err) {
         db.reload();
         console.log('ERROR %s', err);
         return resolve();
       }
     });
   }

  // .............................................................................
  // Updatevertex
  // .............................................................................

  function updatevertex(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        //vertex recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-2)?generateRandom(0,vClusterCount-2):0;
        var vertex = '#'+vClusterId+':'+position;
        //LDBC DATASET
        if(collP=='LDBCP'){
          var lastName =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
          desc.getrid(db,collP,vertex,function(err,vertex1){
            db.let('updatevertex',function(p){
              p.update(vertex1)
              .set({
                lastName : lastName
              })
            }).commit().return('$updatevertex').all()
            .then(
              function(err,results){
                return resolve();
              }
            ).catch(function(err){
              uverr+=1;
              db.reload();
              return resolve();
            })
          })
        //POKEC & Livejournal DATASET
        } else {
          var region =String.fromCharCode(generateRandom(65,90),generateRandom(97,122),generateRandom(97,122));
          desc.getrid(db,collP,vertex,function(err,vertex1){
            db.let('updatevertex',function(p){
              p.update(vertex1)
              .set({
                region : region
              })
            }).commit().return('$updatevertex').all()
            .then(
              function(err,results){
                return resolve();
              }
            ).catch(function(err){
              uverr+=1;
              db.reload();
              return resolve();
            })
          })
        }
      } catch (err) {
        db.reload();
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }
  // .............................................................................
  // deletevertex
  // .............................................................................

  function deletevertex(desc, db, resolve, reject) {
      try {
        //random 숫자
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        //vertex recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-2)?generateRandom(0,vClusterCount-2):0;
        var vertex = '#'+vClusterId+':'+position;
        clusterCounts2[randomnumber]-=1;
        desc.getrid(db,collP,vertex,function(err,vertex1){
          db.let('deletevertex',function(p){
            p.delete('vertex',collP)
            .where('@rid='+vertex1).limit(1)
          }).commit().return('$deletevertex').all()
          .then(
            function(err,results){
              for(var n = 0; n <clusterIds2;n++){
                if(clusterIds2[n]==results[0]['@rid']['cluster']){
                  clusterCounts2[n]-=1;
                }
              }
              return resolve();
            }
          ).catch(function(err){
            dverr+=1;
            db.reload();
            return resolve();
          })
        });
      } catch (err) {
        db.reload();
        console.log('ERROR %s', err);
        return resolve();
      }
  }
  // .............................................................................
  // createedge
  // .............................................................................

  function createedge(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        //random으로 발생된 숫자가 겹치지 않도록
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        var flag = true;
        while (flag) {
          var randomnumber2 = generateRandom(0,clusterIds2.length-1);
          if(randomnumber!=randomnumber2){
            flag = false;
          }
        }
        //vertex 1 recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-1)?generateRandom(0,vClusterCount-1):0;
        //vertex 2 recordId
        var vClusterId2 = clusterIds2[randomnumber2];
        var vClusterCount2 = clusterCounts2[randomnumber2];
        var position2 = generateRandom(0,vClusterCount2-2)?generateRandom(0,vClusterCount2-2):0;

        var vertex1 = '#'+vClusterId+':'+position;
        var vertex2 = '#'+vClusterId2+':'+position2;

        desc.getrid(db,collP,vertex1,function(err,vertex11){
          desc.getrid(db,collP,vertex2,function(err,vertex22){
            db.let('createedge',function(p){
              p.create('edge',collR)
              .from(vertex11)
              .to(vertex22)
            })
            .commit().return('$createedge').all()
            .then(
              function(err,results){
                //edge증가되었으므로 같은 클러스터에 1개 추가
                for(var n = 0; n <clusterIds;n++){
                  if(clusterIds[n]==doc['@rid']['cluster']){
                    clusterCounts[n]+=1;
                  }
                }
                return resolve();
              }
            ).catch(function(err){
              ceerr+=1;
              db.reload();
              return resolve();
            })
          })
        })
      } catch (err) {
        db.reload();
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }
  // .............................................................................
  // updateedge
  // .............................................................................

  function updateedge(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        //random 숫자
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        var randomnumber2 = generateRandom(0,clusterIds.length-1);
        //vertex recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-2)?generateRandom(0,vClusterCount-2):0;
        //edge recordId
        var eClusterId = clusterIds[randomnumber2];
        var eClusterCount = clusterCounts[randomnumber2];
        var position2 = generateRandom(0,eClusterCount-2)?generateRandom(0,eClusterCount-2):0;

        var vertex = '#'+vClusterId+':'+position;
        var edge = '#'+eClusterId+':'+position2;

        desc.getrid(db,collP,vertex,function(err,vertex1){
          desc.getrid(db,collR,edge,function(err,edge1){
            db.let(collR,function(p){
              p.update(edge1)
              .set({
                out : vertex1
              })
            }).commit().return(edge1).all()
            .then(
              function(results){
                return resolve();
              }
            ).catch(function(err){
              ueerr+=1;
              db.reload();
              return resolve();
            })
          })
        })
      } catch (err) {
        db.reload();
        console.log('ERROR %s', err);
        return resolve();

      }
    })
  }

  // .............................................................................
  // deleteedge
  // .............................................................................

  function deleteedge(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        //edge recordId
        randomnumber2 = generateRandom(0,clusterIds.length-1);
        var eClusterId = clusterIds[randomnumber2];
        var eClusterCount = clusterCounts[randomnumber2];
        var position2 = generateRandom(0,eClusterCount-2)?generateRandom(0,eClusterCount-2):0;
        var edgerecord = '#'+eClusterId+':'+(position2-1);
        //edge삭제했으므로 -1
        clusterCounts[a]-=1;
        desc.getrid(db,collR,edgerecord,function(err,edge1){
          db.let('deleteedge',function(p){
            p.delete('edge',collR)
            .where('@rid='+edge1).limit(1)
          }).commit().return('$deleteedge').all()
          .then(
            function(results){
              return resolve();
            }
          ).catch(function(err){
            deerr+=1;
            db.reload();
            return resolve();
          })
        });
      } catch (err) {
        db.reload();
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }
  // .............................................................................
  // signle read
  // .............................................................................

  function benchmarkSingleRead(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        //vertex recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-2)?generateRandom(0,vClusterCount-2):0;
        var vertex = '#'+vClusterId+':'+position;
        desc.getrid(db,collP,vertex,function(err,result){
          desc.getDocument(db, collP, result, function (err, doc) {
            return resolve();
          });
        });
      } catch (err) {
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }

  // .............................................................................
  // aggregation
  // .............................................................................

  function benchmarkAggregation(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        if(collP=='LDBCP'){
          desc.aggregate(db, collP, function (err, result) {
            return resolve();
          });
        } else {
          desc.aggregate2(db, collP, function (err, result) {
            return resolve();
          });
        }
      } catch (err) {
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }

  // .............................................................................
  // neighbors
  // .............................................................................

  var error = 0;
  function benchmarkNeighbors(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        var values1 = [];
        var values2 = [];
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        //vertex recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-2)?generateRandom(0,vClusterCount-2):0;
        var vertex = '#'+vClusterId+':'+position;
        desc.getrid(db,collP,vertex,function(err,result1){
          desc.neighbors(db, collP, collR,result1, function (err, result) {
            if(Object(result).length!=null){
              for(var i=0;i<result.length;i++){
                desc.getrecord(db,collR,result[i],function(err,result3){
                  if(result3==undefined){
                    error ++;
                  }
                  desc.getDocument(db,collP,result3,function(err,result2){
                    values2.push(result2);
                    return resolve();
                  })
                })
              }
            } else {
              return resolve();
            }
          });
        });
      } catch (err) {
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }

  // .............................................................................
  // shortest path
  // .............................................................................

  function benchmarkShortestPath(desc, db, resolve, reject) {
    return new Promise(function(resolve,reject){
      try {
        //random으로 발생된 숫자가 겹치지 않도록
        var randomnumber = generateRandom(0,clusterIds2.length-1);
        var flag = true;
        while (flag) {
          var randomnumber2 = generateRandom(0,clusterIds2.length-1);
          if(randomnumber!=randomnumber2){
            flag = false;
          }
        }
        //vertex 1 recordId
        var vClusterId = clusterIds2[randomnumber];
        var vClusterCount = clusterCounts2[randomnumber];
        var position = generateRandom(0,vClusterCount-1)?generateRandom(0,vClusterCount-1):0;
        //vertex 2 recordId
        var vClusterId2 = clusterIds2[randomnumber2];
        var vClusterCount2 = clusterCounts2[randomnumber2];
        var position2 = generateRandom(0,vClusterCount2-2)?generateRandom(0,vClusterCount2-2):0;

        var vertex1 = '#'+vClusterId+':'+position;
        var vertex2 = '#'+vClusterId2+':'+position2;

        desc.getrid(db,collP,vertex1,function(err,vertex11){
          desc.getrid(db,collP,vertex2,function(err,vertex22){
            desc.shortestPath(db, collP,vertex11, vertex22, function (err, result) {
              return resolve();
            });
          })
        })
        var a, b = 0;
        a = generateRandom(1,vCount-1);
        var flag = true;
        while(flag){
          b = generateRandom(1,vCount-1);
          if (a!=b){
            flag = false;
          }
        }
      } catch (err) {
        console.log('ERROR %s', err);
        return resolve();
      }
    })
  }
}
