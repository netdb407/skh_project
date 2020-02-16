var async = require('async');

// .............................................................................
// parse command-line options
// .............................................................................

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')

  .command('arangodb', 'ArangoDB benchmark')
  .command('arangodb-mmfiles', 'ArangoDB benchmark')
  .command('mongodb', 'MongoDB benchmark')
  .command('neo4j', 'neo4j benchmark')
  .command('orientdb', 'orientdb benchmark')
  .command('postgresql', 'postgresql JSON benchmark')
  .command('postgresql_tabular', 'postgresql tabular benchmark')
  .demand(1)

  .option('t', {
    alias: 'tests',
    demand: false,
    default: 'all',
    describe: 'tests to run separated by comma: shortest, neighbors, neighbors2, neighbors2data, singleRead, singleWrite, aggregation, hardPath, singleWriteSync',
    type: 'string'
    })
  .requiresArg('t')

  .option('s', {
    alias: 'restrict',
    demand: false,
    default: 0,
    describe: 'restrict to that many elements (0=no restriction)',
    type: 'integer'
    })
  .requiresArg('s')

  .option('l', {
    alias: 'neighbors',
    demand: false,
    default: 1000,
    describe: 'look at that many neighbors',
    type: 'integer'
    })
  .requiresArg('l')

  .option('ld', {
    alias: 'neighbors2data',
    demand: false,
    default: 100,
    describe: 'look at that many neighbors2 with profiles',
    type: 'integer'
    })
  .requiresArg('ld')

  .option('a', {
    alias: 'address',
    demand: false,
    default: '127.0.0.1',
    describe: 'server host',
    type: 'string'
    })
  .requiresArg('a')

  .boolean('d')
  .help('h')
  .epilog('copyright 2015 Claudius Weinberger')
  .argv
;
