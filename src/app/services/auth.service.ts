import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//--------------

import { Observable, of } from 'rxjs';
import { User } from "../../models/user";
import { Tour } from "../../models/tour";
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';
import { AngularFireStorage } from 'angularfire2/storage';
//-----------------

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: Observable<User>;
  tour: Observable<Tour>;
  //----------------------
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    public alertCtrl :AlertController,
    private toast: ToastController
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  //---------------註冊
  signUp(user){
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
    .then(credential=>{
      this.updateUserData(
        credential.user,
        user.Name,
        user.gender,
        user.date,
        user.phone,
        user.address,
        //user.touron,
        // user.imgsrc
      );
      console.log('註冊成功');
      this.registerSucess();
      //this.router.navigate(['/login']);
      this.afAuth.auth.currentUser.sendEmailVerification();
    })
    .catch(error=>{
      console.log("註冊失敗:",error)
      const errorCode = error.code;

      if(errorCode==='auth/email-already-in-use'){ //嚴格相等
        console.log('這個email已註冊');
        this.registerFail();
        return;
      }
    });
  }

  private updateUserData(user, Name,gender,date,phone,address){
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`)
    const data:User = {
      email: user.email,
      Name: Name,
      date:date,
      gender:gender,
      phone:phone,
      address:address,
      // touron:touron,
      // imgsrc:imgsrc
    }
    return userRef.set(data);
  }

  //-------------------------

  //---------------登入

  
  emailLogin(user){
    return this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password)
      .then(()=>{
        console.log("success")
        this.router.navigate(['/home']);
      })
      .catch((error)=>{
        console.log("登入失敗: ",error)
        this.loginFail();
      });
  }

  //---------------忘記密碼
  async resetPassword(user){
    return await this.afAuth.auth.sendPasswordResetEmail(String(user.email))
      .then(()=>{
        console.log('email sent success')
        this.emailSucess();
      })
      .catch((error)=>{
        console.log(error)
        this.emailFail();
      })
    }

  //---------------登出(?)
  signOut(){
    return this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/']);
    });
  }
  
  //---------------註冊成功alert
  
  async registerSucess() {
    const alert = await this.alertCtrl.create({
        header: '註冊成功',
        subHeader: ' 回登入畫面繼續',
        buttons: ['OK']
    });
    await alert.present();
  }

  //---------------註冊失敗toast
  
  async registerFail(){
    const toast = await this.toast.create({
      message: '這個郵件地址已存在',
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  //---------------登入失敗dialog
  async loginFail() {
    const alert = await this.alertCtrl.create({
        header: '登入失敗!',
        subHeader: '請確定你的帳號密碼是否正確',
        buttons: ['OK']
    });
    await alert.present();
  }

  //---------------郵件傳送dialog
  async emailSucess(){
    const alert = await this.alertCtrl.create({
      header: '傳送成功!',
      subHeader: '請至您的信箱確認驗證信',
      buttons: ['OK']
    });
    await alert.present();
  }

  async emailFail(){
    const alert = await this.alertCtrl.create({
      header: '傳送失敗!',
      subHeader: '請先在郵件處輸入您的email再按忘記密碼',
      buttons: ['OK']
    });
    await alert.present();
  }
}