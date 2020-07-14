const program = require('commander')
const property = require('../../propertiesReader.js')
const PropertiesReader = require('properties-reader')
const exec = require('child_process').exec
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise')
const server_ycsb_dir = property.get_server_ycsb_dir()
const server_wlfile_dir = property.get_server_wlfile_dir()
const server_IP = property.get_server_IP()
const nodes_IP = property.get_nodes_IP()
let ip = nodes_IP.split(',')
let nodetool_ip = property.get_nodetool_IP()
const ycsb_exporter = property.get_ycsb_exporter()
const ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()
const IO_tracer_dir = property.get_IO_tracer_dir()
const IO_watch_dir = property.get_IO_watch_dir()
const IO_output_dir = property.get_IO_output_dir()
const node_cassandra_dir = property.get_node_cassandra_dir()
const node_arangodb_dir = property.get_node_arangodb_dir()

let loadsizeCmd = '',
  recordcount = '',
  operationcount = ''


/* ################################################################################################################# */
/* ################################################################################################################# */

let nodeIPArr //split array
let node_ip = property.get_nodes_IP();
nodeIPArr = node_ip.split(',');
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0

function runCassExec(status, nodeIPArr, nodetool_ip) {
  return new Promise(function(resolve, reject) {
    nodeIPArr.forEach(function(ip) {
      let firewallcmd = `ssh root@${ip} systemctl stop firewalld`

      //#수정하기! <hdd성능평가용으로 잠시 디렉토리 변경함> config에 cassandrahome
      // let runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -R`
      let runcmd = `ssh root@${ip} ${node_cassandra_dir}/bin/cassandra -R`
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
      exec(firewallcmd)
      console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
      exec(runcmd)
      console.log(chalk.green.bold('[INFO]'), 'run Cassandra in', `${ip}`);
    })
    console.log('----------------------------------------------------------');
    return console.log(chalk.green.bold('[INFO]'), 'run exec complete!');
  });
}

function stdout_results(status, nodeIPArr, nodetool_ip) {
  return new Promise(function(resolve, reject) {
    console.log('----------------------------------------------------------');
    //console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');

    //#수정하기! <hdd성능평가용으로 잠시 디렉토리 변경함> config에 cassandrahome
    // let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    let statuscmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/nodetool status`
    let checkcmd = exec(statuscmd)

    let results = ''

    checkcmd.stdout.on('data', function(data) {
      results += data.toString()
    })

    checkcmd.on('exit', function(code) {
      //console.log('results : \n', results);
      return resolve(results)
    })

    checkcmd.stderr.on('data', function(data) {
      return resolve(status * 0)
    })

  });
}

function find_UN_DN(results) {
  return new Promise(function(resolve, reject) {
    let unTemp = 0
    let dnTemp = 0

    let unTemp1 = results.toString().match(/UN/gi)
    if (unTemp1 !== null) {
      unTemp = unTemp1.length
    }
    let dnTemp1 = results.toString().match(/DN/gi)
    if (dnTemp1 !== null) {
      dnTemp = dnTemp1.length
    }

    console.log(chalk.green.bold('[INFO]'), 'UN:', unTemp, ', DN:', dnTemp)

    if (unTemp == 3) {
      return resolve(status * -1) //success : 1
    } else {
      return resolve(status) //fail : -1
    }
  });
}

/* ################################################################################################################# */
/* ################################################################################################################# */


function runArangoExec(status, nodeIPArr, nodetool_ip) {
  return new Promise(function(resolve, reject) {
    nodeIPArr.forEach(function(ip) {
      let firewallcmd = `ssh root@${ip} systemctl stop firewalld`

      let runcmd = `ssh root@${ip} ${node_arangodb_dir}/bin/arangodb --starter.mode=cluster --starter.data-dir=/root/ssdStorage/arango_cluster --all.cluster.min-replication-factor=3 --starter.join ${nodes_IP}`
      console.log(runcmd);
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
      exec(firewallcmd)
      console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
      exec(runcmd)
      console.log(chalk.green.bold('[INFO]'), 'run arangodb in', `${ip}`);
    })
    console.log('----------------------------------------------------------');
    return console.log(chalk.green.bold('[INFO]'), 'run exec complete!');
  });
}

