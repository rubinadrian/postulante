import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Experiencia, Referencia } from 'src/app/models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { SwalService } from 'src/app/services/swal.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ModalExperienciaComponent } from './modal.experiencia.component';
import { ModalReferenciaComponent } from './modal.referencia.component';
import { SizeScreenService } from 'src/app/services/size-screen.service';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';


@Component({
  selector: 'step-experiencias',
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.css']
})
export class ExperienciasComponent implements OnInit {
  areas = [];
  formStepExperiencias:FormGroup

  displayedColumnsExperiencias: string[] = ['empresa', 'funcion', 'fecha_inicio', 'fecha_fin', 'observacion', 'tools'];
  displayedColumnsReferencias: string[] = ['empresa','contacto','telefono', 'observacion', 'tools'];
  dataSourceExperiencias = new MatTableDataSource<Experiencia>([]);
  dataSourceReferencias = new MatTableDataSource<Referencia>([]);

  constructor(public _formBuilder:FormBuilder,
              public _dialogService:DialogService,
              public _swal:SwalService,
              public _sizeScreen:SizeScreenService) {}


  ngOnInit(): void {
    this.formStepExperiencias = this._formBuilder.group({
      experiencias: this._formBuilder.array([]),
      referencias: this._formBuilder.array([])
    });


    this._sizeScreen.subject.pipe(distinctUntilChanged()).subscribe((resp:any) => {
      if(resp != 'xs') {
        this.displayedColumnsExperiencias = ['empresa', 'funcion', 'fecha_inicio', 'fecha_fin', 'observacion', 'tools'];
        this.displayedColumnsReferencias = ['empresa','contacto','telefono', 'observacion', 'tools'];
      } else {
        this.displayedColumnsExperiencias = ['empresa', 'funcion', 'tools'];
        this.displayedColumnsReferencias = ['empresa','contacto', 'tools'];
      }
    });
  }

  public setFormValues(data:any) {
    this.experienciasArray.clear();
    this.referenciasArray.clear();

    // es necesario dar formato al formarray para setar valores
    data.experiencias.forEach((experiencia) => {
      this.experienciasArray.push(this._formBuilder.group({
        empresa: ['', Validators.required],
        area_laboral_id: '',
        funcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        observacion: ''
      }));
    });

    data.referencias.forEach(() => {
      this.referenciasArray.push(this._formBuilder.group({
        empresa: ['', Validators.required],
        contacto: '',
        telefono: '',
        observacion: '',
      }));
    });

    let experiencias = data.experiencias.map(v => new Experiencia(v));
    let referencias = data.referencias.map(v => new Referencia(v));

    this.formStepExperiencias.setValue({experiencias,referencias});
    this.dataSourceExperiencias.data = this.experienciasArray.value;
    this.dataSourceReferencias.data  = this.referenciasArray.value;
  }

  get experienciasArray(): FormArray {
    return this.formStepExperiencias.get('experiencias') as FormArray;
  }

  get referenciasArray() {
    return this.formStepExperiencias.get('referencias') as FormArray;
  }

  delExperiencia(experiencia: Experiencia) {
    this._swal.confirmRemove(() => {
      let index = this.dataSourceExperiencias.filteredData.indexOf(experiencia);
      this.experienciasArray.removeAt(index);
      this.dataSourceExperiencias.data = this.experienciasArray.value;
    });
  }

  delReferencia(referencia: Referencia) {
    this._swal.confirmRemove(() => {
      let index = this.dataSourceReferencias.filteredData.indexOf(referencia);
      this.referenciasArray.removeAt(index);
      this.dataSourceReferencias.data = this.referenciasArray.value;
    });
  }

  editExperiencia(experiencia: Experiencia) {
    let index = this.dataSourceExperiencias.filteredData.indexOf(experiencia);
    this.openDialogExperiencia(this.experienciasArray.at(index) as FormGroup);
  }

  editReferencia(referencia: Referencia) {
    let index = this.dataSourceReferencias.filteredData.indexOf(referencia);
    this.openDialogReferencia(this.referenciasArray.at(index) as FormGroup);
  }

  openDialogExperiencia(formExperiencia: FormGroup|null = null): void {
    this._dialogService.openDialog(formExperiencia, ModalExperienciaComponent, this.experienciasArray, this.dataSourceExperiencias);
  }

  openDialogReferencia(formReferencia: FormGroup|null = null): void {
    this._dialogService.openDialog(formReferencia, ModalReferenciaComponent, this.referenciasArray, this.dataSourceReferencias);
  }


}
