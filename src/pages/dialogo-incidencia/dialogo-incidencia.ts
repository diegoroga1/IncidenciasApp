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
  encargadoKey:any;
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
    this.getEncargadosPermiteRecibir();
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
        hora:new Date().getHours()+ ':'+ new Date().getMinutes(),creadaPor:localStorage.getItem("user_uid"),ubicacion:latLng,estado:"Pendiente",resueltaPor:""};
    }, (err) => {
      console.log(err);
    });

  }

  //AÑADE LA INCIDENCIA CREADA A LA RAMA INCIDENCIAS Y A CADA USUARIO DENTRO DE SU RAMA INCIDENCIASCREADAS
  addIncidencia(){
    this.incidenciaArray.push(this.incidencia);
    this.af.list('/incidencias').push(this.incidencia).then((success)=>{
      this.incidenciaArray.forEach(data=>{
        console.log(data.descripcion);
        console.log(success.key);

        this.af.object('/users/'+localStorage.getItem("user_uid")+'/incidenciasCreadas/'+success.key).set(data.descripcion);
        console.log(data.encargado);//key
        this.addIncidenciaAsignadaUsuario(data.encargado,data.key,data.descripcion);
      })
    this.navCtrl.pop();
  });
  }
  //AÑADIR INCIDENCIA AL USUARIO ASIGNADO
  addIncidenciaAsignadaUsuario(userKey,key,descripcion){
   // this.cogerKeyUsuarioPorNombre(userName);
    console.log(userKey);
    console.log(descripcion);
    console.log(key);
    this.af.object('/users/'+userKey+'/incidenciasAsignadas/'+key).set(descripcion);
  }

  //RECOGE ENCARGADOS A LOS QUE SE LE PERMITE ASIGNAR TAREA
  getEncargadosPermiteRecibir(){
    this.af.list('/users').forEach(data=>{
      data.forEach(item=>{
        if(item.recibe){
          this.encargados.push({nombre:item.nombre,key:item.$key});
          console.log(this.encargados);
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
