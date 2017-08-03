import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import {DialogoIncidencia} from "../dialogo-incidencia/dialogo-incidencia";

@Component({
  selector: 'page-encargado',
  templateUrl: 'encargado.html',
})
export class Encargado {

  titulo_pagina:string="Encargado";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.titulo_pagina="Encargado";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Encargado');
  }
  crearIncidencia(){
    this.navCtrl.push(DialogoIncidencia);
  }

}
