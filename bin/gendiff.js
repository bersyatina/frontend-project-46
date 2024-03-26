#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../src/index.js';

program
  .name('gendiff')
  .description('  Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath1>')
  .action((filepath1, filepath2) => {
    const result = genDiff(filepath1, filepath2, program.opts().format);
    console.log(result);
  });

program.parse();
