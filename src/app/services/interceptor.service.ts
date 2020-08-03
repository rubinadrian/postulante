import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/internal/operators/delay';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {

  constructor(private _auth:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {

    if(this._auth.token) {
      let params = req.clone().params;
      params = params.append('token', this._auth.token);
      return next.handle(req.clone({ params })).pipe(delay(100));
    }

    return next.handle(req).pipe(delay(100));
  }
}
