import { Observable } from '@reactivex/rxjs';

export interface IResult {
  description: string;
  behavior: string;
  ok: boolean;
}

export type Behavior = (description: string) => Observable<IResult>;

export interface IDescription {
  name: string;
  behaviorCount: number;
  behavior$: Observable<Behavior>;
}

export type Assertion<T> = (actual: () => T) => Observable<boolean>

export function test<T>(behavior: string, assertion: () => Assertion<T>, actual: () => T): Behavior {
  return function test(description: string): Observable<IResult> {
    return assertion()(actual).map(ok => ({ ok, description, behavior }));
  };
}

export function group(name: string, behaviors: Behavior[]): IDescription {
  return {
    name,
    behaviorCount: behaviors.length,
    behavior$: Observable.from(behaviors)
  }
}

export function suite(descriptions: IDescription[]): { count: number, result$: Observable<IResult> } {
  let count = descriptions
    .map(d => d.behaviorCount)
    .reduce((count, length) => count + length);
  let result$ = Observable.of(...descriptions)
    .flatMap(description =>
      description.behavior$.flatMap(behavior => behavior(description.name))
    );

  return { count, result$ };
}

export * from './assertions';
