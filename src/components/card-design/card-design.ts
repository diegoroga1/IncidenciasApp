import { Component ,Input} from '@angular/core';
import {DetalleIncidencia} from '../../pages/detalle-incidencia/detalle-incidencia';
import { NavController ,NavParams} from 'ionic-angular';
import {AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';



/**
 * Generated class for the CardDesign component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'card-design',
  templateUrl: 'card-design.html'
})
export class CardDesign {
  @Input('tipo') tipo: string;
  @Input('descripcion') descripcion:string;
  @Input('encargado') encargado:string;
  @Input('fecha') fecha:string;
  @Input('fotos') fotos:FirebaseListObservable<any>;
  @Input('fechalimite') fechalimite:string;
  @Input('ubicacion') ubicacion:object;
  @Input('estado') estado:string;
  @Input('key') key:string;
  text: string;
  userName:string;
  constructor(public navCtl:NavController,private af:AngularFireDatabase,public domsanitizer:DomSanitizer) {
    console.log('Hello CardDesign Component');
    this.text = 'Hello World';
  }

  irADetalles(){
    this.navCtl.push(DetalleIncidencia,{
      tipo:this.tipo,
      encargado:this.encargado,
      descripcion:this.descripcion,
      fecha:this.fecha,
      fotos:this.fotos,
      fechalimite:this.fechalimite,
      ubicacion:this.ubicacion,
      estado:this.estado,
      key:this.key
    });
  }



}
