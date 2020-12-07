import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    const ctrl = new AbortController();
    const signal = ctrl.signal;

    fetch(url, { signal })
      .then(
        (res) => res.json()
      )
      .then(
        (body) => {
          observer.next(body);
          observer.complete();
        }
      )
      .catch(
        (err) => observer.error(err)
      );

    return () => ctrl.abort();
  });
}
