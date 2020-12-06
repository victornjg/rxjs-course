import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { pluck, share } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const routeEnd = new Subject<{ data: any, url: string }>();

    // grab url and share with subscribers
    const lastUrl = routeEnd.pipe(
      pluck('url'),
      share()
    );

    // initial subscriber required
    const initialSubscriber = lastUrl.subscribe((x) => console.log('initial sub = ' + x));

    // simulate route change
    routeEnd.next({ data: {}, url: 'my-path' });

    // nothing logged
    const lateSubscriber = lastUrl.subscribe((x) => console.log('late sub = ' + x));
  }

}
