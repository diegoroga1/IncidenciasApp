import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
@Component({
  selector: 'page-detalle-incidencia',
  templateUrl: 'detalle-incidencia.html',
})
export class DetalleIncidencia {
  datosIncidencia=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getParamsIncidencia();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleIncidencia');
    console.log(this.datosIncidencia);
  }
  getParamsIncidencia(){
    this.datosIncidencia.push({
      'tipo':this.navParams.get('tipo'),
      'encargado':this.navParams.get('encargado'),
      'fecha':this.navParams.get('fecha'),
      'descripcion':this.navParams.get('descripcion'),
      'foto':this.navParams.get('foto')}
    );
  }

}
