import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot, Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<Course> {

  constructor(private route: ActivatedRoute, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    const courseId = parseInt(route.params.id, 10);
    if (!isNaN(courseId)) {
      return createHttpObservable(`/api/coursess/${courseId}`)
        .pipe(
          catchError((err) => {
            const currentNavigation = this.router.getCurrentNavigation();
            currentNavigation.extras.state.alertConfig.show = true;
            currentNavigation.extras.state.alertConfig.message = 'The course selected was not found!';
            this.router.navigateByUrl('');
            return of(null);
          }),
        );
    } else {

      this.router.navigateByUrl('');
      return null;
    }
  }
}
