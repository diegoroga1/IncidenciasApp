import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'page-resueltas',
  templateUrl: 'resueltas.html',
})

export class Resueltas {
  resueltas:FirebaseListObservable<any>;
  usuarioActual:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private af:AngularFireDatabase) {
  this.usuarioActual=localStorage.getItem('user_uid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Resueltas');
    this.mostrarIncidenciasResueltas();
  }
  ionViewWillEnter(){
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
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.mostrarIncidenciasResueltas();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
