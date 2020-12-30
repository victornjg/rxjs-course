import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { concat, forkJoin, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  first, map,
  switchMap,
} from 'rxjs/operators';
import { StoreService } from '../common/store.service';
import { createHttpObservable } from '../common/util';
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;


  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private storeService: StoreService) {


  }

  ngOnInit() {

    this.courseId = parseInt(this.route.snapshot.params['id'], 10);

    this.course$ = this.storeService.selectCourseById(this.courseId)
      .pipe(
        first(),
      );

    forkJoin([this.course$, this.loadLessons()])
      .subscribe(console.log);
  }

  ngAfterViewInit() {

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res["payload"])
      );
  }


}
