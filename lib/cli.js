#!/usr/bin/env node

var doctator = require('./doctator');
var argv = require('yargs').options({
  f: {
    alias: 'files',
    default: '**/*.js'
  },
  o: {
    alias: 'output',
    default: 'doc'
  }
})
.argv;

doctator(argv.files, argv.output);
