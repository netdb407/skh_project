const program = require('commander')
const property = require('../../propertiesReader.js')
// const checkStatus_Cass = require('../../checkStatus_Cass.js')
const childProcess = require("child_process");
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const fs = require('fs')
const chalk = require('chalk')
let Promise = require('promise');
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
const error = chalk.red('ERR!')
let dbtypeLine = '', runtypeLine = '', wlfileLine = '', loadsizeLine = '', loadsizeCmd = '',
threadLine = '', timewindowLine = '', cassandraTracingLine = '', cassandraTracingCmd = ''


// const property = require('./propertiesReader.js')
// const exec =  require('child_process').exec
// const childProcess = require("child_process");
// const chalk = require('chalk')
let nodeIPArr //split array
let node_ip = property.get_nodes_IP();
// let nodetool_ip = property.get_nodetool_IP();
nodeIPArr = node_ip.split(',');
// var Promise = require('promise');
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0



// checkStatus_Cass(status, nodeIPArr, nodetool_ip)




// async function checkStatus_Cass(status, nodeIPArr, nodetool_ip){
//   runExec(status, nodeIPArr, nodetool_ip)
//   let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
//   // console.log('resTemp : ', resTemp);
//   let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
//   console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
//   if(isOK == 1){
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
//     console.log('----------------------------------------------------------');
//
//   }else if(isOK == -1){
//     console.log('----------------------------------------------------------');
//     console.log(chalk.red.bold('[ERROR]'), 'check cassandra again');
//
//     checkStatus_Cass(status, nodeIPArr, nodetool_ip)
//   }else if(isOK == 0){
//
//     console.log('stderr~!!!');
//   }
// }



function runExec(status, nodeIPArr, nodetool_ip) {
    return new Promise(function(resolve, reject) {
      nodeIPArr.forEach(function(ip){
        let firewallcmd = `ssh root@${ip} systemctl stop firewalld`
        // let killcmd = `ssh root@${ip} /root/ssdStorage/cassandra/killCass.sh`
        let runcmd = `ssh root@${ip} /root/ssdStorage/cassandra/bin/cassandra -R`
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(ip));
        exec(firewallcmd)
        console.log(chalk.green.bold('[INFO]'), 'stop firewall in', `${ip}`);
        // exec(killcmd)
        exec(runcmd)
        console.log(chalk.green.bold('[INFO]'), 'run Cassandra in', `${ip}`);
      })
      console.log('----------------------------------------------------------');
      return console.log(chalk.green.bold('[INFO]'), 'run exec complete!');
    });
}





function stdout_results(status, nodeIPArr, nodetool_ip){
  return new Promise(function(resolve, reject){
    console.log('----------------------------------------------------------');
    console.log(chalk.green.bold('[INFO]'), 'IP address', chalk.blue.bold(nodetool_ip));
    console.log(chalk.green.bold('[INFO]'), 'check Node Status');
    let statuscmd = `ssh root@${nodetool_ip} /root/ssdStorage/cassandra/bin/nodetool status`
    let checkcmd = exec(statuscmd)

    let results = ''

    checkcmd.stdout.on('data', function(data){
      results += data.toString()
    })

    checkcmd.on('exit', function(code){
      //console.log('results : \n', results);
      return Promise.resolve(results)
    })

    checkcmd.stderr.on('data', function(data){
      return Promise.resolve(status*0)
    })

  });
}



function find_UN_DN(results){
  return new Promise(function(resolve, reject) {
  // console.log('nodetool status results: \n', results);
  let unTemp = 0
  let dnTemp = 0

  let unTemp1 = results.toString().match(/UN/gi)
  if(unTemp1 !== null){
    unTemp = unTemp1.length
  }
  let dnTemp1 = results.toString().match(/DN/gi)
  if(dnTemp1 !== null){
    dnTemp = dnTemp1.length
  }

  console.log(chalk.green.bold('[INFO]'), 'UN:', unTemp, ', DN:', dnTemp)

  if(unTemp == 3){
    return Promise.resolve(status * -1) //success : 1
  }else{
    return Promise.resolve(status)  //fail : -1
  }
});
}



