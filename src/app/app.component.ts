import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireDatabase} from 'angularfire2/database';
import {Encargado} from '../pages/encargado/encargado';
import {Intro} from '../pages/intro/intro';
import {Admin} from '../pages/admin/admin';
import {getCurrentDebugContext} from "../../node_modules/@angular/core/src/view/services";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Admin;
  usuarioActual:any;
  constructor(platform: Platform, public af:AngularFireDatabase,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.getNameCurrentUser();
    });
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
}
