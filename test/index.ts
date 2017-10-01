import {suite, IResult } from '../src';
import assertionsTest from './assertions-test';

let { count, result$ } = suite([assertionsTest]);

function tap(result: IResult, index: number): string {
  return `${result.ok ? 'ok' : 'not ok'} ${++index} ${result.description}: ${result.behavior}`;
}

console.log(`1..${count}`);
result$.map(tap).subscribe(v => console.log(v));
