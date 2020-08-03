import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerosService } from 'src/app/services/generos.service';


@Component({
  selector: 'modal-referencia',
  templateUrl: 'modal.referencia.html',
})
export class ModalReferenciaComponent implements OnInit{
  formReferencia: FormGroup;
  generos = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalReferenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public formReferenciaParametro:FormGroup,
    public _generosService: GenerosService) {
      this._generosService.getGeneros().subscribe(resp => this.generos = resp);
    }
  
  ngOnInit() {

    this.formReferencia = this._formBuilder.group({
      empresa: ['', Validators.required],
      contacto: '',
      telefono: '',
      observacion: '',
    });

    if(this.formReferenciaParametro) { 
      this.formReferencia.setValue(this.formReferenciaParametro.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  matDialogClose() {
    if(this.formReferencia.dirty) {
      return this.formReferencia;
    }
  }

}
