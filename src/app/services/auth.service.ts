import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { SwalService } from './swal.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.url;
  public logged = false;
  public user:any = {};
  public isAdmin = false;
  public token = '';
  public getUserLoggedIn:BehaviorSubject<any>;


  constructor(private http:HttpClient,
              public _af: AngularFireAuth,
              private router:Router,
              private _swal:SwalService)
  {
    this.getUserLoggedIn = new BehaviorSubject<any>(null);
  }

  // Este metodo lo estamos llamando desde el Init.Service
  listenAuth() {
    return new Promise((resolve, reject) => {
      this._af.authState.subscribe((userFireBase:firebase.User) => {

        if(!userFireBase) {
          resolve();
          return;
        }

        this._swal.showLoading();
        // Controlamos si es admin desde los Claims
        userFireBase.getIdTokenResult().then(tokenData => {
          this.isAdmin = tokenData.claims.admin || false;
          //Obtenemos los datos del usuario
          userFireBase.getIdToken().then(token => {
            this._swal.close();
            this.token = token;
            this.user.uid = userFireBase.uid;
            this.user.displayName = userFireBase.displayName;
            this.user.email = userFireBase.email;
            this.user.photoURL = userFireBase.photoURL;
            this.logged = true;
            this.getUserLoggedIn.next(this.user);
            resolve();
            //this.getUserLoggedIn.complete();
          });
        });

    });


    });
  }

  login(proveedor: string) {

    switch(proveedor) {
      case 'google': this._af.signInWithPopup(new firebase.auth.GoogleAuthProvider());break;
      case 'facebook': this._af.signInWithPopup(new firebase.auth.FacebookAuthProvider());break;
      case 'twitter': this._af.signInWithPopup(new firebase.auth.TwitterAuthProvider());break;
    }

  }

  logout() {
    this.logged = false;
    this.user = {};
    this.isAdmin = false;
    this.token = '';
    this._af.signOut();
    this.router.navigate(['/login']);
  }
}

