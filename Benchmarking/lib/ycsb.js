console.log('1');
module.exports.ycsbRun = (cmd) => {
  console.log(cmd);
  program
      // .command('benchmark')
      // .arguments('<dbtype>')
      .option('-d, --dbtype <dbtype>')
      .option('-r, --runtype <runtype>')
      .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
      .option('-w --wlfile <wlfile>', `workload file을 입력`)
      .option('-c --config <config>', `config 파일 입력`)
      .option('-n, --name <name>', `name을 입력`)
      .option('-o, --output <output>', `output directory 지정`)
      .action(function(options){
        console.log(options.dbtype);
        console.log(options.runtype);

        switch(options.dbtype){
          case 'cassandra' :
          console.log('cassandra');

        }
        // console.log(opt);
        //console.log(runtype);

        // bencmhark.chooseDbtype(dbtype);
      })

  program.parse(process.argv);
      //
      // const dbtypeLine = `dbtype : ${
      //   (() => {
      //     switch (cmd.dbtype) {
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
      //     switch (cmd.runtype) {
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
      // if(!cmd.loadsize){
      //   var sizeoption = "";
      //   var size = "";
      //   var loadSize = "";
      // }else{
      //   var sizeoption = '-p insertcount='
      //   var size = cmd.loadsize
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
      // //   const stdout = execSync(`./ycsb-0.17.0/bin/ycsb.sh ${cmd.runtype} ${cmd.dbtype} `);
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
      // console.log(`./ycsb-0.17.0/bin/ycsb.sh ${cmd.runtype} ${cmd.dbtype} ${sizeoption}${loadSize}`);
      //
      //
}
