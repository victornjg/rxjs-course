import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { forkJoin, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { debug, RxjsLoggingLevel, setRxjsLogginLevel } from '../common/debug';
import { createHttpObservable } from '../common/util';
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    setRxjsLogginLevel(RxjsLoggingLevel.DEBUG);

    const course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    const lessons$ = this.loadLessons();

    forkJoin([course$, lessons$])
      .subscribe(
        ([course, lessons]) => {
          console.log('course ', course);
          console.log('lessons ', lessons);
        },
      );
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        map((event: any) => event.target.value),
        debug(RxjsLoggingLevel.TRACE, 'search '),
        //startWith(''),
        distinctUntilChanged(),
        switchMap((search) => this.loadLessons(search)),
        debug(RxjsLoggingLevel.DEBUG, 'lessons '),
      );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map((res) => res['payload'])
      );
  }
}
