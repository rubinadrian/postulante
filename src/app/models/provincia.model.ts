
export class Provincia {
    nombre_completo: string;
    fuente:          string;
    iso_id:          string;
    nombre:          string;
    id:              string;
    categoria:       string;
    iso_nombre:      string;
    centroide:       Centroide;
}

export interface Centroide {
    lat: number;
    lon: number;
}
