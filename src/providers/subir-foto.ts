import { Injectable,Inject } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { File } from '@ionic-native/file';
import { ToastController, Platform,LoadingController, Loading,ActionSheetController } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {FirebaseApp} from 'angularfire2';
import { Observable }     from 'rxjs/Observable';
import * as firebase from 'firebase';
/*
  Generated class for the SubirFoto provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var cordova: any;
@Injectable()
export class SubirFoto {
  datosIncidencia=[];
  storageRef:any;
  imageRef:any;
  lastImage:string=null;
  result:string
  foto1:Observable<any>
  foto2:Observable<any>
  fotoR:Observable<any>
  fotoOk=false;
  public base64img;
  loading:Loading;  constructor(public af:AngularFireDatabase,@Inject(FirebaseApp) firebaseApp: firebase.app.App,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController
) {
    console.log('Hello SubirFoto Provider');
  this.storageRef=firebaseApp.storage().ref();
 // this.storageRef.child("imagenes/");
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

    //this.subirFotoNueva(this.base64img,tipo,datos);
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
      this.datosIncidencia.forEach(data=>{
        console.log(data);
      //  this.af.object('/incidencias/'+data.$key+'/foto2').set(foto);
        this.storageRef.child('imagenes/'+data.id+'/foto2.jpg').putString(foto,'base64')
      })
    }if(tipo=='uno'){
      this.datosIncidencia.forEach(data=>{
       // this.af.object('/incidencias/'+data.$key+'/foto1').set(foto);
        this.storageRef.child('imagenes/'+data.id+'/foto1.jpg').putString(foto,'base64');

      })

    }
    if(tipo=='R'){
      this.datosIncidencia.forEach(data=>{
       // this.af.object('/incidencias/'+data.$key+'/fotoR').set(foto);
        this.storageRef.child('imagenes/'+data.id+'/fotoR.jpg').putString(foto,'base64');

      })
    }
  }
  getFotos(){
    return this.result
  }
}
