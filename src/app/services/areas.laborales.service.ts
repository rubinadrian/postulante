import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/internal/operators/first';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface AreaLaboral {
  id:number;
  area:string;
}

@Injectable({
  providedIn: 'root'
})
export class AreasLaboralesService {
  areas: AreaLaboral[] = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getAreasLaborales(): Observable<any> {
    this.areas = this.getAreasFromStorage();
    if(!this.areas) {
      return this.http.post(this.url + 'areaslaborales',{});
    }
    return new BehaviorSubject(this.areas).pipe(first());
  }

  getAreasFromStorage() {
    let dateLS = window.localStorage.getItem('date_areas_laborales');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('areas_laborales')) as AreaLaboral[];
  }

  saveAreasInLocalStorage(areas:AreaLaboral[]) {
    window.localStorage.setItem('areas_laborales', JSON.stringify(areas));
    window.localStorage.setItem('date_areas_laborales', JSON.stringify(new Date().getTime()));
  }
}

