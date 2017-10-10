import { Observable, Subject } from '@reactivex/rxjs';

export { default as run } from './run';
export { default as testemAdapter } from './testem-adapter';

export type Thunk<T> = () => T;

export type Assertion = Promise<boolean>;

export type Test = (description: string, assertion: Thunk<Assertion>) => void;

export type Count = (count: number) => void;

export type Sequence = {
  (test: Test): void | Promise<void>;
  count?: number;
  group?: string;
}

export interface IGroup {
  count: number;
  sequence$: Observable<Sequence>;
}

export interface IResult {
  description: string;
  ok: boolean;
}

export interface ISuiteOptions {
  timeout: number;
}

export type Report = (result: Observable<IResult>) => void;

export function group(group: string, ...sequences: Sequence[]): IGroup {
  let count = sequences.reduce((acc, sequence) => acc + (sequence.count || 0), 0);

  sequences.forEach(sequence => {
    sequence.group = group;
  });

  return {
    count,
    sequence$: Observable.from(sequences)
  };
}

export function expect(count: number, sequence: Sequence): Sequence {
  sequence.count = count;

  return sequence;
}

function testFactory(test$$: Subject<Observable<IResult>>, group?: string): Test {
  return (description, assertion) => {
    let result$ = Observable.from(assertion())
      .map(ok => ({
        ok,
        description: group ? `${group}: ${description}` : description
      }));

    test$$.next(result$);
  };
}

export function suite(
  groups: IGroup[],
  each: (result: IResult) => void,
  error: (error: any) => void,
  complete: Thunk<void>,
  options: ISuiteOptions = {
    timeout: 500
  }
) {
  let test$$ = new Subject<Observable<IResult>>();
  let group$ = Observable.from(groups);
  let report$ = new Subject<void>();
  let expectedCount = groups.reduce((total, group) => total + group.count, 0);
  let actualCount$ = report$.mapTo(0).scan((count, v) => count + 1, 0);
  let done$ = actualCount$
    .startWith(0)
    .takeWhile(actualCount => actualCount < expectedCount)
    .max()
    .map(v => v + 1);

  done$.subscribe(() => {}, () => {}, complete);

  test$$
    .flatMap(r => r)
    .timeout(options.timeout)
    .takeUntil(done$)
    .subscribe(r => { each(r); report$.next(); }, error);

  group$
    .flatMap(group => group.sequence$)
    .subscribe(sequence => {
      let test = testFactory(test$$, sequence.group);
      sequence(test);
    });
}
