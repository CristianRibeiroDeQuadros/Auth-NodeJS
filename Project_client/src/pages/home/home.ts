import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { SignupPage } from '../signup/signup';
import { InitialPage } from '../initial/initial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  email: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController) {

  }  

  ionViewDidLoad() {

    
  }

  login(){

      this.showLoader();

      let credentials = {
          email: this.email,
          password: this.password
      };

      this.authService.login(credentials).then((result) => {
          this.loading.dismiss();
          this.navCtrl.setRoot(InitialPage);
      }, (err) => {
          this.loading.dismiss();
          console.log(err.statusText);
      });

  }

  launchSignup(){
      this.navCtrl.push(SignupPage);
  }

  loginGoogle(){
      this.showLoader();
      this.authService.loginGoogle().then((result) => {
          this.loading.dismiss();
      }, (err) => {
        console.log('algo deu errado no direcionamento: ' + err);
        this.loading.dismiss();
      });
  }

  showLoader(){

      this.loading = this.loadingCtrl.create({
          content: 'Authenticating...'
      });

      this.loading.present();

  }

}
