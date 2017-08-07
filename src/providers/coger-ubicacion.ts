import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';


/*
  Generated class for the CogerUbicacion provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var google;
@Injectable()

export class CogerUbicacion {
  public ubicacion:{};
  constructor(public geolocation: Geolocation) {
    console.log('Hello CogerUbicacion Provider');
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.ubicacion=latLng;
      console.log(this.ubicacion);
    }, (err) => {
      console.log(err);
    });
    console.log(this.ubicacion);
  }
  getLatLng(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.ubicacion=latLng;
      console.log(this.ubicacion);
    }, (err) => {
      console.log(err);
    });

  }
  getUbicacion(){
    console.log(this.ubicacion);
    return this.ubicacion;
  }
  setUbicacion(ubi){
    this.ubicacion=ubi;
  }

}
