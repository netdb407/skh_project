const program = require('commander')
const ycsbAction = require('../lib/ycsb.js')

module.exports.test = () => {

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
}


//
// const bot = dbtype => {
//   console.log('db type : ', dbtype)
// }
//
// const collect = (val, arr) => {
//   arr.push(val)
//   return arr
// }

// program
//   .option('-d, --dbtype <dbtype>', `db type을 입력 (cassandra / orientdb / arangodb)`)
//   .option('-r, --runtype <runtype>', `run type을 입력 (load / run / loadrun)`)
//   .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
//   .option('-w --wlfile <wlfile>', `workload file을 입력`)
//   .option('-c --config <config>', `config 파일 입력`)
//   .option('-n, --name <name>', `name을 입력`)
//   .option('-o, --output <output>', `output directory 지정`)
//   .option('-s, --silent', 'disable output')
//
//
// program.command('*').action(() => program.help())
// program.parse(process.argv)
//
// if(program.args.length ===0 ) mainAction(program)




// module.exports.chooseDbtype = (dbtype) =>{
//
//   switch(dbtype){
//     case 'cassandra' :
//       ycsbAction.ycsbRun()
//       break;
//     case 'arnagodb' :
//       ycsbAction.ycsbRun()
//       break;
//       }
//
// }


console.log('asdf');

// program
//     .command('benchmark')
//     // .arguments('<dbtype>')
//     .option('-d, --dbtype <dbtype>')
//     .option('-r, --runtype <runtype>')
//     .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
//     .option('-w --wlfile <wlfile>', `workload file을 입력`)
//     .option('-c --config <config>', `config 파일 입력`)
//     .option('-n, --name <name>', `name을 입력`)
//     .option('-o, --output <output>', `output directory 지정`)
//     .action(function(options){
//       console.log(options.dbtype);
//       console.log(options.runtype);
//
//       switch(options.dbtype){
//         case 'cassandra' :
//
//       }
//       // console.log(opt);
//       //console.log(runtype);
//
//       // bencmhark.chooseDbtype(dbtype);
//     })
//
// program.parse(process.argv);
