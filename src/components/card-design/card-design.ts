import { Component ,Input} from '@angular/core';
import {DetalleIncidencia} from '../../pages/detalle-incidencia/detalle-incidencia';
import { NavController ,NavParams} from 'ionic-angular';
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
  @Input('foto') foto:string;
  text: string;

  constructor(public navCtl:NavController) {
    console.log('Hello CardDesign Component');
    this.text = 'Hello World';
  }
  irADetalles(){
    this.navCtl.push(DetalleIncidencia,{
      tipo:this.tipo,
      encargado:this.encargado,
      descripcion:this.descripcion,
      fecha:this.fecha,
      foto:this.foto
    });
  }

}
