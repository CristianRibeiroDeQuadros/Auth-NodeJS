import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InitialPage } from '../pages/initial/initial';
import { HomePage } from '../pages/home/home';
import { Auth } from '../providers/auth/auth';
import { ViewLoaderPage } from '../pages/view-loader/view-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  loading: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public loadingCtrl: LoadingController, public auth: Auth) {
    this.showLoader();
    this.rootPage = ViewLoaderPage;
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Verifica se ja existe um usuario autenticado para ver qual pagina vai abrir
      
      this.auth.checkAuthentication().then((result) => {
        this.rootPage = InitialPage;
        this.loading.dismiss();
      }, (err) => {
        this.rootPage = HomePage;
        this.loading.dismiss();
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
        content: 'Authenticating...'
    });

    this.loading.present();

}

}
