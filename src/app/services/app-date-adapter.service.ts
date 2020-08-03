import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class AppDateAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          const day = this.ceros(date.getDate());
          const month = this.ceros(date.getMonth() + 1);
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
      } else {
          return date.toDateString();
      }
  }


  ceros(valor) {
    return ('0' + valor).slice(-2);
  }
}

