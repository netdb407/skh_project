#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const property = require('../propertiesReader.js')
const installDir = property.get_server_install_dir_WL()
const fileDir = property.get_server_file2_dir()
const dir = installDir + fileDir;

const PropertiesReader = require('properties-reader');
var underscore = require('underscore');
var async = require('async');


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

  .option('t', {
    alias: 'tests',
    demand: false,
    default: 'all',
    describe: 'tests to run separated by comma: shortest, neighbors, neighbors2, neighbors2data, singleRead, singleWrite, aggregation, hardPath, singleWriteSync',
    type: 'string'
    })
  .requiresArg('t')

  .option('s', {
    alias: 'restrict',
    demand: false,
    default: 0,
    describe: 'restrict to that many elements (0=no restriction)',
    type: 'integer'
    })
  .requiresArg('s')

  .option('l', {
    alias: 'neighbors',
    demand: false,
    default: 1000,
    describe: 'look at that many neighbors',
    type: 'integer'
    })
  .requiresArg('l')

  .option('ld', {
    alias: 'neighbors2data',
    demand: false,
    default: 100,
    describe: 'look at that many neighbors2 with Profiles',
    type: 'integer'
    })
  .requiresArg('ld')

  .option('a', {
    alias: 'address',
    demand: false,
    default: '127.0.0.1',
    describe: 'server host',
    type: 'string'
    })
  .requiresArg('a')

  .boolean('d')
  .help('h')
  .epilog('copyright 2015 Claudius Weinberger')
  .argv
;

// .............................................................................
// checks the arguments
// .............................................................................

var databases = argv._;
var tests = argv.t;
var debug = argv.d;
var restriction = argv.s;
var neighbors = argv.l;
var neighbors2data = argv.ld;
var host = argv.a;
var filename = argv.n;

var fileproperties = PropertiesReader(dir+filename);
//console.log(fileproperties);

var total = 0;

if (tests.length === 0 || tests === 'all') {
  tests = ['warmup', 'shortest', 'neighbors', 'neighbors2', 'singleRead', 'singleWrite',
           'singleWriteSync', 'aggregation', 'hardPath', 'neighbors2data'];
}
else {
  tests = tests.split(',').map(function (e) { return e.trim(); });
}

var database = databases[0];
var desc;

try {
  desc = require('./' + database + '/description');
} catch (err) {
  console.log('ERROR database %s is unknown (%s)', database, err);
  process.exit(1);
}

// .............................................................................
// loads the ids and documents
// .............................................................................
var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;
}
var bodies = [];
var ids = [];
// if (restriction > 0) {
//   ids = ids.slice(0, restriction);
//   bodies = bodies.slice(0, restriction);
// }

