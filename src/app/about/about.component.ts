import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.state$.subscribe(val => console.log('AboutComponent - ', val));

    const subject = new BehaviorSubject(0);
    const series$ = subject.asObservable();

    series$.subscribe((val) => console.log('first sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    setTimeout(() => {
      series$.subscribe((val) => console.log('second sub: ', val));

      subject.next(4);
      subject.complete();
    }, 3000);
  }

}
