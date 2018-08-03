import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
import { VolunteersProvider } from "../../providers/volunteers/volunteers";
import { SERVER_NAME } from "../../providers/config";

@IonicPage()
@Component({
  selector: 'page-volunteer',
  templateUrl: 'volunteer.html',
  providers: [UsersProvider, VolunteersProvider]
})
export class VolunteerPage {
  public volunteers;
  public serverName;
  loading: Loading;
  constructor(private volunteers_: VolunteersProvider, private users: UsersProvider, public navCtrl: NavController, public navParams: NavParams, 
    private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.serverName = SERVER_NAME;
  }

  public show () {
    this.users.volunteers().subscribe(
      data => {
        this.volunteers = data.json().users;
      },
      error => {

      }
    );
  }
  public addVolunteer(id) {
    this.showLoading()
    this.volunteers_.create({user_id: id}).subscribe(
      data => {
        this.show();
        this.loading.dismiss();
        this.showError("Has been added successfully");
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
