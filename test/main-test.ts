import { Observable } from '@reactivex/rxjs';
import { group, test, before } from '../src';

const testWithSetup = before(() => 'foo');

export default group('main', [
  test('assertions that return an observable that emits `true` pass the test',
    () => () => Observable.of(true),
    () => {}
  ),
  test('assertions can compare the actual value to an expected value',
    () => actual => Observable.of(actual() === 'foo'),
    () => 'foo'
  ),
  test('only the first value from the assertion observable is taken',
    () => () => Observable.from([true, false]),
    () => {}
  ),
  testWithSetup('tests with common setup can use `before()`',
    () => actual => Observable.of(actual() === 'foo'),
    (setup) => setup
  )
]);