// .............................................................................
// execute tests for the given database
// .............................................................................
var posTests = -1;
var testRuns = [];
console.log('INFO using server address %s', host);
desc.startup(host, function (db) {
  testRuns.push(function (resolve, reject) {
    console.log('INFO start');
    return resolve();
  });
  for (var j = 0; j < tests.length; ++j) {
    var test = tests[j];
    var a =0;
    if (test === 'warmup') {
      testRuns.push(function (resolve, reject) {
        var start = Date.now();
        desc.warmup(db, function (err) {
          if (err) return reject(err);
          reportResult(desc.name, 'warmup', 0, Date.now() - start);
          return resolve();
        });
      });
    }
    else if (test === 'random') {
      testRuns.push(function (resolve, reject) { benchmarkrandom(desc, db, resolve, reject); });
    }
    else if (test === 'createvertex') {
      testRuns.push(function (resolve, reject) { createvertex(desc, db, resolve, reject); });
    }
    else if (test === 'updatevertex') {
      testRuns.push(function (resolve, reject) { updatevertex(desc, db, resolve, reject); });
    }
    else if (test === 'deletevertex') {
      testRuns.push(function (resolve, reject) { deletevertex(desc, db, resolve, reject); });
    }
    else if (test === 'createedge') {
      testRuns.push(function (resolve, reject) { createedge(desc, db, resolve, reject); });
    }
    else if (test === 'updateedge') {
      testRuns.push(function (resolve, reject) { updateedge(desc, db, resolve, reject); });
    }
    else if (test === 'deleteedge') {
      testRuns.push(function (resolve, reject) { deleteedge(desc, db, resolve, reject); });
    }
    else if (test === 'singleRead') {
      testRuns.push(function (resolve, reject) { benchmarkSingleRead(desc, db, resolve, reject); });
    }
    else if (test === 'singleWrite') {
      testRuns.push(function (resolve, reject) { benchmarkSingleWrite(desc, db, resolve, reject); });
    }
    else if (test === 'singleWriteSync') {
      testRuns.push(function (resolve, reject) { benchmarkSingleWriteSync(desc, db, resolve, reject); });
    }
    else if (test === 'aggregation') {
      for(a = 0 ; a < fileproperties._properties.Aggregation;a++){
        testRuns.push(function (resolve, reject) { benchmarkAggregation(desc, db, resolve, reject); });
      }
    }
    else if (test === 'neighbors') {
      for(a = 0 ; a < fileproperties._properties.Neighbors;a++){
        testRuns.push(function (resolve, reject) { benchmarkNeighbors(desc, db, resolve, reject); });
      }
    }
    else if (test === 'neighbors2') {
      for(a = 0 ; a < fileproperties._properties.Neighbors2;a++){
        testRuns.push(function (resolve, reject) { benchmarkNeighbors2(desc, db, resolve, reject); });
      }
    }
    else if (test === 'neighbors2data') {
      for(a = 0 ; a < fileproperties._properties.Neighbors2data;a++){
        testRuns.push(function (resolve, reject) { benchmarkNeighbors2data(desc, db, resolve, reject); });
      }
    }
    else if (test === 'shortest') {
      for(a = 0 ; a < fileproperties._properties.SSSP;a++){
        testRuns.push(function (resolve, reject) { benchmarkShortestPath(desc, db, resolve, reject); });
      }
    }
    else if (test === 'hardPath') {
      for(a = 0 ; a < fileproperties._properties.Hard_Path;a++){
        testRuns.push(function (resolve, reject) { benchmarkHardPath(desc, db, resolve, reject); });
      }
    }
    else {
      console.error('ERROR unknown test case %s', test);
    }
  }

  testRuns.push(function (resolve, reject) {
    console.log('DONE');
    process.exit(0);
  });

  executeTest();
  console.log(testRuns)
});

function reportError(err) {
  console.log('ERROR %s', err);
  process.exit(1);
}

function executeTest() {
  testRuns[++posTests](function () {
    process.nextTick(executeTest);
  }, reportError);
}
// .............................................................................
// random(함수 만들기)
// .............................................................................

function benchmarkrandom(desc, db, resolve, reject) {
  var name = 'Profiles';
  var fcname = '';
  try {
    desc.getCollection(db, name, function (err, coll) {
      if (err) return reject(err);
  	// var rd = generateRandom(0,100);
    var rd = 5
        var start3 = Date.now();
        var cv = parseInt(fileproperties._properties.Create_vertex);
        var uv = parseInt(fileproperties._properties.Update_vertex);
        var dv = parseInt(fileproperties._properties.Delete_vertex);
        var ce = parseInt(fileproperties._properties.Create_edge);
        var ue = parseInt(fileproperties._properties.Create_edge);
        var de = parseInt(fileproperties._properties.Create_edge);
        var sum = parseInt(cv+uv+dv+ce+ue+de);
        if(rd < (cv/sum*100)){
          testRuns.push(function (resolve, reject) { createvertex(desc, db, resolve, reject);});
          // createvertex(desc, db, resolve, reject);
          fcname ='Create_vertex';
        } else if(rd < (cv/sum*100)+(uv/sum*100)){
          testRuns.push(function (resolve, reject) { updatevertex(desc, db, resolve, reject);});
          fcname ='Update_vertex';
        } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)){
          testRuns.push(function (resolve, reject) { deletevertex(desc, db, resolve, reject);});
          fcname ='Delete_vertex';
        } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)){
          testRuns.push(function (resolve, reject) { createedge(desc, db, resolve, reject);});
          fcname ='Create_edge';
        } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)){
          testRuns.push(function (resolve, reject) { updateedge(desc, db, resolve, reject);});
          fcname ='Update_edge';
        } else if(rd < (cv/sum*100)+(uv/sum*100)+(dv/sum*100)+(ce/sum*100)+(ue/sum*100)+(de/sum*100)){
          testRuns.push(function (resolve, reject) { deleteedge(desc, db, resolve, reject);});
          fcname ='Delete_edge';
        }
        if (debug) {
          console.log('RESULT', result);
        }
        console.log("1");
        reportResult(desc.name, fcname , 1, Date.now() - start3);
        return resolve();
      });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}
