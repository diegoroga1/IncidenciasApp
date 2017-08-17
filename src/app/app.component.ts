import { Component,ViewChild  } from '@angular/core';
import { Platform,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from 'ionic-angular';

import {Encargado} from '../pages/encargado/encargado';
import {Intro} from '../pages/intro/intro';
import {Admin} from '../pages/admin/admin';
import {getCurrentDebugContext} from "../../node_modules/@angular/core/src/view/services";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') navCtrl: NavController;
  rootPage:any=Intro;
  usuarioActual:any;
  tipo:any;
  user: string[] = [null];
  constructor(platform: Platform,public firebase:AngularFireAuth,public toast:ToastController,public af:AngularFireDatabase,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.getNameCurrentUser();
      this.af.list('/users/'+localStorage.getItem("user_uid")).forEach(data=>{
        data.forEach(campos=>{
          if(campos.$key=='rol'){
            this.tipo=campos.$value;
          }

        })
      })
    });
    localStorage.getItem("user_uid") ? this.user[0] = localStorage.getItem("user_uid") : this.user[0] = null;

    // TODO: arreglar redirección al loguear
    if (this.user[0] == null) {
      //this.nav.setRoot(IntroPage);
      this.rootPage = Intro;
    } else {
      //this.nav.setRoot(Page1);
      this.rootPage = Admin;
    }
  }


  getNameCurrentUser(){
    this.af.list('/users/'+localStorage.getItem("user_uid")).forEach(data=>{
      data.forEach(campos=>{

        if(campos.$key=="nombre"){
          console.log(campos.$value);

          this.usuarioActual=campos.$value;
        }
      })
    })
  }
  logOut() {
    this.firebase.auth.signOut().then(
      () => {
        localStorage.removeItem("user_uid");
        this.navCtrl.setRoot(Intro);
        let toast = this.toast.create({
          message: 'Esperamos verle pronto',
          duration: 3000
        });
        toast.present();
      }
    );
  }

}
