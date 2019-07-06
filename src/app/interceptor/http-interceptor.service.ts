import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

class ErrorObject {
  status: string;
  type: string;
  message: string;
  url: string;
  httpErrorCode: number;
}

export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('login')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthService.getToken()}`
        }
      });
    }
    return next.handle(req).pipe(
      catchError( (error) => {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          const errorObject = new ErrorObject();
          if (error.error instanceof ErrorEvent) {
            console.error('Error Event');
            // client side error
            errorObject.status = 'error';
            errorObject.type = 'CLIENT_ERROR';
            errorObject.message = error.message;
            errorObject.httpErrorCode = null;
            errorObject.url = error.url || '';
            return throwError(errorObject);
          } else {
            errorObject.status = 'error';
            errorObject.type = error.error.type;
            errorObject.message = error.error.message;
            errorObject.httpErrorCode = error.status;
            errorObject.url = error.url || '';
            return throwError(errorObject);
          }
        }
        return throwError(error);
      })
    );
  }
}
