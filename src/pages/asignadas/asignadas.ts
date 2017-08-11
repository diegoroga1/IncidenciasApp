import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

import {CardDesign} from '../../components/card-design/card-design';
@Component({
  selector: 'page-asignadas',
  templateUrl: 'asignadas.html',
})
export class Asignadas {
  asignadas:FirebaseListObservable<any>;
  usuarioActual:any;
  items=[];
  constructor(public navCtrl: NavController,private af:AngularFireDatabase, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Asignadas');
    this.usuarioActual = localStorage.getItem("user_uid");
    this.getNameCurrentUser();
    this.mostrarIncidenciasAsignadas();
  }
  mostrarIncidenciasAsignadas() {
    this.asignadas=this.af.list('/incidencias');
    this.asignadas.subscribe(incidencias=>{
      incidencias.forEach(incidencia=>{
        if(incidencia.encargado==localStorage.getItem("user_uid")){
          console.log(incidencia);
        }
      })
    })
  }
/*
    this.af.list('/users/' + localStorage.getItem("user_uid") + '/incidenciasAsignadas').forEach(data => {
      console.log(data);
      data.forEach(item => {
        console.log(item);
        this.asignadas.push(item);
      })
    });*/

  getNameCurrentUser() {
    this.af.list('/users/' + localStorage.getItem("user_uid")).forEach(data => {
      data.forEach(campos => {
        if (campos.$key == "nombre") {
          console.log(campos.$value);

        }
      })
    })
  }
}
