import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UsersProvider]
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };
 
  constructor(private users: UsersProvider, private nav: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

 
  public login() {
    this.showLoading()
    this.users.signin(this.registerCredentials).subscribe(
      data => {
        localStorage.setItem("user_id", data.json().data.id);
        localStorage.setItem("access-token", data.headers.get("access-token"));
        localStorage.setItem("client", data.headers.get("client"));
        localStorage.setItem("uid", data.headers.get("uid"));
        localStorage.setItem("type_u", data.json().data.type_u);
        this.loading.dismiss();
        this.nav.setRoot('MainPage');
      },
      error => {
        this.loading.dismiss();
        this.showError("Erreur");
        console.log(error);
      }
    );
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}