import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../common/store.service';
import { Course } from "../model/course";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.beginnerCourses$ = this.storeService.selectBeginnerCourses();
    this.advancedCourses$ = this.storeService.selectAdvancedCourses();
  }

}
