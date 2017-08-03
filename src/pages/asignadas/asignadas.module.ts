import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Asignadas } from './asignadas';

@NgModule({
  declarations: [
    Asignadas,
  ],
  imports: [
    IonicPageModule.forChild(Asignadas),
  ],
})
export class AsignadasModule {}
