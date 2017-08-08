import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { File } from '@ionic-native/file';
import { ToastController, Platform,LoadingController, Loading,ActionSheetController } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Generated class for the SubirFoto provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var cordova: any;
@Injectable()
export class SubirFoto {

  lastImage:string=null;
  public base64img:string;
  loading:Loading;  constructor(public af:AngularFireDatabase,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController
) {
    console.log('Hello SubirFoto Provider');
  }
  takePicture(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData)=>{
      this.base64img="data:image/jpeg;base64,"+imageData;
    }),(err)=>{
      console.log(err);
    }
  }

}
