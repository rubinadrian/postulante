import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  url = environment.url;

  constructor(private http:HttpClient) {}

  saveCurriculum(data){
    const formData = new FormData();
    formData.append('file', data.file, data.file.name);
    formData.append('uid', data.uid);

    return this.http.post(this.url + 'curriculum/uploadfile', formData);
  }

  getCurriculum(){
    return this.http.post(this.url + 'curriculum/getfile', {});
  }
}
