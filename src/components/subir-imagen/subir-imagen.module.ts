import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SubirImagen } from './subir-imagen';

@NgModule({
  declarations: [
    SubirImagen,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    SubirImagen
  ]
})
export class SubirImagenModule {}
