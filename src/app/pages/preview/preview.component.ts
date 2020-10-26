import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostulanteService } from 'src/app/services/postulante.service';

import { Experiencia } from '../../models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { Estudio, Referencia } from 'src/app/models/interfaces';
import { NivelesEstudioService } from 'src/app/services/niveles.estudio.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { environment } from '../../../environments/environment';
import { CurriculumService } from '../../services/curriculum.service';
import { StoreService } from 'src/app/services/store.service';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  url = environment.url;

  id:any;
  loading = true;
  provincias:any;
  localidades:any;
  p:any;
  profileImagenBase64:any;

  nivelesEstudio = [];
  displayedColumnsEstudios: string[] = ['nivel_estudio_id','institucion','titulo','completo'];
  dataSourceEstudios = new MatTableDataSource<Estudio>([]);

  displayedColumnsExperiencias: string[] = ['empresa', 'funcion', 'fecha_inicio', 'fecha_fin'];
  displayedColumnsReferencias: string[] = ['empresa','contacto','telefono'];
  dataSourceExperiencias = new MatTableDataSource<Experiencia>([]);
  dataSourceReferencias = new MatTableDataSource<Referencia>([]);

  constructor(
    private _ps: PostulanteService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private _nivelesEstudiosService:NivelesEstudioService,
    private _provinciasService: ProvinciasService,
    private _curriculumService:CurriculumService,
    private _storeService:StoreService
  ) {
    this._nivelesEstudiosService.getNivelesEstudios().subscribe(resp => this.nivelesEstudio = resp);
    this._provinciasService.getProvincias().subscribe(resp => this.provincias = resp);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('postulanteId');
      if(this.id) {
        this._ps.getPostulanteById(this.id).subscribe(resp => {
          this.loading = false;
          this.localidades = resp.localidades;
          this.p = resp.postulante;
          this.dataSourceEstudios.data = this.p.estudios;
          this.dataSourceExperiencias.data = this.p.experiencias;
          this.dataSourceReferencias.data = this.p.referencias;
          this._storeService.getImageProfile(this.p.uid_fb).subscribe(resp => this.profileImagenBase64 =resp);
        });
      }
    });
  }

  getNivelText(id) {
    return this.nivelesEstudio.find(n => n.id === id)?.nombre;
  }

  getProvinciaNombre(id_provincia) {
    return this.provincias.find(prov => prov.id === id_provincia)?.nombre;
  }

  getLocalidadNombre(id_localidad) {
    return this.localidades.find(loc => loc.id === id_localidad)?.nombre;
  }


  getCurriculumFile() {
    if(!this.p.curriculum_file) return;
    this._curriculumService.downloadCurriculumFile(this.p.curriculum_file);
  }



}
