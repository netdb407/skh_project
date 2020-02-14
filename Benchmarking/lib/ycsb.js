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


let dbtypeLine = ''
let runtypeLine = ''
let wlfileLine = ''
let loadsizeLine = ''
let loadsizecmd = ''

module.exports.ycsb = (opt) => {

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
    console.log('[ERROR] 오류가 있어서 실행할 수 없습니다.');
    }

    function ycsbLoad(){
      if((dbtypeLine.indexOf('ERROR') != -1)||(runtypeLine.indexOf('ERROR') != -1)||(wlfileLine.indexOf('ERROR') != -1)||(loadsizeLine.indexOf('ERROR') != -1)){
        console.log('[ERROR] 오류가 있어서 실행할 수 없습니다.');
      }else{

        console.log(`cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_result -threads ${opt.threads}}`);

        try {

          execSync(` cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_result`);


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
      if((dbtypeLine.indexOf('ERROR') != -1)||(runtypeLine.indexOf('ERROR') != -1)||(wlfileLine.indexOf('ERROR') != -1)||(loadsizeLine.indexOf('ERROR') != -1)){
        console.log('[ERROR] 오류가 있어서 실행할 수 없습니다.');
      }else{

          console.log(`cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_result`);
          try {

            execSync(` cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfile_dir}/${opt.wlfile} -p hosts=${nodes_IP} ${loadsizecmd} -p export=${ycsb_exporter} -p exportfile=${ycsb_exportfile_dir}/${opt.name}/bm_result`);


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
      runtypeLine = `[ERROR] runtype : (load, run, load/run) 를 입력해주세요.`
      console.log(runtypeLine)
    }
  }

  function checkFile(wlfile){
      if(wlfile == null) {
        wlfileLine = `[ERROR] workload file : Workload 파일 이름을 입력해주세요.`
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
          wlfileLine = `[ERROR] workload file : '${wlfile}' 파일이 존재하지 않습니다.`
          console.log(wlfileLine)
        }
      }
    }
  }

  function checkLoadsize(runtype, loadsize){
    if((runtype == 'run') && (loadsize)){
      loadsizeLine = `[ERROR] load size : load size는 load 옵션 입니다.`
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
      loadsizeLine = `[ERROR] load size : load size를 (###M, ###G, ###T) 형식으로 입력해주세요.`
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
            opt.name = `${opt.name}_2`
          }

        }catch (err) {
          if (err.code === 'ENOENT') {
            console.log(opt.name);
        }
      }

      }

      try{

        execSync(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
      }catch (err) {
        if (err.code === 'ENOENT') {
          let file = `${ycsb_exportfile_dir}/${opt.name}`
          // let file = `./YCSB_RESULT/${opt.name}`
          fs.statSync(file);
          opt.name = `${opt.name}_2`
          execSync(`mkdir ${ycsb_exportfile_dir}/${opt.name}`)
      }
    }

    }


  function checkTimewindow(opt){
      if(opt.timeindow == null) {
        opt.timeindow = `${ycsb_timewindow}`
        timewindowLine = `time window : ${opt.timeindow}`
        console.log(timewindowLine);
      }else {
        opt.timeindow = `${opt.timewindow}`
        timewindowLine = `time window : ${opt.timeindow}`
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
