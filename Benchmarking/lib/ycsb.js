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

  // function saveWLfile(opt){
  //
  //   if(opt.wlfile == `${opt.wlfile}`){
  //     console.log('파일잇음~!');
  //
  //     fs.readdir(`${ycsb_dir}/${wlfile_dir}`, function(error, filelist){
  //       console.log(filelist);
  //       let file = `${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`
  //       try{
  //         fs.statSync('file')
  //         console.log('파일 존재');
  //       }
  //       catch (err) {
  //         if(err.code === 'ENOENT'){
  //           console.log('파일 없음dd');
  //         }
  //       }
  //     })
  //
  //   //
  //   //   fs.readFile(`${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`,'utf-8',function(err,data){
  //   //   // readFile 이므로 비 동기식이며, readFile()메소드를 실행하면서 세번쨰 파라미터로 전달된 함수는 파일을 읽어들이는 작업이 끝났을때 호출이 된다. 이때, err,data 를 전달받아 오류 발생여부 확인할 수 있다.
  //   //   console.log(`${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`);
  //   //   console.log(data);
  //   //   //에러 발생시 err은 오류 데이터가 들어가고 에러 발생하지 않았을 경우 null 값이 들어간다.
  //   // });
  //   //
  //   //
  //     //
  //     // let inname = `${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`;
  //     // let outname = `${ycsb_dir}/${wlfile_dir}/${opt.wlfile}${num}`;
  //     //
  //     // // outname의 파일을 모두 삭제 하기 위함.
  //     // fs.exists(outname, function(err){
  //     //     if(err){
  //     //         fs.unlink(outname,function(err){                // link를 끊어 버리기 위해 unlink(파일 삭제를 의미한다.)
  //     //             if(err) throw err;
  //     //             console.log('기존 파일 [' + outname +']삭제함');
  //     //         })
  //     //     }
  //     // })
  //     //
  //     // // infile 과 outfile 변수에 스트림을 쓴다.
  //     // let infile = fs.createReadStream(inname,{flags:'r'});
  //     // let outfile = fs.createWriteStream(outname,{flags : 'w'});
  //     // infile.pipe(outfile); // infile 스트림과 outfile 스트림을 객체를 연결하기 위한 pipe() => 파일 내용 복사
  //     // console.log('파일 복사 [ ' + inname + '] -> ' + outname + ']');
  //
  // //     const fs = require('fs');
  // // const util = require('util');
  // //
  // // // create promisified versions of fs methods we will use
  // // const readFile = util.promisify(fs.readFile);
  // // const readdir = util.promisify(fs.readdir);
  // // const appendfile = util.promisify(fs.appendFile);
  // //
  // // async function run() {
  // //     let somephrase = await readFile('./YCSB/workloads/workloada').toString();
  // //     let files = await readdir('./YCSB/workloads/');
  // //     console.log(files);
  // //     console.log(somephrase);
  // //     for (let file of files) {
  // //         try {
  // //             let f = './YCSB/workloads/' + file;
  // //             let somenumber = await readFile(f).toString();
  // //             //intermingle the data from initial file (phrase.js) with each of the files in files dir
  // //             let output = somenumber + somephrase;
  // //             //write output to new files
  // //             let output_file = './YCSB/workloads/' + somenumber + 'js';
  // //             await appendFile(output_file, output);
  // //         } catch(e) {
  // //             console.log("error in loop", e);
  // //         }
  // //     }
  // // }
  // //
  // // run().then(() => {
  // //    // all done here
  // // }).catch(err => {
  // //    // error occurred here
  // // });
  //
  //     // const fs = require('fs');
  //     // const util = require('util');
  //     //
  //     // // create promisified versions of fs methods we will use
  //     // const readFile = util.promisify(fs.readFile);
  //     // const readdir = util.promisify(fs.readdir);
  //     // const appendfile = util.promisify(fs.appendFile);
  //     //
  //     // async function run() {
  //     //     let somephrase = await readFile(`${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`).toString();
  //     //     let files = await readdir(`/${ycsb_dir}/${wlfile_dir}`);
  //     //
  //     //     for (let file of files) {
  //     //         try {
  //     //             let f = `${ycsb_dir}/${wlfile_dir}` + file;
  //     //             let somenumber = await readFile(f).toString();
  //     //             //intermingle the data from initial file (phrase.js) with each of the files in files dir
  //     //             let output = somenumber + somephrase;
  //     //             //write output to new files
  //     //             let output_file = `${ycsb_dir}/${wlfile_dir}` + somenumber + 'js';
  //     //             await appendFile(output_file, output);
  //     //         } catch(e) {
  //     //             console.log("error in loop", e);
  //     //         }
  //     //     }
  //     // }
  //     //
  //     // run().then(() => {
  //     //   console.log(files);
  //     //    // all done here
  //     // }).catch(err => {
  //     //    // error occurred here
  //     // });
  //
  //
  //   }else {
  //     console.log('없ㅇㅁ');
  //   }
  //
  // }
  //


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
            // let file = `${ycsb_exportfile_dir}/${opt.name}/result` 이게 서버용
            let file = `./YCSB_RESULT/${opt.name}`
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
            //         let file = `${ycsb_exportfile_dir}/${opt.name}/result` 이건 서버용
            let file = `./YCSB_RESULT/${opt.name}`
            fs.statSync(file);
            opt.name = `${opt.name}_2`

        }catch (err) {
          if (err.code === 'ENOENT') {
console.log(opt.name);
        }
      }


  //
  // 밑에 거로 해야댐
  //         let file = `${ycsb_exportfile_dir}/${opt.name}/result`
        // let file = `./YCSB_RESULT/${opt.name}`
        //   try {
        //     fs.statSync(file);
        //     console.log(file);
        //     console.log('이미 존재?');
        //
        //   }catch (err) {
        //     if (err.code === 'ENOENT') {
        //   console.log(file);
        //   console.log('존재하지안흥ㅁ');
        //   }
        // }

      }
    //   execSync(`mkdir ${ycsb_exportfile_dir}/${name}`)
    }


