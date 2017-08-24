import { Component ,ViewChild, ElementRef } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions} from '@ionic-native/google-maps';
import { CogerUbicacion } from '../../providers/coger-ubicacion';
import { Geolocation } from '@ionic-native/geolocation';
import {DialogoIncidencia} from '../dialogo-incidencia/dialogo-incidencia';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

declare var google;
@Component({
  selector: 'page-vista-ubicacion',
  templateUrl: 'vista-ubicacion.html',
})
export class VistaUbicacion {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  miPosicion:any={};
  posicionIncidencia=null;
  lat:any;
  long:any;
  modificado=true;
  marker:any;
  markerIn:any;
  constructor(public navCtrl: NavController, public af:AngularFireDatabase,public cogerUbi:CogerUbicacion,private googleMaps: GoogleMaps, public navParams: NavParams,public geolocation: Geolocation,private ubicacion:CogerUbicacion) {
    //this.loadMap();
    this.getCurrentPosition()
    if(this.navParams.get('datosIncidencia')){
      this.navParams.get('datosIncidencia').forEach(data=>{
        console.log(data);
        this.lat=data.ubicacion.lat;
        this.long=data.ubicacion.long;
        this.posicionIncidencia=new google.maps.LatLng(this.lat, this.long);
        console.log(this.posicionIncidencia);
      })
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad VistaUbicacion');

  }
  //Crea un mapa
    pressEvent(e){
      console.log(e);

    }
    loadMap(){
       let latLng = new google.maps.LatLng(this.miPosicion.lat, this.miPosicion.long);
        let mapOptions = {
          center: this.posicionIncidencia,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.Satellite
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.addMiUbicacion();
        this.addUbicacionIncidencia(this.posicionIncidencia);
    }

    //Coge ubicacion actual
    getCurrentPosition(){
      this.geolocation.getCurrentPosition()
        .then(position => {
          this.miPosicion = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          }
          this.loadMap();
        })
        .catch(error=>{
          console.log(error);
        })
    }
    //Señaliza mi ubicacion con marcador por defecto
  addMiUbicacion(){
      console.log(this.geolocation.getCurrentPosition());
   this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.miPosicion.lat, this.miPosicion.long),
    });
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(this.marker, content);
  }
  //Señaliza ubicacion de la incidencia
  addUbicacionIncidencia(pos){
    console.log(this.posicionIncidencia,this.posicionIncidencia);
    if(pos!=null){
      this.modificado=null;
      this.markerIn = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
        position:  pos,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6, //tamaño
          fillOpacity:1// opacidad del relleno
        },
      });
    }else{
      this.modificado=null;
      this.markerIn = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
        position:  this.map.getCenter(),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6, //tamaño
          fillOpacity:1// opacidad del relleno
        },
      });
      this.posicionIncidencia=this.miPosicion;
    }
    let longpress=false;
    let start;

    google.maps.event.addListener(this.map,'click',function (data) {
      if(longpress){
        this.markerIn.setMap(null);
        console.log(data.latLng);
        var pos=data.latLng;
        let lat=pos.lat();
        let long=pos.lng();
        this.modificado=null;
        this.posicionIncidencia={lat,long};
        this.addUbicacionIncidencia(data.latLng);
        console.log(this.posicionIncidencia);
      }
    }.bind(this));

    google.maps.event.addListener(this.map, 'mousedown', function(event){
      start = new Date().getTime();

    });
    google.maps.event.addListener(this.map, 'mouseup', function(event){
      let end = new Date().getTime();
      longpress = (end - start < 500) ? false : true;

    });
    //RECOGE EL EVENTO DE ARRASTRE DEL MARCADOR EN EL MAPA
    /*google.maps.event.addListener(marker, 'dragend', function(data) {
      console.log(data);
      console.log(marker);
      var pos = marker.getPosition()
      let lat=pos.lat();
      let long=pos.lng();
      console.log(lat,long)
      this.modificado=null;
      this.posicionIncidencia={lat,long};
    }.bind(this));*/

      this.marker.setMap(this.map);

      this.markerIn.setMap(this.map);
      //this.map.addMarker(marker);
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(this.marker, content);
    this.addInfoWindow(this.markerIn, content);
  }
  //Añade informacion al marcador
  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  //CAMBIA LA UBICACIÓN DE UNA INCIDENCIA YA CREADA, O ASIGNA UBICACION A UNA POR CREAR
  cambiarUbicacion(){
    if(this.navParams.get('datosIncidencia')){//SI LE HE PASADO UNA INCIDENCIA POR PARAMETRO, CAMBIAMOS UBICACION
      this.navParams.get('datosIncidencia').forEach(data=>{
        if(data.estado!="Resuelta"){
          console.log(data);
          this.af.object('/incidencias/' + data.$key + '/ubicacion').set(this.posicionIncidencia);
        }
      })
    }else{//SI NO, SIGNIFICA QUE LA VAMOS A CREAR
      this.cogerUbi.setUbicacion(this.posicionIncidencia);
    }
    this.navCtrl.pop();
  }
  refresh(){
    console.log("hola");
  }

}
