import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";
import {CardDesign} from '../../components/card-design/card-design';
import {CogerIncidencias} from '../../providers/coger-incidencias';

import * as _ from 'lodash'
@Component({
  selector: 'page-creadas',
  templateUrl: 'creadas.html',
})
export class Creadas  {

  finished=false;
  usuarioActual:any;
  creadas:FirebaseListObservable<any>;
  items=[]
  userNameEncargado:any;
  constructor(public navCtrl: NavController,private af:AngularFireDatabase, public navParams: NavParams,private cIncidencias:CogerIncidencias) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Creadas');
    this.usuarioActual=localStorage.getItem("user_uid");
    //this.creadas=this.cIncidencias.getData();
    this.mostrarIncidenciasCreadas();
  }
  ionViewWillEnter(){
    this.mostrarIncidenciasCreadas();
  }
  mostrarIncidenciasCreadas(){
    this.creadas=this.af.list('/incidencias')
    this.creadas.subscribe(creadas=>{

    })
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.mostrarIncidenciasCreadas();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
