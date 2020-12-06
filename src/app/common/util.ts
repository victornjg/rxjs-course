import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    fetch(url)
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
      )
  });
}
