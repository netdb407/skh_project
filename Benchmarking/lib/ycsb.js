const program = require('commander')
const property = require('../../propertiesReader.js')
const exec =  require('child_process').exec
const fs = require('fs')
const chalk = require('chalk')
const java_exporter = property.get_java_exporter()
const maven_exporter = property.get_maven_exporter()
const path_exporter = property.get_path_exporter()
const home_exporter = property.get_home_exporter()
const wlfile_dir = property.get_server_file_dir()
const server_ycsb_dir = property.get_server_ycsb_dir()
const nodes_IP = property.get_nodes_IP()
const ycsb_exporter = property.get_ycsb_exporter()
const ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()

const info = chalk.bold.green('[INFO]')
const error = chalk.red('ERR!')
let dbtypeLine = '', runtypeLine = '', wlfileLine = '', loadsizeLine = '', loadsizeCmd = '', threadLine = '', timewindowLine = '', cassandraTracingLine = '', cassandraTracingCmd = ''

module.exports.ycsb = (opt) => {
  exec(`mkdir YCSB_RESULT`)

  checkCassandra(opt)
  checkRuntype(opt.runtype)
  checkFile(opt.wlfile)
  checkLoadsize(opt.runtype, opt.loadsize)
  benchmarkName(opt)
  checkTimewindow(opt)
  checkThreads(opt)

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
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('ERR') != -1)||(threadLine.indexOf('ERR') != -1)||(timewindowLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('ERR') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
        console.log(`${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`)
        try {
          // execSync(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} -s -t`);

          //let cmd = `./sk_bench_tool cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
          // let cmd = `export JAVA_HOME=/root/skh_project/package/java && export MAVEN_HOME=/root/skh_project/package/maven && PATH=$PATH:$MAVEN_HOME/bin:$JAVA_HOME/bin && cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
          let cmd = `${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
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
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('err') != -1)||(threadLine.indexOf('ERR') != -1)||(timewindowLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('err') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
          console.log(`${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`)
          try {
            let cmd = `${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
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
      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('ERR') != -1)||(threadLine.indexOf('ERR') != -1)||(timewindowLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('ERR') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')
      }else{
        console.log(`${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s -t`);
        try {
          let cmd = `${java_exporter} && ${maven_exporter} && ${path_exporter} && cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
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
        let file = `${server_ycsb_dir}${wlfile_dir}${wlfile}`
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
      try{
        while(1){
          let file = `${ycsb_exportfile_dir}/${opt.name}`
          fs.statSync(file);
          let string = opt.name

          let substring = string.substring(string.length, string.length-2)
          let newstring = string.substring(0, string.length-2)

          let strArray=string.split('_')
          let seqString=strArray[strArray.length-1] // 마지막 인자

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

        }
      }
    }
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
          console.log(timewindowLine);
        }else { // 값이 있으면 숫자인지 확인
          if(isNumber(opt.timewindow)){
            timewindowLine = `${timewindowInfo} : ${opt.timewindow} (sec)`
            timewindow = `${opt.timewindow}`*Math.pow(10,3)
            console.log(timewindowLine);
          }else{
            timewindowLine = `${error} ${timewindowInfo} : enter timewindow as number type.`
            console.log(timewindowLine);
          }
        }
      }

    function checkThreads(opt){
      let threadsInfo = chalk.magenta('threads')
        if(opt.threads == null) { // 값이 없으면 default
          opt.threads = 1
          threadLine = `${threadsInfo} : ${opt.threads}`
          console.log(threadLine);
        }else { // 값이 있으면 숫자인지 확인
          if(isNumber(opt.threads)){
            threadLine = `${threadsInfo} : ${opt.threads}`
            console.log(threadLine);
          }else{
            threadLine = `${error} ${threadsInfo} : enter threads as number type.`
            console.log(threadLine);
          }
        }
      }
