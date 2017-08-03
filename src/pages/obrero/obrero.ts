import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
  selector: 'page-obrero',
  templateUrl: 'obrero.html',
})
export class Obrero {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Obrero');
  }

}
