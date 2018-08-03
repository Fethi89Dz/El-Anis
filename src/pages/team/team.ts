import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
import { SERVER_NAME } from "../../providers/config";


@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
  providers: [UsersProvider]
})
export class TeamPage {
  public volunteers;
  public serverName;
  loading: Loading;
  constructor(private users: UsersProvider, public navCtrl: NavController, public navParams: NavParams, 
    private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.serverName = SERVER_NAME;
  }

  public show () {
    this.users.myteam().subscribe(
      data => {
        this.volunteers = data.json().users;
      },
      error => {

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

 
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    this.show();
  }
}
