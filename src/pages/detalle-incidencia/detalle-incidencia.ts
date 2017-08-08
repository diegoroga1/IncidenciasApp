import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController,ActionSheetController,AlertController} from 'ionic-angular';
import {VistaUbicacion} from '../vista-ubicacion/vista-ubicacion';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-detalle-incidencia',
  templateUrl: 'detalle-incidencia.html',
})
export class DetalleIncidencia {
  datosIncidencia=[];
  public photos : any;
  fotos:any[];
  public base64Image : string;
  usuarioActual:string;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera : Camera,
              private alert:AlertController,
              private af:AngularFireDatabase
            ) {
    this.getParamsIncidencia();
    this.fotos=['https://ionicframework.com/dist/preview-app/www/assets/img/nin-live.png','https://ionicframework.com/dist/preview-app/www/assets/img/nin-live.png'];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleIncidencia');
    console.log(this.datosIncidencia);
    this.usuarioActual = localStorage.getItem("user_uid");
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
      'fechalimite':this.navParams.get('fechalimite'),
      'ubicacion':this.navParams.get('ubicacion'),
      'estado':this.navParams.get('estado'),
      'key':this.navParams.get('key')}
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
    this.navCtrl.push(VistaUbicacion,{
        datosIncidencia:this.datosIncidencia
      }
    );
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
  showAlert() {
    let prompt = this.alert.create({
      title: 'Resolver incidencia',
      subTitle: '¿Está seguro de que quiere resolver la incidencia?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resolver',
          handler: data => {
            console.log('Resuelta');
            this.resolverIncidencia();
          }
        }
      ]
    });
    prompt.present();
  }
  resolverIncidencia(){
    this.datosIncidencia.forEach(data=>{
      console.log(data.key);
      this.af.object('/incidencias/'+data.key).update({estado:"Resuelta",resueltaPor:this.usuarioActual})
      this.af.object('/users/'+this.usuarioActual+'/incidenciasResueltas/'+data.key).set(data.descripcion);
      console.log(this.usuarioActual);
      console.log("Incidencia Resuelta");
    })
    this.navCtrl.pop();

  }

}
