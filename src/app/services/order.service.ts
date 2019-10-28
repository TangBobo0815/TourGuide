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
import { element, reference } from '@angular/core/src/render3';
import { toDate } from '@angular/common/src/i18n/format_date';
import { DateAdapter } from '@angular/material';
import { Package } from './package.service';
import { User } from 'src/models/user';



export interface User {
  uid:string;
  Name:string;
}

export interface Order {
  packageId:string;
  orderTime:Date;
  status:string;
  userId:DocumentReference;
  userName:string;
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
  place:string;
  userId:string;
  packageId:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  user: Observable<User>;
  uid:string;
  UID:string;
  array=[];

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

  collectionInitialization(){
    this.orderCollection = this.db.collection('order');
    
    this.orderItem = this.orderCollection.snapshotChanges().pipe(map(changes=>{    
      return changes.map( change => {
        const data = change.payload.doc.data();
        const packageId = data.packageId;
        //this.setPackTitle(packageId);        
        const orderTime = (data.orderTime);
        const status=data.status;
        const userId=(data.userId);
        const userName=data.userName;
        // const userImg=this.db.doc(userId).valueChanges().forEach(value=>{
        //   this.array.push(value);
        //   this.array.forEach(value=>{
        //     return value.userImg.toString
        //   })
        // });
        
        
          return this.db.collection('packages').doc(packageId).valueChanges().pipe(map( (PackData: Pack) => {
            return Object.assign( 
              {UID:userId, name: userName, packageId:packageId,status:status, OrderTime:orderTime,title:PackData.title,place:PackData.place})
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

  getUserImg(){
    this.array.forEach(value=>{
      return value.userImg;
    })
  }
}
