import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable , of, BehaviorSubject , combineLatest, Timestamp} from 'rxjs';
import {flatMap, map, toArray} from 'rxjs/operators';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { stringify } from '@angular/core/src/render3/util';
import { Title } from '@angular/platform-browser';
import { element } from '@angular/core/src/render3';
import { toDate } from '@angular/common/src/i18n/format_date';
import { DateAdapter } from '@angular/material';

export interface User {
  uid:string;
  Name:string;
}
export interface Order {
  packageId:string;
  orderTime:number;
  status:string;
  userId:string;
}
export interface Show {
  uid?:string;
  Name?:string;
  packageId?:string;
  orderTime?:Date;
  status:string;
}

export interface Pack {
  title:string;
  userId:string;
  packageId:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  user: Observable<User>;
  userId$: BehaviorSubject<String>;
  uid:string;
  showTitle:string;
  place:string;
  array=[];
  array2=[];

  orderCollection:AngularFirestoreCollection<Order>;
  orderItem:Observable<Order[]>;
  packCollectionRef:AngularFirestoreCollection<Pack>;
  packItem:any;


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
    this.collectionInitialization();
   }

   setPackTitle(packageId){
    var db= firebase.firestore();   
    var collection = db.collection('packages');
    
    collection.doc(packageId).get().then(doc=>{
      this.showTitle = doc.data().title
      console.log(doc.data());
      this.array.push(doc.data());
    })
  }

  getTitle(){
    console.log("get title start")
    console.log("this.array.length" + this.array.length);
    this.array.forEach(element=>{
      this.showTitle=element.title
      console.log(this.showTitle);
    })
    console.log("get title end")
    return this.showTitle;
  }

  getPlace(){
    this.array.forEach(element=>{
      this.place=element.place
    })
    return this.place;
  }

  collectionInitialization(){
    this.orderCollection = this.db.collection('order');
    
    this.orderItem = this.orderCollection.snapshotChanges().pipe(map(changes=>{    
      return changes.map( change => {
        const data = change.payload.doc.data();
        const packageId = data.packageId;
        this.setPackTitle(packageId);        
        const title=this.showTitle;
        const place=this.getPlace();
        const orderTime = data.orderTime;
        const status=data.status;
        const userId=data.userId;
        
          return this.db.doc(userId).valueChanges().pipe(map( (SignupData: User) => {
            return Object.assign( 
              {UID:userId, name: SignupData.Name, packageId:packageId,status:status, OrderTime:orderTime,title:title,place:place})
          }
          ));
      });
    }),
    flatMap(shows => combineLatest(shows)));
    
    this.orderItem.forEach(value => {
      console.log(value);
    });
  }

  selectAll(){
    this.collectionInitialization();
    return this.orderItem;
  }  
}
