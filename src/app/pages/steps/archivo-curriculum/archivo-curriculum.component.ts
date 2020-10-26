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

  filename;
  uploadingFile = false;

  constructor(private swal:SwalService,
    private _cs:CurriculumService,
    public _auth:AuthService) { }

  ngOnInit(): void {
  }

  openInput() {
    this.fileInput.nativeElement.click();
  }

  downloadCurriculum() {
    this._cs.downloadCurriculumFile(this.filename);
  }

  fileChange(file:File[]) {

    if(file && file[0]) {
      if(file[0].size > 5242880) {
        this.swal.error('Tamaño del archivo', 'El tamaño del archivo no debe superar los 5MB');
        return;
      }

      this._auth.getUserLoggedIn.subscribe(user => {
        this.filename = '';
        this.uploadingFile = true;
        this.uploading.emit(this.uploadingFile);
        this._cs.saveCurriculum({uid: user.uid, file:file[0]}).subscribe((resp:any) => {
          if(resp.ok) {
            this.filename = resp.filename;
          }
          this.uploadingFile = false;
          this.uploading.emit(this.uploadingFile);
          this.fileInput.nativeElement.value = '';
        },
        error => this.swal.error('File Upload', 'Ocurrio un error, vuelve a intentarlo mas tarde.'));
      });


    }
  }

}
