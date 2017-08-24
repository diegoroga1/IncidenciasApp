import { Injectable ,Inject} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';

/*
  Generated class for the SubirArchivo provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SubirArchivo {
  image:string;
  storageRef:any;
  imageRef:any;
  base64:string;
  constructor( @Inject(FirebaseApp) firebaseApp: firebase.app.App) {
    console.log('Hello SubirArchivo Provider');
    this.storageRef=firebaseApp.storage().ref();//Referencia a storage
       console.log(this.storageRef);



  }/*
  uploadImage(keyIncidencia,tipo,foto){
    this.imageRef=this.storageRef.child('imagenes/'+keyIncidencia+'/'+tipo);
    this.imageRef.putString(foto,'base64').then(snapshot=>{
      console.log('Subiendo en base64');
    }).catch(error=>{
      console.log("No se ha podido subir");
    });
  }*/


}
