import { Component } from '@angular/core';
import { NavController ,NavParams,ActionSheetController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Admin} from '../admin/admin';
import {SubirFoto} from '../../providers/subir-foto';
import { CogerUbicacion } from '../../providers/coger-ubicacion';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import {VistaUbicacion} from '../vista-ubicacion/vista-ubicacion';
declare var cordova: any;
declare var google;

@Component({
  selector: 'page-dialogo-incidencia',
  templateUrl: 'dialogo-incidencia.html',
})
export class DialogoIncidencia {
  incidenciaArray=[];
  tipos=[];
  incidencia=[];
  incidenciafinal={};
  encargados=[];
  userKey:any;
  ubicacion:{}
  encargadoKey:any;
  base64img:string;
  photos:any[]=[];
  latLng:any;
   fechaToday:any;
   day:any;
   month:any;
   admin:any;
  constructor(public navCtrl: NavController,
              public af:AngularFireDatabase,
              public navParams: NavParams,
              public actionSheetCtrl:ActionSheetController,
              public sFoto:SubirFoto,
              private camera: Camera,
              private geolocation:Geolocation,
              public cogerUbi:CogerUbicacion
  ) {console.log(this.fechaToday);
    this.tipos=["Basura","Alcantarillado","Farolas"];
    this.incidenciaArray=[];
    console.log(this.ubicacion);
    console.log(cogerUbi.getUbicacion());
    this.getEncargadosPermiteRecibir();
    this.cogerFechaHoy();
    this.geolocation.getCurrentPosition().then((position) => {//AL DARLE A AÑADIR INCIDENCIA RECOGE LA UBICACION PARA LA INCIDENCIA
      this.latLng ={latitud:position.coords.latitude, longitud:position.coords.longitude};
    }, (err) => {
      console.log(err);
    });
    //AÑADIMOS FECHA HORA Y CREADOR A LA INCIDENCIA Q VAMOS A CREAR
     }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DialogoIncidencia');
  }
  cogerFechaHoy(){
    if((new Date().getDate())<10){
      this.day='0'+(new Date().getDate());
    }else{
      this.day=(new Date().getDate());
    }
    if((new Date().getMonth()+1)<10){
      this.month='0'+(new Date().getMonth()+1)
    }else{
      this.month=(new Date().getMonth()+1)
    }
    this.fechaToday=new Date().getFullYear()+'-'+this.month+'-'+this.day;
  console.log(this.fechaToday);
  }
  //AÑADE LA INCIDENCIA CREADA A LA RAMA INCIDENCIAS Y A CADA USUARIO DENTRO DE SU RAMA INCIDENCIASCREADAS
  addIncidencia(){
    this.incidenciaArray.push(this.incidencia);//GUARDAMOS LOS DATOS DEL FORM EN UN ARRAY
    this.incidenciaArray.forEach(data=>{
      console.log(data);
      if(data.encargado=='undefined'){
        data.encargado=='Lorena';
      }
      this.incidenciafinal={//CREAMOS UNA INCIDENCIA INICIAL Y APARTE RECOGEMOS DATOS DEL FORM DEL HTML
        fecha: new Date().getDate() + '/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
        hora:new Date().getHours()+ ':'+ new Date().getMinutes(),
        creadaPor:localStorage.getItem("user_uid"),
        ubicacion:this.cogerUbi.getUbicacion(),
        estado:"Pendiente",
        resueltaPor:"",
        descripcion:data.descripcion,
        encargado:data.encargado,
        fechalimite:data.fechalimite,
        tipo:data.tipo
      };
    })
    this.af.list('/incidencias').push(this.incidenciafinal).then((success)=>{//AÑADE LA INCIDENCIA A LA RAMA INCIDENCIA
      this.af.object('/incidencias/'+success.key+'/fotos').set(this.photos);//AÑADE LAS FOTOS A LA RAMA FOTOS DE LA INCIDENCIA
      this.incidenciaArray.forEach(data=>{
        this.af.object('/users/'+localStorage.getItem("user_uid")+'/incidenciasCreadas/'+success.key).set(data.descripcion);
        this.addIncidenciaAsignadaUsuario(data.encargado,success.key,data.descripcion);
        console.log(data.encargado,success.key,data.descripcion)
      })
    this.navCtrl.pop();
  });

  }
  //AÑADIR INCIDENCIA AL USUARIO ASIGNADO
  addIncidenciaAsignadaUsuario(userKey,key,descripcion){
   // this.cogerKeyUsuarioPorNombre(userName);
    this.af.object('/users/'+userKey+'/incidenciasAsignadas/'+key).set(descripcion);
  }
  //RECOGE ENCARGADOS A LOS QUE SE LE PERMITE ASIGNAR TAREA
  getEncargadosPermiteRecibir(){
    this.af.list('/users').forEach(data=>{
      data.forEach(item=>{
        if(item.recibe){
          this.encargados.push({nombre:item.nombre,key:item.$key});
          console.log(item.rol);
          if(item.rol=='admin'){
            this.admin=item.nombre
            console.log(this.admin);
          }
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
  //Menu que se muestra para seleccionar opcion de subida de foto
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccionar fuente ',
      buttons: [
        {
          text: 'Cargar desde galería',
          handler: () => {
            //;
            this.takePicture();
          }
        },
        {
          text: 'Usar Camara',
          handler: () => {
            this.choosePicture()

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

  //Abre la camara para sacar foto y la guarda en base64 en array photos
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
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;

      this.photos.push(this.base64img);
    }),(err)=>{
      console.log(err);
    }
  }
  seleccionarUbicacion(){
    this.navCtrl.push(VistaUbicacion);

  }
  setUbicacionIncidencia(ubicacion){
    this.ubicacion=ubicacion;
  }


}
