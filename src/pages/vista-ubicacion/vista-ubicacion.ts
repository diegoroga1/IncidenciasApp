import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-vista-ubicacion',
  templateUrl: 'vista-ubicacion.html',
})
export class VistaUbicacion {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VistaUbicacion');
  }

}
