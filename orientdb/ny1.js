var Tail = require('always-tail');
var fs = require('fs');
var filename = "/root/ssdStorage/orientdb195/log/orient-server.log.0";

if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");

var tail = new Tail(filename, '\n');

tail.on('line', function(data) {
  console.log("got line:", data);
});


tail.on('error', function(data) {
  console.log("error:", data);
});

tail.watch();