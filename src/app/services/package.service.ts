import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

//--------------

import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  packagesCollection: AngularFirestoreCollection<Package>;
  user: Observable<User>;
  packages:Observable<Package[]>;
  packagesData:string;
  test=[];
  id:string;
  private data = [];

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router){
      this.packages = this.db.collection('packages').valueChanges();
  }


  getPackages(){
    return this.packages;
  }
  
  getPjoin(){
    return this.db.collection('packages').doc(this.id).valueChanges();
  }

  getPackagesData(id){
    this.id=id;
  }


   getData(){
    //return this.db.collection('packages').doc(id);
    var db= firebase.firestore();   
    var collection = db.collection('packages')
    
  
    collection.doc(this.id).get().then( doc => {
      console.log(doc.id, doc.data());
      this.test.push(doc.id, doc.data());
    })
    console.log(this.test);
    return this.test;
    
  }

  
}

export interface Package {
  title?:string;
  startDate?:string;
  endDate?:string,
  detailsArray?:Array<true>,
  userId?:string,
}

export class User {
  uid?:string;
  email?: string;
  Name?: string;
  gender?:string;
  date?:Date;
  phone?:string;
  address?:string;
  userImg?:string;
  userImgRef?:string;
  //-----------
  touron?:boolean;
  imgsrc?:string;
  fileRef?:string;
  userid?:string;
}