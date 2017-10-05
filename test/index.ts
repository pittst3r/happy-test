import { suite, IResult } from '../src';
import mainTest from './main-test';

let { run, count } = suite([mainTest]);

function tap(result: IResult): string {
  return `${result.ok ? 'ok' : 'not ok'} ${result.index} ${result.group}: ${result.test}`;
}

console.log(`1..${count}`);
run(result => {
  console.log(tap(result));
});
