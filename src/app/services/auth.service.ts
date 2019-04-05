import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//--------------

import { Observable, of } from 'rxjs';
import { User } from "../../models/user";
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';
//-----------------

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: Observable<User>;
  //----------------------
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    public alertCtrl :AlertController,
    private toast: ToastController,
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
      this.infosignUp(
        credential.user,
        user.Name,
        user.gender,
        user.date,
        user.phone,
        user.address
      );
      console.log('第一階段註冊成功');
      this.register1Sucess();
      this.afAuth.auth.currentUser.sendEmailVerification();
      //this.router.navigate(['/login']);
    })
    .catch(error=>{
      console.log("註冊失敗:",error)
      const errorCode = error.code;

      if(errorCode==='auth/email-already-in-use'){ //嚴格相等
        console.log('這個email已註冊');
        this.alreadyFail();
        return
      }
      if(errorCode === 'auth/invalid-email'){
        this.useremailFail();
        return
      }
    });
  }

  private infosignUp(user,Name,gender,date,phone,address){
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`)
    const data:User = {
      uid:user.uid,
      email: user.email,
      Name: Name,
      date:date,
      gender:gender,
      phone:phone,
      address:address
    }
    return userRef.set(data);
  }

   imgsignUp(user:User,data:any){
     this.register2Sucess();
     return this.db.doc(`users/${user.uid}`).update(data);
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
        this.resetemailSucess();
      })
      .catch((error)=>{
        console.log(error)
        this.resetemailFail();
      })
    }

  //---------------登出(?)
  signOut(){
    return this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/']);
    });
  }
  
  //---------------註冊成功alert

  async register1Sucess(){
    const toast = await this.toast.create({
      message: '第一階段註冊成功',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok'
    })
    toast.present();
  }
  
  async register2Sucess(){
    const toast = await this.toast.create({
      message: '第二階段註冊成功',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  //---------------註冊失敗toast
  
  async alreadyFail(){
    const toast = await this.toast.create({
      message: '這個郵件地址已存在，請使用帳號密碼登入',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  async useremailFail(){
    const toast = await this.toast.create({
      message: '郵件輸入有誤',
      showCloseButton: true,
      position: 'top',
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
  async resetemailSucess(){
    const alert = await this.alertCtrl.create({
      header: '傳送成功!',
      message: '請至您的信箱確認',
      buttons: ['OK']
    });
    await alert.present();
  }

  async resetemailFail(){
    const alert = await this.alertCtrl.create({
      header: '傳送失敗!',
      message: '請確認你是否確實有帳號',
      buttons: ['OK']
    });
    await alert.present();
  }
}