import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-incidencias',
  templateUrl: 'incidencias.html',
})
export class Incidencias {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Incidencias');
  }

}
