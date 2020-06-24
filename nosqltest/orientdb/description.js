'use strict';
var OrientDB = require('orientjs');
var Promise = require('bluebird');


function capitalize(a) {
  return a.replace(/(^|\s|_)([a-z])/g, function (m, p1, p2) {return p1 + p2.toUpperCase();});
}

function orientName(name) {
  name = capitalize(name);

  if (name === 'Profiles') name = 'Profile_Info';
  if (name === 'Profilest') name = 'ProfileT';
  if (name === 'Relations') name = 'RelationT';

  return name;
}

module.exports = {
  name: 'OrientDB',

  startup: function (host, cb) {

    var server = OrientDB({
      host: host,
      port: 2424,
      username: 'root',
      password: '1234',
      servers : [{host: host, port:2425}],
      pool: {
        max: 25
      }
    });

    var db = server.use({
      name: 'pokec'
    });
    db.open('admin', 'admin')
      .then(function (db) {
       cb(db);
    });
  },

  initClass: function (db, cb) {
    db.class.list()
      .then(function() {cb();})
      .catch(cb);
  },

  warmup: function (db, cb) {
    var ids = [];
    module.exports.getCollection(db, 'Profiles', function (err, coll) {
      if (err) return cb(err);

      module.exports.aggregate(db, coll, function (err, result) {
        if (err) return cb(err);

        console.log('INFO warmup 1/3');
        var i;
        var j;
        var s = [];
        module.exports.getid(db,'Profiles',function(err,results){
          ids.push(Object.entries(results))
          for (i = 1; i < ids[0].length; ++i) {
            for (j = 50; j < ids[0].length; ++j) {

              s.push(db.query('select shortestPath($a[0].rid, $b[0].rid, "Out") '
                              + 'LET $a = (select @rid from Profile_Info where id = '+ids[i][1]['id'] + '"), '
                              + '$b = (select @rid from Profile_Info where id = ' + ids[j][1]['id'] + '")', {limit: 10000}));
            }
          }
        })
        Promise.all(s).then(function () {
          console.log('INFO warmup 2/3');
          module.exports.getCollection(db, 'Profiles', function (err, coll) {
            if (err) return cb(err);
            var warmupids =[];
            module.exports.getid(db,'Profiles',function(err,results){
              warmupids = Object.entries(results)
              var goal = ids.length;
              var total = 0;
              for (var i = 0; i < warmupids.length; i++) {
                module.exports.getDocument(db, coll, warmupids[i][1]['id'], function (err, result) {
                 if (err) return cb(err);

                  ++total;
                  if (total === goal) {
                    console.log('INFO warmup 3/3');
                    console.log('INFO warmup done');
                    cb(null);
                  }
                });
              }
            })
          });
        }).catch(function (e) {
          cb(e);
        });
      });
    });
  },
//class조회
  getCollection: function (db, name, cb) {
    cb(null, orientName(name));
  },
//class 삭제
  dropCollection: function (db, name, cb) {
    name = orientName(name);

    db.query('drop class ' + name)
    .then(function () {cb();})
    .catch(function (err) {cb(err);});
  },
//class생성
  createCollection: function (db, name, cb) {
    name = orientName(name);

    db.query('create class ' + name)
    .then(function () {
      module.exports.initClass(db, cb);
    })
    .catch(function (err) {cb(err);});
  },
  //id조회
  getrecord : function(db, coll, k, cb) {
    db.query('select id from '+coll+' where @rid>-1:-1 skip '+k+' limit 1')
    .then(function (result) {
      cb(null, result);})
    .catch(function (err) {cb(err);});
  },
  //relation id조회
  getrecordR : function(db, coll, k, cb) {
    db.query('select ID1 from '+coll+' where @rid>-1:-1 skip '+k+' limit 1')
    .then(function (result) {
      cb(null, result);})
    .catch(function (err) {cb(err);});
  },
//id조회
  getid: function (db, coll, cb) {
    db.query('select id from ' + coll)
    .then(function (results) {
      cb(null, results);})
    .catch(function (err) {cb(err);});
  },
  //record개수조회
  getcount: function (db, coll, cb) {
    name = orientName(name);
    db.query('select count(*) from ' + name)
    .then(function (result) {
      cb(null, result);})
    .catch(function (err) {cb(err);});
  },
//id조회2
  getid2: function (db, name,id, cb) {
    name = orientName(name);
    db.query('select ID2 from ' + name + ' where ID1 = "'+id+'"')
    .then(function (results) {
      cb(null, results);})
    .catch(function (err) {cb(err);});
  },
//count조회
  getcount: function (db, coll, cb) {
    db.query('select count(*) from ' + coll)
    .then(function (result) {cb(null, result);})
    .catch(function (err) {cb(err);});
  },
//문서조회
  getDocument: function (db, coll, id, cb) {
    db.query('select * from ' + coll + ' where id=:key',
      {params: {key: id}, limit: 1})
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
//문서저장
  saveDocument: function (db, coll, doc, cb) {
    db.class.get(coll).then(function (klass) {
      klass.create(doc).then(function (rec) {
        cb(null, rec);
      }).catch(function (err) {
        cb(err);
      });
    });
  },
  createvertex: function (db,coll,gender,firstName,lastName,id,locationIP,browserUsed,creationDate,birthday,cb) {
    db.query('create vertex ' + coll + ' set gender="'+gender+'",firstName="'+firstName+'",lastName="'+lastName+'",id="'+id+'",Pid1="'+id+'",locationIP="'+locationIP+'",browserUsed="'+browserUsed+'",creationDate="'+creationDate+'",birthday="'+birthday+'"')
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  updatevertex: function (db,coll,gender,firstName,lastName,id,locationIP,browserUsed,creationDate,birthday,cb) {
    db.query('update ' + coll + ' set gender="'+gender+'",firstName="'+firstName+'",lastName="'+lastName+'",locationIP="'+locationIP+'",browserUsed="'+browserUsed+'",creationDate="'+creationDate+'",birthday="'+birthday+'" where id="'+id+'"')
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  deletevertex: function (db,coll,id,cb) {
    db.query('delete vertex ' + coll + ' where id="'+id+'"')
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  createedge: function (db,collP,collR,id1,id2,cb) {
    db.query('create edge ' + collP + ' from (select from '+collR+' where id="'+id1+'") to (select from '+collR+' where id="'+id2+'") set ID1="'+id1+'", ID2="'+id2+'"')
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  deleteedge: function (db,collP,k,cb) {
    db.query('delete edge '+collP+' where @rid in (select @rid from '+collP+' where @rid>-1:-1 skip '+k+' limit 1)')
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  aggregate: function (db, coll, cb) {
    db.query('select birthday.format("yyyy"),count(*) from ' + coll + ' group by birthday', {limit: 200})
    .then(function (result) {cb(null, result);})
    .catch(function (err) {cb(err);});
  },
  neighbors: function (db, collP, collR, id, cb) {
    db.query('select out_' + collR + ' as out from ' + collP + ' where id=:key', {params: {key: id}})
    .then(function (result) { cb(null, result[0].out?result[0].out._size:0);})
    .catch(function (err) {cb(err);});
  },
  shortestPath: function (db, collP, collR, ida, idb, cb) {
    db.query('select shortestPath($a[0], $b[0], "Out") '
           + 'LET $a = (select @rid from ' + collP + ' where id = "' + ida + '"), '
           + '$b = (select @rid from ' + collP + ' where id = "' + idb + '")')
    .then(function (result) {cb(null, (result[0].shortestPath.length));})
    .catch(function (err) {cb(err);});
  }
};
