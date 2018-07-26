import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupform: FormGroup;
  submitAttempt: boolean = false;

  email: string;
  password: string;
  loading: any;
  message: '';

  constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public formBuilder: FormBuilder) {
    this.signupform = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register(){   
    //se um dos campos do formulario nao for preenchido dispara a mensagem
    //esta funcao sera customizada futuramente 
    if(!this.signupform.valid){
      this.submitAttempt = true;      
    }
    else{
      this.showLoader();
 
      let details = {
          email: this.email,
          password: this.password        
      };
  
      this.authService.createAccount(details).then((result) => {
        this.loading.dismiss();
        console.log(result);
        this.presentToast(result);
        this.navCtrl.setRoot(HomePage);
      }, (err) => {
        console.log(err);
        this.presentToast(err.statusText);
        this.loading.dismiss();
      });
    }
  }
 
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}
