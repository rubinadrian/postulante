import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private storage: AngularFireStorage) { }

  uploadFileBase64(name:string, fileBase64) {

    const filePath = `/profile_photo/${name}.jpg`;

    const ref = this.storage.ref(filePath);

    ref.putString(fileBase64, 'data_url', {contentType:'image/jpg'}).then().catch()
  }


  getImageProfile(name:string) {
    const ref = this.storage.ref(`/profile_photo/${name}.jpg`);
     return ref.getDownloadURL();
  }
}
