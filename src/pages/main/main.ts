import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  public type_u;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type_u = localStorage.getItem('type_u');
    console.log(this.type_u);
    
  }

  goToPage(page) {
    console.log(page);
    
    this.navCtrl.push(page);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
