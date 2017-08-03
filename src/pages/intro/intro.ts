import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';
import {Admin} from '../admin/admin';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class Intro {
  user:Observable<firebase.User>;
  items:FirebaseListObservable<any[]>;
  msgVal:string='';
  email:any;
  passwd:any;
  constructor(public navCtrl: NavController,public toast:ToastController, public afAuth: AngularFireAuth, public af: AngularFireDatabase,public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Intro');
  }
  submitForm(form){
    this.email=form.value.email;
    this.passwd=form.value.password;
    console.log(form.value.email);
    this.afAuth.auth.signInWithEmailAndPassword(this.email,this.passwd).then((success)=>{
      //IDENTIFICAR TIPO USUARIO **************
      localStorage.setItem("user_uid",success.uid);
      sessionStorage.setItem("user_uid",success.uid);
      this.navCtrl.setRoot(Admin);
    }).catch(
      (error)=>{
        switch (error.message) {
          case "There is no user record corresponding to this identifier. The user may have been deleted.":
            // Cambiar por toast
            this.writeToast('Este correo no se corresponde con ningún usuario');
            break;
          case "The password is invalid or the user does not have a password.":
            // Cambiar por toast
            this.writeToast('La contraseña no coincide');
            break;
        }
      }
    );
    console.log(this.afAuth.authState);
  }
  writeToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
