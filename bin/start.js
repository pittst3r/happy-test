'use strict';

const watchman = require('fb-watchman');
const client = new watchman.Client();
const path = require('path');

let projectDir = path.join(__dirname, '..');
let tmpDir = path.join(projectDir, 'tmp');
let tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');
let test = path.join(__dirname, '..', 'tmp', 'test', 'index.js');

let tscTrigger = ['trigger', projectDir, {
  name: 'tsc',
  expression: ['anyof',
    ['match', 'src/*.ts', 'wholename'],
    ['match', 'test/*.ts', 'wholename']
  ],
  command: [tsc],
  stdout: '> tsc-out.log',
  chdir: projectDir
}];

let testTrigger = ['trigger', tmpDir, {
  name: 'test',
  expression: ['anyof',
    ['match', 'src/*.js', 'wholename'],
    ['match', 'test/*.js', 'wholename']
  ],
  command: ['node', test],
  stdout: '> test-out.log',
  chdir: projectDir
}];

client.command(tscTrigger, startWatch('tsc'));
client.command(testTrigger, startWatch('test'));

function startWatch(name) {
  return (error, resp) => {
    console.log(name, 'watch started');

    if (error) {
      console.error('Error initiating watch:', error);
      return;
    }

    if ('warning' in resp) {
      console.log('warning: ', resp.warning);
    }

    process.on('SIGINT', function() {
      stopWatch(name);
      console.log(name, 'watch stopped');
      process.exit();
    });
  };
}

function stopWatch(name) {
  return () => {
    client.command(
      ['trigger-del', projectDir, name]
    )
  };
}