//
//   function benchmarkName(opt){
//     if((typeof opt.name) == 'function'){ // n 값이 없으면 디폴트값 만들어줌
//       opt.name = 'ycsb_result_0001'
//
//       try{
//         // let file = `${ycsb_exportfile_dir}/${opt.name}/result`
//         let file = `./YCSB_RESULT/${opt.name}`
//           fs.statSync(file);
//           // console.log(file);
//          // console.log('지정한 이름이 이미 잇다');
//
//         let string = opt.name
//         // 마지막 sequence 자르기
//         let strArray=string.split('_')
//         let seqString=strArray[strArray.length-1] // 마지막 인자 => 0000 시퀀스
//
//         // 배열에 담기 (스트링->각 요소들을 숫자로)
//         let seqArray = new Array();
//         let newArray = new Array();
//         seqArray = seqString.split("");
//         console.log(seqArray);
//
//         let seqNum = 0
//         // 각 요소들을 더해서 숫자로 계산
//         for(let i = 0; i < seqArray.length; i++){
//           // console.log(seqArray[i]);
//           // console.log(seqArray.length);
//           newArray[i]=seqArray[i]*Math.pow(10,seqArray.length-1-i)
//           newArray[seqArray.length-1] = newArray[seqArray.length-1]+1
//           seqNum += newArray[i]
//         }
//         console.log(seqNum);
//
//         // 계산 된 숫자를 자릿수 맞춰줌
//         function pad(n, width) {
//           n = n + '';
//           return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
//         }
//         let seqNew = pad(seqNum, 4)
//         console.log(seqNew);
//
//         opt.name = `ycsb_result_${seqNew}`
//         console.log(opt.name);
//
//
//       }catch (err) {
//         if (err.code === 'ENOENT') {
//
//       console.log('존재하지안흥ㅁ');
//       }
//     }
//
//     }else { //n 값이 있으면 else if((typeof opt.name) == 'string') {
//       console.log('값이 있음');
//       console.log(opt.name);
// //
// // 밑에 거로 해야댐
// //         let file = `${ycsb_exportfile_dir}/${opt.name}/result`
//       let file = `./YCSB_RESULT/${opt.name}`
//         try {
//           fs.statSync(file);
//           console.log(file);
//           console.log('이미 존재?');
//
//         }catch (err) {
//           if (err.code === 'ENOENT') {
//         console.log(file);
//         console.log('존재하지안흥ㅁ');
//         }
//       }
//
//     }
//   //   execSync(`mkdir ${ycsb_exportfile_dir}/${name}`)
//   }

