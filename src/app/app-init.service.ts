import { Injectable }  from '@angular/core';
import { AuthService } from './services/auth.service';

/*
Esta clase funciona con APP_INITIALIZER en el app.module.
Se ejecuta al inicio, cuando carga por primera vez la pagina.
Se retorna una promesa porque asi funciona al APP_INITIALIZER.
Cuando se retorna una promesa, hasta que no se resuelve, no sigue cargando la pagina.
La idea es eperar el token del usuario en firebase.
*/


@Injectable()
export class AppInitService {

    constructor(private _auth:AuthService) {
    }

    Init() {
        return new Promise<void>((resolve, reject) => {
          this._auth.listenAuth().then(a=>resolve());
        });
    }
}
