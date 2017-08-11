import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FirebaseListObservable,AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the CogerIncidencias provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CogerIncidencias {
  incidencias=this.af.list('/incidencias');
  constructor(public af:AngularFireDatabase) {
    console.log('Hello CogerIncidencias Provider');

  }
  getData():any{
    let incidenciasList:FirebaseListObservable<any>;
    incidenciasList=this.incidencias;
    return incidenciasList;
  }
  getAsyncData(): Promise<any[]> {
    // async receive mock data
    return new Promise(resolve => {

      setTimeout(() => {
        resolve(this.getData());
      }, 1000);

    });
  }



}
