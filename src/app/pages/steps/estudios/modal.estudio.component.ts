import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NivelesEstudioService } from 'src/app/services/niveles.estudio.service';
import { AreasEstudioService } from 'src/app/services/areas.estudio.service';
import { TextValue } from 'src/app/models/interfaces';

@Component({
  selector: 'modal-estudio',
  templateUrl: 'modal.estudio.html',
})
export class ModalEstudioComponent implements OnInit{
  formEstudio: FormGroup;
  niveles_estudios = [];
  areas_estudios = [];
  siNo: TextValue[] = [{value: true, text: 'Si'},{value: false, text: 'No'}];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalEstudioComponent>,
    public _nivelesEstudiosService:NivelesEstudioService,
    public _areasEstudiosService: AreasEstudioService,
    @Inject(MAT_DIALOG_DATA) public formEstudioParametro:FormGroup) {}

  ngOnInit() {
    this._areasEstudiosService.getAreasEstudios().subscribe(resp => this.areas_estudios = resp);
    this._nivelesEstudiosService.getNivelesEstudios().subscribe(resp => this.niveles_estudios = resp);
    this.formEstudio = this._formBuilder.group({
      nivel_estudio_id: ['', Validators.required],
      area_estudio_id: '',
      institucion: '',
      completo: true,
      titulo: ''
    });

    if(this.formEstudioParametro) {
      this.formEstudio.setValue(this.formEstudioParametro.value);
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  matDialogClose() {
    if(this.formEstudio.dirty) {
      return this.formEstudio;
    }
  }

}
