import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerosService } from 'src/app/services/generos.service';


@Component({
  selector: 'modal-hijo',
  templateUrl: 'modal.hijo.html',
})
export class ModalHijoComponent implements OnInit{
  formHijo: FormGroup;
  generos = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalHijoComponent>,
    @Inject(MAT_DIALOG_DATA) public formHijoParametro:FormGroup,
    public _generosService: GenerosService) {
      this._generosService.getGeneros().subscribe(resp => this.generos = resp);
    }

  ngOnInit() {

    this.formHijo = this._formBuilder.group({
      nombre: ['', Validators.required],
      edad: '',
      genero_id: '',
    });

    if(this.formHijoParametro) {
      this.formHijo.setValue(this.formHijoParametro.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  matDialogClose() {
    if(this.formHijo.dirty) {
      return this.formHijo;
    }
  }

}
