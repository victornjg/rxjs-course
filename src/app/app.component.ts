import { Component } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.state$.subscribe(val => console.log('AppComponent - ', val));
  }
}
