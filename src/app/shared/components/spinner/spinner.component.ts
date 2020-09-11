import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  loading = true;

  constructor(private _ls:LoadingService,) { }

  ngOnInit(): void {
    this._ls.isLoading.subscribe(resp => this.loading = resp);
  }

}
