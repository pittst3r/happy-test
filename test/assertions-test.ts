import { group, test, emits, equals, notOk, ok } from '../src';
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
  test('notOk',
    () => notOk(),
    () => false
  ),
  test('ok',
    () => ok(),
    () => true
  )
]);
