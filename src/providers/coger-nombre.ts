import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the CogerNombre provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CogerNombre {
  public users:FirebaseListObservable<any>;
  public nombre:string;
  constructor(public af:AngularFireDatabase) {
    console.log('Hello CogerNombre Provider');
  }
 public getNameWithKey(key:any) :any{
    this.users=this.af.list('/users/'+key);
    this.users.forEach(data=>{
      data.forEach(data2=>{
        if(data2.$key=="nombre"){
          this.nombre=data2.$value
        }
      })
    })
  }
}
