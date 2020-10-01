import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
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
  @Output() uploading = new EventEmitter<boolean>();

  uploadingFile = false;

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
        this.uploadingFile = true;
        this.uploading.emit(this.uploadingFile);
        this._cs.saveCurriculum({uid: user.uid, file:file[0]}).subscribe(resp => {
          this.uploadingFile = false;
          this.uploading.emit(this.uploadingFile);
          this.fileInput.nativeElement.value = '';
        },
        error => this.swal.error('File Upload', 'Error al subir el arhcivo.'));
      });


    }
  }

}
