import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController,ActionSheetController,AlertController} from 'ionic-angular';
import {VistaUbicacion} from '../vista-ubicacion/vista-ubicacion';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';
import {CogerNombre} from '../../providers/coger-nombre';


@Component({
  selector: 'page-detalle-incidencia',
  templateUrl: 'detalle-incidencia.html',
  providers:[CogerNombre]
})
export class DetalleIncidencia {
  datosIncidencia=[];
  photos : FirebaseListObservable<any>;
  fotoNueva:string;
  public base64Image : string;
  usuarioActual:string;
  nombreUsuario:string;
  base64img:string;
  rolUsuario:any;
  datosAux=[];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera : Camera,
              private alert:AlertController,
              private af:AngularFireDatabase,
              private domsanitizer:DomSanitizer,
              public cogerNombre:CogerNombre
            ) {
    this.getParamsIncidencia();

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleIncidencia');
    console.log(this.datosIncidencia);
    this.usuarioActual = localStorage.getItem("user_uid");
    this.af.object('/users/'+this.usuarioActual+'/rol').forEach(data=>{
      this.rolUsuario=data.$value;
    });
    console.log(this.rolUsuario);
  }

  getParamsIncidencia(){
    this.datosIncidencia.push({
      'tipo':this.navParams.get('tipo'),
      'encargado':this.navParams.get('encargado'),
      'fecha':this.navParams.get('fecha'),
      'descripcion':this.navParams.get('descripcion'),
      'fotos':this.navParams.get('fotos'),
      'fechalimite':this.navParams.get('fechalimite'),
      'ubicacion':this.navParams.get('ubicacion'),
      'estado':this.navParams.get('estado'),
      'key':this.navParams.get('key')}
    );
    this.datosIncidencia.forEach(data=>{
      this.cogerNombre.getNameWithKey(data.encargado);
      this.nombreUsuario=this.cogerNombre.nombre;

    })
  }
  //ACTION SHEET PARA MODIFICAR INCIDENCIA
  presentActionSheet() {
    let actionSheet;
    if(this.rolUsuario!='obrero'){
      actionSheet= this.actionSheetCtrl.create({
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
            text: 'Añadir foto',
            handler: () => {
              this.datosIncidencia.forEach(data=>{
                if(data.estado!='Resuelta'){
                  this.addImage()
                }
              })
            }
          },{
            text: 'Cambiar ubicación',
            handler: () => {
              this.navCtrl.push(VistaUbicacion,
                {datosIncidencia:this.datosIncidencia}
              )
            }
          },{
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }else {
      if (this.rolUsuario != 'obrero') {
        actionSheet = this.actionSheetCtrl.create({
          title: 'Editar incidencia',
          buttons: [
            {
              text: 'Cambiar encargado',
              handler: () => {
                console.log('Cambiar encargado');
              }
            }, {
              text: 'Añadir foto',
              handler: () => {
                this.datosIncidencia.forEach(data => {
                  if (data.estado != 'Resuelta') {
                    this.addImage()
                  }
                })
              }
            }, {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
      }
    }

    actionSheet.present();
  }
  irAlMapa(){
    this.navCtrl.push(VistaUbicacion,{
        datosIncidencia:this.datosIncidencia
      }
    );
  }
  //ACTION SHEET PARA AÑADIR FOTO DE CAMARA O GALERIA
  addImage(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Añadir foto',
      buttons: [
        {
          text: 'Sacar foto',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },{
          text: 'Subir desde galería',
          handler: () => {
            this.choosePicture();
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
  /*subirFotoNueva(){
    this.datosIncidencia.forEach(data=>{
     // this.photos=this.af.list('/incidencia/'+data.key+'/fotos');
      this.af.list('/incidencia/'+data.key+'/fotos').push(this.photos);
    })

  }*//*
  pressEvent(e){
    this.datosIncidencia.forEach(data=>{
      // this.photos=this.af.list('/incidencia/'+data.key+'/fotos');
      this.af.list('/incidencia/'+data.key+'/fotos').subscribe(data2=> {

          console.log(data2);

      });
    })
    console.log("presionada");
  }*/
  //FUNCION PARA USAR CAMARA
  takePicture(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
      this.photos.push(this.base64img);
    }),(err)=>{
      console.log(err);
    }
  }
 choosePicture(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
      this.photos.push(this.base64img);
    }),(err)=>{
      console.log(err);
    }
  }
  //ALERTA PARA RESOLVER INCIDENCIA
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
  //RESUELVE INCIDENCIA, CAMBIA ESTADO Y AÑADE FOTO DE RESOLUCION
  resolverIncidencia(){
    this.alertFoto()
    this.datosIncidencia.forEach(data=>{
      console.log(data.key);
      this.af.object('/incidencias/'+data.key).update({estado:"Resuelta",resueltaPor:this.usuarioActual})
      this.af.object('/users/'+this.usuarioActual+'/incidenciasResueltas/'+data.key).set(data.descripcion);
      console.log(this.usuarioActual);
      console.log("Incidencia Resuelta");
    })
    this.navCtrl.pop();

  }
  //ALERTA PARA SUBIR FOTO AL RESOLVER
  alertFoto() {
    let alert = this.alert.create({
      title: 'Añadir foto resolución',
      subTitle: '¿Quiere añadir una foto de la incidencia resuelta?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Añadir foto',
          handler: data => {
            console.log('Añadiendo foto');
            this.takePicture();
          }
        }
      ]
    });
    alert.present();
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.actualizarDatos();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  actualizarDatos(){
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data=>{

      this.af.object('/incidencias/'+data.key).forEach(item=>{
        console.log(item);
        this.datosAux.push(item);
        console.log(item.fotos);
        this.datosIncidencia=this.datosAux;
        this.datosAux=[];

      })
      console.log(this.datosIncidencia);

    })

  }

}
