import { Component, ElementRef, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController, Loading, AlertController, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  LatLng,
  GoogleMapsEvent,
  VisibleRegion
} from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { UsersProvider } from "../../providers/users/users";
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [UsersProvider]
})
export class MapPage {
  @ViewChild("map") mapElement: ElementRef;
  public loc: LatLng;
  map: GoogleMap;
  public current_position: any = { latitude: "", longitude: "" };
  loading: Loading;
  public locations = [];
  constructor(public plat: Platform, private users: UsersProvider, private alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController,public navParams: NavParams,    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation) {
  }
  loadingBox() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
  alertMsg(content) {
    let alert = this.alertCtrl.create({
      title: "Info",
      subTitle: content,
      buttons: ["OK"]
    });
    alert.present();
  }
  gpsRequest() {
    this.plat.ready().then(() => {
      if (this.plat.is("android")) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
            this.locationAccuracy
              .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(
                () => this.startTracking(),
                error =>
                  console.log("Error requesting location permissions", error)
              );
          }
        });
      } else {
        this.startTracking();
      }
    });
  }
  startTracking() {
    let earth = 6378.137;  //radius of the earth in kilometer
    let pi = Math.PI;
    let m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree
    let cos = Math.cos;

    this.loadingBox();
    var opts = {
      timeout: 20000, enableHighAccuracy: true , maximumAge: 0
    };
    this.geolocation
      .getCurrentPosition(opts)
      .then(resp => {
        this.loading.dismiss();
        this.loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
        this.initMap();
        this.current_position = {
          latitude: Number(resp.coords.latitude + (200 * m)).toFixed(6),
          longitude: Number(resp.coords.longitude + (200 * m) / cos(resp.coords.longitude * (pi / 180))).toFixed(6)
        };
      })
      .catch(error => {
        this.loading.dismiss();
        this.alertMsg("Activate the GPS please.");
        this.initMap();
      });
  }


  initMap() {
    let element = this.mapElement.nativeElement;

    this.map = GoogleMaps.create(element);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      let options = {
        target: this.loc,
        zoom: 15,
        backgroundColor: "transparent"
      };

      this.map.moveCamera(options);
      
    });
    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(data => {
      this.getUsersMap();  
    });
  }

  getUsersMap() {
    let iconProfile;
    iconProfile = "assets/imgs/mapIcon.png";
    this.users.map().subscribe(
      data => {
        this.locations = [];
        data.json().users.forEach(element => {
          this.locations.push({
            position: {
              lat: parseFloat(element.volunteer.latitude),
              lng: parseFloat(element.volunteer.longitude)
            },
            icon: {
              url: iconProfile,
              size: { width: 32, height: 32 }
            },
            title: element.volunteer.lastname
          });
        });
      },
      error => {
      }
    );
    setTimeout(() => {
      this.addCluster();
    }, 1000);
  }
  addCluster() {
    this.map
      .clear()
      .then(() => {
        this.map
          .addMarkerCluster({
            markers: this.locations,
            boundsDraw: false,
            icons: [
              {
                min: 2,
                max: 100,
                url: "./assets/imgs/cluster.png",
                anchor: { x: 16, y: 16 },
                label: {
                  color: "white",
                  bold: true,
                  fontSize: 14
                }
              }
            ]
          })
          .then(markerCluster => {
            markerCluster
              .on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(cluster => {
               
              });
          });
      })
      .catch(err => {
        console.error(err);
      });
  }
  ionViewDidLoad() {

  }

  ngAfterViewInit() {
    this.gpsRequest();
  }
}
