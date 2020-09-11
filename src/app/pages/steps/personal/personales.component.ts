import { Component, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { Provincia } from 'src/app/models/provincia.model';
import { Localidad } from 'src/app/models/localidad.model';
import { LocalidadesService } from 'src/app/services/localidades.service';
import { StoreService } from '../../../services/store.service';
import { GenerosService } from '../../../services/generos.service';
import { SwalService } from '../../../services/swal.service';
import { AuthService } from '../../../services/auth.service';
import { Personal } from 'src/app/models/interfaces';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'step-pesonal',
  templateUrl: './personales.component.html',
  styleUrls: ['./personales.component.css']
})
export class PersonalesComponent implements OnInit {
  formStepPersonal:FormGroup;
  fechaNacimiento:Date;
  generos = [];
  provincias: Provincia[] = [];
  localidades: Localidad[] = [];
  localidadesFiltradas: Observable<Localidad[]>;
  isEditable = true;
  profileImagenBase64;
  imagenFile:File;
  isImageSaved = false;
  uid = '';

    constructor(private _formBuilder: FormBuilder,
              private _generos: GenerosService,
              private storeService:StoreService,
              private _provinciasService: ProvinciasService,
              private _localidadesService: LocalidadesService,
              private swal:SwalService,
              private _auth:AuthService) {
      const currentYear = new Date().getFullYear();
      _provinciasService.getProvincias().subscribe(resp => this.provincias = resp);
      _generos.getGeneros().subscribe(resp => this.generos = resp);
    }

  ngOnInit(): void {
    // Formulario Datos Personales
    this.formStepPersonal = this._formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      domicilio: ['', Validators.required],
      provincia_id: ['', Validators.required],
      localidad_id: [{ value: '', disabled: true }, [Validators.required, this.validarLocalidad()]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      genero_id: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      email: ['', Validators.email],
      celular: '',
      vivienda: false
    });

    // Es un observer que necesita el mat-autocomplete
    this.localidadesFiltradas = this.formStepPersonal.controls.localidad_id.valueChanges.pipe(startWith(''),
      map(value => this._filterLocalidad(value)));
  }

  public setFormValues(data) {
    if(data.keyfirestore) {
      this.uid = data.keyfirestore;
      this.storeService.getImageProfile(data.keyfirestore).subscribe(resp => this.profileImagenBase64 =resp);
    } else {
      this.uid = this._auth.user.uid;
    }
    let personal = new Personal(data);
    this.formStepPersonal.setValue(personal);
    this.formStepPersonal.controls.localidad_id.enable();
  }

  public setLocalidades(localidades:Localidad[]) {
    this.localidades = localidades;
  }

  // Al trabajar con objetos, es necesario un metodo [displayWith].
  displayLocalidad(id_localidad) {
    return this.localidades.find(loc => loc.id === id_localidad)?.nombre;
  }

  // Habilita el control localidad, al seleccionar una provincia
  onSelectProvincia(event) {
    this._localidadesService.getLocalidades(this.formStepPersonal.controls.provincia_id.value)
      .subscribe(resp => this.localidades = resp);
    this.formStepPersonal.controls.localidad_id.reset();
    this.formStepPersonal.controls.localidad_id.enable();
  }

  // Selecciona la primer coincidencia en la localidad.
  seleccionAutomatica() {
    let l = this._filterLocalidad(this.formStepPersonal.controls.localidad_id.value);
    if(l.length > 0) {
      this.formStepPersonal.controls.localidad_id.setValue(l[0].id);
    }
  }

  private _filterLocalidad(value: string): Localidad[] {
    let resp = [];
    if(this.formStepPersonal.controls.localidad_id.disabled || typeof value != 'string') return [];
    if(this.formStepPersonal.value.provincia !== '') {
      const filterValue = value.toLowerCase();
      resp = this.localidades.filter(localidad => localidad.nombre.toLowerCase().includes(filterValue) && localidad.provincia_id  === this.formStepPersonal.controls.provincia_id.value);
    }
    return resp;
  }

  // Es un metodo que retorna un validador, por eso lleva los parentesis al utilizarlo.
  validarLocalidad(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.localidades.find(loc => loc.id === control.value) ? null : {'No es un elemento de la lista': {value: control.value}};
    };
  }

  uploadImageFile(eventChangeFile) {
    let imageError = null;
    if (eventChangeFile.target.files && eventChangeFile.target.files[0]) {
      const max_size = 6000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      // Permitimos solo imagenes
      if (!allowed_types.includes(eventChangeFile.target.files[0].type)) {
        imageError = 'Only Images are allowed ( JPG | PNG )';
        this.swal.error('File upload error', 'Tipo de archivo no permitido');
        return false;
      }

      // Limitamos el peso del archivo
      if (eventChangeFile.target.files[0].size > max_size) {
        imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        this.swal.error('File upload error', 'Archivo muy grande.');
        return false;
      }


      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result as string;
        image.onload = (rs) => {
          const imgBase64Path = e.target.result;
          this.profileImagenBase64 = this.resizeImage(image);
          this.isImageSaved = true;
          // this.imagenFile = eventChangeFile.target.files[0];
          this.storeService.uploadFileBase64(this.uid, this.profileImagenBase64);
        };
      };

      fileReader.readAsDataURL(eventChangeFile.target.files[0]);
    }
  }

  removeImage() {
    this.profileImagenBase64 = null;
    this.isImageSaved = false;
  }

  resizeImage(image) {
    let canvas=document.createElement("canvas");
    let context=canvas.getContext("2d");
    canvas.width=300;
    canvas.height=300;
    context.drawImage(image,0,0,image.width,image.height,0,0,canvas.width,canvas.height);
    return canvas.toDataURL();
  }

}
