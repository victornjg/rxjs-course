import { Component } from '@angular/core';
import { StoreService } from './common/store.service';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private menuService: MenuService, private storeService: StoreService) { }

  ngOnInit() {
    this.menuService.state$.subscribe(val => console.log('AppComponent - ', val));
    this.storeService.init();
  }
}