function arango_status(status, nodeIPArr, nodetool_ip) {
  return new Promise(function(resolve, reject) {
    console.log('----------------------------------------------------------');
    //console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');


    const http = require("http");

    http.get("http://203.255.92.193:8529/_admin/cluster/health", res => {
      let data = "";
      let good = 0;
      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.error) {
            throw new Error("Server replied with error code " + parsedData.code);
          }
          console.log("Status: Node ID");
          for (node in parsedData.Health) {
            console.log(parsedData.Health[node].Status + ": " + node);
            if (parsedData.Health[node].Status === 'good') {
              ++good;
            }
          }
          if (good = 9) {
            console.log('Status is complete', );
            return resolve(status * -1) //success : 1
          }
        } catch (err) {
          console.log("Error: " + err.message);
          return resolve(status * 1)
        }
      });

      res.on("error", err => {
        console.log("Error: " + err.message);
        return resolve(status * 0)
      });
    });

  });
}




/* ################################################################################################################# */
/* ################################################################################################################# */

module.exports.ycsb = (opt) => {
  exec(`mkdir YCSB_RESULT`)

  benchmark_name(opt)
  run_function(status)

  async function run_function(status) {
    let iotracer_status = await check_iotracer(status, opt.iotracer)
    // console.log('IOTRACER_STATUS', iotracer_status)
    let dbtype_status = await check_dbtype(status, opt.dbtype, opt.casstracing)
    // console.log('DBTYPE_STATUS', dbtype_status)
    let runtype_status = await check_runtype(status, opt.runtype)
    // console.log('RUNTYPE_STATUS', runtype_status)
    let wlfile_status = await check_Fileexist(status, opt.wlfile)
    // console.log('WLFILE_STATUS', wlfile_status)
    let loadsize_status = await check_loadsize(status, opt.runtype, opt.loadsize)
    // console.log('LOADSIZE_STATUS', loadsize_status)
    let timewindow_status = await check_Timewindow(status, opt)
    // console.log('TIMEWINDOW_STATUS', timewindow_status)
    let threads_status = await check_threads(status, opt)
    // console.log('THREADS_STATUS', threads_status)

    if (dbtype_status == 1 && runtype_status == 1 && wlfile_status == 1 && loadsize_status == 1 && timewindow_status == 1 && threads_status == 1) {
      if (opt.dbtype == 'cassandra') {
        runCassExec(status, nodeIPArr, nodetool_ip)
        checkStatus_Cass(status, nodeIPArr, nodetool_ip)
      } else if (opt.dbtype == 'arangodb') {
        runArangoExec(status, nodeIPArr, nodetool_ip)
        // setTimeout(checkStatus_Arango, 1000 * 5, status, nodeIPArr, nodetool_ip)
        // checkStatus_Arango(status, nodeIPArr, nodetool_ip)
        setTimeout(function() {
          checkStatus_Arango(status, nodeIPArr, nodetool_ip)
        }, 10000);
      }
    } else {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'There was an error and could not be executed.')
      console.log('----------------------------------------------------------');
    }
  }

  async function checkStatus_Cass(status, nodeIPArr, nodetool_ip) {
    let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
    // console.log('resTemp : ', resTemp);
    let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
    console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
    if (isOK == 1) {
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
      console.log('----------------------------------------------------------');
      // runYCSB(opt, opt.runtype)

      if (opt.runtype == 'load' || opt.runtype == 'run') {
        opt.flag = true
        runYCSB(opt, opt.runtype)
      } else if (opt.runtype == 'loadrun') {
        let runtype1 = opt.runtype.substring(0, 4)
        let runtype2 = opt.runtype.substring(4, 7)

        // checkStatus_Cass
        opt.flag = true
        runYCSB(opt, runtype1)
          .then((data) => {
            opt.flag = data
            runYCSB(opt, runtype2)
          })

      } else {
        console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'There was an error and could not be executed.')
        console.log('----------------------------------------------------------');
      }

    } else if (isOK == -1) {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'check cassandra again .. waiting for 20 seconds');
      setTimeout(checkStatus_Cass, 1000 * 20, status, nodeIPArr, nodetool_ip)
    } else if (isOK == 0) {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'stderr');
    }
  }


  async function checkStatus_Arango(status, nodeIPArr, nodetool_ip) {
    // let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
    // console.log('resTemp : ', resTemp);
    let isOK = await arango_status(status) //success: 1, failed: -1, stederr: 0
    console.log(isOK);
    console.log(chalk.green.bold('[INFO]'), 'ArangoDB is OK? :', isOK, '(Success:1, Failed:-1)');
    if (isOK == 1) {
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'Start ArangoDB benchmarking');
      console.log('----------------------------------------------------------');

      if (opt.runtype == 'load' || opt.runtype == 'run') {
        opt.flag = true
        runYCSB(opt, opt.runtype)
      } else if (opt.runtype == 'loadrun') {
        let runtype1 = opt.runtype.substring(0, 4)
        let runtype2 = opt.runtype.substring(4, 7)

        // checkStatus_Cass
        opt.flag = true
        runYCSB(opt, runtype1)
          .then((data) => {
            opt.flag = data
            runYCSB(opt, runtype2)
          })
      } else {
        console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'There was an error and could not be executed.')
        console.log('----------------------------------------------------------');
      }

    } else if (isOK == -1) {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'check ArangoDB again .. waiting for 20 seconds');
      setTimeout(checkStatus_Arango, 1000 * 20, status, nodeIPArr, nodetool_ip)
    } else if (isOK == 0) {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'stderr');
    }
  }
}

