import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { UsersProvider } from "../providers/users/users";

@Component({
  templateUrl: 'app.html',
  providers: [UsersProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;
  public current_position: any = {latitude: '', longitude: ''};

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
    private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private users: UsersProvider) {
    this.initializeApp();
    if (localStorage.getItem('user_id') === null) {
      this.rootPage = 'OnboardingPage';
    }
    else {
      this.rootPage = 'MainPage';
      this.gpsRequest();
      setInterval(() => { 
        this.currentPosition();
       }, 20000);
    }
  }
  logout() {
    this.users.signout().subscribe(
      data => {
        localStorage.removeItem('client');
        localStorage.removeItem('uid');
        localStorage.removeItem('access-token');
        localStorage.removeItem('user_id');
        this.nav.setRoot('LoginPage');
      },
      error => {
        console.log(error);
      }
    );
  }
  gpsRequest() {
    this.platform.ready().then(() => {
      if (this.platform.is("android")) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
            this.locationAccuracy
              .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(
                () => this.currentPosition(),
                error =>
                  console.log("Error requesting location permissions", error)
              );
          }
        });
      } else {
        this.currentPosition();
      }
    });
  }

  currentPosition() {
    let earth = 6378.137;  //radius of the earth in kilometer
    let pi = Math.PI;
    let m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree
    let cos = Math.cos;
    var opts = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 5000
    };
    this.geolocation
      .getCurrentPosition(opts)
      .then(resp => {        
        this.current_position = {
          latitude: Number(resp.coords.latitude + (200 * m)).toFixed(6),
          longitude: Number(resp.coords.longitude + (200 * m) / cos(resp.coords.longitude * (pi / 180))).toFixed(6)
        };
        this.updatePosition();
      })
      .catch(error => {
      });

    
  }
  updatePosition() {
    this.users.updatePosition(this.current_position).subscribe(
      data => {
      },
      error => {

      }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.push(page);
  }
}
