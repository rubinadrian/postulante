import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { RoutesModule } from './routes/routes.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { HomeComponent } from "./pages/home/home.component";
import { PersonalesComponent } from './pages/steps/personal/personales.component';
import { FamiliaresComponent } from './pages/steps/familiares/familiares.component';
import { EstudiosComponent } from './pages/steps/estudios/estudios.component';
import { ExperienciasComponent } from './pages/steps/experiencias/experiencias.component';
import { PreferenciasComponent } from './pages/steps/preferencias/preferencias.component';

import { ModalHermanoComponent } from './pages/steps/familiares/modal.hermano.component';
import { ModalHijoComponent } from './pages/steps/familiares/modal.hijo.component';
import { HeaderComponent } from './pages/header/header.component';
import { ModalEstudioComponent } from './pages/steps/estudios/modal.estudio.component';
import { ModalReferenciaComponent } from './pages/steps/experiencias/modal.referencia.component';
import { ModalExperienciaComponent } from './pages/steps/experiencias/modal.experiencia.component';

import { MatCarouselModule } from '@ngmodule/material-carousel';


/** PARA EL FORMATO DE LAS FECHAS */
import{MatDateFormats, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter} from '@angular/material/core';
import { AppDateAdapter } from './services/app-date-adapter.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './pages/login/login.component';
import { PhoneComponent } from './shared/components/phone/phone.component';

/** Esto lo hice para que me funcione el captcha en phone auth */
import firebase from 'firebase/app';
import { ListaComponent } from './pages/lista/lista.component';
import { SaludoComponent } from './pages/saludo/saludo.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { AreaCoopunionComponent } from './pages/area-coopunion/area-coopunion.component';
import { AreaLaboralComponent } from './pages/area-laboral/area-laboral.component';
import { AreaEstudioComponent } from './pages/area-estudio/area-estudio.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ModalAreasComponent } from './shared/components/modal-areas/modal-areas.component';
import { ArchivoCurriculumComponent } from './pages/steps/archivo-curriculum/archivo-curriculum.component';

firebase.initializeApp(environment.firebase);
//--------

const MY_DATE_FORMATS = {
    parse: {
        dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' }
    },
    useUtc: false,
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
 };




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    PersonalesComponent,
    FamiliaresComponent,
    EstudiosComponent,
    ExperienciasComponent,
    PreferenciasComponent,
    ModalHermanoComponent,
    ModalHijoComponent,
    ModalEstudioComponent,
    ModalReferenciaComponent,
    ModalExperienciaComponent,
    LoginComponent,
    PhoneComponent,
    ListaComponent,
    SaludoComponent,
    AreaCoopunionComponent,
    AreaLaboralComponent,
    AreaEstudioComponent,
    SpinnerComponent,
    ModalAreasComponent,
    ArchivoCurriculumComponent,
  ],
  imports: [
    BrowserModule,
    RoutesModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatCarouselModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


/** No es posible interceptar peticiones del firestore :( */
