import { Component } from '@angular/core';
import { NavController ,NavParams,ActionSheetController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Admin} from '../admin/admin';
import {SubirFoto} from '../../providers/subir-foto';
import { CogerUbicacion } from '../../providers/coger-ubicacion';
import { Geolocation } from '@ionic-native/geolocation';

import { Camera } from '@ionic-native/camera';

declare var cordova: any;
declare var google;

@Component({
  selector: 'page-dialogo-incidencia',
  templateUrl: 'dialogo-incidencia.html',
})
export class DialogoIncidencia {
  incidenciaArray=[];
  tipos=[];
  incidencia={};
  encargados=[];
  userKey:any;
  ubicacion:{}

  constructor(public navCtrl: NavController,
              public af:AngularFireDatabase,
              public navParams: NavParams,
              public actionSheetCtrl:ActionSheetController,
              public sFoto:SubirFoto,
              private camera: Camera,
              private geolocation:Geolocation,
              private cogerUbi:CogerUbicacion
  ) {

    this.tipos=["Basura","Alcantarillado","Farolas"];
    this.incidenciaArray=[];
    console.log(cogerUbi.getUbicacion());
    //AÑADIMOS FECHA HORA Y CREADOR A LA INCIDENCIA Q VAMOS A CREAR
     }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DialogoIncidencia');
    this.initIncidencia();
  }
  initIncidencia(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng ={latitud:position.coords.latitude, longitud:position.coords.longitude};
      this.incidencia={fecha: new Date().getDate() + '/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
        hora:new Date().getHours()+ ':'+ new Date().getMinutes(),creadaPor:localStorage.getItem("user_uid"),ubicacion:latLng,estado:"Pendiente"};
    }, (err) => {
      console.log(err);
    });
    this.getEncargadosPermiteRecibir();
  }

  //AÑADE LA INCIDENCIA CREADA A LA RAMA INCIDENCIAS Y A CADA USUARIO DENTRO DE SU RAMA INCIDENCIASCREADAS
  addIncidencia(){
      this.af.list('/incidencias').push(this.incidencia).then((success)=>{
      this.af.list('/users/'+localStorage.getItem("user_uid")+'/incidenciasCreadas').push(this.incidencia).then((success)=>{
       this.incidenciaArray.push(this.incidencia);
       this.incidenciaArray.forEach(data=>{
         console.log(data.encargado);
         this.addIncidenciaAsignadaUsuario(data.encargado);

       })
      })
      //this.navCtrl.setRoot(Admin);
    });
  }

  //AÑADIR INCIDENCIA AL USUARIO ASIGNADO
  addIncidenciaAsignadaUsuario(userName){
    this.cogerKeyUsuarioPorNombre(userName);
    console.log(this.userKey);
    this.af.list('/users/'+this.userKey+'/incidenciasAsignadas').push(this.incidencia);
  }

  //RECOGE ENCARGADOS A LOS QUE SE LE PERMITE ASIGNAR TAREA
  getEncargadosPermiteRecibir(){
    this.af.list('/users').forEach(data=>{
      data.forEach(item=>{
        console.log(item.recibe);
        if(item.recibe){
          this.encargados.push(item.nombre);
        }
      })
    });
  }

  //DEVUELVE LA KEY DEL USUARIO PASADO POR PARAMETRO
  cogerKeyUsuarioPorNombre(name){
    this.af.list('/users').subscribe(data=>{
      data.forEach(item=>{
        if(item.nombre==name){
          this.userKey=item.$key;
        }
      })
    })
  }


  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccionar fuente ',
      buttons: [
        {
          text: 'Cargar desde galería',
          handler: () => {
            this.sFoto.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar Camara',
          handler: () => {
            this.sFoto.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
}
