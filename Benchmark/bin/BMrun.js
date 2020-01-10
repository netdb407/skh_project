
const program = require('commander')
const mainAction = require('../lib/ycsb.js')

//
// const bot = dbtype => {
//   console.log('db type : ', dbtype)
// }
//
// const collect = (val, arr) => {
//   arr.push(val)
//   return arr
// }

program
  .option('-d, --dbtype <dbtype>', `db type을 입력 (cassandra / orientdb / arangodb)`)
  .option('-r, --runtype <runtype>', `run type을 입력 (load / run / loadrun)`)
  .option('-l, --loadsize [loadsize]', `load size를 입력 (###M, ###G, ###T)`)
  .option('-w --wlfile <wlfile>', `workload file을 입력`)
  .option('-c --config <config>', `config 파일 입력`)
  .option('-n, --name <name>', `name을 입력`)
  .option('-o, --output <output>', `output directory 지정`)
  .option('-s, --silent', 'disable output')


program.command('*').action(() => program.help())
program.parse(process.argv)

if(program.args.length ===0 ) mainAction(program)
