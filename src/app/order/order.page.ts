import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable , of, BehaviorSubject } from 'rxjs';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';


export interface User {
  uid:string;
  Name:string;
}

export interface Order {
  packageId:string;
  orderTime:Date;
  status:string;
  userId:string;
}


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})


export class OrderPage implements OnInit {

  user: Observable<User>;
  order$: Observable<Order[]>;
  userId$: BehaviorSubject<String>;
  test=[];
  uid:string;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private db : AngularFirestore,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private storage: AngularFireStorage,
    private afAuth:AngularFireAuth
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          this.uid=(user.uid).toString();
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

  ngOnInit() {
    var db= firebase.firestore();   
    var collection = db.collection('order').where('userId', '==', 'users/LjVImDcCpTZkR2ExgiB7TzA548D3')
    
    // var ref = db.collection('packages').where("title","==","title");
  
    collection.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });

    console.log(this.test);
    return this.test;
  }
}
