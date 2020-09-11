import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';




interface AreaCoopunion {
  id:number;
  area:string;
}

@Injectable({
  providedIn: 'root'
})
export class AreasCoopunionService {
  areas = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getAreas(): Observable<any> {
    this.areas = this.getAreasFromStorage();
    if(!this.areas) {
      return this.http.post(this.url + 'areascoopunion', {});
    }
    return new BehaviorSubject(this.areas).pipe(first());
  }


  saveArea(data) {
    return this.http.post(this.url + 'areascoopunion/update', data);
  }

  delArea(data) {
    return this.http.post(this.url + 'areascoopunion/remove', data);
  }


  getAreasFromStorage() {
    let dateLS = window.localStorage.getItem('date_areas_coopunion');
    if(dateLS && +new Date().getTime() - +new Date(+dateLS).getTime() > (60*60*24*1000)) {
      return;
    }
    return JSON.parse(window.localStorage.getItem('areas_coopunion')) as AreaCoopunion[];
  }

  saveAreasInLocalStorage(areas:AreaCoopunion[]) {
    window.localStorage.setItem('areas_coopunion', JSON.stringify(areas));
    window.localStorage.setItem('date_areas_coopunion', JSON.stringify(new Date().getTime()));
  }

}
