import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
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

    const subject = new Subject();
    const series$ = subject.asObservable();

    series$.subscribe(console.log);

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
  }

}
