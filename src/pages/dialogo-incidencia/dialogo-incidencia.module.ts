import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DialogoIncidencia } from './dialogo-incidencia';

@NgModule({
  declarations: [
    DialogoIncidencia,
  ],
  imports: [
    IonicPageModule.forChild(DialogoIncidencia),
  ],
})
export class DialogoIncidenciaModule {}
