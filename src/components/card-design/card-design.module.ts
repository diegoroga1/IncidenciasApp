import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CardDesign } from './card-design';

@NgModule({
  declarations: [
    CardDesign,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CardDesign
  ]
})
export class CardDesignModule {}
