import { Component ,ViewChild, ElementRef } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions} from '@ionic-native/google-maps';
import { CogerUbicacion } from '../../providers/coger-ubicacion';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
@Component({
  selector: 'page-vista-ubicacion',
  templateUrl: 'vista-ubicacion.html',
})
export class VistaUbicacion {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  miPosicion:any={};
  posicionIncidencia:any={};

  constructor(public navCtrl: NavController,  private googleMaps: GoogleMaps, public navParams: NavParams,public geolocation: Geolocation,private ubicacion:CogerUbicacion) {
    //this.loadMap();
    this.navParams.get('datosIncidencia').forEach(data=>{
      console.log(data);
      this.posicionIncidencia=data.ubicacion;
      console.log(this.posicionIncidencia);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad VistaUbicacion');
    this.getCurrentPosition()
  }

  //Crea un mapa
    loadMap(){
       let latLng = new google.maps.LatLng(this.miPosicion.latitude, this.miPosicion.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.Satellite
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMiUbicacion();
        this.addUbicacionIncidencia();
    }
    //Coge ubicacion actual
    getCurrentPosition(){
      this.geolocation.getCurrentPosition()
        .then(position => {
          this.miPosicion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          this.loadMap();
        })
        .catch(error=>{
          console.log(error);
        })
    }
    //Señaliza mi ubicacion con marcador por defecto
  addMiUbicacion(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(marker, content);
  }
  //Señaliza ubicacion de la incidencia
  addUbicacionIncidencia(){
    console.log(this.posicionIncidencia,this.posicionIncidencia);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
        position:  new google.maps.LatLng(this.posicionIncidencia.latitud,this.posicionIncidencia.longitud),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6, //tamaño
          fillOpacity:1// opacidad del relleno
        },
      });
      marker.setMap(this.map);
      //this.map.addMarker(marker);
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(marker, content);

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
}
