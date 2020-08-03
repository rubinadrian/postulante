import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Estudio, TextValue } from 'src/app/models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { SwalService } from 'src/app/services/swal.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ModalEstudioComponent } from './modal.estudio.component';
import { NivelesEstudioService } from 'src/app/services/niveles.estudio.service';
import { SizeScreenService } from '../../../services/size-screen.service';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
  selector: 'step-estudios',
  templateUrl: './estudios.component.html',
  styleUrls: ['./estudios.component.css']
})
export class EstudiosComponent implements OnInit {
  formStepEstudios: FormGroup;
  nivelesEstudio = [];
  siNo: TextValue[] = [{value: true, text: 'Si'},{value: false, text: 'No'}];
  displayedColumnsEstudios: string[] = ['nivel_estudio_id','institucion','completo','titulo', 'tools'];
  dataSourceEstudios = new MatTableDataSource<Estudio>([]);


  constructor(public _formBuilder:FormBuilder,
              public _dialogService:DialogService,
              public _swal:SwalService,
              public _nivelesEstudiosService:NivelesEstudioService,
              public _sizeScreen:SizeScreenService) {
    this._nivelesEstudiosService.getNivelesEstudios().subscribe(resp => this.nivelesEstudio = resp);
  }


  ngOnInit(): void {
    this.formStepEstudios = this._formBuilder.group({
      estudios: this._formBuilder.array([]),
    });

    this._sizeScreen.subject.pipe(distinctUntilChanged()).subscribe((resp:any) => {
      if(resp != 'xs') {
        this.displayedColumnsEstudios = ['nivel_estudio_id','institucion','completo','titulo', 'tools'];
      } else {
        this.displayedColumnsEstudios = ['nivel_estudio_id','institucion','tools'];
      }
    });
  }

  public setFormValues(data:any) {
    this.estudiosArray.clear();
    // es necesario dar formato al formarray para setar valores
    data.estudios.forEach(() => {
      this.estudiosArray.push(this._formBuilder.group({
        nivel_estudio_id: '',
        area_estudio_id: '',
        institucion: '',
        completo: true,
        titulo: ''
      }));
    });
    let estudios = data.estudios.map(v => new Estudio(v));
    this.formStepEstudios.setValue({estudios});
    this.dataSourceEstudios.data = this.estudiosArray.value;
  }


  get estudiosArray(): FormArray {
    return this.formStepEstudios.get('estudios') as FormArray;
  }

  getNivelText(id) {
    return this.nivelesEstudio.find(n => n.id === id)?.nombre;
  }


  delEstudio(estudio: Estudio) {
    this._swal.confirmRemove(() => {
      let index = this.dataSourceEstudios.filteredData.indexOf(estudio);
      this.estudiosArray.removeAt(index);
      this.dataSourceEstudios.data = this.estudiosArray.value;
    });
  }


  editEstudio(estudio: Estudio) {
    let index = this.dataSourceEstudios.filteredData.indexOf(estudio);
    this.openDialogEstudio(this.estudiosArray.at(index) as FormGroup);
  }


  openDialogEstudio(formEstudio: FormGroup|null = null): void {
    this._dialogService.openDialog(formEstudio, ModalEstudioComponent, this.estudiosArray, this.dataSourceEstudios);
  }






}
