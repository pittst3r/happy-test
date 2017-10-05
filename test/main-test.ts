import { Subject, Observable } from '@reactivex/rxjs';
import { group, test, before, equals, eventually, Assertion } from '../src';

let testWithSetup = before(() => 'foo');

export default group('main',
  test('simple',
    () => equals('foo'),
    () => 'foo'
  ),
  test('promises',
    () => eventually(equals('foo')),
    async () => 'foo'
  ),
  testWithSetup('setup',
    () => equals('foo'),
    setup => setup
  ),
  test('side effects',
    () => emitsValue('foo'),
    action => {
      let main$ = new Subject<string>();

      action(() => { main$.next('foo'); });

      return main$;
    }
  )
);

function emitsValue<T>(expected: T): Assertion<Observable<T>> {
  return actual$ => actual$.map(actual => actual === expected);
}
