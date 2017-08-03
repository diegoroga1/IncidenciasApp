import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Location} from '@angular/common';
import {Admin} from '../admin/admin';
@Component({
  selector: 'page-dialogo-incidencia',
  templateUrl: 'dialogo-incidencia.html',
})
export class DialogoIncidencia {
  incidenciaArray=[];
  tipos=[];
  incidencia={};
  encargados=[];
  usuarioActual:any;
  userKey:any;
  constructor(public navCtrl: NavController,
              public af:AngularFireDatabase,
              private _location:Location,
              public navParams: NavParams,
              ) {
    this.tipos=["Basura","Alcantarillado","Farolas"];
    this.incidenciaArray=[];
    //AÑADIMOS FECHA HORA Y CREADOR A LA INCIDENCIA Q VAMOS A CREAR
    this.incidencia={fecha: new Date().getDate() + '/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
      hora:new Date().getHours()+ ':'+ new Date().getMinutes(),creadaPor:localStorage.getItem("user_uid")};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DialogoIncidencia');
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
      this.navCtrl.setRoot(Admin);
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
        if(item.nombre==name.toString()){
          this.userKey=item.$key;
        }
      })
    })
  }
}
