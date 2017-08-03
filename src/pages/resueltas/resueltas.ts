import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
@Component({
  selector: 'page-resueltas',
  templateUrl: 'resueltas.html',
})
export class Resueltas {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Resueltas');
  }

}