/* ################################################################################################################# */
/* ################################################################################################################# */

const dropData = () => new Promise(resolve => {
  ip.forEach((i) => {
    dropCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/dropKeyspace.cql ${nodetool_ip}`
    // removeCmd = `ssh root@${i} ${node_cassandra_dir}/bin/nodetool clearsnapshot`
    try {
      const stdout = exec(dropCmd)
      console.log('--------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'remove cassandra data : ', chalk.blue.bold(i));
      console.log('--------------------------------------');
    } catch (err) {
      // console.error(err);
    }
  })
  resolve()
})


const createData = () => new Promise(resolve => {
  createCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/createKeyspace.cql ${nodetool_ip}`
  try {
    const stdout = exec(createCmd);
    console.log('--------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'careate cassandra table : ', chalk.blue.bold(nodetool_ip));
    console.log('--------------------------------------');
    // console.log(shadowContent);
  } catch (err) {
    // console.error(err);
  }
  resolve()
})


const runYCSB = (opt, runtype) => new Promise(resolve => {
  if (opt.iotracer == true) { // IOracer 옵션이 있을 경우Otracer 를 실행함
    if (opt.runtype == 'load' || opt.runtype == 'run' || ((opt.runtype == 'loadrun') && (runtype == 'load')))
      // console.log('iotracer 시작');
      ip.forEach((i) => {
        try {
          // const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d -p 1048576 ${IO_watch_dir}`)
          const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d -p 1048576 ${IO_watch_dir}`)
          // console.log(`stdout: ${stdout}`);
          console.log('--------------------------------------');
          console.log(chalk.green.bold('[INFO]'), 'iotracer run : ', chalk.blue.bold(i));
          console.log('--------------------------------------');
          // exec(`ssh root@${i} ${IO_tracer_dir} -d ${IO_watch_dir}`)
        } catch (err) {
          console.log(err);
        }
      })
  }
  try { // error가 없는 경우 벤치마킹을 수행함
    if (opt.dbtype == 'cassandra' && opt.remove == true) {
      if (opt.runtype == 'load') {
        dropData().then(createData())
      } else if ((opt.runtype == 'loadrun') && (runtype == 'load')) {
        dropData().then(createData())
      }
    } else if (opt.dbtype == 'cassandra' && opt.remove == null && runtype == 'load') {
      // checkStatus_Cass
      createData()
    }
    if (opt.dbtype == 'arangodb') {
      dropDBBeforeRun = 'true'
      if (opt.runtype == 'run' || runtype == 'run') {
        dropDBBeforeRun = 'false'
      }
    }

    let cmd = ''
    if (opt.dbtype == 'cassandra') {
      cmd = `cd YCSB && \
              ./bin/ycsb ${runtype} cassandra-cql -P ${server_wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} -p measurementtype=timeseries ${loadsizeCmd} \
              -p timeseries.granularity=${timewindow} -p exporter=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/${runtype}_result \
              -threads ${opt.threads} -p cassandra.tracing=${cassandraTracing} -s`
    } else if (opt.dbtype == 'arangodb') {
      cmd = `cd YCSB && \
              ./bin/ycsb ${runtype} ${opt.dbtype} -P ${server_wlfile_dir}/${opt.wlfile} -p arangodb.ip=${nodetool_ip} -p arangodb.port=${8529} -p measurementtype=timeseries ${loadsizeCmd} \
              -p timeseries.granularity=${timewindow} -p exporter=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/${runtype}_result \
              -threads ${opt.threads} -p arangodb.dropDBBeforeRun=${dropDBBeforeRun} -s`
    }

    console.log(cmd);
    // console.log(cmd);
    let cmdexec;
    if (!opt.flag) {
      cmd = 'ls'
      // cmdexec = exec(cmd)
    }
    console.log('--------------------------------------');
    console.log(chalk.green.bold('[INFO]'), `ycsb ${runtype} started.`);
    console.log('--------------------------------------');
    cmdexec = exec(cmd)
    // else
    //   cmdexec = 'ls'

    let file = `${server_ycsb_dir}/${server_wlfile_dir}/${opt.wlfile}`
    try {
      fs.statSync(file);

      const properties = PropertiesReader(`./YCSB/workloads/${opt.wlfile}`)
      recordcount = properties.get('recordcount')
      operationcount = properties.get('operationcount')
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      }
    }
    let flag = true

    cmdexec.stderr.on('data', function(data) {
      console.log(data)
      if (data.includes('Exception')) {
        flag = false
      }
      let count = data.split(" ")
      if (opt.event) {
        switch (runtype) {
          case 'load':
            if (recordcount * (opt.event) * 0.01 < count[4] && count[4] < recordcount * (parseInt(opt.event) + parseInt("20")) * 0.01) {
              // 이벤트 내용 추가

              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), `${opt.event} % complete`);
              console.log('recordcount : ', count[4]);
              console.log(`recordcount*${opt.event*0.01} : `, recordcount * opt.event * 0.01);
              console.log('--------------------------------------');
            }
            break;
          case 'run':
            if (operationcount * (opt.event) * 0.01 < count[4] && count[4] < operationcount * (parseInt(opt.event) + parseInt("20")) * 0.01) {
              // 이벤트 내용 추가

              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), `${opt.event} % complete`);
              console.log('operationcount : ', count[4]);
              console.log(`operationcount*${opt.event*0.01} : `, operationcount * opt.event * 0.01);
              console.log('--------------------------------------');
            }
            break;
        }
      }

    })

    cmdexec.on('exit', function(code) {

      console.log('--------------------------------------');
      console.log(chalk.green.bold('[INFO]'), `ycsb ${runtype} completed.`);
      console.log('--------------------------------------');
      // console.log('start');
      exec(`/root/ssdStorage/skh_project/json2csv.sh ${ycsb_exportfile_dir}/${opt.name}/${runtype}_result`);


      if (opt.dbtype == 'cassandra') {
        if (((opt.runtype == 'load') || (opt.runtype == 'run')) || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
          ip.forEach((i) => {
            try {
              exec(`ssh root@${i} ${node_cassandra_dir}/killCass.sh`);
              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), 'kill cassandra : ', chalk.blue.bold(i));
              console.log('--------------------------------------');
            } catch (err) {
              console.log(err);
            }
          })


          if (opt.iotracer == true) { // 벤치마킹 종료 후 iotracer 결과를 저장함
            if ((opt.runtype == 'load') || (opt.runtype == 'run') || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
              get_IO_results(opt.name, ip, opt.runtype)
            }
          }

          console.log('--------------------------------------');
          console.log(chalk.green.bold('[INFO]'), 'complete benchmarking : ', chalk.blue.bold(opt.name));
          console.log('--------------------------------------');


                setTimeout(function() {

                    ip.forEach((i) => {
                    try {
                      // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
                      const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${opt.runtype}_output`)
                      console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${opt.runtype}_output`);
                      console.log(`stdout: ${stdout3}`);
                      stdout3.stdout.on('data', function(data){
                        console.log(data);
                      })
                      // stdout3.stderr.on('data', function(data){
                      //   console.log(data);
                      // })
                      // stdout3.stdin.on('data', function(data){
                      //   console.log(data);
                      // })

                    } catch (err) {
                      console.log('server send fail');
                      console.log(err);
                    }
                    })
                }, 10000);

        }
      } else if (opt.dbtype == 'arangodb') {
        if (((opt.runtype == 'load') || (opt.runtype == 'run')) || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
          ip.forEach((i) => {
            try {
              exec(`ssh root@${i} ${node_arangodb_dir}/killArango.sh`)
              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), 'kill arangodb : ', chalk.blue.bold(i));
              console.log('--------------------------------------');
            } catch (err) {
              console.log(err);
            }
          })


          if (opt.iotracer == true) { // 벤치마킹 종료 후 iotracer 결과를 저장함
            if ((opt.runtype == 'load') || (opt.runtype == 'run') || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
              get_IO_results(opt.name, ip, opt.runtype)
            }
          }

          console.log('--------------------------------------');
          console.log(chalk.green.bold('[INFO]'), 'complete benchmarking : ', chalk.blue.bold(opt.name));
          console.log('--------------------------------------');


                setTimeout(function() {

                    ip.forEach((i) => {
                    try {
                      // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
                      const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${runtype}_output`)
                      console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${runtype}_output`);
                      console.log(`stdout: ${stdout3}`);
                      stdout3.stdout.on('data', function(data){
                        console.log(data);
                      })
                      // stdout3.stderr.on('data', function(data){
                      //   console.log(data);
                      // })
                      // stdout3.stdin.on('data', function(data){
                      //   console.log(data);
                      // })

                    } catch (err) {
                      console.log('server send fail');
                      console.log(err);
                    }
                    })
                }, 10000);

        }
      }

      resolve(flag)

    })


  } catch (err) {
    console.log(err);
  }

})



function check_dbtype(status, dbtype, casstracing) {
  return new Promise(function(resolve, reject) {
    // console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'dbtype :', chalk.blue.bold(dbtype));
    // console.log('----------------------------------------------------------');

    if (dbtype == 'cassandra') { // 카산드라일때 tracinㅎ 옵션
      dbtype = 'cassandra-cql'
      if (casstracing == true) {
        cassandraTracing = 'true'
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'cassandraTracing :', chalk.blue.bold(cassandraTracing));
        // console.log('----------------------------------------------------------');
      } else {
        cassandraTracing = 'false'
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'cassandraTracing :', chalk.blue.bold(cassandraTracing));
        // console.log('----------------------------------------------------------');
      }
      return resolve(status * -1)
    } else {
      return resolve(status * -1)
    }
  });
}

function check_iotracer(status, iotracer) {
  return new Promise(function(resolve, reject) {
    if (iotracer == true) {
      iotracing = 'true'
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'iotracer :', chalk.blue.bold(iotracing));
      // console.log('----------------------------------------------------------');
    } else {
      iotracing = 'false'
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'iotracer :', chalk.blue.bold(iotracing));
      // console.log('----------------------------------------------------------');
    }
    return resolve(status * -1)
  });
}


function get_IO_results(bmname, ip, runtype) {
  ip.forEach((i) => { // iotracer 종료 후
    try {
      const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/killIO.sh`)
      // console.log(`ssh root@${i} ${IO_tracer_dir}/killIO.sh`);
      // console.log(`stdout: ${stdout}`);
      console.log('--------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'kill iotracer : ', chalk.blue.bold(i));
      console.log('--------------------------------------');
      // console.log(stdout);
    } catch (err) {
      console.log('kill fail');
      console.log(err);
    }

    // try {
    //   // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
    //   const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`)
    //   console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`);
    //   console.log(`stdout: ${stdout3}`);
    //   stdout3.stdout.on('data', function(data){
    //     console.log(data);
    //   })
    //   // stdout3.stderr.on('data', function(data){
    //   //   console.log(data);
    //   // })
    //   // stdout3.stdin.on('data', function(data){
    //   //   console.log(data);
    //   // })
    //
    // } catch (err) {
    //   console.log('server send fail');
    //   console.log(err);
    // }

    // // console.log('parse start');
    // try { // 파싱해서 결과를 저장함
    //   const stdout2 = exec(`ssh root@${i} ${IO_tracer_dir}/bin/ioparser ${IO_tracer_dir}/output ${IO_output_dir}`)
    //   // console.log(`stdout: ${stdout2}`);
    //   console.log('parse end');
    //   exec(`mv ${ycsb_exportfile_dir}/${bmname}/output ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`)
    //
    //   exec(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${bmname}`)
    //   exec(`mv ${ycsb_exportfile_dir}/${bmname}/output ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`)
    //   console.log('result end');
    //   console.log(`stdout: ${std`out3}`);
    // } catch (err) {
    //   console.log('parcer fail');
    //   console.log(err);
    // }

    // try{
    // // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
    // const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`)
    // console.log(`stdout: ${stdout3}`);
    // }catch (err){
    //   console.log('server send fail');
    //   console.log(err);
    // }

  })
}



function check_runtype(status, runtype) {
  return new Promise(function(resolve, reject) {
    if (runtype == 'load' || runtype == 'run' || runtype == 'loadrun') {
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'runtype :', chalk.blue.bold(runtype));
      // console.log('----------------------------------------------------------');
      return resolve(status * -1)
    } else {
      // console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'runtype :', 'invalid runtype', chalk.blue.bold(runtype), `, (choose from 'load', 'run', 'loadrun')`)
      // console.log('----------------------------------------------------------');
      return resolve(status * 1)
    }
  });
}

function check_Fileexist(status, wlfile) {
  return new Promise(function(resolve, reject) {
    if (wlfile == null) {
      // console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'workload file :', 'enter workload file name or type (news, contents, facebook, log, recommendation ..)')
      // console.log('----------------------------------------------------------');
    } else {
      let file = `${server_ycsb_dir}/${server_wlfile_dir}/${wlfile}`
      try {
        fs.statSync(file);
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'workload file :', chalk.blue.bold(wlfile));
        // console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } catch (err) {
        // console.error(err);
        // console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'workload name :', 'invalid workload file', chalk.blue.bold(wlfile), '(No such type of file)')
        // console.log('----------------------------------------------------------');
        return resolve(status) //fail : -1
      }
    }
  });
}


function check_loadsize(status, runtype, loadsize) {

  return new Promise(function(resolve, reject) {

    if ((runtype == 'run') && (loadsize)) { // run인데 load size가 있는 경우
      // console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'load size :', `'load size' is ,load', 'loadrun' option.`)
      // console.log('----------------------------------------------------------');

      return resolve(status) //fail : -1
    } else if ((runtype == 'load' || runtype == 'loadrun') && (loadsize)) { // load에 대한 loadsize 옵션
      // 10M -> 10
      let loadsizeInfo = chalk.magenta('load size')
      let fieldcount = 10
      let fieldlength = Math.pow(10, 6) / fieldcount

      if (loadsize.match(/M/)) {
        recordcount = loadsize.split('M')[0]
        loadsizeCmd = `-p fieldcount=${fieldcount} -p fieldlength=${fieldlength} -p recordcount=${recordcount}`
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'load size :', chalk.blue.bold(loadsize));
        // console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else if (loadsize.match(/G/)) {
        recordcount = loadsize.split('G')[0] * Math.pow(10, 3)
        loadsizeCmd = `-p fieldcount=${fieldcount} -p fieldlength=${fieldlength} -p recordcount=${recordcount}`
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'load size :', chalk.blue.bold(loadsize));
        // console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else if (loadsize.match(/T/)) {
        recordcount = loadsize.split('T')[0] * Math.pow(10, 6)
        loadsizeCmd = `-p fieldcount=${fieldcount} -p fieldlength=${fieldlength} -p recordcount=${recordcount}`
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'load size :', chalk.blue.bold(loadsize));
        // console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else { // 형식이 안 맞으면 error
        loadsizeLine = `${error} ${loadsizeInfo} : enter load size in (###M, ###G, ###T) format.`
        loadsizeCmd = ''
        // console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'load size :', 'enter load size in (###M, ###G, ###T) format.');
        // console.log('----------------------------------------------------------');
        return resolve(status) //success : 1
      }
    } else {
      loadsizeCmd = ''
      return resolve(status * -1) //success : 1
    }
  });
}

