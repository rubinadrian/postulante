import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerosService } from 'src/app/services/generos.service';

@Component({
  selector: 'modal-hermano',
  templateUrl: 'modal.hermano.html',
})
export class ModalHermanoComponent implements OnInit{
  formHermano: FormGroup;
  generos = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalHermanoComponent>,
    @Inject(MAT_DIALOG_DATA) public formHermanoParametro:FormGroup,
    public _generosService: GenerosService) {
      this._generosService.getGeneros().subscribe(resp => this.generos = resp);
    }

  ngOnInit() {

    this.formHermano = this._formBuilder.group({
      nombre: ['', Validators.required],
      edad: '',
      oficio: '',
      genero_id: '',
    });

    if(this.formHermanoParametro) {
      this.formHermano.setValue(this.formHermanoParametro.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  matDialogClose() {
    if(this.formHermano.dirty) {
      return this.formHermano;
    }
  }

}




