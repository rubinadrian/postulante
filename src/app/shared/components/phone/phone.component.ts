import { Component, OnInit } from '@angular/core';
import { WindowsService } from 'src/app/services/windows.service';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
  windowRef: any;
  verificationCode: string;
  user: any;
  line:string = '';
  captchaValido = false;

  constructor(private win: WindowsService) {}

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'callback': (respCaptcha) => { if(respCaptcha) { this.captchaValido = true; }},
      'expired-callback': (respCaptchaExpire) => { this.captchaValido = false; }
    });
    this.windowRef.recaptchaVerifier.render();
  }


  sendLoginCode() {
    if(isNaN(+this.line)) return;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = `+549${this.line}`;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => { this.windowRef.confirmationResult = result; })
            .catch( error => console.error(error) );
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then(() => {this.windowRef.confirmationResult=''}) // logueado, hay un observable escuchando en authService.
                  .catch( error => console.error(error, "El código no es correcto"));
  }


}
