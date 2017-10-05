import { Observable } from '@reactivex/rxjs';
import { Assertion, Opaque } from './index';

export function equals<T>(expected: T): Assertion<T> {
  return actual => Observable.of(actual === expected);
}

export function eventually<T>(assertion: Assertion<T>): Assertion<Promise<T>> {
  return (actual: Promise<T>): Observable<boolean> => {
    return Observable.fromPromise(actual).flatMap(actual => assertion(actual));
  };
}

export function ok(expected: Opaque): Assertion<boolean> {
  return actual => Observable.of(!!expected);
}

export function notOk(expected: Opaque): Assertion<boolean> {
  return actual => Observable.of(!expected);
}
