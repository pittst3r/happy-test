import main from './main-test';
import { IResult, suite } from '../src/index';

console.info('# Happy Test');

let groups = [main];
let startTime = Date.now();
let index = 0;
let exitCode = 0;

function each(result: IResult) {
  index++;
  console.info(index.toString(), result.ok ? 'ok' : '️not ok', result.description);
  if (!result.ok) exitCode = 1;
}

function complete() {
  console.info(`1..${index}`);
  console.info(`# done in ${Date.now() - startTime}ms`);
  process.exitCode = exitCode;
}

suite(groups, each, complete, { timeout: 100 });
