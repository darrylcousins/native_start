#!/usr/bin/env node

const prog = require('caporal');
const createCmd = require('./lib/create');

prog
  .version('0.0.1')
  .command('create', 'Create a new react start application')
  .argument('<dir>', 'Directory to install into', null, 'cwd')
  .argument('<template>', 'Template to use', null, 'default')
  .option('--variant <variant>', 'Which <variant> of the template is going to be created')
  .action(createCmd);

prog.parse(process.argv);
