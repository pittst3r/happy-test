import { IResult, IGroup, ISuiteOptions, suite } from "./index";

export default function run(groups: IGroup[], options: ISuiteOptions): void {
  if (typeof console.group === 'function') {
    console.group('Happy Test');
  } else {
    console.info('# Happy Test');
  }

  let startTime = Date.now();
  let index = 0;
  let exitCode = 0;

  function each(result: IResult) {
    index++;

    if (result.ok) {
      console.info(`${tap(result, index)}`);
      return;
    }

    console.info(`%c${tap(result, index)}`, 'color: orange;');
    exitCode = 1;
  }

  function error(error: Error): void {
    console.info(`# ${error.name}`);
    console.info(`# errored in ${Date.now() - startTime - options.timeout}ms`);
    process.exitCode = exitCode;
  }

  function complete() {
    console.info(`1..${index}`);
    console.info(`# done in ${Date.now() - startTime}ms`);
    if (typeof console.groupEnd === 'function') {
      console.groupEnd();
    }
    process.exitCode = exitCode;
  }

  suite(groups, each, error, complete, { timeout: options.timeout });
}

function tap(result: IResult, index: number): string {
  let ok = result.ok ? 'ok' : 'not ok';

  return `${index.toString()} ${ok} ${result.description}`;
}
