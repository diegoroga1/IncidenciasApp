import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VistaUbicacion } from './vista-ubicacion';

@NgModule({
  declarations: [
    VistaUbicacion,
  ],
  imports: [
    IonicPageModule.forChild(VistaUbicacion),
  ],
})
export class VistaUbicacionModule {}
