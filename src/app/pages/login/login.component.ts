import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showCarousel = true;
  form_login_email:FormGroup;
  panelOpenState = true;
  hide = true; //password
  error = '';
  proportion = 100;
  slides = [{'image': 'assets/images/carousel/3R4A3012.jpg'},
            {'image': 'assets/images/carousel/3R4A3050.jpg'},
            {'image': 'assets/images/carousel/4P8A9152.jpg'},
            {'image': 'assets/images/carousel/4P8A9249.jpg'},
            {'image': 'assets/images/carousel/DJI_0583.jpg'}];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fixSizeImages();
  }

  constructor(public _auth: AuthService, public router:Router) {
    this._auth.getUserLoggedIn.subscribe((user:any) => {
      if(user) {
        this.router.navigate(['home']);
      }
    });

    this.fixSizeImages();

  }

  fixSizeImages() {

    if(window.innerWidth >= 961) {
      this.showCarousel = true;
      this.proportion = 100;
    } else if (window.innerWidth >= 650){
      this.showCarousel = true;
      this.proportion = (-window.innerWidth * 0.32 + 450) / (window.innerWidth/660);
    } else {
      this.showCarousel = false;
    }
  }

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
