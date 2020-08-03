import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


interface EstadoCivil {
  id:number;
  nombre:string;
}

@Injectable({
  providedIn: 'root'
})
export class EstadosCivilesService {
  estadosciviles = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getEstadosCiviles(): Observable<any> {
    this.estadosciviles = this.getEstadosCivilesFromStorage();
    if(!this.estadosciviles) {
      return this.http.post(this.url + 'estadosciviles',{})
        .pipe(first((resp:any) => { this.saveEstadosCivilesInLocalStorage(resp); return resp; }));
    }
    return new BehaviorSubject(this.estadosciviles).pipe(first());
  }

  getEstadosCivilesFromStorage() {
    let dateLS = window.localStorage.getItem('date_estados_civiles');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('estados_civiles')) as EstadoCivil[];
  }

  saveEstadosCivilesInLocalStorage(estadosciviles:EstadoCivil[]) {
    window.localStorage.setItem('estados_civiles', JSON.stringify(estadosciviles));
    window.localStorage.setItem('date_estados_civiles', JSON.stringify(new Date().getTime()));
  }

}
