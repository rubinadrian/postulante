import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


interface Localidad {
  id:number;
  provincia_id:number;
  nombre:string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {
  localidades = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getLocalidades(provincia_id): Observable<any> {
    this.localidades = this.getLocalidadesFromStorage(provincia_id);
    if(!this.localidades) {
      return this.http.post(this.url + 'localidades/' + provincia_id, {})
            .pipe(first((resp:any) => { this.saveLocalidadesInLocalStorage(resp, provincia_id); return resp; }));
    }
    return new BehaviorSubject(this.localidades).pipe(first());
  }

  getLocalidadesFromStorage(provincia_id) {
    let dateLS = window.localStorage.getItem('date_localidades_' + provincia_id);
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('localidades_' + provincia_id)) as Localidad[];
  }

  saveLocalidadesInLocalStorage(localidades:Localidad[], provincia_id) {
    window.localStorage.setItem('localidades_' + provincia_id, JSON.stringify(localidades));
    window.localStorage.setItem('date_localidades_' + provincia_id, JSON.stringify(new Date().getTime()));
  }

}
