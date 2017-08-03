import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Encargado } from './encargado';

@NgModule({
  declarations: [
    Encargado,
  ],
  imports: [
    IonicPageModule.forChild(Encargado),
  ],
})
export class EncargadoModule {}
