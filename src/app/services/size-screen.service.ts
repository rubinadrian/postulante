import { Injectable, HostListener } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Injectable({
  providedIn: 'root'
})
export class SizeScreenService {
  width:number;
  height:number;
  xs = false;
  sm = false;
  md = false;
  lg = false;
  xl = false;
  current = 'xs';
  subject = new Subject();

  constructor() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.setValuesWidth();
  }


  detectScreenSize(event) {
    this.height = event.target.innerHeight;
    this.width  = event.target.innerWidth;
    this.setValuesWidth();
  }

  setValuesWidth() {
    this.xs = false;
    this.sm = false;
    this.md = false;
    this.lg = false;
    this.xl = false;

    switch(true) {
      case (this.width <  576):
        this.xs = true;
        this.current = 'xs';
        break;
      case (this.width >= 576 && this.width	> 768):
        this.sm = true;
        this.current = 'sm';
        break;
      case (this.width >= 768 && this.width	> 992):
        this.md = true;
        this.current = 'md';
        break;
      case (this.width >= 992 && this.width	> 1200):
        this.lg = true;
        this.current = 'lg';
        break;
      case (this.width	>= 1200):
        this.xl = true;
        this.current = 'xl';
        break;
    }

    this.subject.next(this.current);
  }

}
