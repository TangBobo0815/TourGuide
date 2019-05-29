import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { User } from "../../models/user";
import { Router } from '@angular/router';
import { AuthService } from '.././services/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';


import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  user :Observable<firebase.User>;
  loginForm:any;

  constructor(private auth: AuthService,
              private builder: FormBuilder,
              private router: Router,
              public alertCtrl: AlertController,
              public afAuth: AngularFireAuth,
              public platform:Platform,
) {
                this.user=this.afAuth.authState;
              }

  ngOnInit() {
    this.buildForm();
  }

  login(){
    let form = this.loginForm.value;
    const data ={
      email:form.email,
      password:form.password
    };
    this.auth.emailLogin(data).then(i=>{
      if(i==0){
        this.router.navigate(['/home']);
      }
      else if(i==-9){
        this.loginFail(); //not signup
        this.loginForm.reset();
      }else if(i==-8){
        this.pwdFail(); //email or pwd worng
        this.loginForm.reset();
      }else{
        this.Fail(); //fail
        this.loginForm.reset();
      }
    });
  }

 /* googleLogin(){
    if(this.platform.is('cordova')){
      this.nativeGoogleLogin();
    }else{
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin():Promise<void>{
    try{
      const gplusUser = await this.gplus.login({
        'webClientId':'693255000376-omgan83jj2tnl7bgh2annah1n94l8466.apps.googleusercontent.com',
        'offline':true,
        'scopes':'profie email'
      }).then((res)=>{
        this.router.navigate(['/home']);
        const googleCredential = firebase.auth.GoogleAuthProvider
                  .credential(res.idToken);

              firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
                console.log("Firebase success: " + JSON.stringify(response));
            });
      })
    }catch(err){
      console.log(err);
    }
  }

  webGoogleLogin(){
    let result;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(()=>{
      this.router.navigate(['/home']);
    })
  }
  
  googleSignUp(){
    this.auth.googleLogin();
  }*/

  resetPassword(){
    let form = this.loginForm.value;
    const data={
      email:form.email
    }
    this.auth.resetPassword(data);
  }

  buildForm() {
    this.loginForm = this.builder.group({
      email: ['',
        [Validators.required, Validators.email]
      ],
        password: new FormControl('',
          [Validators.required,
          ]
        ),
      })
  }

  //-------------------------------

  //---------------登入失敗dialog
  async loginFail() {
      const alert = await this.alertCtrl.create({
        header: '登入失敗!',
        subHeader: '還沒有註冊哦，快去註冊吧!',
        buttons: ['OK']
      });
      await alert.present();
  }

  async pwdFail(){
    const alert = await this.alertCtrl.create({
      header: '登入失敗!',
      subHeader: '請確定你的帳號密碼是否正確',
      buttons: ['OK']
    });
    await alert.present();
  }

  async Fail(){
    const alert = await this.alertCtrl.create({
      header: '登入失敗!',
      subHeader: '錯誤',
      buttons: ['OK']
    });
    await alert.present();
  }
}
