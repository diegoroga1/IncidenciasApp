import { Component } from '@angular/core';
import { NavController ,NavParams,ToastController} from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";
import {CardDesign} from '../../components/card-design/card-design';
@Component({
  selector: 'page-creadas',
  templateUrl: 'creadas.html',
})
export class Creadas {

  creadas=[];
  constructor(public navCtrl: NavController,private af:AngularFireDatabase, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Creadas');
    this.mostrarIncidenciasCreadas();

  }
  mostrarIncidenciasCreadas(){
    this.af.list('/users/'+localStorage.getItem("user_uid")+'/incidenciasCreadas').forEach(data=>{
      console.log(data);
      data.forEach(item=>{
        console.log(item);
        this.creadas.push(item);
      })

    });
  }
}
