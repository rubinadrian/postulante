import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
// RXJS
import { Observable } from 'rxjs/internal/Observable';
import { startWith, map, pairwise } from 'rxjs/operators';
// Self
import { LocalidadesService } from 'src/app/services/localidades.service';
import { GenerosService } from 'src/app/services/generos.service';
import { Provincia } from 'src/app/models/provincia.model';
import { Localidad } from 'src/app/models/localidad.model';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { PostulanteService } from 'src/app/services/postulante.service';
import { NivelesEstudioService } from 'src/app/services/niveles.estudio.service';
import { AreasEstudioService } from 'src/app/services/areas.estudio.service';
import { AreasLaboralesService } from 'src/app/services/areas.laborales.service';
import { AreasCoopunionService } from '../../services/areas.coopunion.service';
import { storage } from 'firebase';
// import { RestaurarbdService } from '../../services/restaurarbd.service';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  formFilters:FormGroup;
  provincias: Provincia[] = [];
  localidades: Localidad[] = [];
  localidadesFiltradas: Observable<Localidad[]>;
  niveles_estudios = [];
  areas_estudios = [];
  areas_laborales = [];
  areas_coopunion = [];
  generos = [];

  listlength = 0;
  pageSize = 100;
  pageIndex = 0;
  pageSizeOptions: number[] = [10,50,100,200,500];


  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'celular', 'tools'];
  dataSource = new MatTableDataSource<any>([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private _generos: GenerosService,
              private _formBuilder: FormBuilder,
              private _provinciasService: ProvinciasService,
              private _localidadesService: LocalidadesService,
              private _ps:PostulanteService,
              private _nivelesEstudiosService:NivelesEstudioService,
              private _areasLaboralesService: AreasLaboralesService,
              private _areasEstudiosService: AreasEstudioService,
              private _areasCoopunion:AreasCoopunionService,
              private router:Router,
              private ref: ChangeDetectorRef) {

    this._provinciasService.getProvincias().subscribe(resp => this.provincias = resp);
    this._generos.getGeneros().subscribe(resp => this.generos = resp);
    this._areasEstudiosService.getAreasEstudios().subscribe(resp => this.areas_estudios = resp);
    this._areasLaboralesService.getAreasLaborales().subscribe(resp => this.areas_laborales = resp);
    this._nivelesEstudiosService.getNivelesEstudios().subscribe(resp => this.niveles_estudios = resp);
    this._areasCoopunion.getAreas().subscribe(resp => this.areas_coopunion = resp);
  }

  getLastStatus() {
    let ls = window.localStorage.getItem('filtros');
    if(ls) {
      let {filtros, query} = JSON.parse(ls);
      if(filtros.provincia_id) {
        this.onSelectProvincia(filtros.provincia_id);
      }
      this.formFilters.patchValue(filtros);
      this.setTableAndPaginator(query);
    }
  }

  saveLastStatus(filtros, query) {
    window.localStorage.setItem('filtros', JSON.stringify({filtros, query}));
  }

  filterCurriculums() {
    let data = this.formFilters.value;
    data.page = +this.pageIndex + 1;
    data.per_page = +this.pageSize;
    this._ps.getPostulantes(data).subscribe(query => {
      this.saveLastStatus(this.formFilters.value, query);
      this.setTableAndPaginator(query);
    });
  }

  private setTableAndPaginator(query) {
    this.dataSource = new MatTableDataSource(query.data);
    this.listlength = query.total;
    this.pageIndex = query.current_page - 1;
    this.pageSize = query.per_page;
  }

  ngOnInit(): void {
       this.formFilters = this._formBuilder.group({
        provincia_id: [''],
        localidad_id: [{ value: '', disabled: true }],
        genero_id: [''],
        nivel_estudio_id: [''],
        area_laboral: [''],
        area_estudio: [''],
        areas_coopunion: [''],
        completo: false,
        vivienda: false,
        edad_minima: 12,
        edad_maxima: 100,
        fecha_desde:  [''],
        fecha_hasta:  [''],
      });

      // pairwise devuelve un array con el valor anterior y el nuevo valor
      this.formFilters.controls.area_estudio.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
        if(next.length > 10) {
          this.formFilters.controls.area_estudio.setValue(prev);
        }
      });
      this.formFilters.controls.area_laboral.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
        if(next.length > 10) {
          this.formFilters.controls.area_laboral.setValue(prev);
        }
      });

      // Es un observer que necesita el mat-autocomplete
      this.localidadesFiltradas = this.formFilters.controls.localidad_id.valueChanges.pipe(startWith(''),
        map(value => this._filterLocalidad(value)));

      this.getLastStatus();
  }

    // Al trabajar con objetos, es necesario un metodo [displayWith].
    displayLocalidad(id_localidad) {
      return this.localidades.find(loc => loc.id === id_localidad)?.nombre;
    }

    // Habilita el control localidad, al seleccionar una provincia
    onSelectProvincia(provincia_id) {
      this.localidades = [];
      this.formFilters.controls.localidad_id.reset();
      this.formFilters.controls.localidad_id.disable();
      this._localidadesService.getLocalidades(provincia_id)
        .subscribe(resp => {
          this.localidades = resp;
          this.formFilters.controls.localidad_id.setValue('');
          this.formFilters.controls.localidad_id.enable();
        });
    }

    // Selecciona la primer coincidencia en la localidad.
    seleccionAutomatica() {
      let l = this._filterLocalidad(this.formFilters.controls.localidad_id.value);
      if(l.length > 0) {
        this.formFilters.controls.localidad_id.setValue(l[0].id);
      }
    }

    private _filterLocalidad(value: string): Localidad[] {
      let resp = [];
      if(this.formFilters.controls.localidad_id.disabled || typeof value != 'string') return [];
      if(this.formFilters.value.provincia_id !== '') {
        const filterValue = value.toLowerCase();
        resp = this.localidades.filter(localidad => localidad.nombre.toLowerCase().includes(filterValue) && localidad.provincia_id  === this.formFilters.controls.provincia_id.value);
      }
      return resp;
    }

      // Es un metodo que retorna un validador, por eso lleva los parentesis al utilizarlo.
    validarLocalidad(): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} | null => {
        return this.localidades.find(loc => loc.id === control.value) ? null : {'No es un elemento de la lista': {value: control.value}};
      };
    }

    previewPostulante(row) {
      this.router.navigate(['preview', row.id]).then();
    }

    editPostulante(row) {
      this.router.navigate(['postulante', row.id]).then();
    }

    changePage(pageEvent:PageEvent) {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
      this.filterCurriculums();
    }

}
