import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from '../services/log.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private log: LogService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = `HTTP ${err.status} — ${req.method} ${req.urlWithParams} — ${err.message}`;
        this.log.log(msg);
        return throwError(() => err);
      })
    );
  }
}
