import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostulanteComponent } from '../pages/postulante/postulante.component';
import { LoginComponent } from '../pages/login/login.component';
import { ListaComponent } from '../pages/lista/lista.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';
import { SaludoComponent } from '../pages/saludo/saludo.component';
import { AreaCoopunionComponent } from '../pages/abms/area-coopunion/area-coopunion.component';
import { AreaLaboralComponent } from '../pages/abms/area-laboral/area-laboral.component';
import { AreaEstudioComponent } from '../pages/abms/area-estudio/area-estudio.component';
import { UsuarioComponent } from '../pages/usuario/usuario.component';
import { PreviewComponent } from '../pages/preview/preview.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',         component: LoginComponent},
  { path: 'postulante',          component: PostulanteComponent,          ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'postulante/:postulanteId',    component: PostulanteComponent,     ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'preview/:postulanteId', component: PreviewComponent,     ...canActivate(adminOnly) },
  { path: 'saludo',        component: SaludoComponent,        ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'lista',         component: ListaComponent,         ...canActivate(adminOnly) },
  { path: 'areacoopunion', component: AreaCoopunionComponent, ...canActivate(adminOnly) },
  { path: 'arealaboral',   component: AreaLaboralComponent,   ...canActivate(adminOnly) },
  { path: 'areaestudio',   component: AreaEstudioComponent,   ...canActivate(adminOnly) },
  { path: 'usuario',       component: UsuarioComponent,       ...canActivate(adminOnly) },
  { path: '**',            component: LoginComponent },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesModule { }
