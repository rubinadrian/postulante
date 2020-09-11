import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { SwalService } from './swal.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.url;
  public logueado = false;
  public user:any = {};
  public isAdmin = false;
  public token = '';
  public getUserLoggedIn:BehaviorSubject<any>;


  constructor(private http:HttpClient,
              public _auth: AngularFireAuth,
              private router:Router,
              private _swal:SwalService) {
    this.getUserLoggedIn = new BehaviorSubject<any>(null);
    _auth.authState.subscribe((userFireBase:firebase.User) => {

      if(!userFireBase) { return; }

      userFireBase.getIdToken().then(token => {
        this.token = token;

        this._swal.showLoading();
        this.http.post(this.url + 'login',{token}).pipe(first()).subscribe((resp:any) => {
          this._swal.close();
          if(resp === 1) { this.isAdmin = true; }

          this.user.uid = userFireBase.uid;
          this.user.displayName = userFireBase.displayName;
          this.user.email = userFireBase.email;
          this.user.photoURL = userFireBase.photoURL;
          this.logueado = true;
          this.getUserLoggedIn.next(this.user);
          //this.getUserLoggedIn.complete();
        }, error => {
          this._swal.close();
          this._swal.error('Error Login', 'Probrema con la conexion, vuelva a intentarlo mas tarde.');
        });

      });

    });
  }

  login(proveedor: string) {

    switch(proveedor) {
      case 'google': this._auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());break;
      case 'facebook': this._auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());break;
      case 'twitter': this._auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());break;
    }

  }

  logout() {
    this.logueado = false;
    this.user = {};
    this.isAdmin = false;
    this.token = '';
    this._auth.signOut();
    this.router.navigate(['/login']);
  }
}

