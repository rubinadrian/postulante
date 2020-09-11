import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { ListaComponent } from '../pages/lista/lista.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';
import { SaludoComponent } from '../pages/saludo/saludo.component';
import { AuthGuard } from './guards/auth.guard';
import { AreaCoopunionComponent } from '../pages/area-coopunion/area-coopunion.component';
import { AreaLaboralComponent } from '../pages/area-laboral/area-laboral.component';
import { AreaEstudioComponent } from '../pages/area-estudio/area-estudio.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'home/:postulanteId', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'saludo', component: SaludoComponent,...canActivate(redirectUnauthorizedToLogin) },
  { path: 'lista', component: ListaComponent, canActivate: [AuthGuard]},
  { path: 'areacoopunion', component: AreaCoopunionComponent,}, // canActivate: [AuthGuard]
  { path: 'arealaboral', component: AreaLaboralComponent,}, // canActivate: [AuthGuard]
  { path: 'areaestudio', component: AreaEstudioComponent,}, // canActivate: [AuthGuard]
  { path: '**', component: LoginComponent },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesModule { }
