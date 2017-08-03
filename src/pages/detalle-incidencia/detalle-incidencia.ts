import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController,ActionSheetController} from 'ionic-angular';
import {VistaUbicacion} from '../vista-ubicacion/vista-ubicacion';
import {Camera, CameraOptions} from '@ionic-native/camera';

@Component({
  selector: 'page-detalle-incidencia',
  templateUrl: 'detalle-incidencia.html',
})
export class DetalleIncidencia {
  datosIncidencia=[];
  public photos : any;
  public base64Image : string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              private camera : Camera) {
    this.getParamsIncidencia();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleIncidencia');
    console.log(this.datosIncidencia);
  }
  ngOnInit(){
    this.photos=[];
  }
  getParamsIncidencia(){
    this.datosIncidencia.push({
      'tipo':this.navParams.get('tipo'),
      'encargado':this.navParams.get('encargado'),
      'fecha':this.navParams.get('fecha'),
      'descripcion':this.navParams.get('descripcion'),
      'foto':this.navParams.get('foto'),
      'fechalimite':this.navParams.get('fechalimite')}
    );
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Editar incidencia',
      buttons: [
        {
          text: 'Cambiar tipo',
          handler: () => {
            console.log('Voy a editar tipo');
          }
        },{
          text: 'Cambiar encargado',
          handler: () => {
            console.log('Cambiar encargado');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  irAlMapa(){
    this.navCtrl.push(VistaUbicacion);
  }
  addImage(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Añadir foto',
      buttons: [
        {
          text: 'Sacar foto',
          icon: 'camera',
          handler: () => {
            this.takePhoto();
          }
        },{
          text: 'Subir desde galería',
          handler: () => {
            console.log('Desde galería');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  takePhoto(){
    const options : CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options) .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }
}
