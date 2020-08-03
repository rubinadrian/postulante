import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GenerosService } from 'src/app/services/generos.service';
import { EstadosCivilesService } from 'src/app/services/estados.civiles.service';
import { ModalHermanoComponent } from './modal.hermano.component';
import { ModalHijoComponent } from './modal.hijo.component';
import { Hijo, Hermano, TextValue, Madre, Padre } from 'src/app/models/interfaces';
import { SwalService } from 'src/app/services/swal.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'step-familiares',
  templateUrl: './familiares.component.html',
  styleUrls: ['./familiares.component.css']
})
export class FamiliaresComponent implements OnInit {

  generos = [];
  formStepFamiliares: FormGroup;
  siNo: TextValue[] = [{value: true, text: 'Si'},{value: false, text: 'No'}];
  estadosCiviles = [];
  displayedColumnsHijos: string[] = ['nombre', 'genero_id', 'edad', 'tools'];
  displayedColumnsHermanos: string[] = ['nombre', 'genero_id', 'edad', 'oficio', 'tools'];
  dataSourceHijos = new MatTableDataSource<Hijo>([]);
  dataSourceHermanos = new MatTableDataSource<Hermano>([]);


  constructor(private _formBuilder: FormBuilder,
              public _estadosCivilesService: EstadosCivilesService,
              public _generosService: GenerosService,
              public _swal:SwalService,
              public _dialogService: DialogService) {}



  ngOnInit() {

    this._estadosCivilesService.getEstadosCiviles().subscribe(resp => this.estadosCiviles = resp);
    this._generosService.getGeneros().subscribe(resp => this.generos = resp);

    // Fomrilario Datos Familiares
    this.formStepFamiliares = this._formBuilder.group({
      estado_civil_id: ['', Validators.required],
      nombre_pareja: '',
      hijos: this._formBuilder.array([]),
      hermanos: this._formBuilder.array([]),
      madre: this._formBuilder.group({nombre: ['', Validators.required],oficio: '',vive: true}),
      padre: this._formBuilder.group({nombre: ['', Validators.required],oficio: '',vive: true})
    });

  }

  public setFormValues(data) {
    let familiares = {
      madre: new Madre(data.familiares.find(v => v.tipo_familiar_id == '1')),
      padre: new Padre(data.familiares.find(v => v.tipo_familiar_id == '2')),
      hijos: data.familiares.filter(v => v.tipo_familiar_id == '3').map(v => new Hijo(v)),
      hermanos: data.familiares.filter(v => v.tipo_familiar_id == '4').map(v => new Hermano(v)),
      estado_civil_id: data.estado_civil_id,
      nombre_pareja: data.nombre_pareja,
    };

    this.hijosArray.clear();
    this.hermanosArray.clear();
    // es necesario dar formato al formarray para setar valores
    familiares.hijos.forEach(() => {
      this.hijosArray.push(this._formBuilder.group({
        nombre: ['', Validators.required],
        edad: '',
        genero_id: '',
      }));
    });

    familiares.hermanos.forEach(() => {
      this.hermanosArray.push(this._formBuilder.group({
        nombre: ['', Validators.required],
        edad: '',
        oficio: '',
        genero_id: '',
      }));
    });

    this.formStepFamiliares.setValue(familiares);
    this.dataSourceHijos.data = this.hijosArray.value;
    this.dataSourceHermanos.data = this.hermanosArray.value;
  }

  get hermanosArray(): FormArray {
    return this.formStepFamiliares.get('hermanos') as FormArray;
  }

  get hijosArray() {
    return this.formStepFamiliares.get('hijos') as FormArray;
  }

  getTextGenero(id: string) {
    return this.generos.find(g => g.id === id)?.nombre;
  }

  delHermano(hermano: Hermano) {
    this._swal.confirmRemove(() => {
      let index = this.dataSourceHermanos.filteredData.indexOf(hermano);
      this.hermanosArray.removeAt(index);
      this.dataSourceHermanos.data = this.hermanosArray.value;
    });
  }

  delHijo(hijo: Hijo) {
    this._swal.confirmRemove(() => {
      let index = this.dataSourceHijos.filteredData.indexOf(hijo);
      this.hijosArray.removeAt(index);
      this.dataSourceHijos.data = this.hijosArray.value;
    });
  }

  editHijo(hijo: Hijo) {
    let index = this.dataSourceHijos.filteredData.indexOf(hijo);
    this.openDialogHijo(this.hijosArray.at(index) as FormGroup);
  }

  editHermano(hermano: Hermano) {
    let index = this.dataSourceHermanos.filteredData.indexOf(hermano);
    this.openDialogHermano(this.hermanosArray.at(index) as FormGroup);
  }

  openDialogHijo(formHijo: FormGroup|null = null): void {
    this._dialogService.openDialog(formHijo, ModalHijoComponent, this.hijosArray, this.dataSourceHijos);
  }

  openDialogHermano(formHermano: FormGroup|null = null): void {
    this._dialogService.openDialog(formHermano, ModalHermanoComponent, this.hermanosArray, this.dataSourceHermanos);
  }

}
