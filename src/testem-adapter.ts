import { ISuiteOptions, suite, IResult, IGroup } from './index';

export default function testemAdapter(groups: IGroup[], options: ISuiteOptions): Function {
  return (socket: SocketIO.Server) => {
    socket.emit('tests-start');

    console.group('Happy Test');

    let timeout = options.timeout;
    let startTime = Date.now();
    let index = 0;

    function each(result: IResult) {
      index++;

      console.info(index.toString(), result.ok ? 'ok' : '️not ok', result.description);

      socket.emit('test-result', {
          passed: result.ok ? 1 : 0,
          failed: result.ok ? 0 : 1,
          id: index,
          name: result.description
      });
    }

    function complete() {
      console.info(`1..${index}`);
      console.info(`done in ${Date.now() - startTime}ms`);
      console.groupEnd();
      socket.emit('all-test-results');
    }

    suite(groups, each, complete, { timeout });
  }
}
