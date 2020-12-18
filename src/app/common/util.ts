import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    const ctrl = new AbortController();
    const signal = ctrl.signal;

    fetch(url, { signal })
      .then(
        (res) => {
          if (res.ok) {
            return res.json();
          } else {
            observer.error('Resquest failed with status code: ' + res.status);
          }
        }
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
