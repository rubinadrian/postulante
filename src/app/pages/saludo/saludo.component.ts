import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saludo',
  templateUrl: './saludo.component.html',
  styleUrls: ['./saludo.component.css']
})
export class SaludoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  navegar(redsocial) {
    switch(redsocial) {
      case 'facebook':
        window.location.href = "https://www.facebook.com/cooperativaagropecuariaunion/";
        break;
      case 'instagram':
        window.location.href = "https://www.instagram.com/coop_union";
        break;
      case 'youtube':
        window.location.href = "https://www.youtube.com/channel/UCQDfPS3Gehq3GSeMCvPbAzA";
        break;
      case 'page':
        window.location.href = "https://www.coopunion.com.ar";
        break;
    }
  }

}
