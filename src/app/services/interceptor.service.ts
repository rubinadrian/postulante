import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/internal/operators/delay';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {
  private requests: HttpRequest<any>[] = [];

  constructor(private _auth:AuthService, private _loading:LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    let params = req.clone().params;

    // Agrego el token a todas las peticiones.
    if(this._auth.token) {
      params = params.append('token', this._auth.token);
    }

    let reqWithToken = req.clone({ params });

    // Armo un array de peticiones,si esta vacio, no estoy leyendo (loading).
    this.requests.push(reqWithToken);

    return Observable.create(observer => {
      const subscription = next.handle(reqWithToken)
          .pipe(delay(100))
          .subscribe(
              event => {
                  if (event instanceof HttpResponse) {
                      this.removeRequest(reqWithToken);
                      observer.next(event);
                  }
              },
              err => {
                  this.removeRequest(reqWithToken);
                  observer.error(err);
              },
              () => {
                  this.removeRequest(reqWithToken);
                  observer.complete();
              });
      // remove request from queue when cancelled
      return () => {
          this.removeRequest(reqWithToken);
          subscription.unsubscribe();
      };
  });



  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i !== -1) { this.requests.splice(i, 1); }
    this._loading.isLoading.next(this.requests.length > 0);
  }
}
