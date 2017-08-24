import { Component,Inject } from '@angular/core';
import { NavController ,NavParams,ToastController,ActionSheetController,AlertController} from 'ionic-angular';
import {VistaUbicacion} from '../vista-ubicacion/vista-ubicacion';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';
import {CogerNombre} from '../../providers/coger-nombre';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';
@Component({
  selector: 'page-detalle-incidencia',
  templateUrl: 'detalle-incidencia.html',
  providers:[CogerNombre]
})
export class DetalleIncidencia {
  datosIncidencia = [];
  fotos = [];
  usuarioActual: string;
  nombreUsuario: string;
  base64img: string;
  rolUsuario: any;
  datosAux = [];
  tipos = [];
  encargados = [];
  fotoResuelta: string;
  foto1:string;
  foto2:string
  fotoR:string;
  storageRef:any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private alertCtrl: AlertController,
              private af: AngularFireDatabase,
              private domsanitizer: DomSanitizer,
              public cogerNombre: CogerNombre,
              public toast: ToastController,
               @Inject(FirebaseApp) public firebaseApp: firebase.app.App) {
    this.af.list('/tipos').forEach(tipos=>{
      tipos.forEach(tipo=>{
        this.tipos.push(tipo);
      })
    });
    this.af.list('/users').forEach(users=>{
      users.forEach(user=>{
        if(user.recibe){
          this.encargados.push(user);
        }
      })
    });
    this.getParamsIncidencia();
    this.storageRef=firebaseApp.storage().ref();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleIncidencia');
    console.log(window.location);
    console.log(this.datosIncidencia);
    this.usuarioActual = localStorage.getItem("user_uid");
    this.af.object('/users/' + this.usuarioActual + '/rol').forEach(data => {
      this.rolUsuario = data.$value;
    });
    console.log(this.rolUsuario);
    this.actualizarDatos();
  }
  ionViewWillEnter(){
    this.datosIncidencia.forEach(data=>{
      this.getPhotos(data.id)
      console.log(data.id);
    })
    this.actualizarDatos()
  }
  getParamsIncidencia() {
    this.datosIncidencia = [];
    this.datosIncidencia.push({
        'tipo': this.navParams.get('tipo'),
        'encargado': this.navParams.get('encargado'),
        'fecha': this.navParams.get('fecha'),
        'descripcion': this.navParams.get('descripcion'),
        'foto1': this.navParams.get('foto1'),
        'foto2': this.navParams.get('foto2'),
        'fotoR': this.navParams.get('fotoR'),
        'id':this.navParams.get('id'),
        'codigo':this.navParams.get('codigo'),
        'fechalimite': this.navParams.get('fechalimite'),
        'ubicacion': this.navParams.get('ubicacion'),
        'estado': this.navParams.get('estado'),
        'key': this.navParams.get('key')
      }
  );
    this.datosIncidencia.forEach(data => {
      this.cogerNombre.getNameWithKey(data.encargado);
      this.nombreUsuario = this.cogerNombre.nombre;
    })
  }
  //ACTION SHEET PARA MODIFICAR INCIDENCIA
  presentActionSheet() {
    let actionSheet;
    if (this.rolUsuario != 'obrero') {
      actionSheet = this.actionSheetCtrl.create({
        title: 'Editar incidencia',
        buttons: [
          {
            text: 'Cambiar tipo',
            handler: () => {
              this.mostrarTipos()
              console.log('Voy a editar tipo');
            }
          }, {
            text: 'Cambiar fecha limite',

            handler: () => {
              this.alertCambiarFecha()
              console.log('Voy a editar la fecha');
            }
          }, {
            text: 'Cambiar asignado',
            handler: () => {
              this.mostrarEncargados()
              console.log('Cambiar asignado');
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
    } else {
      actionSheet = this.actionSheetCtrl.create({
        title: 'Editar incidencia',
        buttons: [
          {
            text: 'Cambiar asignado',
            handler: () => {
              this.mostrarEncargados();
              console.log('Cambiar encargado');
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

  irAlMapa() {
    this.navCtrl.push(VistaUbicacion, {
        datosIncidencia: this.datosIncidencia
      }
    );
  }

  //ACTION SHEET PARA AÑADIR FOTO 2 DE CAMARA O GALERIA
  addImage2() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Añadir foto',
      buttons: [
        {
          text: 'Sacar foto',
          icon: 'camera',
          handler: () => {
              this.takePicture('dos', this.datosIncidencia)


            //this.actualizarDatos()
            //this.subirFotoNueva('adadasdasdas');
          }
        }, {
          text: 'Subir desde galería',
          icon: 'images',
          handler: () => {
            this.choosePicture('dos', this.datosIncidencia);
            this.actualizarDatos()
          }
        }, {
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

  addImage1() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Añadir foto',
      buttons: [
        {
          text: 'Sacar foto',
          icon: 'camera',
          handler: () => {
             this.takePicture('uno', this.datosIncidencia);
          }
        }, {
          text: 'Subir desde galería',
          icon: 'images',
          handler: () => {
            this.choosePicture('uno', this.datosIncidencia)

          }
        }, {
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

  pressEvent(e, foto) {
    let key;
    this.getParamsIncidencia();
    this.datosIncidencia.forEach(data => {
      let prompt = this.alertCtrl.create({
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
              console.log(data);
              console.log(foto);
              this.storageRef.child('imagenes/'+data.id+'/'+foto+'.jpg').delete().then(success=>{
                this.actualizarDatos();
              })
              this.af.object('/incidencias/' + data.key + '/' + foto).remove().then((success) => {
              });
              this.navCtrl.pop();
            }
          }
        ]
      });
      prompt.present();
    })
  }
  //ALERTA PARA RESOLVER INCIDENCIA
  showAlert() {
    let prompt = this.alertCtrl.create({
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
  resolverIncidencia() {
    this.getParamsIncidencia();
    this.datosIncidencia.forEach(data => {
      console.log(data.key);
      this.af.object('/incidencias/' + data.key).update({estado: "Resuelta", resueltaPor: this.usuarioActual})
      this.af.object('/users/' + this.usuarioActual + '/incidenciasResueltas/' + data.key).set(data.descripcion);
      console.log(this.usuarioActual);
      this.writeToast("Incidencia resuelta");
    })
    this.alertTextoRes()
    this.navCtrl.pop();
  }

  alertTextoRes(){
    let alert = this.alertCtrl.create({
      title: 'Añadir descripcion de resolución',
      subTitle: '¿Quiere añadir texto a la resolución?',
      inputs:[{
        name:"descripcionR",
        placeholder:"Introduce texto a la resolución",
        type:"text"
      }],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            this.alertFoto();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.getParamsIncidencia();
            this.datosIncidencia.forEach(inci => {
              this.af.object('/incidencias/' + inci.key + '/descripcionR').set(data.descripcionR);
            });
            this.alertFoto();
          }
        }
      ]
    });
    alert.present();
  }

  //ALERTA PARA SUBIR FOTO AL RESOLVER
  alertFoto() {
    let alert = this.alertCtrl.create({
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
          text: 'Sacar foto',
          handler: data => {
            console.log('Añadiendo foto');
            this.takePicture('R', this.datosIncidencia);
            this.actualizarDatos()
          }
        },
        {
          text: 'Subir desde la galería',

          handler: data => {
            console.log('Añadiendo foto');
            this.choosePicture('R', this.datosIncidencia);
            this.actualizarDatos()
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

  actualizarDatos() {
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data => {
      this.af.object('/incidencias/' + data.key).forEach(item => {
        this.datosAux.push(item);
        this.datosIncidencia = this.datosAux;
        this.datosAux = [];
        this.getPhotos(item.id)
     })
    })
  }
  cambiarTipo(tipoNuevo,codigoTipo) {
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data => {
      this.af.object('/incidencias/' + data.key + '/tipo').set(tipoNuevo).then(() => {
        this.writeToast("Se ha cambiado el tipo de incidencia");
      })
      let codigoNuevo=codigoTipo+'-'+data.id;
      this.af.object('/incidencias/' + data.key + '/codigo').set(codigoNuevo)
    })
    this.actualizarDatos()
  }

  cambiarEncargado(encargadoNuevo) {
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data => {
      this.af.object('/incidencias/' + data.key + '/encargado').set(encargadoNuevo).then(() => {
        this.writeToast("Incidencia reasignada")
      });
    })
    this.actualizarDatos()
    this.datosIncidencia.forEach(data => {
      this.cogerNombre.getNameWithKey(data.encargado);
      this.nombreUsuario = this.cogerNombre.nombre;
    })
  }

  mostrarTipos() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecciona el tipo de incidencia');
    this.tipos.forEach(data => {
      console.log(data);
      alert.addInput({
        type: 'radio',
        label: data.$key,
        value: data.$key
      });
    })
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data2 => {
        console.log(data2);
        this.tipos.forEach(tipo => {

          if(tipo.$key==data2){
            this.cambiarTipo(data2, tipo.$value)
          }

        });
      }
    });
    alert.present();
  }

  mostrarEncargados() {
    var encargado=[];
    let alert = this.alertCtrl.create();
    alert.setTitle('Asignar incidencia');
    this.encargados.forEach(encargados=>{
      alert.addInput({
        type: 'radio',
        label: encargados.nombre,
        value: encargados
      });
    })
      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Aceptar',
        handler: data => {
          console.log(data);
          this.cambiarEncargado(data.$key)
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

  cambiarFecha(fechaNueva) {
    this.getParamsIncidencia()
    this.datosIncidencia.forEach(data => {
      this.af.object('/incidencias/' + data.key + '/fechalimite').set(fechaNueva).then(() => {
        this.writeToast("Se ha cambiado la fecha")
      });
    })  }

  alertCambiarFecha() {
    let alert = this.alertCtrl.create({
      title: 'Cambiar fecha limite',
      inputs:[{
        type:'date'
      }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log(data[0]);
            this.cambiarFecha(data[0]);
          }
        }
      ]
    });
    alert.present();
  }

  getPhotos(id){
    console.log(id)
    this.storageRef.child('imagenes/'+id+'/foto1.jpg').getDownloadURL()
      .then(url => this.foto1 = url)
      .catch(error=>console.log(error));
    this.storageRef.child('imagenes/'+id+'/foto2.jpg').getDownloadURL()
      .then(url => this.foto2 = url)
      .catch(error=>console.log(error));
    this.storageRef.child('imagenes/'+id+'/fotoR.jpg').getDownloadURL()
      .then(url => this.fotoResuelta = url)
      .catch(error=>console.log(error));
  }

  takePicture(tipo,datos){
    console.log(tipo,datos);
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img=imageData;
      this.subirFotoNueva(this.base64img,tipo,datos)
    }),(err)=>{
      console.log(err);
    }
  }

  choosePicture(tipo,datos){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img=imageData;
      this.subirFotoNueva(this.base64img,tipo,datos)
    }),(err)=>{
      console.log(err);
    }
  }

  subirFotoNueva(foto,tipo,params){
    this.datosIncidencia=params;
    if(tipo=='dos'){
      this.foto2='data:image/jpeg;base64,'+foto
      this.datosIncidencia.forEach(data=>{
        console.log(data);
        this.storageRef.child('imagenes/'+data.id+'/foto2.jpg').putString(foto,'base64')
      })
    }if(tipo=='uno'){
      this.foto1='data:image/jpeg;base64,'+foto
      this.datosIncidencia.forEach(data=>{
        this.storageRef.child('imagenes/'+data.id+'/foto1.jpg').putString(foto,'base64');
      })
    }
    if(tipo=='R'){
      this.fotoResuelta='data:image/jpeg;base64,'+foto
      this.datosIncidencia.forEach(data=>{
        this.storageRef.child('imagenes/'+data.id+'/fotoR.jpg').putString(foto,'base64');
      })
    }
  }
}
