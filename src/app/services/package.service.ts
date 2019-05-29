import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

//--------------

import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Reference } from '@angular/fire/storage/interfaces';
import { Url } from 'url';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  packagesCollection: AngularFirestoreCollection<Package>;
  user: Observable<User>;
  packages:Observable<Package[]>;

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
}

export interface Package {
  title?:string;
  detailsArray?:Array<true>,
  userRef?:string,
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