import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
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
    let result;
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
      this.afAuth.auth.currentUser.sendEmailVerification();
      //this.router.navigate(['/login']);
      result=0;
      return result;
    })
    .catch(error=>{
      console.log("註冊失敗:",error)
      const errorCode = error.code;

      if(errorCode==='auth/email-already-in-use'){ //嚴格相等
        console.log('這個email已註冊');
        result=-9
      }else if(errorCode === 'auth/invalid-email'){
        console.log('郵件輸入有誤');
        result=-8
      }else{
        console.log('錯誤');
        result=-7
      }
      return result;
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
    let result;
    return this.db.doc(`users/${user.uid}`).update(data)
      .then(()=>{
        result=0; //sucess
        return result;
      });  
   }

  //-------------------------

  //---------------登入
  emailLogin(user){
    let result;
    return this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password)
      .then(()=>{
        console.log("success")
        return result=0;
      })
      .catch(error=>{
        const errorCode = error.code;
        if(errorCode==='auth/user-not-found'){ //嚴格相等
          //not signup
          console.log('未註冊');
          result=-9; 
        }else if (errorCode==='auth/wrong-password'){
          //pwd wrong
          console.log('密碼錯誤'); 
          result=-8;
        }else{
          //fail
          result=-7;
        }
        console.log("登入失敗: ",error)
        return result;
      })
  }
  //------------------------
  //---------------google註冊

  googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
  }

  private oAuthLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider)
    .then((credential)=>{
      this.googleUser(
        credential.user,
      );
    })
  }

  private googleUser(user){
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`)
    const data : User = {
      uid:user.uid,
      email:user.email,
      Name:user.displayName,
      //date:user.birth,
      // gender:user.gender,
      //phone:user.phone,
      //address:user.address,
      imgsrc:user.photoURL
    }
    return userRef.set(data,{merge:true});
  }

  //---------------忘記密碼
  async resetPassword(user){
    let result;
    return await this.afAuth.auth.sendPasswordResetEmail(String(user.email))
      .then(()=>{
        console.log('email sent success')
        return result=0;
      })
      .catch((error)=>{
        console.log(error)
        return result=-9;
      })
  }

  //---------------登出
  signOut(){
    return this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/login']);
    });
  }
}