import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/internal/operators/first';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface Provincia {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProvinciasService {
  provincias: Provincia[] = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getProvincias(): Observable<any> {
    this.provincias = this.getProvinciasFromStorage();
    if(!this.provincias) {
      return this.http.post(this.url + 'provincias', {});
    }
    return new BehaviorSubject(this.provincias).pipe(first());
  }

  getProvinciasFromStorage() {
    let dateLS = window.localStorage.getItem('date_provincias');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('provincias')) as Provincia[];
  }

  saveProvinciasInLocalStorage(provincias:Provincia[]) {
    window.localStorage.setItem('provincias', JSON.stringify(provincias));
    window.localStorage.setItem('date_provincias', JSON.stringify(new Date().getTime()));
  }

}
