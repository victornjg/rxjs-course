import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from "../model/course";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  alertConfig = {
    show: false,
    message: null,
  };

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      finalize(() => console.log('finalize executed')),
      tap(() => console.log('http request executed!')),
      map((res) => {
        if (res['payload'] != null) {
          return Object.values(res['payload']);
        } else {
          return [];
        }
      }),
      shareReplay(),
      retryWhen((errors) => errors.pipe(
        delayWhen(() => timer(2000))
      )),
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) => courses.filter((course: Course) => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => courses.filter((course: Course) => course.category === 'ADVANCED'))
    );

    this.route.params.subscribe((params) => {
      console.log('home - params -> ', params);
    });

    this.route.data.subscribe((data) => {
      console.log('home - data -> ', data);
    });
  }

  navTest(): void {
    this.router.navigate(['/courses', 0], { state: { alertConfig: this.alertConfig } });
  }

}
