import { group, test, emits, equals, notOk, ok, eventually } from '../src';
import { greetings, greet } from './fixtures';

export default group('assertions', [
  test('emits',
    () => emits(['Hello, Daniel', 'Hello, Ryan']),
    () => greetings('Daniel', 'Ryan')
  ),
  test('equals',
    () => equals('Hello, Daniel'),
    () => greet('Daniel')
  ),
  test('eventually',
    () => eventually(equals('foo')),
    async () => 'foo'
  ),
  test('notOk',
    () => notOk(),
    () => false
  ),
  test('ok',
    () => ok(),
    () => true
  )
]);