function benchmark_name(opt) {
  if ((typeof opt.name) == 'function') { // n 값이 없으면 디폴트값 만들어줌
    opt.name = 'ycsb_result_1'
    // console.log(opt);
    try {
      while (1) {
        let file = `${ycsb_exportfile_dir}/${opt.name}`
        fs.statSync(file); // 파일 존재 확인

        let string = opt.name
        let strArray = string.split('_') // 마지막 sequence 자르기
        let seqString = strArray[strArray.length - 1] // 마지막 인자 (숫자 저장)

        // 배열에 담기 (스트링->각 요소들을 숫자로)
        let seqArray = new Array();
        let newArray = new Array();
        seqArray = seqString.split("");

        let seqNum = 0
        // 각 요소들을 더해서 숫자로 계산
        for (let i = 0; i < seqArray.length; i++) {
          newArray[i] = seqArray[i] * Math.pow(10, seqArray.length - 1 - i)
          newArray[seqArray.length - 1] = newArray[seqArray.length - 1] + 1
          seqNum += newArray[i]
        }
        opt.name = `ycsb_result_${seqNum}`
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
        // console.log(err);
      }
    }
  } else { //n 값이 있으면 else if((typeof opt.name) == 'string')
    const path = `${ycsb_exportfile_dir}`
    var file = opt.name
    // console.log(file);
    //console.log(file.split("_")[1])
    //split 하면 배열로 반환됨
    const fs = require('fs')

    while (1) {
      // console.log(file)
      var array = file.split("_") //som, som, 1
      try {
        if (!fs.existsSync(path + '/' + file)) {
          fs.mkdirSync(path + '/' + file)
        } else if (fs.existsSync(path + '/' + file) && array.length >= 2) {
          let num = Number(array[array.length - 1]); //
          // console.log('exists')
          if (isNaN(num)) {
            file = file + '_' + 1
            fs.mkdirSync(path + '/' + file)

            opt.name = file
          } else if (typeof(num) == typeof(10)) {
            num += 1; //2
            //for문
            file = ''
            for (i = 0; i < array.length - 1; i++) { //length = 3
              file += array[i] + '_' //i = 0, 1 (som, som)
            }
            file = file + num
            fs.mkdirSync(path + '/' + file)
            //opt.name = file
            opt.name = file
          } else {
            file = file + '_' + 1 //som_som_1
            fs.mkdirSync(path + '/' + file)
            //opt.name = file
            opt.name = file
          }
          break;
        } else if (array.length == 1) {
          file = array[0] + '_' + 1
          fs.mkdirSync(path + '/' + file)

          opt.name = file
        }
        break;
      } catch (err) {
        continue;
      }
    }
  }
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'benchmark Name :', chalk.blue.bold(opt.name));
  console.log('----------------------------------------------------------');

  try {
    exec(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
  } catch (err) {
    console.error(err);
  }
}

