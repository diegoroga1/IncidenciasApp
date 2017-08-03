import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

import {CardDesign} from '../../components/card-design/card-design';
@Component({
  selector: 'page-asignadas',
  templateUrl: 'asignadas.html',
})
export class Asignadas {
  asignadas=[];
  constructor(public navCtrl: NavController,private af:AngularFireDatabase, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Asignadas');
    this.mostrarIncidenciasAsignadas();
  }
  mostrarIncidenciasAsignadas() {
    this.af.list('/users/' + localStorage.getItem("user_uid") + '/incidenciasAsignadas').forEach(data => {
      console.log(data);
      data.forEach(item => {
        console.log(item);
        this.asignadas.push(item);
      })
    });
  }
}
