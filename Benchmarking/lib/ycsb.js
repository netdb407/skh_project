const program = require('commander');
const property = require('../../propertiesReader.js');
const wlfileDir = property.get_server_wlfile_dir();
const ycsbDir = property.get_server_ycsb_dir();
const nodeIP = property.get_nodeIP();
const fs = require('fs');
const execSync = require('child_process').execSync;

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
        // console.log(` ${ycsbDir}/bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
        console.log(` cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
          // console.log(` ${ycsbDir}/bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile}  ${loadsizecmd}`);
        try {
          // execSync(` ${ycsbDir}/bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
          // execSync(` cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
          execSync(` cd YCSB && ./bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);

            // execSync(` ${ycsbDir}/bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p ${loadsizecmd}`);
        } catch (err) {
            // console.log(err.stdout)
            // console.log(err.stderr)
            // console.log(err.pid)
            // console.log(err.signal)
            // console.log(err.status)
            // etc
        }
      }
    }

    function ycsbRun(){
      if((dbtypeLine.indexOf('ERROR') != -1)||(runtypeLine.indexOf('ERROR') != -1)||(wlfileLine.indexOf('ERROR') != -1)||(loadsizeLine.indexOf('ERROR') != -1)){
        console.log('[ERROR] 오류가 있어서 실행할 수 없습니다.');
      }else{
        // console.log(` ${ycsbDir}/bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
        console.log(`cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
        try {
          // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
          console.log('실행이 되나?');
          // execSync(`cd YCSB && ./bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
          execSync(`cd ./YCSB`);
          execSync(`mkdir TEST123`);
          console.log('실행이 됏다..');

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

  function saveWLfile(opt){

    if(opt.wlfile == `${opt.wlfile}`){
      console.log('파일잇음~!');


    //   fs.readFile(`${ycsbDir}/${wlfileDir}/${opt.wlfile}`,'utf-8',function(err,data){
    //   // readFile 이므로 비 동기식이며, readFile()메소드를 실행하면서 세번쨰 파라미터로 전달된 함수는 파일을 읽어들이는 작업이 끝났을때 호출이 된다. 이때, err,data 를 전달받아 오류 발생여부 확인할 수 있다.
    //   console.log(`${ycsbDir}/${wlfileDir}/${opt.wlfile}`);
    //   console.log(data);
    //   //에러 발생시 err은 오류 데이터가 들어가고 에러 발생하지 않았을 경우 null 값이 들어간다.
    // });
    //




      //
      // let inname = `${ycsbDir}/${wlfileDir}/${opt.wlfile}`;
      // let outname = `${ycsbDir}/${wlfileDir}/${opt.wlfile}${num}`;
      //
      // // outname의 파일을 모두 삭제 하기 위함.
      // fs.exists(outname, function(err){
      //     if(err){
      //         fs.unlink(outname,function(err){                // link를 끊어 버리기 위해 unlink(파일 삭제를 의미한다.)
      //             if(err) throw err;
      //             console.log('기존 파일 [' + outname +']삭제함');
      //         })
      //     }
      // })
      //
      // // infile 과 outfile 변수에 스트림을 쓴다.
      // let infile = fs.createReadStream(inname,{flags:'r'});
      // let outfile = fs.createWriteStream(outname,{flags : 'w'});
      // infile.pipe(outfile); // infile 스트림과 outfile 스트림을 객체를 연결하기 위한 pipe() => 파일 내용 복사
      // console.log('파일 복사 [ ' + inname + '] -> ' + outname + ']');




      const fs = require('fs');
      const util = require('util');

      // create promisified versions of fs methods we will use
      const readFile = util.promisify(fs.readFile);
      const readdir = util.promisify(fs.readdir);
      const appendfile = util.promisify(fs.appendFile);

      async function run() {
          let somephrase = await readFile(`${ycsbDir}/${wlfileDir}/${opt.wlfile}`).toString();
          let files = await readdir(`/${ycsbDir}/${wlfileDir}`);
          for (let file of files) {
              try {
                  let f = `${ycsbDir}/${wlfileDir}` + file;
                  let somenumber = await readFile(f).toString();
                  //intermingle the data from initial file (phrase.js) with each of the files in files dir
                  let output = somenumber + somephrase;
                  //write output to new files
                  let output_file = `${ycsbDir}/${wlfileDir}` + somenumber + 'js';
                  await appendFile(output_file, output);
              } catch(e) {
                  console.log("error in loop", e);
              }
          }
      }

      run().then(() => {
         // all done here
      }).catch(err => {
         // error occurred here
      });



    }else {
      console.log('없ㅇㅁ');
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
        let file = `${ycsbDir}/${wlfileDir}/${wlfile}`
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
//         let file = `${ycsbDir}/${wlfileDir}/${opt.wlfile}`
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
