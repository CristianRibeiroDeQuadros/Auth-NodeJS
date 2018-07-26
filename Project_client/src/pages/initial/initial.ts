import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the InitialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: Auth) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad InitialPage');
  }

  profile(){
    this.authService.gotoProfile().then((result) => {      
      console.log(result);
    }, (err) => {
        console.log(err);
    });
  }

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
