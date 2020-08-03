import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { first } from 'rxjs/internal/operators/first';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NivelEstudio } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NivelesEstudioService {
  url = environment.url;
  areas: NivelEstudio[] = [];


  constructor(private http:HttpClient) {}

  getNivelesEstudios(): Observable<any> {
    this.areas = this.getNivelesEstudiosFromStorage();
    if(!this.areas) {
      return this.http.post(this.url + 'nivelesestudios', {})
        .pipe(first((resp:any) => { this.saveNivelesInLocalStorage(resp); return resp; }));
    }
    return new BehaviorSubject(this.areas).pipe(first());
  }

  getNivelesEstudiosFromStorage() {
    let dateLS = window.localStorage.getItem('date_niveles_estudio');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('niveles_estudio')) as NivelEstudio[];
  }

  saveNivelesInLocalStorage(areas:NivelEstudio[]) {
    window.localStorage.setItem('niveles_estudio', JSON.stringify(areas));
    window.localStorage.setItem('date_niveles_estudio', JSON.stringify(new Date().getTime()));
  }
}
