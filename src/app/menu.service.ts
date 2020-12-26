import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private stateSubject = new Subject();

  state$ = this.stateSubject.asObservable();

  constructor() {
    setTimeout(() => {
      this.stateSubject.next('menu opened!');
    }, 2000);
    setTimeout(() => {
      this.stateSubject.next('menu closed!');
    }, 10000);
  }
}
