import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.url;
  public logueado = false;
  public user:any = {};
  public isAdmin = false;
  public token = '';


  constructor(private http:HttpClient,
              public _auth: AngularFireAuth,
              private router:Router) {

    _auth.authState.subscribe((userFireBase:firebase.User) => {
      console.log('1', userFireBase);
      if(!userFireBase) { return; }
      console.log('2', userFireBase);
      userFireBase.getIdToken().then(token => {
        this.token = token;
        console.log('3', userFireBase);

        this.http.post(this.url + 'login',{token}).pipe(first()).subscribe((resp:any) => {
          if(resp === 1) { this.isAdmin = true; }
          console.log('4', userFireBase);
          this.user.uid = userFireBase.uid;
          this.user.displayName = userFireBase.displayName;
          this.user.email = userFireBase.email;
          this.user.photoURL = userFireBase.photoURL;
          this.logueado = true;

          if(router.routerState.snapshot.url != '/lista') {
            this.router.navigate(['home']);
          }
        });

      });

    });
  }



  isLoggedIn() {
     return this._auth.authState.pipe(first()).toPromise();
  }

  async getUserLoggedIn() {
     const user = await this.isLoggedIn();
     return user;
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

