import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form_login_email:FormGroup;
  panelOpenState = true;
  hide = true; //password
  error = '';

  constructor(public _auth: AuthService) { }

  ngOnInit(){
    this.form_login_email = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  login(proveedor: string) {
    this._auth.login(proveedor);
  }

  createUserWithEmailAndPassword() {
    let c = this.form_login_email.value; // credentials
    this._auth._auth.createUserWithEmailAndPassword(c.email, c.password)
      .catch(err => this.error = err.message);
  }

  signInWithEmailAndPassword() {
    let c = this.form_login_email.value; // credentials
    this._auth._auth.signInWithEmailAndPassword(c.email, c.password)
      .catch(err => this.error = err.message);
  }


}
