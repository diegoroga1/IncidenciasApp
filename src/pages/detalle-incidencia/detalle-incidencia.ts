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
  photosIncidencia: FirebaseListObservable<any>;
  fotos=[];
  fotoNueva:string;
  public base64Image : string;
  usuarioActual:string;
  nombreUsuario:string;
  base64img:string;
  rolUsuario:any;
  datosAux=[];
  tipos=[];
  encargados=[];
  fotoResuelta:string;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera : Camera,
              private alert:AlertController,
              private af:AngularFireDatabase,
              private domsanitizer:DomSanitizer,
              public cogerNombre:CogerNombre,
              public toast:ToastController
            ) {
    this.tipos=["Basura","Alcantarillado","Farolas"];

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
    this.actualizarDatos();

  }

  getParamsIncidencia(){
    this.datosIncidencia=[];
    this.datosIncidencia.push({
      'tipo':this.navParams.get('tipo'),
      'encargado':this.navParams.get('encargado'),
      'fecha':this.navParams.get('fecha'),
      'descripcion':this.navParams.get('descripcion'),
      'foto1':this.navParams.get('foto1'),
      'foto2':this.navParams.get('foto2'),
      'fotoR':this.navParams.get('fotoR'),
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
              this.mostrarTipos()
              console.log('Voy a editar tipo');
            }
          },{
            text: 'Cambiar ubicación',
            handler: () => {
              this.irAlMapa()
              console.log('Voy a editar la ubicacion');
            }
          },{
            text: 'Cambiar encargado',
            handler: () => {
              this.mostrarEncargados()
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
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }else {
        actionSheet = this.actionSheetCtrl.create({
          title: 'Editar incidencia',
          buttons: [
            {
              text: 'Cambiar encargado',
              handler: () => {
                this.mostrarEncargados();
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
            //this.subirFotoNueva('adadasdasdas');
          }
        },{
          text: 'Subir desde galería',
          icon:'images',
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
  subirFotoNueva(foto,tipo){
    this.getParamsIncidencia();

    if(tipo=='dos'){
      this.datosIncidencia.forEach(data=>{
        this.af.object('/incidencias/'+data.key+'/foto2').set(foto);
      })
    }
    if(tipo=='R'){
      this.datosIncidencia.forEach(data=>{
        this.af.object('/incidencias/'+data.key+'/fotoR').set(foto);
      })
    }

  }
  pressEvent(e,foto){
    let key;
    this.getParamsIncidencia();
    this.datosIncidencia.forEach(data=>{
    let prompt = this.alert.create({
      title: '¿Borrar foto?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data2 => {
              console.log("Voy a borrar");
              this.af.object('/incidencias/'+data.key+'/'+foto).remove().then((success)=>{

              });

          }
        }
      ]
    });
      prompt.present();
    })


  }
  //FUNCION PARA USAR CAMARA
  takePicture(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
      this.subirFotoNueva(this.base64img,'dos')

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
      this.subirFotoNueva(this.base64img,'dos')

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
   this.getParamsIncidencia();
    this.datosIncidencia.forEach(data=>{
      console.log(data.key);
      this.af.object('/incidencias/'+data.key).update({estado:"Resuelta",resueltaPor:this.usuarioActual})
      this.af.object('/users/'+this.usuarioActual+'/incidenciasResueltas/'+data.key).set(data.descripcion);
      console.log(this.usuarioActual);
      this.writeToast("Incidencia resuelta");
    })
    this.alertFoto();
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
          text: 'Sacar foto'
          handler: data => {
            console.log('Añadiendo foto');
            this.takePictureR();
          }
        },
        {
          text: 'Subir desde la galería'
          handler: data => {
            console.log('Añadiendo foto');
            this.choosePictureR();
          }
        }
      ]
    });
    alert.present();
  }
  takePictureR(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
      this.subirFotoNueva(this.base64img,'R')

    }),(err)=>{
      console.log(err);
    }
    this.subirFotoNueva(this.base64img,'R')

  }
  choosePictureR(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
      this.subirFotoNueva(this.base64img,'R')

    }),(err)=>{
      console.log(err);
    }
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
  cambiarTipo(tipoNuevo){
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data=>{
      this.af.object('/incidencias/'+data.key+'/tipo').set(tipoNuevo).then(()=> {
        this.writeToast("Se ha cambiado el tipo de incidencia");
      })
    })
  }
  cambiarEncargado(encargadoNuevo){
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data=>{
      this.af.object('/incidencias/'+data.key+'/encargado').set(encargadoNuevo).then(()=>{
        this.writeToast("Se ha cambiado el encargado")
      });

    })
  }
  mostrarTipos() {
    let alert = this.alert.create();
    alert.setTitle('Selecciona el tipo de incidencia');
    this.tipos.forEach(data=>{
      console.log(data);
      alert.addInput({
        type: 'radio',
        label: data,
        value: data
      });
    })
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.cambiarTipo(data)
      }
    });
    alert.present();
  }
  mostrarEncargados() {
    let alert = this.alert.create();
    alert.setTitle('Selecciona un nuevo encargado');
    this.af.list('/users').forEach(data=>{
      data.forEach(item=>{
        console.log(item);
        if(item.recibe){
          console.log(item.nombre);
          alert.addInput({
            type: 'radio',
            label: item.nombre,
            value: item.nombre
          });
        }
    });
    })
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.cambiarEncargado(data)
      }
    });
    alert.present();
  }
  writeToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
