import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Obrero } from './obrero';

@NgModule({
  declarations: [
    Obrero,
  ],
  imports: [
    IonicPageModule.forChild(Obrero),
  ],
})
export class ObreroModule {}
