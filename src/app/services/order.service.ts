import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable , of, BehaviorSubject , combineLatest} from 'rxjs';
import {flatMap, map, toArray} from 'rxjs/operators';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { stringify } from '@angular/core/src/render3/util';

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
export interface Show {
  uid?:string;
  Name?:string;
  packageId?:string;
  orderTime?:Date;
  status:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  user: Observable<User>;
  userId$: BehaviorSubject<String>;
  uid:string;
  array=[];

  orderCollection:AngularFirestoreCollection<Order>;
  orderItem:Observable<Order[]>;

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
        const orderTime = data.orderTime;
        const status=data.status;
        const userId=data.userId;
          console.log('userID'+userId);
          return this.db.doc(userId).valueChanges().pipe(map( (SignupData: User) => {
            return Object.assign(
              {UID:userId, name: SignupData.Name, OrderTime:orderTime}); }
        
          ));
      });
    }), flatMap(shows => combineLatest(shows)));

    this.orderItem.forEach(value => {
      console.log(value);
    });
  }

  getPackTitle(){
    this.orderCollection = this.db.collection('order');
    this.orderItem = this.orderCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map( change => {
        const data = change.payload.doc.data();
        const packageId = data.packageId;
        const orderTime = data.orderTime;
        const status=data.status;
        const userId=data.userId;
          console.log('userID'+userId);
          return this.db.doc(userId).valueChanges().pipe(map( (SignupData: User) => {
            return Object.assign(
              {UID:userId, name: SignupData.Name, OrderTime:orderTime}); }
        
          ));
      });
    }), flatMap(shows => combineLatest(shows)));

    this.orderItem.forEach(value => {
      console.log(value);
    });
  }

  selectAll(){
    this.collectionInitialization();
    return this.orderItem;
  }

  
}
