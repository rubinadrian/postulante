import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Postulante } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class PostulanteService {
  url = environment.url;

  constructor(private http:HttpClient) {}

  getPostulante(uid:string): Observable<any> {
    return this.http.post(this.url + 'postulante/' + uid, {});
  }

  getPostulanteById(id:string): Observable<any> {
    return this.http.post(this.url + 'postulante/id/' + id, {});
  }

  getPostulantes(data:any): Observable<any> {
    return this.http.post(this.url + 'postulantes', data);
  }

  savePostulante(postulante: Postulante) {
    return this.http.put(this.url+'postulante', postulante);
  }


}

