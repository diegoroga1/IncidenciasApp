import { Component ,Input,Inject} from '@angular/core';
import {DetalleIncidencia} from '../../pages/detalle-incidencia/detalle-incidencia';
import { NavController ,NavParams} from 'ionic-angular';
import {AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';
import {CogerNombre} from '../../providers/coger-nombre';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
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
  @Input('descripcion') descripcion: string;
  @Input('encargado') encargado: string;
  @Input('fecha') fecha: string;
  @Input('foto1') foto1: string;
  @Input('foto2') foto2: string;
  @Input('fotoR') fotoR: string;
  @Input('fechalimite') fechalimite: string;
  @Input('ubicacion') ubicacion: object;
  @Input('estado') estado: string;
  @Input('key') key: string;
  @Input('codigo') codigo: string;
  @Input('id') id: string;
  text: string;
  userName: string;
  caducada = false;
  fechaHoy: any;
  day: any;
  month: any;
  imageDefault: any;

  constructor(public navCtl: NavController, @Inject(FirebaseApp) public firebaseApp: firebase.app.App, private af: AngularFireDatabase, public domsanitizer: DomSanitizer, public cogerNombre: CogerNombre) {
    if ((new Date().getDate()) < 10) {
      this.day = '0' + (new Date().getDate());
    } else {
      this.day = (new Date().getDate());
    }
    if ((new Date().getMonth() + 1) < 10) {
      this.month = '0' + (new Date().getMonth() + 1)
    } else {
      this.month = (new Date().getMonth() + 1)
    }
    this.fechaHoy = new Date().getFullYear() + '-' + this.month + '-' + this.day;
    firebaseApp.storage().ref().child('ayuntamiento.jpg').getDownloadURL().then(url => this.imageDefault = url);

    console.log(this.imageDefault);
  }


  ngOnInit() {
    this.cogerNombre.getNameWithKey(this.encargado);
    this.userName = this.cogerNombre.nombre;
    this.comprobarCaducada();
    this.cogerFotos();
  }
  ionViewWillEnter(){
    this.cogerNombre.getNameWithKey(this.encargado);
    this.userName = this.cogerNombre.nombre;
    this.cogerFotos();
  }


  irADetalles() {
    this.navCtl.push(DetalleIncidencia, {
      tipo: this.tipo,
      encargado: this.encargado,
      descripcion: this.descripcion,
      fecha: this.fecha,
      fechalimite: this.fechalimite,
      ubicacion: this.ubicacion,
      estado: this.estado,
      key: this.key,
      id: this.id,
      caducada: this.caducada,
      codigo: this.codigo
    });
  }

  comprobarCaducada() {
    this.af.object('/incidencias/' + this.key + '/fechalimite').forEach(data => {
      console.log(data.$value);
      console.log(this.fechaHoy);
      if (data.$value < this.fechaHoy) {
        this.caducada = true;
      } else {
        this.caducada = false;
      }
    });

  }

  cogerFotos() {
    this.firebaseApp.storage().ref().child('imagenes/' + this.id + '/foto1.jpg').getDownloadURL()
      .then(url => this.foto1 = url)
      .catch(error => console.log(error));
    this.firebaseApp.storage().ref().child('imagenes/' + this.id + '/foto2.jpg').getDownloadURL()
      .then(url => this.foto2 = url)
      .catch(error => console.log(error));
    this.firebaseApp.storage().ref().child('imagenes/' + this.id + '/fotoR.jpg').getDownloadURL()
      .then(url => this.fotoR = url)
      .catch(error => console.log(error));

  }



}
