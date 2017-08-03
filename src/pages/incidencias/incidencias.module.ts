import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Incidencias } from './incidencias';

@NgModule({
  declarations: [
    Incidencias,
  ],
  imports: [
    IonicPageModule.forChild(Incidencias),
  ],
})
export class IncidenciasModule {}
