// 'use strict';
var OrientDB = require('orientjs');
var Promise = require('bluebird');

module.exports = {
  name: 'OrientDB',

  startup: function (host, cb) {
    //db 연결
    var server = OrientDB({
      host: host,
      port: 2424,
      username: 'root',
      password: '1234',
      useToken : true,
      servers : [{host: host, port:2424}]
    });

    var db = server.use({
      name: 'skh'
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
  //record 전체 가져오기(id로 검색)
  getDocument: function (db, coll, id, cb) {
    db.query('select * from ' + coll + ' where id=:key',
      {params: {key: id}, limit: 1})
    .then(function (results) {cb(null, results[0]);})
    .catch(function (err) {cb(err);});
  },
  getrecord: function (db, coll, id, cb) {
    db.query('select from ' + coll + ' where @rid=:key',
      {params: {key: id}, limit: 1})
    .then(function (results) {cb(null, results[0]['_to']);})
    .catch(function (err) {cb(err);});
  },
  //record rid 가져오기 (rid로 검색)
  getrid : function(db, coll, k, cb) {
    db.query('select from '+coll+' where @rid>'+k+' limit 1')
    .then(function (result) {
      cb(null, result[0]['@rid']);})
    .catch(function (err) {cb(err);});
  },
  getrid2 : function(db, coll, k, cb) {
    db.query('select from '+coll+' where @rid>'+k+' limit 1')
    .then(function (result) {
      cb(null, result[0]['id']);})
    .catch(function (err) {cb(err);});
  },
  //record id 가져오기 (id로 검색)
  getid: function (db, coll, id, cb) {
    db.query('select id from ' + coll+' where id ="'+id+'"')
    .then(function (results) {
      cb(null, results);})
    .catch(function (err) {cb(err);});
  },
  //record 개수 가져오기
  getcount: function (db, coll, cb) {
    db.query('select count(*) from ' + coll)
    .then(function (result) {
      cb(null, result[0]['count']);})
    .catch(function (err) {cb(err);});
  },
  //aggregation 년도별로 계산(LDBC)
  aggregate: function (db, coll, cb) {
    db.query('select birthday.format("yyyy"),count(*) from ' + coll + ' group by birthday', {limit: 200})
    .then(function (result) {cb(null, result);})
    .catch(function (err) {cb(err);});
  },
  //aggregation 나이별로 계산(pokec,livejournal)
  aggregate2: function (db, coll, cb) {
    db.query('select age,count(*) from ' + coll + ' group by age', {limit: 200})
    .then(function (result) {cb(null, result);})
    .catch(function (err) {cb(err);});
  },
  //neighbors
  neighbors: function (db, collP, collR, id, cb) {
    db.query('select out_' + collR + ' as out from ' + collP + ' where @rid=:key', {params: {key: id}})
    .then(function (result) {
      cb(null, result[0]['out']['_content']?result[0]['out']['_content']:[]);})
    .catch(function (err) {cb(err);});
  },
  //shortestPath
  shortestPath: function (db, collP,ida, idb, cb) {
    db.query('select shortestPath($a[0], $b[0], "Out") '
           + 'LET $a = (select from ' + collP + ' where @rid = "' + ida + '"), '
           + '$b = (select from ' + collP + ' where @rid = "' + idb + '")')
    .then(function (result) {cb(null, (result[0].shortestPath.length));})
    .catch(function (err) {cb(err);});
  },
  //cluster 정보
  cluster : function(db, k, cb) {
    db.query('select count(*) from cluster:'+k)
    .then(function (results) {
      cb(null, results[0]['count']);})
    .catch(function (err) {cb(err);});
  }
};
