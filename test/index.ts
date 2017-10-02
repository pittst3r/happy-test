import { suite, IResult } from '../src';
import assertionsTest from './assertions-test';
import mainTest from './main-test';

let { count, result$ } = suite([mainTest, assertionsTest]);

function tap(result: IResult, index: number): string {
  return `${result.ok ? 'ok' : 'not ok'} ${++index} ${result.group}: ${result.test}`;
}

console.log(`1..${count}`);
result$.map(tap).subscribe(console.log);
