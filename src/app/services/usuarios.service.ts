import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios = [];
  url = environment.url;

  constructor(private http:HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.url + 'usuario');
  }

  setAdmin(data:{email?;phone?}) {
    return this.http.put(this.url + 'usuario', data);
  }

  delAdmin(id) {
    return this.http.delete(this.url + 'usuario/' + id);
  }

}
