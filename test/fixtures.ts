import { Observable } from '@reactivex/rxjs';

export function greet(name: string): string {
  return `Hello, ${name}`;
}

export function greetings(...names: string[]): Observable<string> {
  return Observable.of(...names).map(greet);
}
