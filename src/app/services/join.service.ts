import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { WindowService } from '../window.service';
//--------------

import { Observable, of, from } from 'rxjs';
import { User } from "../../models/user";
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class JoinService {
  user: Observable<User>;
  userName:string;

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

  joinOrder(packageId){
    let id = this.db.createId();
    //var myFirebaseFirestoreTimestampFromDate = firebase.firestore.Timestamp.fromDate(new Date());
    var finishedAt = firebase.firestore.FieldValue.serverTimestamp();


    const data={
      userId:this.db.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref,
      userName:this.getUserName(),
      status:'申請中',
      packageId:packageId,
      orderTime:finishedAt
    }

    this.db.collection('order').doc(id).set(data)
      .then(i=>
        this.Sucess()
      )
    console.log(data);
  }

  getUserName(){
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      console.log(doc.data());
      this.userName=doc.data().Name;
      console.log('userName:'+this.userName);
    })
    return this.userName
  }

  async Sucess(){
    const toast = await this.toast.create({
      message: '加入要求成功傳送，靜待開團者回覆',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }
}
