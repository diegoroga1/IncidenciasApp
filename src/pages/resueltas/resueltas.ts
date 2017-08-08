import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'page-resueltas',
  templateUrl: 'resueltas.html',
})

export class Resueltas {
  resueltas:FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private af:AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Resueltas');
    this.mostrarIncidenciasResueltas();
  }
  mostrarIncidenciasResueltas() {
    this.resueltas=this.af.list('/incidencias');
    this.resueltas.subscribe(incidencias=>{
      incidencias.forEach(incidencia=>{
        if(incidencia.estado==="Resuelta"){
          console.log(incidencia);
        }
      })
    })
  }

}
