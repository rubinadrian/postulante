import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreasLaboralesService } from 'src/app/services/areas.laborales.service';

@Component({
  selector: 'modal-experiencia',
  templateUrl: 'modal.experiencia.html',
})
export class ModalExperienciaComponent implements OnInit{
  areas_laborales = [];
  formExperiencia: FormGroup;
  minDate; // Nacimiento
  maxDate; // Nacimiento


  constructor(
    private _formBuilder: FormBuilder,
    public _areasLaboralesService: AreasLaboralesService,
    public dialogRef: MatDialogRef<ModalExperienciaComponent>,
    @Inject(MAT_DIALOG_DATA) public formExperienciaParametro:FormGroup) {
      const currentYear = new Date().getFullYear();
    }

  ngOnInit() {
    this._areasLaboralesService.getAreasLaborales().subscribe(resp => this.areas_laborales = resp);
    this.formExperiencia = this._formBuilder.group({
      empresa: ['', Validators.required],
      area_laboral_id: '',
      funcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      observacion: ''
    });

    if(this.formExperienciaParametro) {
      this.formExperiencia.setValue(this.formExperienciaParametro.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  matDialogClose() {
    if(this.formExperiencia.dirty) {
      return this.formExperiencia;
    }
  }

}
