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

  getCurriculum(filename){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.post(this.url + 'curriculum/getfile', {curriculum_file:filename},httpOptions);
  }

  downloadCurriculumFile(filename) {
    this.getCurriculum(filename).subscribe((resp:any) => {
      let downloadURL = window.URL.createObjectURL(resp);
      let link = document.createElement('a');
      link.href = downloadURL;
      let fn = filename;
      let ext = fn.substr(fn.lastIndexOf('.') + 1);
      link.download = 'curriculum.' + ext;
      link.click();
    });
  }
}
