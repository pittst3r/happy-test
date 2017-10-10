import { ISuiteOptions, suite, IResult, IGroup } from './index';

export default function testemAdapter(groups: IGroup[], options: ISuiteOptions): Function {
  return (socket: SocketIO.Server) => {
    socket.emit('tests-start');

    let timeout = options.timeout;
    let index = 0;

    function each(result: IResult) {
      index++;
      socket.emit('test-result', {
          passed: result.ok ? 1 : 0,
          failed: result.ok ? 0 : 1,
          id: index,
          name: result.description
      });
    }

    function error(e: Error) {
      console.error(e.name);
      socket.emit('all-test-results');
    }

    function complete() {
      socket.emit('all-test-results');
    }

    suite(groups, each, error, complete, { timeout });
  }
}
