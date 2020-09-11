import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PersonalesComponent } from '../steps/personal/personales.component';
import { FamiliaresComponent } from '../steps/familiares/familiares.component';
import { MatStepper } from '@angular/material/stepper';
import { EstudiosComponent } from '../steps/estudios/estudios.component';
import { ExperienciasComponent } from '../steps/experiencias/experiencias.component';
import { PreferenciasComponent } from '../steps/preferencias/preferencias.component';
import { PostulanteService } from 'src/app/services/postulante.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SwalService } from '../../services/swal.service';
import { SizeScreenService } from '../../services/size-screen.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class HomeComponent implements OnInit {
  loading = true;
  estado;
  uid;
  id;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._sizeScreen.detectScreenSize(event);
  }

  @ViewChild(PersonalesComponent) stepPersonal: PersonalesComponent;
  @ViewChild(FamiliaresComponent) stepFamiliares: FamiliaresComponent;
  @ViewChild(EstudiosComponent) stepEstudios: EstudiosComponent;
  @ViewChild(ExperienciasComponent) stepExperiencias: ExperienciasComponent;
  @ViewChild(PreferenciasComponent) stepPreferencias: PreferenciasComponent;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private _sizeScreen:SizeScreenService,
    private route: ActivatedRoute,
    private router: Router,
    private _ps: PostulanteService,
    private changeDetector: ChangeDetectorRef,
    private _auth: AuthService,
    private swal:SwalService) { }

  isEditable = true;
  showControls = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('postulanteId');
      if(this.id) {
        this.getPostulanteById(this.id);
      } else {
        this.getPostulanteByUser();
      }
    });

  }

  getPostulanteById(id) {
      this._ps.getPostulanteById(id).subscribe(data => this.setValuesStepsForms(data));
  }


  getPostulanteByUser() {
    this._auth.getUserLoggedIn.subscribe((user:any) => {
      if(user) {
        this.uid = user.uid;
        this._ps.getPostulante(user.uid).subscribe(data => {
          this.loading = false;
          if(data && data.postulante.id) {
            this.id = data.postulante.id;
            this.setValuesStepsForms(data);
          }
        });
      }
    });
  }

  setValuesStepsForms(data:any) {
    this.loading = false;
    this.changeDetector.detectChanges();
    if(!data || !data.postulante) return;
    this.stepPersonal.setLocalidades(data.localidades);
    this.stepPersonal.setFormValues(data.postulante);
    this.stepFamiliares.setFormValues(data.postulante);
    this.stepEstudios.setFormValues(data.postulante);
    this.stepExperiencias.setFormValues(data.postulante);
    this.stepPreferencias.setFormValues(data.postulante);
  }

  terminoAnimacion() {
    this.showControls = true;
  }

  empezoAnimacion(){
    this.showControls = false;
  }

  get formStepPersonal() {
    return this.stepPersonal
      ? this.stepPersonal.formStepPersonal
      : new FormGroup({});
  }

  get formStepFamiliares() {
    return this.stepFamiliares
      ? this.stepFamiliares.formStepFamiliares
      : new FormGroup({});
  }

  get formStepEstudios() {
    return this.stepEstudios
      ? this.stepEstudios.formStepEstudios
      : new FormGroup({});
  }

  get formStepExperiencias() {
    return this.stepExperiencias
      ? this.stepExperiencias.formStepExperiencias
      : new FormGroup({});
  }

  get formStepPreferencias() {
    return this.stepPreferencias
      ? this.stepPreferencias.formStepPreferencias
      : new FormGroup({});
  }


  savePostulante() {
    this._auth.getUserLoggedIn.subscribe((user:any) => {
      if(user) {

        this.uid = user.uid;

        const postulante = {
          admin: this._auth.isAdmin,
          id: this.id,
          uid: this.uid,
          personal: this.formStepPersonal.value,
          familiares: this.formStepFamiliares.value,
          estudios: this.formStepEstudios.value,
          experiencias: this.formStepExperiencias.value,
          preferencias: this.stepPreferencias.getPreferenciasSeleccionadas(),
        };

        this._ps.savePostulante(postulante).subscribe(resp => {
            if(!this._auth.isAdmin) {
              this.router.navigate(['/saludo']);
            } else {
              this.swal.saveSuccessful();
            }
        });
      }});
  }
}
