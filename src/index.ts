import { Observable } from '@reactivex/rxjs';

export interface IResult {
  group: string;
  test: string;
  ok: boolean;
}

export type Test = (group: string) => Observable<IResult>;

export interface IGroup {
  name: string;
  testCount: number;
  test$: Observable<Test>;
}

export type Assertion<T> = (actual: () => T) => Observable<boolean>;

export interface ISuite {
  count: number;
  result$: Observable<IResult>;
}

export function test<T>(name: string, assertion: () => Assertion<T>, actual: () => T): Test {
  return (group: string): Observable<IResult> =>
    assertion()(actual).first().map(ok => ({ ok, group, test: name }));
}

export function group(name: string, tests: Test[]): IGroup {
  return {
    name,
    testCount: tests.length,
    test$: Observable.from(tests)
  }
}

export function suite(groups: IGroup[]): ISuite {
  let count = groups
    .map(d => d.testCount)
    .reduce((count, length) => count + length);
  let result$ = Observable.of(...groups)
    .flatMap(group =>
      group.test$.flatMap(test => test(group.name))
    );

  return { count, result$ };
}

export * from './assertions';
