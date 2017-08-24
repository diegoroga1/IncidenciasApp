import { NgModule, ErrorHandler,ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {CogerNombre} from '../providers/coger-nombre';

import { CogerUbicacion } from '../providers/coger-ubicacion';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CardDesign} from '../components/card-design/card-design';
import {Encargado} from '../pages/encargado/encargado';
import {DialogoIncidencia} from '../pages/dialogo-incidencia/dialogo-incidencia';
import {Intro} from '../pages/intro/intro';
import {Admin} from '../pages/admin/admin';
import {DetalleIncidencia} from '../pages/detalle-incidencia/detalle-incidencia';
import {Asignadas} from '../pages/asignadas/asignadas';
import {Creadas} from '../pages/creadas/creadas';
import {Resueltas} from '../pages/resueltas/resueltas';
import {VistaUbicacion} from '../pages/vista-ubicacion/vista-ubicacion';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

export const firebaseConfig = {
  apiKey: "AIzaSyB5Y4AeJuBY6XxsX0pELump_3m7sDhdkiI",
  authDomain: "incidenciasapp-129ab.firebaseapp.com",
  databaseURL: "https://incidenciasapp-129ab.firebaseio.com",
  projectId: "incidenciasapp-129ab",
  storageBucket: "incidenciasapp-129ab.appspot.com",
  messagingSenderId: "798383736376"
};

@NgModule({
  declarations: [
    MyApp,
    Encargado,
    DialogoIncidencia,
    Intro,
    Admin,
    Asignadas,
    Creadas,
    Resueltas,
    CardDesign,
    DetalleIncidencia,
    VistaUbicacion
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    InfiniteScrollModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Encargado,
    DialogoIncidencia,
    Intro,
    Admin,
    Asignadas,
    Creadas,
    Resueltas,
    CardDesign,
    DetalleIncidencia,
    VistaUbicacion
  ],
  providers: [
    StatusBar,
    SplashScreen, File,
    Transfer,
    Camera,
    FilePath,
    Geolocation,
    GoogleMaps,
    CogerUbicacion,
    ViewChild,
    CogerNombre,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}