/* ################################################################################################################# */

module.exports.ycsb = (opt) => {
  exec(`mkdir YCSB_RESULT`)
  // // runCassandra(nodes_IP)
  // // cqlsh(opt.dbtype)
  // checkCassandra(opt)
  // checkRuntype(opt.runtype)
  // checkFile(opt.wlfile)
  // checkLoadsize(opt.runtype, opt.loadsize)
  // benchmarkName(opt)
  // checkTimewindow(opt)
  // checkThreads(opt)
  // checkiotracer(opt)

  function runFunc(opt) {
      return new Promise(function(resolve, reject) {
        // runCassandra(nodes_IP)
        // cqlsh(opt.dbtype)
        checkCassandra(opt)
        checkRuntype(opt.runtype)
        checkFile(opt.wlfile)
        checkLoadsize(opt.runtype, opt.loadsize)
        benchmarkName(opt)
        checkTimewindow(opt)
        checkThreads(opt)
        checkiotracer(opt)
        });
  }

  runFunc(opt)

  async function checkStatus_Cass(status, nodeIPArr, nodetool_ip){
    console.log('asdf');
    runExec(status, nodeIPArr, nodetool_ip)
    let resTemp = await stdout_results(status, nodeIPArr, nodetool_ip)
    // console.log('resTemp : ', resTemp);
    let isOK = await find_UN_DN(resTemp) //success: 1, failed: -1, stederr: 0
    console.log(chalk.green.bold('[INFO]'), 'Cassandra is OK? :', isOK, '(Success:1, Failed:-1)');
    if(isOK == 1){
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'Start cassandra benchmarking');
      console.log('----------------------------------------------------------');


                if(opt.runtype == 'load' || opt.runtype == 'run'){
                    // runFunc(opt)checkStatus_Cass
                  // checkStatus_Cass().then(status =>{
                  //   console.log('status : ', status);
                  // })
                  // checkStatus_Cass.then ((data) => runYCSB(opt, opt.runtype) )

                  // checkStatus().then(status =>{
                  //   console.log('status : ', status);
                  // })

                  runYCSB(opt, opt.runtype)
                }else if(opt.runtype == 'loadrun'){
                  let runtype1 = opt.runtype.substring(0,4)
                  let runtype2 = opt.runtype.substring(4,7)

                  // checkStatus_Cass

                  runYCSB(opt, runtype1)
                  .then( (data) => runYCSB(opt, runtype2))

                }else {
                  console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
                }

    }else if(isOK == -1){
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'check cassandra again');

      checkStatus_Cass(status, nodeIPArr, nodetool_ip)

    }else if(isOK == 0){

      console.log('stderr~!!!');
    }
  }

  checkStatus_Cass(status, nodeIPArr, nodetool_ip)

    //
    //
    // if(opt.runtype == 'load' || opt.runtype == 'run'){
    //     // runFunc(opt)checkStatus_Cass
    //   // checkStatus_Cass().then(status =>{
    //   //   console.log('status : ', status);
    //   // })
    //   // checkStatus_Cass.then ((data) => runYCSB(opt, opt.runtype) )
    //
    //   // checkStatus().then(status =>{
    //   //   console.log('status : ', status);
    //   // })
    //
    //   runYCSB(opt, opt.runtype)
    // }else if(opt.runtype == 'loadrun'){
    //   let runtype1 = opt.runtype.substring(0,4)
    //   let runtype2 = opt.runtype.substring(4,7)
    //
    //   // checkStatus_Cass
    //
    //   runYCSB(opt, runtype1)
    //   .then( (data) => runYCSB(opt, runtype2))
    //
    // }else {
    //   console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
    // }
  }

