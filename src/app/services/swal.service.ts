import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }


  public confirmRemove(callback: Function) {
    Swal.fire({
      title: '',
      text: "Quieres borrarlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        callback();
      }
    })
  }

  public saveSuccessful() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  }


  public error(title, text) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      // footer: '<a href>Why do I have this issue?</a>'
    })
  }


}
