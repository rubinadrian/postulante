import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/internal/operators/first';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AreaEstudio } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AreasEstudioService {
  areas: AreaEstudio[] = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getAreasEstudios(): Observable<any> {
    this.areas = this.getAreasFromStorage();
    if(!this.areas) {
      return this.http.post(this.url + 'areasestudios',{});
    }
    return new BehaviorSubject(this.areas).pipe(first());
  }


  saveArea(data) {
    return this.http.post(this.url + 'areasestudios/update', data);
  }

  delArea(data) {
    return this.http.post(this.url + 'areasestudios/remove', data);
  }


  getAreasFromStorage() {
    let dateLS = window.localStorage.getItem('date_areas_estudios');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('areas_estudios')) as AreaEstudio[];
  }

  saveAreasInLocalStorage(areas:AreaEstudio[]) {
    window.localStorage.setItem('areas_estudios', JSON.stringify(areas));
    window.localStorage.setItem('date_areas_estudios', JSON.stringify(new Date().getTime()));
  }

}
