export class Estudio {
  nivel_estudio_id: string;
  area_estudio_id: number;
  institucion: number;
  completo: boolean;
  titulo: string;
  constructor(data:any){
    this.nivel_estudio_id = data.nivel_estudio_id;
    this.area_estudio_id = data.area_estudio_id;
    this.institucion = data.institucion;
    this.completo = data.completo;
    this.titulo = data.titulo;
  }
}

export class Experiencia {
  empresa: string;
  area_laboral_id: number;
  funcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  observacion: string;
  constructor(data:any) {
    this.empresa = data.empresa;
    this.area_laboral_id = data.area_laboral_id;
    this.funcion = data.funcion;
    this.fecha_inicio = new Date(data.fecha_inicio);
    this.fecha_inicio = new Date(this.fecha_inicio.setTime(this.fecha_inicio.getTime() + (3*60*60*1000)));
    this.fecha_fin = new Date(data.fecha_fin);
    this.fecha_fin = new Date(this.fecha_fin.setTime(this.fecha_fin.getTime() + (3*60*60*1000)));
    this.observacion = data.observacion;
  }
}

export class Referencia {
  empresa: string;
  contacto: string;
  telefono: string;
  observacion: string;

  constructor(data:any) {
    this.empresa = data.empresa;
    this.contacto = data.contacto;
    this.telefono = data.telefono;
    this.observacion = data.observacion;
  }
}

export interface TextValue {
  value: boolean;
  text: string;
}

export interface Postulante {
  uid?:string;
  estudios:any;
  experiencias:any;
  familiares:any;
  personal:any;
  preferencias:any
}

// export interface Familia {
//   madre:Familiar;
//   padre:Familiar;
//   hermanos:Familiar[];
//   hijos:Familiar[];
//   nombre_pareja?:string;
//   estado_civil_id?:number;
// }

// export interface Familiar {
//   nombre:string;
//   oficio?:string;
//   vive?:boolean;
//   edad?:number;
//   genero_id?:number;
// }

export class Madre {
  nombre: string;
  vive: boolean;
  oficio: string;

  constructor(data:any){
    this.nombre = data.nombre;
    this.vive = data.vive?true:false;
    this.oficio = data.oficio;
  }
}

export class Padre {
  nombre: string;
  vive: boolean;
  oficio: string;

  constructor(data:any){
    this.nombre = data.nombre;
    this.vive = data.vive?true:false;
    this.oficio = data.oficio;
  }
}


export class Hijo {
  nombre: string;
  edad: number;
  genero_id: string;

  constructor(data:any){
    this.nombre = data.nombre;
    this.edad = data.edad;
    this.genero_id = data.genero_id;
  }
}

export class Hermano {
  nombre: string;
  edad: number;
  genero_id: string;
  oficio: string;

  constructor(data:any){
    this.nombre = data.nombre;
    this.edad = data.edad;
    this.genero_id = data.genero_id;
    this.oficio = data.oficio;
  }
}


export class Personal {
  nombre:any;
  apellido:any;
  domicilio:any;
  provincia_id:any;
  localidad_id:any;
  dni:any;
  genero_id:any;
  fecha_nacimiento:any;
  email:any;
  celular:any;
  vivienda:any;
  constructor(data:any){
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.domicilio = data.domicilio;
    this.provincia_id = data.provincia_id;
    this.localidad_id = data.localidad_id;
    this.dni = data.dni;
    this.genero_id = data.genero_id;
    this.fecha_nacimiento = new Date(data.fecha_nacimiento);
    this.fecha_nacimiento = new Date(this.fecha_nacimiento.setTime(this.fecha_nacimiento.getTime() + (3*60*60*1000)));
    this.email = data.email;
    this.celular = data.celular;
    this.vivienda = data.vivienda;
  }
}

export interface NivelEstudio {
  id: string;
  nombre: string;
}

export interface AreaEstudio {
  id: number;
  nombre: string;
}