//   if(wlfile == null) {
//     wlfileLine = `[ERROR] workload file : Workload 파일 이름을 입력해주세요.`
//     console.log(wlfileLine)
//   }else{
//     let file = `${ycsb_dir}/${wlfile_dir}/${wlfile}`
//     try {
//       fs.statSync(file);
//       wlfileLine = `workload file : ${wlfile}`
//       console.log(wlfileLine)
//     }catch (err) {
//       if (err.code === 'ENOENT') {
//         // console.log(err);
//       wlfileLine = `[ERROR] workload file : '${wlfile}' 파일이 존재하지 않습니다.`
//       console.log(wlfileLine)
//     }
//   }
// }

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


  // function checkThreads(t){
  //     if( t== "") {
  //       t = ${ycsb_threadcount}
  //     }
  //   }
  // }
  //

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
//
//   function checkRuntype(){
//     if(opt.runtype == 'load' || opt.runtype == 'run' || opt.runtype == 'loadrun'){
//       const runtypeLine = `runtype : ${opt.runtype}`
//       console.log(runtypeLine);
//     }else {
//       console.log('[ERROR] runtype : (load, run, load/run) 를 입력해주세요.');
//       return 0
//     }
//   }
//
// // workload file 존재 여부 확인
//     function checkFile(){
//       if(opt.wlfile == null) {
//         const wlfileLine = `[ERROR] workload file : Workload 파일 이름을 입력해주세요.`
//         console.log(wlfileLine);
//       }else{
//         let file = `${ycsb_dir}/${wlfile_dir}/${opt.wlfile}`
//         try {
//           fs.statSync(file);
//           const wlfileLine = `workload file : ${opt.wlfile}`
//           console.log(wlfileLine);
//         }catch (err) {
//           if (err.code === 'ENOENT') {
//           const wlfileLine = `[ERROR] workload file : '${opt.wlfile}' 파일이 존재하지 않습니다.`
//           console.log(wlfileLine);
//           return 0
//         }
//       }
//     }
//   }
//
//
//   function checkLoadSize(){
//
//       if(opt.runtype == 'run'){
//         loadsizeLine = `[ERROR] load size : load size는 load 옵션 입니다.`
//         console.log(loadsizeLine);
//         return 0
//       }else{
//         size = opt.loadsize
//         loadsizeLine = `load size : ${size}`
//         console.log(loadsizeLine);
//       }
//
//
//         fieldcount = 10
//         fieldlength = Math.pow(10,6)/fieldcount
//         fieldcountLine = `-p fieldcount=${fieldcount}`
//         fieldlengthLine = `-p fieldlength=${fieldlength}`
//
//         transformLoadSize()
//
//         recordcountLine = `-p recordcount=${recordcount}`
//         loadsizecmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
//         console.log(loadsizecmd);
//       }
//
//
//       function transformLoadSize(){
//         if (size.match(/M/)){
//           splitSize = size.split('M');
//           // fieldcount = 10 (10이 default)
//           // fieldcount*fieldlength = 1M (1M가 default)
//           recordcount = splitSize[0]
//         }
//         else if (size.match(/G/)){
//           splitSize = size.split('G');
//           // loadSize = afterSize[0]*Math.pow(10, 9);
//           recordcount = splitSize[0]*Math.pow(10,3)
//         }
//         else if (size.match(/T/)){
//           splitSize = size.split('T');
//           // loadSize = afterSize[0]*Math.pow(10,12);
//           recordcount = splitSize[0]*Math.pow(10,6)
//         }
//         else{
//           loadsizeLine = `load size : load size를 (###M, ###G, ###T) 형식으로 입력해주세요.`
//           console.log(loadsizeLine);
//           return 0
//         }
//       }
//
//


//
// module.exports.ycsbRun = () => {
//   // console.log(options);
// console.log('ycsb 함수');
// // console.log(arg.dbtype);
// }

