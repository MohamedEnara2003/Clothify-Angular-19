import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const isConnection : boolean = window.navigator.onLine;

  if (!isConnection) {
  router.navigateByUrl('/error/offline');
  }
    

  return next(req).pipe(
    catchError((error : HttpErrorResponse) => {
    console.log(error);
    switch(error.status){
    case 0 :router.navigateByUrl('/error/network');
    break
    case 404 :router.navigateByUrl('/error/not-found');
    break
    }
    
    return throwError(() => error);
    }),
  );
};
