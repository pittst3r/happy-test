import { Observable } from '@reactivex/rxjs';
import { Assertion } from './index';

export function emits<T extends Observable<U>, U>(expectedValues: U[]): Assertion<T> {
  return actual => {
    return actual()
      .reduce((remainingValues, actualValue): U[] => {
        return remainingValues.filter(r => r !== actualValue);
      }, expectedValues)
      .map(remaining => remaining.length === 0);
  };
}

export function equals<T>(expectedValue: T): Assertion<T> {
  return actual => toObservable(actual()).first().map(v => v === expectedValue);
}

export function notOk(): Assertion<boolean> {
  return actual => toObservable(actual()).first().map(v => !v);
}

export function ok(): Assertion<boolean> {
  return actual => toObservable(actual()).first().map(v => !!v);
}

function toObservable<T>(value: Promise<T>): Observable<T>;
function toObservable<T>(value: T): Observable<T>;
function toObservable(value: any): Observable<any> {
  function isPromise(value: any): value is Promise<any> {
    return typeof value.then === 'function';
  }

  return isPromise(value) ? Observable.fromPromise(value) : Observable.of(value);
}
