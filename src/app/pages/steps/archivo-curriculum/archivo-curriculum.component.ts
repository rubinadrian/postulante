import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SwalService } from '../../../services/swal.service';
import { CurriculumService } from '../../../services/curriculum.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'step-curriculum-file',
  templateUrl: './archivo-curriculum.component.html',
  styleUrls: ['./archivo-curriculum.component.css']
})
export class ArchivoCurriculumComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;

  constructor(private swal:SwalService,
    private _cs:CurriculumService,
    private _auth:AuthService) { }

  ngOnInit(): void {

  }

  openInput() {
    this.fileInput.nativeElement.click();
  }

  fileChange(file:File[]) {

    if(file && file[0]) {
      if(file[0].size > 5242880) {
        this.swal.error('Tamaño del archivo', 'El tamaño del archivo no debe superar los 5MB');
        return;
      }

      this._auth.getUserLoggedIn.subscribe(user => {
        this._cs.saveCurriculum({uid: user.uid, file:file[0]}).subscribe(resp => {
          this.fileInput.nativeElement.value = '';
        });
      });


    }
  }

}
