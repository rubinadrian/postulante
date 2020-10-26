import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { EMPTY } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private storage: AngularFireStorage) { }

  uploadFileBase64(name:string, fileBase64) {

    if(!name || name.length == 0) return;

    const filePath = `/profile_photo/${name}.jpg`;

    const ref = this.storage.ref(filePath);

    ref.putString(fileBase64, 'data_url', {contentType:'image/jpg'}).then().catch()
  }


  getImageProfile(name:string) {
    if(!name || name.length == 0) return EMPTY;
    const ref = this.storage.ref(`/profile_photo/${name}.jpg`);
     return ref.getDownloadURL();
  }
}
