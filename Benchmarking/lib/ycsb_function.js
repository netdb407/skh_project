
const exec =  require('child_process').exec
const execSync =  require('child_process').execSync
const childProcess = require("child_process");
const fs = require('fs')
const chalk = require('chalk')
let server_ycsb_dir = property.get_server_ycsb_dir()
let server_wlfile_dir = property.get_server_wlfile_dir()
let server_IP = property.get_server_IP()
let nodes_IP = property.get_nodes_IP()
let nodetool_ip = property.get_nodetool_IP();
let ip = nodes_IP.split(',')
let ycsb_exporter = property.get_ycsb_exporter()
let ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()
let IO_tracer_dir = property.get_IO_tracer_dir()
let IO_watch_dir = property.get_IO_watch_dir()
let IO_output_dir = property.get_IO_output_dir()
let node_cassandra_dir = property.get_node_cassandra_dir()
let error = chalk.red('ERR!')
let dbtypeLine = '', runtypeLine = '', wlfileLine = '', loadsizeLine = '', loadsizeCmd = '',
threadLine = '', timewindowLine = '', cassandraTracingLine = '', cassandraTracingCmd = ''



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


module.exports.DropAndCreate = (ip, nodetool_ip, node_cassandra_dir) => {

    async function DropAndCreate() {
      // i = '203.255.92.193'
      cmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh ${nodetool_ip}`
      createCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/createKeyspace.cql ${nodetool_ip}`
      dropCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/dropKeyspace.cql ${nodetool_ip}`
      checkCmd = `ssh root@${nodetool_ip} ${node_cassandra_dir}/bin/cqlsh -f ${node_cassandra_dir}/checkTable.cql ${nodetool_ip}`
    try {
      const passwdContent = await execute(dropCmd);
      // console.log(passwdContent);
    } catch (error) {
      // console.error(error);
    }
    try {
      const shadowContent = await execute(createCmd);
      // console.log(shadowContent);
    } catch (error) {
      // console.error(error);
    }
  }
}


module.exports.killIOtracer = (ip, nodetool_ip, node_cassandra_dir, opt) => {
    async function killIOtracer(){
      try{
        const stdout = await execute(`ssh root@${i} ${IO_tracer_dir}/kill.sh`)
        // console.log(`stdout: ${stdout}`);
      }catch(err){
        console.log(err);
    }

      // console.log('parse start');
      try{
        const stdout2 = await execute(`ssh root@${i} ${IO_tracer_dir}/bin/ioparser ${IO_tracer_dir}/output ${IO_output_dir}`)
        // console.log(`stdout: ${stdout2}`);
        // console.log('parse end');

        await execute(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}`)
        await execute(`mv ${ycsb_exportfile_dir}/${opt.name}/output ${ycsb_exportfile_dir}/${opt.name}/${i}_${runtype}_output`)
        // console.log('result end');
        // console.log(`stdout: ${std`out3}`);

      }catch(err){
        console.log(err);
      }
    }
}

module.exports.checkiotracer = (iotracer) => {
  let iotracerInfo = chalk.magenta('iotracer')
  if(iotracer==true){
    let iotracerLine = `${iotracerInfo} : ${iotracer}`
    console.log(iotracerLine)

  }else{
    iotracer = 'false'
    let iotracerLine = `${iotracerInfo} : ${iotracer}`
    console.log(iotracerLine)
  }
}

