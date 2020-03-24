const program = require('commander')
const property = require('../../propertiesReader.js')
const exec =  require('child_process').exec
const wlfile_dir = property.get_server_file_dir()
const ycsb_dir = property.get_server_ycsb_dir()
const nodes_IP = property.get_nodes_IP()
const ycsb_exporter = property.get_ycsb_exporter()
const ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()
const ycsb_threadcount = property.get_ycsb_threadcount()
const ycsb_timewindow = property.get_ycsb_timewindow()
const cassandra_tracing_option = property.get_cassandra_tracing_option()
const fs = require('fs')
const execSync = require('child_process').execSync
const chalk = require('chalk')
const info = chalk.bold.green('[INFO]')
const error = chalk.red('ERR!')
let dbtypeLine = ''
let runtypeLine = ''
let wlfileLine = ''
let loadsizeLine = ''
let loadsizeCmd = ''
let cassandraTracingLine = ''
let cassandraTracingCmd = ''


module.exports.ycsb = (opt) => {
  let dbtypeInfo = chalk.magenta('dbtype')
  let dbtypeLine = `${dbtypeInfo} : ${opt.dbtype}`
  if(opt.dbtype == 'cassandra')
    opt.dbtype = 'cassandra-cql'
  console.log(dbtypeLine);

  checkRuntype(opt.runtype)
  checkFile(opt.wlfile)
  checkLoadsize(opt.runtype, opt.loadsize)
  benchmarkName(opt)
  checkTimewindow(opt)
  checkThreads(opt)
  checkCassandraTracing(opt.dbtype, opt.casstracing)

  switch(opt.runtype){
    case 'load' :
      ycsbLoad()
      break;
    case 'run' :
      ycsbRun()
      break;
    case 'loadrun' :
      ycsbLoadRun()
      break;
    default :
    console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
    }


    function ycsbLoad(){
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('ERR') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
        console.log(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`)
        try {
          // execSync(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} -s -t`);

          let cmd = `cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
          let loadcmd = exec(cmd)

          console.log('--------------------------------------')
          console.log(chalk.green.bold('[INFO]'),'ycsb load started.')
          console.log('--------------------------------------')

          loadcmd.stderr.on('data', function(data) {
            console.log(data)
          })

          loadcmd.on('exit', function(code){
            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'),'ycsb load completed.')
            console.log('--------------------------------------')
          })

        } catch (err) {
            err.stdout;
            err.stderr;
            err.pid;
            err.signal;
            err.status;
            // etc
        }
      }
    }

    function ycsbRun(){
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('err') != -1)||(cassandraTracingLine.indexOf('err') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
          console.log(`cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`)
          try {
            let cmd = `cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
            let runcmd = exec(cmd)

            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'),'ycsb run started.')
            console.log('--------------------------------------')

            runcmd.stderr.on('data', function(data) {
              console.log(data)
            })

            runcmd.on('exit', function(code){
              console.log('--------------------------------------')
              console.log(chalk.green.bold('[INFO]'),'ycsb run completed.')
              console.log('--------------------------------------')
            })

          } catch (err) {
            err.stdout;
            err.stderr;
            err.pid;
            err.signal;
            err.status;
            // etc
        }
      }
    }


    function ycsbLoadRun(){
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('ERR') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
        console.log(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`);
        try {
          let cmd = `cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
          let loadcmd = exec(cmd)

          console.log('--------------------------------------')
          console.log(chalk.green.bold('[INFO]'),'ycsb load started.')
          console.log('--------------------------------------')

          loadcmd.stderr.on('data', function(data) {
            console.log(data)
          })

          loadcmd.on('exit', function(code){
            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'),'ycsb load completed.')
            console.log('--------------------------------------')

            ycsbRun()
          })

        } catch (err) {
            err.stdout;
            err.stderr;
            err.pid;
            err.signal;
            err.status;
            // etc
        }
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
        let file = `${ycsb_dir}${wlfile_dir}${wlfile}`
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
    if((runtype == 'run') && (loadsize)){
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
    if (loadsize.match(/M/)){
      splitSize = loadsize.split('M');
      recordcount = splitSize[0]
      loadsizeLine = `${loadsizeInfo} : ${loadsize}`

      fieldcount = 10
      fieldlength = Math.pow(10,6)/fieldcount
      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`

    }
    else if (loadsize.match(/G/)){
      splitSize = loadsize.split('G');
      recordcount = splitSize[0]*Math.pow(10,3)
      loadsizeLine = `${loadsizeInfo} : ${loadsize}`

      fieldcount = 10
      fieldlength = Math.pow(10,6)/fieldcount
      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`

    }
    else if (loadsize.match(/T/)){
      splitSize = loadsize.split('T');
      recordcount = splitSize[0]*Math.pow(10,6)
      loadsizeLine = `${loadsizeInfo} : ${loadsize}`

      fieldcount = 10
      fieldlength = Math.pow(10,6)/fieldcount
      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizeCmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
    }
    else{
      loadsizeLine = `${error} ${loadsizeInfo} : enter load size in (###M, ###G, ###T) format.`
    }

    console.log(loadsizeLine)
  }

    function benchmarkName(opt){
      if((typeof opt.name) == 'function'){ // n 값이 없으면 디폴트값 만들어줌
        opt.name = 'ycsb_result_1'
        try{
          while(1){
            let file = `${ycsb_exportfile_dir}/${opt.name}`
            // let file = `./YCSB_RESULT/${opt.name}`

            fs.statSync(file);

            let string = opt.name
            // 마지막 sequence 자르기
            let strArray=string.split('_')
            let seqString=strArray[strArray.length-1] // 마지막 인자 => 0000 시퀀스

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
        try{
          while(1){
            let file = `${ycsb_exportfile_dir}/${opt.name}`
            // let file = `./YCSB_RESULT/${opt.name}`
            fs.statSync(file);

            let string = opt.name

            let substring = string.substring(string.length, string.length-2)
            let newstring = string.substring(0, string.length-2)

            let strArray=string.split('_')
            let seqString=strArray[strArray.length-1] // 마지막 인자 => 0000 시퀀스

            if(!(isNaN(seqString))){

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
              opt.name = `${strArray[0]}_${seqNum}` // strArray 첫번째 인자
            }else{
              opt.name = `${opt.name}_2`
            }
          }
        }catch (err) {
          if (err.code === 'ENOENT') {
            // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
            // console.log(err);
        }
      }
    }
        try{
          execSync(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
        }catch (err) {
          if (err.code === 'ENOENT') {
            // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
            // console.log(err);
        }
      }
    }

    function checkTimewindow(opt){
      let timewindowInfo = chalk.magenta('timewindow')
        if(opt.timewindow == null) {
          opt.timewindow = `${ycsb_timewindow}`
          timewindowLine = `${timewindowInfo} : ${opt.timewindow} (sec)`
          timewindow = ycsb_timewindow*Math.pow(10,3)
          console.log(timewindowLine);
        }else {
          timewindowLine = `timewindowInfo : ${opt.timewindow} (sec)`
          timewindow = `${opt.timewindow}`*Math.pow(10,3)
          console.log(timewindowLine);
        }
      }

    function checkThreads(opt){
      let threadsInfo = chalk.magenta('threads')
        if(opt.threads == null) {
          opt.threads = `${ycsb_threadcount}`
          threadLine = `${threadsInfo} : ${opt.threads}`
          console.log(threadLine);
        }else {
          threadLine = `${threadsInfo} : ${opt.threads}`
          console.log(threadLine);
        }
      }

    function checkCassandraTracing(dbtype, tracing){
      let cassandratracingInfo = chalk.magenta('cassandra tracing')
      if(!(dbtype == 'cassandra-cql')&&!(tracing == null)){
        cassandraTracingLine = `${error} ${cassandratracingInfo} : 'cassandra tracing option' is only 'cassandra' option.`
        console.log(cassandraTracingLine);
      }else if(!(dbtype == 'cassandra-cql')&&(tracing == null)){
        cassandraTracingCmd = ''
      }else{
        if(tracing == null){
          cassandraTracing = `${cassandra_tracing_option}`
          cassandraTracingLine = `${cassandratracingInfo} : off`
          cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
          console.log(cassandraTracingLine);
        }else if(tracing == 'on'){
          cassandraTracing = 'true'
          cassandraTracingLine = `${cassandratracingInfo} : ${tracing}`
          cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
          console.log(cassandraTracingLine);
        }else if(tracing == 'off'){
          cassandraTracing = 'false'
          cassandraTracingLine = `${cassandratracingInfo} : ${tracing}`
          cassandraTracingCmd = `-p cassandra.tracing=${cassandraTracing}`
          console.log(cassandraTracingLine);
        }else{
          cassandraTracingLine = `${error} ${cassandratracingInfo} : invalid option '${tracing}', (choose from 'on', 'off')`
          console.log(cassandraTracingLine);
        }
      }
    }
