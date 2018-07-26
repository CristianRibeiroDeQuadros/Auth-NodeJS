import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Auth {
 
  public token: any;
 
  constructor(public http: Http, public storage: Storage) {
 
  }
 
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.storage.get('token').then((value) => {
            
            this.token = value;
 
            let headers = new Headers();
            headers.append('Authorization', 'JWT ' + this.token);
            console.log(this.token);
 
            this.http.get('http://localhost:3000/user/checkAuthentication', {headers: headers})
                .subscribe(res => {
                    resolve(res);                    
                }, (err) => {
                    reject(err);
                });
        });        
 
    });
  }
 
  gotoProfile(){
    return new Promise((resolve, reject) => {
 
      //Load token if exists
      this.storage.get('token').then((value) => {
          
          this.token = value;

          let headers = new Headers();
          headers.append('Authorization', 'JWT ' + this.token);
          //console.log(this.token);

          this.http.get('http://localhost:3000/user/profile', {headers: headers})
              .subscribe(res => {
                  resolve(res);                  
              }, (err) => {
                  reject(err);
              });

      });        

    });
  }

  loginGoogle(){
    return new Promise((resolve, reject) => {
 
      //Load token if exists
      this.storage.get('token').then((value) => {
          
          this.token = value;

          let headers = new Headers();
          headers.append('Authorization', 'JWT ' + this.token);
          //console.log(this.token);

          this.http.get('http://localhost:3000/user/google/login', {headers: headers})
              .subscribe(res => {
                  resolve(res);                  
              }, (err) => {
                  reject(err);
              });
      });        

    });
  }

  createAccount(details){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post('http://localhost:3000/user/signup', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            resolve(data);
 
          }, (err) => {
            reject(err);
          });
 
    });
 
  }
 
  login(credentials){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post('http://localhost:3000/user/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);            
            resolve(data);
 
            resolve(res.json());
            console.log(res.json());
          }, (err) => {
            reject(err);
          });
 
    });
 
  }
 
  logout(){
    this.storage.set('token', '');
  }
 
}