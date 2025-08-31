import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { DashboardService } from '../../feature/dashboard/dashboard.service';
import { Observable, of } from 'rxjs';
import {catchError, map, take,} from 'rxjs/operators';


export const isAdminGuard: CanMatchFn = (): Observable<boolean> => {
  const dashboardService = inject(DashboardService);
  const router = inject(Router);
  const backToLogin =   () => {
  router.navigateByUrl('/auth/login')
  return false
  } ;

  return dashboardService.isAdmin().pipe(
    take(1),
    map((isAdmin) => !isAdmin ? backToLogin() : true),   
    catchError(() => {
    backToLogin();
    return of(false); 
    })
  );
};