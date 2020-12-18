import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
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

  constructor() { }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      catchError((err) => {
        /* RECOVERERY LOGIC */
        // return of({
        //   payload: [{
        //     id: 0,
        //     description: "RxJs In Practice Course",
        //     iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        //     courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        //     longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        //     category: 'BEGINNER',
        //     lessonsCount: 10
        //   }]
        // });

        /* RETHROW ERROR LOGIC */
        return throwError(err);
      }),
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
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) => courses.filter((course: Course) => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => courses.filter((course: Course) => course.category === 'ADVANCED'))
    );
  }

}