module.exports.checkCassandra = (dbtype, casstracing) => {
  let cassandratracingInfo = chalk.magenta('cassandra tracing')
  let dbtypeInfo = chalk.magenta('dbtype')
  if(dbtype == 'cassandra'){
    let dbtypeLine = `${dbtypeInfo} : ${dbtype}`
    opt.dbtype = 'cassandra-cql'
    console.log(dbtypeLine)

    if(casstracing==true){
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
    let dbtypeLine = `${dbtypeInfo} : ${dbtype}`
    console.log(dbtypeLine);

    if(casstracing==true){
      cassandraTracingLine = `${error} ${cassandratracingInfo} : 'cassandra tracing option' is only 'cassandra' option.`
      console.log(cassandraTracingLine)
    }else{
      cassandraTracingLine = ''
    }

  }
}


module.exports.getIOresults = (benchmarkname, runtype) => {
    ip.forEach((i) => {
      console.log('--------------------------------------')
      console.log(chalk.green.bold('[INFO]'), 'iotracer kill : ', chalk.blue.bold(i));
      console.log('--------------------------------------')

      killIOtracer()
      try{
        const stdout = await execute(`ssh root@${i} ${IO_tracer_dir}/kill.sh`)
        // console.log(`stdout: ${stdout}`);
      }catch(err){

      }

      // console.log('parse start');
      try{
        const stdout2 = await execute(`ssh root@${i} ${IO_tracer_dir}/bin/ioparser ${IO_tracer_dir}/output ${IO_output_dir}`)
        // console.log(`stdout: ${stdout2}`);
        // console.log('parse end');

        await execute(`ssh root@${i} ${IO_tracer_dir}/result.sh ${IO_output_dir} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}`)
        await execute(`mv ${ycsb_exportfile_dir}/${benchmarkname}/output ${ycsb_exportfile_dir}/${benchmarkname}/${i}_${runtype}_output`)
        // console.log('result end');
        // console.log(`stdout: ${std`out3}`);

      }catch(err){
        console.log(err);
      }

  })
}





    let Promise = require('promise');
    const runYCSB = (opt, runtype) => new Promise( resolve => {

      if(opt.iotracer == true){
        let ip;
        ip = property.get_nodes_IP().split(',');
        ip.forEach((i) => {
          console.log('--------------------------------------')
          console.log(chalk.green.bold('[INFO]'), 'iotracer run : ', chalk.blue.bold(i));
          console.log('--------------------------------------')
          // exec(`ssh root@${i} ${IO_tracer_dir} -d ${IO_watch_dir}`)
          try{
            const stdout = execSync(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -D -d ${IO_watch_dir}`)
            // console.log(`stdout: ${stdout}`);
          }catch (err){
            // console.log(err);
            // console.log(err.stdout)
            // console.log(err.stderr)
          }
        })
      }

      let runtype1 = opt.runtype.substring(0,4)
      let runtype2 = opt.runtype.substring(4,7)

      if((dbtypeLine.indexOf('ERR') != -1)||(runtypeLine.indexOf('ERR') != -1)||(wlfileLine.indexOf('ERR') != -1)||(loadsizeLine.indexOf('ERR') != -1)||(threadLine.indexOf('ERR') != -1)||(timewindowLine.indexOf('ERR') != -1)||(cassandraTracingLine.indexOf('ERR') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.')

        if(opt.iotracer == true){
          let ip;
          ip = property.get_nodes_IP().split(',');

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
          try {
            console.log('cqlsh ㅅㅈ');
            if(opt.dbtype == cassandra){
              cqlsh()
            }
            console.log('cqlsh 끄ㅜㅅ');

            let cmd = `cd YCSB && \
            ./bin/ycsb ${runtype} ${opt.dbtype} -P ${server_wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizeCmd} \
            -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_${runtype}_result \
            -p timeseries.granularity=${timewindow} -threads ${opt.threads} ${cassandraTracingCmd} -s`
            let cmdexec = exec(cmd)

            console.log('--------------------------------------')
            console.log(chalk.green.bold('[INFO]'),`ycsb ${runtype} started.`)
            console.log('--------------------------------------')

            cmdexec.stderr.on('data', function(data) {
              console.log(data)
            })

            cmdexec.on('exit', function(code){
              console.log('--------------------------------------')
              console.log(chalk.green.bold('[INFO]'),`ycsb ${runtype} completed.`)
              console.log('--------------------------------------')
              // console.log('start');
              if(opt.iotracer == true){
                getIOresults(opt, runtype)
                }

              // console.log('end');
              resolve(opt, runtype2)
            })

          } catch (err) {

            // etc
          }
        }
    })



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