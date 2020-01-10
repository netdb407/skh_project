#!/usr/bin/env node

const program = require('commander');
const install = require('./Installation/bin/install.js')
const bencmhark = require('./Benchmark/bin/BMrun.js')

program
    .command('install')
    .action(function installPackage(opts){
      install
    })


program
    .command('benchmark')
    .action(function benchmark()){
      bencmhark
    }

program.parse(process.argv);
