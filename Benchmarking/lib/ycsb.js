const program = require('commander')
const property = require('../../propertiesReader.js')
const wlfileDir = property.get_server_wlfile_dir()
const nodeIP = property.get_nodes()

module.exports.ycsbRun
module.exports.ycsbLoad

module.exports.ycsb = (opt) => {
  // console.log(opt);

  const dbtypeLine = `dbtype : ${opt.dbtype}`
  console.log(dbtypeLine);

  if(opt.runtype == 'load' || opt.runtype == 'run' || opt.runtype == 'loadrun'){
    const runtypeLine = `runtype : ${opt.runtype}`
    console.log(runtypeLine);
  }else {
    console.log('runtype : (load, run, load/run) 를 입력해주세요.');
  }


  if(opt.runtype == 'load'){
    ycsbLoad()
  }else if(opt.runtype == 'loadrun'){
    ycsbLoad()
    ycsbRun()
  }else{
    ycsbRun()
  }

  function ycsbLoad(){
// insertstart, insertcount : record 갯수 계산하기
//
    if(!opt.loadsize){
      var size = "";
      var loadSize = "";
      var loadLine = "";
    }else{
      var size = opt.loadsize
      if (size.match(/M/)){
        afterSize = size.split('M');
        loadSize = afterSize[0]*Math.pow(10, 6);
      }
      if (size.match(/G/)){
        afterSize = size.split('T');
        loadSize = afterSize[0]*Math.pow(10, 9);
      }
      if (size.match(/T/)){
        afterSize = size.split('T');
        loadSize = afterSize[0]*Math.pow(10,12);
      }
      LoadLine = `-p ${loadSize}`
      console.log(`load size : ${size}`);
    }


    console.log(`bin/ycsb load ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP} ${loadLine}`);
  }

  function ycsbRun(){
    console.log(`bin/ycsb run ${opt.dbtype} -P ${wlfileDir}/${opt.wlfile} -p hosts=${nodeIP}`);
  }












        //
        // try {
        //   const execSync = require('child_process').execSync;
        //   // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
        //   const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} `);
        //   console.log(`stdout: ${stdout}`);
        // } catch (err) {
        //     err.stdout;
        //     err.stderr;
        //     err.pid;
        //     err.signal;
        //     err.status;
        //     // etc
        // }

        // console.log(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} ${sizeoption}${loadSize}`);


  //
// console.log(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} ${sizeoption}${loadSize}`);
//

}









// module.exports.ycsbRun = () => {
//   // console.log(options);
// console.log('ycsb 함수');
// // console.log(arg.dbtype);
// }

// const program2 = require('./subcommander.js')

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
//
//
//
//
//
//
//
//
//
// // const program = require('commander');
// //
// //
// //   program
// //       .command('benchmark')
// //       // .arguments('<dbtype>')
// //       .option('-d, --dbtype <dbtype>')
// //       .option('-r, --runtype <runtype>')
// //       .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
// //       .option('-w --wlfile <wlfile>', `workload file을 입력`)
// //       .option('-c --config <config>', `config 파일 입력`)
// //       .option('-n, --name <name>', `name을 입력`)
// //       .option('-o, --output <output>', `output directory 지정`)
// //       .action(function(options){
// //         console.log(options.dbtype);
// //         console.log(options.runtype);
// //
// //         switch(options.dbtype){
// //           case 'cassandra' :
// //           console.log('cassandra');
// //
// //         }
// //         // console.log(opt);
// //         //console.log(runtype);
// //
// //         // bencmhark.chooseDbtype(dbtype);
// //       })
// //
// //   program.parse(process.argv);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//       //
//       // const dbtypeLine = `dbtype : ${
//       //   (() => {
//       //     switch (opt.dbtype) {
//       //       case 'cassandra':
//       //         return 'cassandra'
//       //       case 'arangodb':
//       //         return 'arangodb'
//       //       default:
//       //         return '다시 입력해주세요'
//       //     }
//       //   })()
//       //
//       // }`
//       // console.log(dbtypeLine);
//       //
//       // const loadtypeLine = `runtype : ${
//       //   (() => {
//       //     switch (opt.runtype) {
//       //       case 'load':
//       //         return 'load'
//       //       case 'run':
//       //         return 'run'
//       //       case 'loadrun':
//       //         return 'load / run'
//       //       default:
//       //         return '다시 입력해주세요'
//       //     }
//       //   })()
//       //
//       // }`
//       // console.log(loadtypeLine);
//       //
//       // if(!opt.loadsize){
//       //   var sizeoption = "";
//       //   var size = "";
//       //   var loadSize = "";
//       // }else{
//       //   var sizeoption = '-p insertcount='
//       //   var size = opt.loadsize
//       //   if (size.match(/M/)){
//       //     afterSize = size.split('M');
//       //     loadSize = afterSize[0]*1000000;
//       //   }
//       //   if (size.match(/G/)){
//       //     afterSize = size.split('T');
//       //     loadSize = afterSize[0]*100000000;
//       //   }
//       //   if (size.match(/T/)){
//       //     afterSize = size.split('T');
//       //     loadSize = afterSize[0]*1000000000000;
//       //   }
//       //   console.log(`load size : ${size}`);
//       // }
//       //
//       //
//       //
//       // //
//       // // try {
//       // //   const execSync = require('child_process').execSync;
//       // //   // const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.bsh ${skcli.runtype} ${skcli.dbtype} `);
//       // //   const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} `);
//       // //   console.log(`stdout: ${stdout}`);
//       // // } catch (err) {
//       // //     err.stdout;
//       // //     err.stderr;
//       // //     err.pid;
//       // //     err.signal;
//       // //     err.status;
//       // //     // etc
//       // // }
//       //
//       // console.log(`./ycsb-0.17.0/bin/ycsb.sh ${opt.runtype} ${opt.dbtype} ${sizeoption}${loadSize}`);
//       //
//       //