// .............................................................................
// createvertex
// .............................................................................
 function createvertex(desc, db, resolve, reject) {
  console.log('INFO executing createvertex with 1 documents');
  var name = 'Profiles';

  try {
    desc.getCollection(db, name, function (err, coll) {
      if (err) return reject(err);
      desc.getid(db, name, function(err, results){
         for(i=0;i<Object(results).length;i++){
           ids[i]+=results[i]['id']
           ids[i] = ids[i].replace('undefined','');
         }
         console.log("2");
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
         var start = Date.now();
         desc.createvertex(db, coll,gender,firstName,lastName, id,locationIP,browserUsed,creationDate,birthday, function(err, doc){
           if (err) return reject(err);
           if (debug) {
             console.log('RESULT', doc);
           }
           var finish = Date.now() - start;
           reportResult(desc.name, 'createvertex', 1, finish);
           return resolve();
         })
       });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// Updatevertex
// .............................................................................

function updatevertex(desc, db, resolve, reject) {
  console.log('INFO executing updatevertex with 1 documents');
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
         var start = Date.now();
         desc.updatevertex(db, coll,gender,firstName,lastName, id,locationIP,browserUsed,creationDate,birthday, function(err, doc){
           if (err) return reject(err);
           if (debug) {
             console.log('RESULT', doc);
           }
           reportResult(desc.name, 'updatevertex', 1, Date.now() - start);
           return resolve();
         })
       });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}
// .............................................................................
// deletevertex
// .............................................................................

function deletevertex(desc, db, resolve, reject) {
  console.log('INFO executing deletevertex with 1 documents');
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
         var start = Date.now();
         desc.deletevertex(db, coll,'P7339849119', function(err, doc){
           if (err) return reject(err);
           if (debug) {
             console.log('RESULT', doc);
           }
           reportResult(desc.name, 'deletevertex', 1, Date.now() - start);
           return resolve();
         })
       });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}
// .............................................................................
// createedge
// .............................................................................

