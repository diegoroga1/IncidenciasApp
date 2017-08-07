import { Component ,Inject} from '@angular/core';
import { FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';

/**
 * Generated class for the SubirImagen component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'subir-imagen',
  templateUrl: 'subir-imagen.html'
})
export class SubirImagen {

  text: string;
  image:string;
  constructor(@Inject(FirebaseApp) firebaseApp: firebase.app.App) {
    const storageRef = firebaseApp.storage().ref().child('images/image.png');
    storageRef.getDownloadURL().then(url => this.image = url);
    console.log('Hello SubirImagen Component');
    this.text = 'Hello World';
  }

}
