import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  get windowRef() {
    return window
  }

}