function createedge(desc, db, resolve, reject) {
  var start1 = Date.now();
  console.log('INFO executing createedge with 1 documents');
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
              var start2 = Date.now();
              desc.createedge(db, collP,collR,ida,idb, function(err, doc){
                if (err) return reject(err);
                if (debug) {
                  console.log('RESULT', doc);
                }
                reportResult(desc.name, 'createedge', 1, Date.now() - start2);
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
}
// .............................................................................
// updateedge
// .............................................................................

function updateedge(desc, db, resolve, reject) {
  console.log('INFO executing updateedge with 1 documents');
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
                var start2 = Date.now();
                desc.deleteedge(db, collP,a,function(err, doc){
                  desc.createedge(db, collP,collR,ida,idb, function(err, doc){
                    if (err) return reject(err);
                    if (debug) {
                      console.log('RESULT', doc);
                    }
                    reportResult(desc.name, 'updateedge', 1, Date.now() - start2);
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
}
// .............................................................................
// deleteedge
// .............................................................................

function deleteedge(desc, db, resolve, reject) {
  console.log('INFO executing deleteedge with 1 documents');
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
          var a = generateRandom(0,record);
          var flag = true;
          var start2 = Date.now();
          desc.deleteedge(db, collP,a ,function(err, doc){
            if (err) return reject(err);
            if (debug) {
              console.log('RESULT', doc);
            }
            reportResult(desc.name, 'deleteedge', 1, Date.now() - start2);
            return resolve();
          });
         })
       });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}
// .............................................................................
// signle read
// .............................................................................

function benchmarkSingleRead(desc, db, resolve, reject) {
  var start1 = Date.now();
  var name = 'Profiles';
  desc.getid(db, name, function(err, results1){
     for(i=0;i<Object(results1).length;i++){
       ids[i] += results1[i]['id']
       ids[i] = ids[i].replace('undefined','');
     }
     console.log('INFO executing single read with %d documents', ids.length);
    try {
      var goal = ids.length;
      total = 0;

      desc.getCollection(db, name, function (err, coll) {
        if (err) return reject(err);


        if (desc.hasOwnProperty('CONCURRENCY')) {
          console.log('INFO using concurrency %d', desc.CONCURRENCY);

          async.eachLimit(
            ids, desc.CONCURRENCY,

            function (id, cb) {
              var start2 = Date.now();
              desc.getDocument(db, coll, id,
                function (err, doc) {
                  if (err) return cb(err);

                  if (debug) {
                    console.log('RESULT', doc);
                  }
                  return cb(null);
                }
              );
            },

            function (err) {
              if (err) return reject(err);
              if (total !== goal) reject('expecting ' + goal + ', got ' + total);
              reportResult(desc.name, 'single reads', goal, Date.now() - start);
              return resolve();
            });
        }
        else {
          var start2 = Date.now();
          for (var k = 0; k < ids.length; ++k) {
            desc.getDocument(db, coll, ids[k], function (err, doc) {
              if (err) return reject(err);

              if (debug) {
                console.log('RESULT', doc);
              }

              ++total;

              if (total === goal) {
                reportResult(desc.name, 'single reads', goal, Date.now() - start2);
                return resolve();
              }
            });
          }
        }
      });
    } catch (err) {
      console.log('ERROR %s', err.stack);
      return reject(err);
    }
  });
}

// .............................................................................
// aggregation
// .............................................................................

function benchmarkAggregation(desc, db, resolve, reject) {
  var start1 = Date.now();
  console.log('INFO executing aggregation');
  var name = 'Profiles';

  try {
    desc.getCollection(db, name, function (err, coll) {
      if (err) return reject(err);

      var start2 = Date.now();

      desc.aggregate(db, coll, function (err, result) {
        if (err) return reject(err);

        if (debug) {
          console.log('RESULT', result);
        }

        reportResult(desc.name, 'aggregate', 1, Date.now() - start2);
        return resolve();
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// neighbors
// .............................................................................

function benchmarkNeighbors(desc, db, resolve, reject) {
  var start1 = Date.now();
  console.log('INFO executing neighbors for %d elements', neighbors);
  var nameP = 'Profiles';
  var nameR = 'Relations';

  try {
    var myNeighbors = 0;
    var goal = neighbors;
    total = 0;
    var ngbnum=[];
    desc.getCollection(db, nameP, function (err, collP) {
      if (err) return reject(err);
      desc.getCollection(db, nameR, function (err, collR) {
        if (err) return reject(err);
        desc.getid(db, nameP, function(err, results){
          for(i=0;i<Object(results).length;i++){
            ids[i]+=results[i]['id']
            ids[i] = ids[i].replace('undefined','');
          }
          var start2 = Date.now();
          for (var k = 0; k < neighbors; ++k) {
            desc.neighbors(db, collP, collR,ids[k],k, function (err, result) {
              if (err) return reject(err);
              if (debug) {
                console.log('RESULT', result);
              }

              myNeighbors += result;

              ++total;

              if (total === goal) {
                console.log('INFO total number of neighbors found: %d', myNeighbors);
                reportResult(desc.name, 'neighbors', myNeighbors, Date.now() - start2);
                return resolve();
              }
            });
          }
        })
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// neighbors2
// .............................................................................

function benchmarkNeighbors2(desc, db, resolve, reject) {
  var start1 = Date.now();
  console.log('INFO executing distinct neighbors of 1st and 2nd degree for %d elements', neighbors);

  var nameP = 'Profiles';
  var nameR = 'Relations';

  try {
    var myNeighbors = 0;
    var goal = neighbors;
    total = 0;

    desc.getCollection(db, nameP, function (err, collP) {
      if (err) return reject(err);

      desc.getCollection(db, nameR, function (err, collR) {
        if (err) return reject(err);

        var start2 = Date.now();
        var ids=[];
        desc.getid(db,nameP,function(err,results){
          ids = Object.entries(results)

          for (var k = 0; k < neighbors; ++k) {
            desc.neighbors2(db, collP, collR, ids[k][1]['id'], k, function (err, result) {
              if (err) return reject(err);

              if (debug) {
                console.log('RESULT', result);
              }
              console.log(result);
              myNeighbors += result;

              ++total;

              if (total === goal) {
                console.log('INFO total number of neighbors2 found: %d', myNeighbors);
                reportResult(desc.name, 'neighbors2', myNeighbors, Date.now() - start2);
                return resolve();
              }
            });
          }
        })
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// neighbors2data
// .............................................................................

function benchmarkNeighbors2data(desc, db, resolve, reject) {
  var start1 = Date.now();
  console.log('INFO executing distinct neighbors of 1st and 2nd degree with Profiles for %d elements', neighbors2data);
  var nameP = 'Profiles';
  var nameR = 'Relations';

  try {
    var myNeighbors = 0;
    var goal = neighbors2data;
    total = 0;

    desc.getCollection(db, nameP, function (err, collP) {
      if (err) return reject(err);

      desc.getCollection(db, nameR, function (err, collR) {
        if (err) return reject(err);

        var start2 = Date.now();
        var ids=[];
        desc.getid(db,nameP,function(err,results){
          ids = Object.entries(results)
            for (var k = 0; k < neighbors2data; ++k) {
              desc.neighbors2data(db, collP, collR, ids[k], k, function (err, result) {
                if (err) return reject(err);

                if (debug) {
                  console.log('RESULT', result);
                }

                myNeighbors += result;

                ++total;

                if (total === goal) {
                  console.log('INFO total number of neighbors2 with Profiles found: %d', myNeighbors);
                  reportResult(desc.name, 'neighbors2data', myNeighbors, Date.now() - start2);
                  return resolve();
                }
              });
            }
          })
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// shortest path
// .............................................................................

function benchmarkShortestPath(desc, db, resolve, reject) {
  var start1 = Date.now();
  if (desc.shortestPath === undefined) {
    console.log('INFO %s does not implement shortest path', desc.name);
    console.log('INFO -----------------------------------------------------------------------------');
    return resolve();
  }

  console.log('INFO executing shortest path for %d paths', paths.length);
  var nameP = 'Profiles';
  var nameR = 'Relations';

  try {
    desc.getCollection(db, nameP, function (err, collP) {
      if (err) return reject(err);

      desc.getCollection(db, nameR, function (err, collR) {
        if (err) return reject(err);

        var start2 = Date.now();
        desc.getcount(db, name, function ( err, result){
          var myPaths = 0;
          var goal = paths.length;
          total = 0;

          if (err) return reject(err);
          for (var k = 0; k < result; ++k) {
            desc.shortestPath(db, collP, collR, k, function (err, result) {
              if (err) return reject(err);

              if (debug) {
                console.log('RESULT', result);
              }

              myPaths += result;

              ++total;

              if (total === goal) {
                console.log('INFO total paths length: %d', myPaths);
                reportResult(desc.name, 'shortest path', goal, Date.now() - start2);
                return resolve();
              }
            });
          }
        })
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// hard path
// .............................................................................

function benchmarkHardPath(desc, db, resolve, reject) {
  var start1 = Date.now();
  if (desc.shortestPath === undefined) {
    console.log('INFO %s does not implement hard path', desc.name);
    console.log('INFO -----------------------------------------------------------------------------');
    return resolve();
  }

  console.log('INFO executing hard path');
  var nameP = 'Profiles';
  var nameR = 'Relations';
  //var k = generateRandom(1,1000);
  var path = {from: ids[generateRandom(1,1000)], to: ids[generateRandom(1,1000)]};

  try {
    var myPaths = 0;

    desc.getCollection(db, nameP, function (err, collP) {
      if (err) return reject(err);

      desc.getCollection(db, nameR, function (err, collR) {
        if (err) return reject(err);

        var start2 = Date.now();

        desc.shortestPath(db, collP, collR, path, 0, function (err, result) {
          if (err) return reject(err);

          if (debug) {
            console.log('RESULT', result);
          }

          myPaths += result;

          console.log('INFO total paths length: %d', myPaths);
          reportResult(desc.name, 'hard path', 1, Date.now() - start2);
          return resolve();
        });
      });
    });
  } catch (err) {
    console.log('ERROR %s', err.stack);
    return reject(err);
  }
}

// .............................................................................
// result reporter
// .............................................................................

function reportResult(db, name, num, duration) {
  console.log('INFO -----------------------------------------------------------------------------');
  console.log('INFO %s: %s %d items', db, name, num);
  console.log('INFO Total Time for %d requests: %d ms', num, duration);
  console.log('INFO Average: %d ms', (duration / num));
  console.log('INFO -----------------------------------------------------------------------------');
}