function isNumber(s) { // 입력이 숫자인지 확인해주는 함수
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s == '' || isNaN(s)) return false;
  return true;
}


function check_Timewindow(status, opt) {
  // let timewindow = ''
  return new Promise(function(resolve, reject) {
    if (opt.timewindow == null) {
      opt.timewindow = 1
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'timewindow :', chalk.blue.bold(`${opt.timewindow} (sec)`));
      // console.log('----------------------------------------------------------');
      timewindow = `${opt.timewindow}` * Math.pow(10, 3)
      return resolve(status * -1) //success : 1
    } else {
      if (isNumber(opt.timewindow)) {
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'timewindow :', chalk.blue.bold(`${opt.timewindow} (sec)`));
        // console.log('----------------------------------------------------------');
        timewindow = `${opt.timewindow}` * Math.pow(10, 3)
        return resolve(status * -1) //success : 1
      } else {
        // console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'timewindow :', ` enter timewindow as number type.`)
        // console.log('----------------------------------------------------------');
        return resolve(status) //success : 1
      }
    }
  });
}


function check_threads(status, opt) {
  // let timewindow = ''
  return new Promise(function(resolve, reject) {
    if (opt.threads == null) {
      opt.threads = 1
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'threads :', chalk.blue.bold(`${opt.threads}`));
      console.log('----------------------------------------------------------');
      return resolve(status * -1) //success : 1
    } else {
      if (isNumber(opt.threads)) {
        // console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'threads :', chalk.blue.bold(`${opt.threads}`));
        console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else {
        // console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'threads :', ` enter threads as number type.`)
        console.log('----------------------------------------------------------');
        return resolve(status) //success : 1
      }
    }
  });
}
