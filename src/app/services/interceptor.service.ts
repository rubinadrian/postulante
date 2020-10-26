import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/internal/operators/delay';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { catchError, first, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {
  private requests: HttpRequest<any>[] = [];
  private url = environment.url;

  constructor(private _auth:AuthService, private _loading:LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {


    // La peticion va al backend?
    if(req.url.indexOf(this.url) != -1) {
      if(this._auth.token) {
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this._auth.token) });
      }
    }

    // Armo un array de peticiones,si esta vacio, no estoy leyendo (loading).
    this.requests.push(req);

    return this.sendRequest(req, next);
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i !== -1) { this.requests.splice(i, 1); }
    this._loading.isLoading.next(this.requests.length > 0);
  }

  sendRequest(req, next):Observable<HttpEvent<any>> {
    return new Observable(observer => {
      const subscription = next.handle(req)
            .pipe(delay(100),
            catchError((err: any) => {
              if(err.status == 401 || err.status === 0) {
                  return next.handle(req).pipe(retry(5));
              } else {
                  return throwError(err);
              }
          }))
            .subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(req);
                        observer.next(event);
                    }
                },
                err => {
                    this.removeRequest(req);
                    observer.error(err);
                },
                () => {
                    this.removeRequest(req);
                    observer.complete();
                });
        // remove request from queue when cancelled
        return () => {
            this.removeRequest(req);
            subscription.unsubscribe();
        };
    });
  }
}