/* ################################################################################################################# */

    const dropData = () => new Promise( resolve => {
        ip.forEach((i) => {
        dropCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/dropKeyspace.cql ${nodetool_ip}`
        // removeCmd = `ssh root@${i} ${node_cassandra_dir}/bin/nodetool clearsnapshot`
        console.log('--------------------------------------')
        console.log(chalk.green.bold('[INFO]'), 'remove cassandra data : ', chalk.blue.bold(i));
        console.log('--------------------------------------')
          try{
            const stdout = execSync(dropCmd)
          }catch (err){ }
        })
        resolve()
      })


    const createData = () => new Promise( resolve => {
      createCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/createKeyspace.cql ${nodetool_ip}`
      try {
        console.log('--------------------------------------')
        console.log(chalk.green.bold('[INFO]'), 'careate cassandra table : ', chalk.blue.bold(nodetool_ip));
        console.log('--------------------------------------')
        const stdout = execSync(createCmd);
        // console.log(shadowContent);
      } catch (error) { }
      resolve()
    })


    const runYCSB =  (opt, runtype) => new Promise( resolve => {

      if(opt.iotracer == true){ // IOracer 옵션이 있을 경우Otracer 를 실행함
        ip.forEach((i) => {
          console.log('--------------------------------------')
          console.log(chalk.green.bold('[INFO]'), 'iotracer run : ', chalk.blue.bold(i));
          console.log('--------------------------------------')
          // exec(`ssh root@${i} ${IO_tracer_dir} -d ${IO_watch_dir}`)
          try{
            const stdout = execSync(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -D -d ${IO_watch_dir}`)
            // console.log(`stdout: ${stdout}`);
          }catch (err){
            console.log(err);
          }
        })
      }

      let runtype1 = opt.runtype.substring(0,4)
      let runtype2 = opt.runtype.substring(4,7)

      if((dbtypeLine.match('ERR'))||(runtypeLine.match('ERR'))||(wlfileLine.match('ERR'))||(loadsizeLine.match('ERR'))||(threadLine.match('ERR'))||(timewindowLine.match('ERR'))||(cassandraTracingLine.match('ERR'))){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')

        if(opt.iotracer == true){ // error가 있는 경우 io tracer 를 종료해줌
          ip.forEach((i) => {
            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'), 'iotracer kill : ', chalk.blue.bold(i));
            console.log('--------------------------------------')
            try{
              const stdout =  execSync(`ssh root@${i} ${IO_tracer_dir}/kill.sh`)
              // console.log(`stdout: ${stdout}`);
            }catch(err){
              // console.log('kill end');
            }
          })
        }

      }else{
          try { // error가 없는 경우 벤치마킹을 수행함
            if(opt.dbtype == 'cassandra-cql' && opt.remove == true && runtype == 'load'){
              // remove data 옵션이 있는 경우 데이터를 삭제함 (노드 3대)

               // checkStatus_Cass().then(status =>{
               //   console.log('status : ', status);
               // })
               // .then( dropData())
               // .then( createData())

               dropData().then ( createData() )

               // createData()
            }else if(opt.dbtype == 'cassandra-cql' && opt.remove == null && runtype == 'load'){
              // checkStatus_Cass
              createData()
            }
              let cmd = ''
            if(opt.dbtype == 'cassandra-cql'){
              cmd = `cd YCSB && \
              ./bin/ycsb ${runtype} ${opt.dbtype} -P ${server_wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} -p measurementtype=timeseries ${loadsizeCmd} \
              -p timeseries.granularity=${timewindow} -p exporter=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_${runtype}_result \
              -threads ${opt.threads} ${cassandraTracingCmd} -s`
            }else if ((opt.dbtype == 'arangodb')&&(runtype == 'load')){
              cmd = `cd YCSB && \
              ./bin/ycsb ${runtype} ${opt.dbtype} -P ${server_wlfile_dir}/${opt.wlfile} -p arangodb.ip=${nodetool_ip} -p arangodb.port=${8529} -p measurementtype=timeseries ${loadsizeCmd} \
              -p timeseries.granularity=${timewindow} -p exporter=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_${runtype}_result \
              -threads ${opt.threads} ${dropDBBeforeRunCmd} -s`
            }else if ((opt.dbtype == 'arangodb')&&(runtype == 'run')){
              cmd = `cd YCSB && \
              ./bin/ycsb ${runtype} ${opt.dbtype} -P ${server_wlfile_dir}/${opt.wlfile} -p arangodb.ip=${nodetool_ip} -p arangodb.port=${8529} -p measurementtype=timeseries ${loadsizeCmd} \
              -p timeseries.granularity=${timewindow} -p exporter=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_${runtype}_result \
              -threads ${opt.threads} -s`
            }
            console.log(cmd);
            let cmdexec = exec(cmd)
            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'),`ycsb ${runtype} started.`)
            console.log('--------------------------------------')

            cmdexec.stderr.on('data', function(data) {
              // console.log('데이터??');
              console.log(data)
            })

            cmdexec.on('exit', function(code){

              console.log('--------------------------------------')
              console.log(chalk.green.bold('[INFO]'),`ycsb ${runtype} completed.`)
              console.log('--------------------------------------')
              // console.log('start');
              exec(`/root/ssdStorage/skh_project/json2csv.sh ${ycsb_exportfile_dir}/${opt.name}/bm_${runtype}_result`)

              if(opt.iotracer == true){ // 벤치마킹 종료 후 iotracer 결과를 저장함
                getIOresults(opt.name, ip, opt.runtype)
              }
              if(opt.dbtype == 'cassandra-cql'){
                ip.forEach((i) => {
                  console.log('--------------------------------------')
                  console.log(chalk.green.bold('[INFO]'), 'cassandra kill : ', chalk.blue.bold(i));
                  console.log('--------------------------------------')
                  try{
                    const stdout =  execSync(`ssh root@${i} ${node_cassandra_dir}/killCass.sh`)
                    // console.log(`stdout: ${stdout}`);
                  }catch(err){ }
                })
              }else if (opt.dbtype == 'arangodb'){
                ip.forEach((i) => {
                  console.log('--------------------------------------')
                  console.log(chalk.green.bold('[INFO]'), 'arangodb kill : ', chalk.blue.bold(i));
                  console.log('--------------------------------------')
                  try{
                    // const stdout =  execSync(`ssh root@${i} ${node_cassandra_dir}/killCass.sh`)
                    // console.log(`stdout: ${stdout}`);
                  }catch(err){ }
                })
              }
              // console.log('end');
              resolve(opt, runtype)
            })

          } catch (err) { }
        }
    })


    function execute(command) {
    /**
     * @param {Function} resolve A function that resolves the promise
     * @param {Function} reject A function that fails the promise
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    return new Promise(function(resolve, reject) {
      /**
       * @param {Error} error An error triggered during the execution of the childProcess.exec command
       * @param {string|Buffer} standardOutput The result of the shell command execution
       * @param {string|Buffer} standardError The error resulting of the shell command execution
       * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
       */

      childProcess.exec(command, function(error, standardOutput, standardError) {
        if (error) {
          reject();
          return;
        }

        if (standardError) {
          reject(standardError);
          return;
        }
        resolve(standardOutput);
      });
    });
  }

    async function DropAndCreate(i, nodetool_ip, node_cassandra_dir) {
      dropCmd = `ssh root@${i} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/dropKeyspace.cql ${i}`
      createCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/createKeyspace.cql ${nodetool_ip}`
    try {
      // ip.forEach((i) => {
        removeCmd = `ssh root@${i} rm -rf ${node_cassandra_dir}/data/*`
        console.log('--------------------------------------')
        console.log(chalk.green.bold('[INFO]'), 'remove cassandra data : ', chalk.blue.bold(i));
        console.log('--------------------------------------')
          const passwdContent =  await execute(removeCmd);

    } catch (error) {  }
    try {
      console.log('--------------------------------------')
      console.log(chalk.green.bold('[INFO]'), 'careate cassandra table : ', chalk.blue.bold(nodetool_ip));
      console.log('--------------------------------------')
      const shadowContent = await execute(createCmd);
      // console.log(shadowContent);
    } catch (error) { }
  }

  async function Create(nodetool_ip, node_cassandra_dir){
    createCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/createKeyspace.cql ${nodetool_ip}`
    try {
      console.log('--------------------------------------')
      console.log(chalk.green.bold('[INFO]'), 'careate cassandra table : ', chalk.blue.bold(nodetool_ip));
      console.log('--------------------------------------')
      const shadowContent = await execute(createCmd);
      // console.log(shadowContent);
    } catch (error) { }
  }

  function checkiotracer(opt){
    let iotracerInfo = chalk.magenta('iotracer')
    if(opt.iotracer==true){
      let iotracerLine = `${iotracerInfo} : ${opt.iotracer}`
      console.log(iotracerLine)
    }else{
      opt.iotracer = 'false'
      let iotracerLine = `${iotracerInfo} : ${opt.iotracer}`
      console.log(iotracerLine)
    }
  }

    function checkCassandra(opt){
      let cassandratracingInfo = chalk.magenta('cassandra tracing')
      let dropDBBeforeRun = chalk.magenta('dropDBBeforeRun (data remove)')
      let dbtypeInfo = chalk.magenta('dbtype')
      if(opt.dbtype == 'cassandra'){ // 카산드라일때 tracinㅎ 옵션
        let dbtypeLine = `${dbtypeInfo} : ${opt.dbtype}`
        opt.dbtype = 'cassandra-cql'
        console.log(dbtypeLine)

        if(opt.casstracing==true){
          cassandraTracing = 'true'
          cassandraTracingLine = `${cassandratracingInfo} : on`
          cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
          console.log(cassandraTracingLine)
        }else{
          cassandraTracing = 'false'
          cassandraTracingLine = `${cassandratracingInfo} : off`
          cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
          console.log(cassandraTracingLine)
        }
      }else{ // 카산드라가 아닐때
        let dbtypeLine = `${dbtypeInfo} : ${opt.dbtype}`
        console.log(dbtypeLine);

        if(opt.casstracing==true){
          cassandraTracingLine = `${error} ${cassandratracingInfo} : 'cassandra tracing option' is only 'cassandra' option.`
          console.log(cassandraTracingLine)
        }else{
          cassandraTracingLine = ''
        }

        if(opt.remove==true){
          dropDBBeforeRun = 'true'
          dropDBBeforeRunLine = `${cassandratracingInfo} : on`
          dropDBBeforeRunCmd = `-p arangodb.dropDBBeforeRun=${dropDBBeforeRun}`
          console.log(dropDBBeforeRunLine)
        }else if(opt.remove==null){
          dropDBBeforeRun = 'false'
          dropDBBeforeRunLine = `${cassandratracingInfo} : off`
          dropDBBeforeRunCmd = `-p cassandra.tracing=${dropDBBeforeRun}`
          console.log(dropDBBeforeRunLine)
        }

      }
    }

  function getIOresults(bmname, ip, runtype){
    ip.forEach((i) => { // iotracer 종료 후
      console.log('--------------------------------------')
      console.log(chalk.green.bold('[INFO]'), 'iotracer kill : ', chalk.blue.bold(i));
      console.log('--------------------------------------')
      try{
        const stdout =  execSync(`ssh root@${i} ${IO_tracer_dir}/kill.sh`)
        // console.log(`stdout: ${stdout}`);
      }catch(err){ }

      // console.log('parse start');
      try{ // 파싱해서 결과를 저장함
        const stdout2 = execSync(`ssh root@${i} ${IO_tracer_dir}/bin/ioparser ${IO_tracer_dir}/output ${IO_output_dir}`)
        // console.log(`stdout: ${stdout2}`);
        // console.log('parse end');

        // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
        execSync(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${bmname}`)
        execSync(`mv ${ycsb_exportfile_dir}/${bmname}/output ${ycsb_exportfile_dir}/${bmname}/${i}_${runtype}_output`)
        // console.log('result end');
        // console.log(`stdout: ${std`out3}`);

      }catch(err){ }
    })
  }

  function checkCassandra(opt){
    let cassandratracingInfo = chalk.magenta('cassandra tracing')
    let dbtypeInfo = chalk.magenta('dbtype')
    if(opt.dbtype == 'cassandra'){ // 카산드라일때 tracinㅎ 옵션
      let dbtypeLine = `${dbtypeInfo} : ${opt.dbtype}`
      opt.dbtype = 'cassandra-cql'
      console.log(dbtypeLine);

      if(opt.casstracing==true){
        cassandraTracing = 'true'
        cassandraTracingLine = `${cassandratracingInfo} : on`
        cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
        console.log(cassandraTracingLine);
      }else{
        cassandraTracing = 'false'
        cassandraTracingLine = `${cassandratracingInfo} : off`
        cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
        console.log(cassandraTracingLine);
      }
    }else{ // 카산드라가 아닐때
      let dbtypeLine = `${dbtypeInfo} : ${opt.dbtype}`
      console.log(dbtypeLine);

      if(opt.casstracing==true){
        cassandraTracingLine = `${error} ${cassandratracingInfo} : 'cassandra tracing option' is only 'cassandra' option.`
        console.log(cassandraTracingLine);
      }else{
        cassandraTracingLine = ''
      }

    }
  }

  function checkRuntype(runtype){
    let runtypeInfo = chalk.magenta('runtype')
    if(runtype == 'load' || runtype == 'run' || runtype == 'loadrun'){
      runtypeLine = `${runtypeInfo} : ${runtype}`
      console.log(runtypeLine)
    }else {
      runtypeLine = `${error} ${runtypeInfo} : invalid choice ${runtype}, (choose from 'load', 'run', 'loadrun')`
      console.log(runtypeLine)
    }
  }

  function checkFile(wlfile){
    let wlfileInfo = chalk.magenta('workload file')
    if(wlfile == null) {
      wlfileLine = `${error} ${wlfileInfo} : enter workload filename or type(news, contents, facebook, log, recommendation ..)`
      console.log(wlfileLine)
    }else{
      let file = `${server_ycsb_dir}/${server_wlfile_dir}/${wlfile}`
      try {
        fs.statSync(file);
        wlfileLine = `${wlfileInfo} : ${wlfile}`
        console.log(wlfileLine)
      }catch (err) {
        if (err.code === 'ENOENT') {
          // console.log(err);
          wlfileLine = `${error} ${wlfileInfo} : invalid workload file : workloads/${wlfile} (No such type or file)`
          console.log(wlfileLine)
        }
      }
    }
  }

  function checkLoadsize(runtype, loadsize){
    if((runtype == 'run') && (loadsize)){ // run인데 load size가 있는 경우
      let loadsizeInfo = chalk.magenta('load size')
      loadsizeLine = `${error} ${loadsizeInfo}: 'loadsize' is 'load', 'loadrun' option`
      console.log(loadsizeLine);
    }else if ((runtype == 'load'|| runtype == 'loadrun') && (loadsize)){ // load에 대한 loadsize 옵션
      // 10M -> 10
      transformLoadsize(loadsize)
    }
  }

  function transformLoadsize(loadsize){
    let loadsizeInfo = chalk.magenta('load size')
    let fieldcount = 10
    let fieldlength = Math.pow(10,6)/fieldcount

    if (loadsize.match(/M/)){
      recordcount = loadsize.split('M')[0]

      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeLine = `${loadsizeInfo} : ${loadsize}`
      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
    }
    else if (loadsize.match(/G/)){
      recordcount = loadsize.split('G')[0]*Math.pow(10,3)

      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeLine = `${loadsizeInfo} : ${loadsize}`
      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
    }
    else if (loadsize.match(/T/)){
      recordcount = loadsize.split('T')[0]*Math.pow(10,6)

      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeLine = `${loadsizeInfo} : ${loadsize}`
      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
    }
    else{ // 형식이 안 맞으면 error
      loadsizeLine = `${error} ${loadsizeInfo} : enter load size in (###M, ###G, ###T) format.`
      loadsizeCmd = ''
    }
    console.log(loadsizeLine)
  }

  function benchmarkName(opt){
    if((typeof opt.name) == 'function'){ // n 값이 없으면 디폴트값 만들어줌
      opt.name = 'ycsb_result_1'
      // console.log(opt);
      try{
        while(1){
          let file = `${ycsb_exportfile_dir}/${opt.name}`
          fs.statSync(file); // 파일 존재 확인

          let string = opt.name
          let strArray=string.split('_') // 마지막 sequence 자르기
          let seqString=strArray[strArray.length-1] // 마지막 인자 (숫자 저장)

          // 배열에 담기 (스트링->각 요소들을 숫자로)
          let seqArray = new Array();
          let newArray = new Array();
          seqArray = seqString.split("");

          let seqNum = 0
          // 각 요소들을 더해서 숫자로 계산
          for(let i = 0; i < seqArray.length; i++){
            newArray[i]=seqArray[i]*Math.pow(10,seqArray.length-1-i)
            newArray[seqArray.length-1] = newArray[seqArray.length-1]+1
            seqNum += newArray[i]
          }
          opt.name = `ycsb_result_${seqNum}`
        }
      }catch (err) {
        if (err.code === 'ENOENT') {
          // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
          // console.log(err);
        }
      }
    }else { //n 값이 있으면 else if((typeof opt.name) == 'string')
        const path = `${ycsb_exportfile_dir}`
        var file = opt.name
        // console.log(file);
        //console.log(file.split("_")[1])
        //split 하면 배열로 반환됨
        const fs = require('fs')

        while(1){
          // console.log(file)
          var array = file.split("_")//som, som, 1
          try{
            if(!fs.existsSync(path+'/'+file)){
              fs.mkdirSync(path+'/'+file)
            }
            else if (fs.existsSync(path+'/'+file)&&array.length>=2){
              let num = Number(array[array.length-1]); //
              // console.log('exists')
              if(isNaN(num)){
                file = file+'_'+1
                fs.mkdirSync(path+'/'+file)

                opt.name = file
              }
              else if(typeof(num)==typeof(10)){
                num += 1; //2
                //for문
                file = ''
                for(i=0;i<array.length-1;i++){ //length = 3
                  file += array[i]+'_' //i = 0, 1 (som, som)
                }
                file = file+num
                fs.mkdirSync(path+'/'+file)
                //opt.name = file
                opt.name = file
              }else{
                file = file+'_'+1//som_som_1
                fs.mkdirSync(path+'/'+file)
                //opt.name = file
                opt.name = file
              }
              break;
            }else if(array.length==1){
              file = array[0]+'_'+1
              fs.mkdirSync(path+'/'+file)

              opt.name = file
            }
            break;
          }catch(err){
            continue;
          }
        }
    }

    let benchmarkNameInfo = chalk.magenta('benchmark Name')
    let benchmarkNameLine = `${benchmarkNameInfo} : ${opt.name}`
    console.log(benchmarkNameLine);

    try{
      exec(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
    }catch (err) {
      if (err.code === 'ENOENT') {
        // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
        // console.log(err);
      }
    }
  }

  function isNumber(s) { // 입력이 숫자인지 확인해주는 함수
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
  }

  function checkTimewindow(opt){
    let timewindowInfo = chalk.magenta('timewindow')
    if(opt.timewindow == null) { // 값이 없으면 default
      opt.timewindow = 1
      timewindowLine = `${timewindowInfo} : ${opt.timewindow} (sec)`
      timewindow = `${opt.timewindow}`*Math.pow(10,3)
      console.log(timewindowLine)
    }else { // 값이 있으면 숫자인지 확인
      if(isNumber(opt.timewindow)){
        timewindowLine = `${timewindowInfo} : ${opt.timewindow} (sec)`
        timewindow = `${opt.timewindow}`*Math.pow(10,3)
        console.log(timewindowLine)
      }else{
        timewindowLine = `${error} ${timewindowInfo} : enter timewindow as number type.`
        console.log(timewindowLine)
      }
    }
  }

  function checkThreads(opt){
    let threadsInfo = chalk.magenta('threads')
    if(opt.threads == null) { // 값이 없으면 default
      opt.threads = 1
      threadLine = `${threadsInfo} : ${opt.threads}`
      console.log(threadLine)
    }else { // 값이 있으면 숫자인지 확인
      if(isNumber(opt.threads)){
        threadLine = `${threadsInfo} : ${opt.threads}`
        console.log(threadLine)
      }else{
        threadLine = `${error} ${threadsInfo} : enter threads as number type.`
        console.log(threadLine)
      }
    }
  }
