import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleIncidencia } from './detalle-incidencia';
@NgModule({
  declarations: [
    DetalleIncidencia,
  ],
  imports: [
    IonicPageModule.forChild(DetalleIncidencia),
  ],

})
export class DetalleIncidenciaModule {}