// const program2 = require('./subcommander.js')
//
// console.log('1...');
//
// const projectCommand = program2
//         .command('project')
//         .forwardSubcommands();
//
// projectCommand
//   .command('list')
//   .option('-d, --dbtype <dbtype>')
//   .action(function(options){
//           console.log(options.dbtype);
//           // console.log(options.runtype);
//
//           switch(options.dbtype){
//             case 'cassandra' :
//             console.log('cassandra');
//
//           }
//         })
//
// program2.parse(process.argv);
//
// console.log('2');
// program
//   // .command('db')
//   // .arguments('<dbtype>')
//   .option('-d, --dbtype <dbtype>')
//   .option('-r, --runtype <runtype>')
//   .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
//   .option('-w --wlfile <wlfile>', `workload file을 입력`)
//   .option('-c --config <config>', `config 파일 입력`)
//   .option('-n, --name <name>', `name을 입력`)
//   .option('-o, --output <output>', `output directory 지정`)
//   .action(function(options){
//     console.log(options.dbtype);
//     console.log(options.runtype);
// })
//    program.parse(process.argv);
//
// module.exports.ycsbRun = () => {
//
// console.log('1');
//   program
//       .command('db')
//       // .arguments('<dbtype>')
//       .option('-d, --dbtype <dbtype>')
//       .option('-r, --runtype <runtype>')
//       .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
//       .option('-w --wlfile <wlfile>', `workload file을 입력`)
//       .option('-c --config <config>', `config 파일 입력`)
//       .option('-n, --name <name>', `name을 입력`)
//       .option('-o, --output <output>', `output directory 지정`)
//       .action(function(options){
//         console.log(options.dbtype);
//         console.log(options.runtype);
//
//         switch(options.dbtype){
//           case 'cassandra' :
//           console.log('cassandra');
//
//         }
//         // console.log(opt);
//         //console.log(runtype);
//
//         // bencmhark.chooseDbtype(dbtype);
//       })
//
//   // program.parse(process.argv);
//
// }


// const program = require('commander');
//
//
//   program
//       .command('benchmark')
//       // .arguments('<dbtype>')
//       .option('-d, --dbtype <dbtype>')
//       .option('-r, --runtype <runtype>')
//       .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
//       .option('-w --wlfile <wlfile>', `workload file을 입력`)
//       .option('-c --config <config>', `config 파일 입력`)
//       .option('-n, --name <name>', `name을 입력`)
//       .option('-o, --output <output>', `output directory 지정`)
//       .action(function(options){
//         console.log(options.dbtype);
//         console.log(options.runtype);
//
//         switch(options.dbtype){
//           case 'cassandra' :
//           console.log('cassandra');
//
//         }
//         // console.log(opt);
//         //console.log(runtype);
//
//         // bencmhark.chooseDbtype(dbtype);
//       })
//
//   program.parse(process.argv);
















      //
      // const dbtypeLine = `dbtype : ${
      //   (() => {
      //     switch (opt.dbtype) {
      //       case 'cassandra':
      //         return 'cassandra'
      //       case 'arangodb':
      //         return 'arangodb'
      //       default:
      //         return '다시 입력해주세요'
      //     }
      //   })()
      //
      // }`
      // console.log(dbtypeLine);
      //
      // const loadtypeLine = `runtype : ${
      //   (() => {
      //     switch (opt.runtype) {
      //       case 'load':
      //         return 'load'
      //       case 'run':
      //         return 'run'
      //       case 'loadrun':
      //         return 'load / run'
      //       default:
      //         return '다시 입력해주세요'
      //     }
      //   })()
      //
      // }`
      // console.log(loadtypeLine);
      //
      // if(!opt.loadsize){
      //   let sizeoption = "";
      //   let size = "";
      //   let loadSize = "";
      // }else{
      //   let sizeoption = '-p insertcount='
      //   let size = opt.loadsize
      //   if (size.match(/M/)){
      //     afterSize = size.split('M');
      //     loadSize = afterSize[0]*1000000;
      //   }
      //   if (size.match(/G/)){
      //     afterSize = size.split('T');
      //     loadSize = afterSize[0]*100000000;
      //   }
      //   if (size.match(/T/)){
      //     afterSize = size.split('T');
      //     loadSize = afterSize[0]*1000000000000;
      //   }
      //   console.log(`load size : ${size}`);
      // }
      //
      //
      //
      // //
      // // try {
      // //   const execSync = require('child_process').execSync;
      // //   // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
      // //   const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} `);
      // //   console.log(`stdout: ${stdout}`);
      // // } catch (err) {
      // //     err.stdout;
      // //     err.stderr;
      // //     err.pid;
      // //     err.signal;
      // //     err.status;
      // //     // etc
      // // }
      //
      // console.log(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} ${sizeoption}${loadSize}`);
      //
      //
