import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$ = this.subject.asObservable();

  constructor() { }

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"])),
      )
      .subscribe(
        (courses: Course[]) => this.subject.next(courses)
      )
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category == category))
    );
  }

  selectCourseById(courseId: number): Observable<Course> {
    return this.courses$.pipe(
      map(courses => courses
        .find(course => course.id === courseId))
    );
  }

  saveCourse(courseId: number, changes) {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex((course: Course) => course.id === courseId);
    const newCourses = [...courses];
    const newCourse = {
      ...courses[courseIndex],
      ...changes,
    } as Course;
    newCourses[courseIndex] = newCourse
    this.subject.next(newCourses);
    return from(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}