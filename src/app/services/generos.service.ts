import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Genero {
  id:number;
  nombre:string;
}

@Injectable({
  providedIn: 'root'
})
export class GenerosService {
  generos = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getGeneros(): Observable<any> {
    this.generos = this.getGenerosFromStorage();
    if(!this.generos) {
      return this.http.post(this.url + 'generos', {})
        .pipe(first((resp:any) => { this.saveGenerosInLocalStorage(resp); return resp; }));
    }
    return new BehaviorSubject(this.generos).pipe(first());
  }

  getGenerosFromStorage() {
    let dateLS = window.localStorage.getItem('date_generos');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('generos')) as Genero[];
  }

  saveGenerosInLocalStorage(generos:Genero[]) {
    window.localStorage.setItem('generos', JSON.stringify(generos));
    window.localStorage.setItem('date_generos', JSON.stringify(new Date().getTime()));
  }

}
