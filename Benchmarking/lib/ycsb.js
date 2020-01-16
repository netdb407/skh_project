const program = require('commander')
const property = require('../../propertiesReader.js')
const wlfileDir = property.get_server_wlfile_dir()
const ycsbDir = property.get_server_ycsb_dir()
const nodeIP = property.get_nodes()
const fs = require('fs')
// var loadsizeLine = ""
// var loadsizecmd = ""
// var recordcount = ""



module.exports.ycsb = (opt) => {

  const dbtypeLine = `dbtype : ${opt.dbtype}`
  console.log(dbtypeLine);

  checkRuntype(opt)
  checkFile(opt)
  checkLoadsize(opt)

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
        console.log(`bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
        try {
          const execSync = require('child_process').execSync;
          // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
          const stdout = execSync(`bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
          console.log(`stdout: ${stdout}`);
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
        console.log(`bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);

        // try {
        //   const execSync = require('child_process').execSync;
        //   // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
        //   const stdout = execSync(`bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadsizecmd}`);
        //   console.log(`stdout: ${stdout}`);
        // } catch (err) {
        //     err.stdout;
        //     err.stderr;
        //     err.pid;
        //     err.signal;
        //     err.status;
        //     // etc
        // }
      }
    }
  }





  function checkRuntype(opt){
    if(opt.runtype == 'load' || opt.runtype == 'run' || opt.runtype == 'loadrun'){
      runtypeLine = `runtype : ${opt.runtype}`
      console.log(runtypeLine)
    }else {
      runtypeLine = `[ERROR] runtype : (load, run, load/run) 를 입력해주세요.`
      console.log(runtypeLine)
    }
  }

  function checkFile(opt){
      if(opt.wlfile == null) {
        wlfileLine = `[ERROR] workload file : Workload 파일 이름을 입력해주세요.`
        console.log(wlfileLine)
      }else{
        var file = `${ycsbDir}/${wlfileDir}/${opt.wlfile}`
        try {
          fs.statSync(file);
          wlfileLine = `workload file : ${opt.wlfile}`
          console.log(wlfileLine)
        }catch (err) {
          if (err.code === 'ENOENT') {
          wlfileLine = `[ERROR] workload file : '${opt.wlfile}' 파일이 존재하지 않습니다.`
          console.log(wlfileLine)
        }
      }
    }
  }

  function checkLoadsize(opt){
    if((opt.runtype == 'run') && (opt.loadsize)){
      loadsizeLine = `[ERROR] load size : load size는 load 옵션 입니다.`
      console.log(loadsizeLine);
    }else if ((opt.runtype == 'load'|| opt.runtype == 'loadrun') && (opt.loadsize)){ // load에 대한 loadsize 옵션

      // 10M -> 10
      transformLoadsize(opt)

      size = opt.loadsize
      fieldcount = 10
      fieldlength = Math.pow(10,6)/fieldcount
      fieldcountLine = `-p fieldcount=${fieldcount}`
      fieldlengthLine = `-p fieldlength=${fieldlength}`

      recordcountLine = `-p recordcount=${recordcount}`
      loadsizecmd = `${fieldcountLine} ${fieldlengthLine} ${recordcountLine}`
      // console.log(loadsizecmd);
    }
  }

  function transformLoadsize(opt){
    size = opt.loadsize
    if (size.match(/M/)){
      splitSize = size.split('M');
      recordcount = splitSize[0]
      loadsizeLine = `load size : ${opt.loadsize}`
    }
    else if (size.match(/G/)){
      splitSize = size.split('G');
      recordcount = splitSize[0]*Math.pow(10,3)
      loadsizeLine = `load size : ${opt.loadsize}`
    }
    else if (size.match(/T/)){
      splitSize = size.split('T');
      recordcount = splitSize[0]*Math.pow(10,6)
      loadsizeLine = `load size : ${opt.loadsize}`
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
//         var file = `${ycsbDir}/${wlfileDir}/${opt.wlfile}`
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
      //   var sizeoption = "";
      //   var size = "";
      //   var loadSize = "";
      // }else{
      //   var sizeoption = '-p insertcount='
      //   var size = opt.loadsize
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
