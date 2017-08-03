import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import {DialogoIncidencia} from "../dialogo-incidencia/dialogo-incidencia";
import {Asignadas} from '../asignadas/asignadas';
import {Creadas} from '../creadas/creadas';
import {Resueltas} from '../resueltas/resueltas';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class Admin {
  tab1Root: any = Asignadas;
  tab2Root: any = Creadas;
  tab3Root: any = Resueltas;
  usuarioActual:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public af:AngularFireDatabase,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin');
  }
  crearIncidencia(){

    this.navCtrl.push(DialogoIncidencia);
  }

}
