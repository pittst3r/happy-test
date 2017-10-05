import { Observable } from '@reactivex/rxjs';

export type Opaque = {} | null | undefined | void;

export type Thunk<T> = () => T;

export type Assertion<T> = (actual: T) => Observable<boolean>;

export type Action = (callback: Thunk<void>) => void;

export type Actual<T> = (action: Action) => T;

export interface ITest {
  name: string;
  ok$: Observable<boolean>;
  action: Thunk<void>;
}

export interface IGroup {
  name: string;
  tests: Observable<ITest>[];
}

export interface IResult {
  ok: boolean;
  index: number;
  group: string;
  test: string;
}

export interface ISuite {
  count: number;
  run: (cb: (result: IResult) => void) => void;
}

export function test<T>(name: string, assertion: Thunk<Assertion<T>>, actual: Actual<T>): Observable<ITest> {
  let sideEffect: Thunk<void> = () => {};

  function action(cb: Thunk<void>): void {
    sideEffect = cb;
  }

  return Observable.defer(() => Observable.of({
    name,
    ok$: assertion()(actual(action)),
    action: sideEffect
  }));
}

export function before<T, U>(setup: Thunk<U>): (name: string, assertion: Thunk<Assertion<T>>, actual: (setup: U, action: Action) => T) => Observable<ITest> {
  return (name, assertion, actual) => {
    let sideEffect: Thunk<void> = () => {};

    function action(cb: Thunk<void>): void {
      sideEffect = cb;
    }

    return Observable.defer(() => Observable.of({
      name,
      ok$: assertion()(actual(setup(), action)),
      action: sideEffect
    }));
  };
}

export function group(name: string, ...tests: Observable<ITest>[]): IGroup {
  return {
    name,
    tests
  };
}

export function suite(groups: IGroup[]): ISuite {
  let count = groups.reduce((acc, group) => acc + group.tests.length, 0);

  function run(cb: (result: IResult) => void): void {
    let index = 1;
    let group$ = Observable.from(groups);
    let testWithGroup$ = group$.flatMap(combineTestsWithGroup);

    testWithGroup$.subscribe(({ group, test }) => {
      test.ok$.subscribe(ok => {
        cb({
          ok,
          index: index++,
          test: test.name,
          group: group.name
        });
      });
      test.action();
    });
  }

  return {
    count,
    run
  };
}

export * from './assertions';

function combineTestsWithGroup(group: IGroup) {
  return Observable.from(group.tests)
    .flatMap(test$ => test$)
    .map((test) => ({
      group,
      test
    }));
}
