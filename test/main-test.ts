import { group, expect } from '../src';
import { Subject } from '@reactivex/rxjs';

export default group('main',
  expect(1, test => {
    test('ok', async () => true);
  }),
  expect(1, test => {
    let subject$ = new Subject<boolean>();

    test('side-effect', () => subject$.first().toPromise());

    subject$.next(true);
  })
);
