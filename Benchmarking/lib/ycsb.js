const program = require('commander')
const property = require('../../propertiesReader.js')
const wlfile_dir = property.get_server_wlfile_dir()
const ycsb_dir = property.get_server_ycsb_dir()
const nodes_IP = property.get_nodes_IP()
const ycsb_exporter = property.get_ycsb_exporter()
const ycsb_exportfile_dir = property.get_ycsb_exportfile_dir()
const ycsb_threadcount = property.get_ycsb_threadcount()
const ycsb_timewindow = property.get_ycsb_timewindow()
const fs = require('fs')
const execSync = require('child_process').execSync
const chalk = require('chalk');


const bounds = require('binary-search-bounds');
const dedent = require('dedent');
const path = require('path');
const stats = require('stats-lite');

const Workload = require('./workload');

let dbtypeLine = ''
let runtypeLine = ''
let wlfileLine = ''
let loadsizeLine = ''
let loadsizecmd = ''

module.exports.ycsb = (opt) => {
// console.log(ycsb_exporter);
  const dbtypeLine = `dbtype : ${opt.dbtype}`
  if(opt.dbtype == 'cassandra')
    opt.dbtype = 'cassandra-cql'
  console.log(dbtypeLine);

  checkRuntype(opt.runtype)
  checkFile(opt.wlfile)
  checkLoadsize(opt.runtype, opt.loadsize)
  // saveWLfile(opt)
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
      ycsbLoad()
      ycsbRun()
      break;
    default :
    console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.');
    }


    // printMetrics(Workload)

    function ycsbLoad(){
      if((dbtypeLine.indexOf('error') != -1)||(runtypeLine.indexOf('error') != -1)||(wlfileLine.indexOf('error') != -1)||(loadsizeLine.indexOf('error') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.');
      }else{

        // console.log(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} -s -t`);

        try {

          execSync(` cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_load_result -p timeseries.granularity=${timewindow} -threads ${opt.threads} -s -t`);


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
      if((dbtypeLine.indexOf('error') != -1)||(runtypeLine.indexOf('error') != -1)||(wlfileLine.indexOf('error') != -1)||(loadsizeLine.indexOf('error') != -1)){
        console.log(chalk.red.bold('[ERROR]'),'There was an error and could not be executed.');
      }else{

          // console.log(`cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -s -t`);
          try {

            execSync(` cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_run_result -s -t`);


          }  catch (err) {
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
    if(runtype == 'load' || runtype == 'run' || runtype == 'loadrun'){
      runtypeLine = `runtype : ${runtype}`
      console.log(runtypeLine)
    }else {
      runtypeLine = `error : invalid choice ${runtype}, (choose from 'load', 'run', 'loadrun')`
      console.log(runtypeLine)
    }
  }

  function checkFile(wlfile){
      if(wlfile == null) {
        wlfileLine = `error : enter workload filename or type(news, contents, facebook, log, recommendation ..)`
        console.log(wlfileLine)
      }else{
        let file = `${ycsb_dir}/${wlfile_dir}/${wlfile}`
        try {
          fs.statSync(file);
          wlfileLine = `workload file : ${wlfile}`
          console.log(wlfileLine)
        }catch (err) {
          if (err.code === 'ENOENT') {
            // console.log(err);
          wlfileLine = `error : invalid workload file : workloads/${wlfile} (No such file or type)`
          console.log(wlfileLine)
        }
      }
    }
  }

  function checkLoadsize(runtype, loadsize){
    if((runtype == 'run') && (loadsize)){
      loadsizeLine = `error : [load size] is 'load', 'loadrun' option`
      console.log(loadsizeLine);
    }else if ((runtype == 'load'|| runtype == 'loadrun') && (loadsize)){ // load에 대한 loadsize 옵션

      // 10M -> 10
      transformLoadsize(loadsize)

      fieldcount = 10
      fieldlength = Math.pow(10,6)/fieldcount
      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`
      recordcountLine = `-p recordcount=${recordcount}`

      loadsizecmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
      // console.log(loadsizecmd);
    }
  }

  function transformLoadsize(loadsize){
    if (loadsize.match(/M/)){
      splitSize = loadsize.split('M');
      recordcount = splitSize[0]
      loadsizeLine = `load size : ${loadsize}`
    }
    else if (loadsize.match(/G/)){
      splitSize = loadsize.split('G');
      recordcount = splitSize[0]*Math.pow(10,3)
      loadsizeLine = `load size : ${loadsize}`
    }
    else if (loadsize.match(/T/)){
      splitSize = loadsize.split('T');
      recordcount = splitSize[0]*Math.pow(10,6)
      loadsizeLine = `load size : ${loadsize}`
    }
    else{
      loadsizeLine = `error : enter load size in (###M, ###G, ###T) format`
    }
    console.log(loadsizeLine);
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

        }
      }
    }

        try{
          execSync(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
        }catch (err) {
          if (err.code === 'ENOENT') {
            // let file = `${ycsb_exportfile_dir}/${opt.name}`
            // // let file = `./YCSB_RESULT/${opt.name}`
            // fs.statSync(file);
            // opt.name = `${opt.name}_2`
            // execSync(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
        }
      }
    }


    function checkTimewindow(opt){
        if(opt.timeindow == null) {
          opt.timeindow = `${ycsb_timewindow}`
          timewindowLine = `time window : ${opt.timeindow} (sec)`
          timewindow=ycsb_timewindow*Math.pow(10,3)
          // console.log(timewindow);
          console.log(timewindowLine);
        }else {
          opt.timeindow = `${opt.timewindow}`
          timewindowLine = `time window : ${opt.timeindow} (sec)`
          timewindow= `${opt.timewindow}`*Math.pow(10,3)
          // console.log(timewindow);
          console.log(timewindowLine);
        }
      }

    function checkThreads(opt){
        if(opt.threads == null) {
          opt.threads = `${ycsb_threadcount}`
          threadLine = `threads : ${opt.threads}`
          console.log(threadLine);
        }else {
          threadLine = `threads : ${opt.threads}`
          console.log(threadLine);
        }
      }
      //
      // function formatOptions(argv) {
      //   const options = argv.workload.concat(argv.parameter, [
      //     ['numBucket', argv.num_bucket],
      //   ]);
      //
      //   return new Map(options);
      // }
      //
      // function parseKeyValuePairs(pairs) {
      //   return pairs.map(pair => pair.split('='));
      // }
      //
      // function parseWorkloadFile(filePath) {
      //   const contents = fs.readFileSync(path.resolve(filePath));
      //   return parseKeyValuePairs(contents.toString().split('\n'));
      // }
      //
      //
      //
      // function printMetrics(workload) {
      //   const numBucket = workload.options.get('numBucket');
      //   let totalOps = 0;
      //
      //   workload.operations.forEach(operation => {
      //     totalOps += workload.latencies[operation].length;
      //   });
      //
      //   console.log(
      //     dedent`[OVERALL], RunTime(ms), ${workload.duration}
      //     [OVERALL], Throughput(ops/sec), ${totalOps / (workload.duration / 1000)}`
      //   );
      //
      //   workload.operations.forEach(operation => {
      //     const lats = workload.latencies[operation].sort((a, b) => a - b);
      //     const ops = lats.length;
      //     const opName = `[${operation.toUpperCase()}]`;
      //
      //     console.log(
      //       dedent`${opName}, Operations, ${ops}
      //       ${opName}, AverageLatency(us), ${stats.mean(lats)}
      //       ${opName}, LatencyVariance(us), ${stats.stdev(lats)}
      //       ${opName}, MinLatency(us), ${lats[0]}
      //       ${opName}, MaxLatency(us), ${lats[lats.length - 1]}
      //       ${opName}, 95thPercentileLatency(us), ${stats.percentile(lats, 0.95)}
      //       ${opName}, 99thPercentileLatency(us), ${stats.percentile(lats, 0.99)}
      //       ${opName}, 99.9thPercentileLatency(us), ${stats.percentile(lats, 0.999)}
      //       ${opName}, Return=OK, ${ops}`
      //     );
      //
      //     for (let i = 0; i < numBucket; i++) {
      //       const hi = bounds.lt(lats, i + 1);
      //       const lo = bounds.le(lats, i);
      //       console.log(`${opName}, ${i}, ${hi - lo}`);
      //     }
      //
      //     const lo = bounds.le(lats, numBucket);
      //     console.log(`${opName}, ${numBucket}, ${ops - lo}`);
      //   });
      // }
