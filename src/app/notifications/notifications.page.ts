import { Component, OnInit } from '@angular/core';

import { Platform, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFirestore} from '@angular/fire/firestore';
import { Subject, combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  searchterm: string;
  qmoney: number;
  qmoneyup: number;
  qpeople: string;
  qpeopleup: string;
  startAt = new Subject();
  endAt = new Subject();
  selectvalue;
  qplace = [];
  packages = [];
  place: string = null;
  money: string = null;
  people:string = null;
  startobs = this.startAt.asObservable();
  ensobs = this.endAt.asObservable();



  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private router: Router,
    public popoverController: PopoverController
  )  {}


  ngOnInit() {
    combineLatest(this.startobs, this.ensobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((packages) => {
        this.packages = packages;
      })
      this.place = null;
      this.people = null;
      this.money = null;
    });
  }

  selectplace(chplace) {
    var db = firebase.firestore();
    var collection = db.collection('packages') 
    this.packages = [];
    if(chplace != null){
      this.people = null;
      this.money = null;
    }
    collection.where("place", "==", chplace).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.data());
        this.qplace.push(doc.data());
        if (this.qplace !== this.packages) {
          this.qplace.push(doc.data());
          this.packages.push(doc.data());
        }
      })
    })
  }

  selectmoney(chmoney) {
    var db = firebase.firestore();
    var collection = db.collection('packages')
    this.packages = [];
    if(chmoney != null){
      this.place = null;
      this.people = null;
    }
    if (chmoney == "1") {
      this.qmoney = 1000;
      collection.where("money", "<", this.qmoney).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chmoney == "2") {
      this.qmoney = 1000;
      this.qmoneyup = 2000;
      collection.where("money", ">=", this.qmoney).where("money", "<", this.qmoneyup).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chmoney == "3") {
      this.qmoney = 2000;
      this.qmoneyup = 4000;
      collection.where("money", ">=", this.qmoney).where("money", "<", this.qmoneyup).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chmoney == "4") {
      this.qmoney = 4000;
      this.qmoneyup = 6000;
      collection.where("money", ">=", this.qmoney).where("money", "<", this.qmoneyup).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chmoney == "5") {
      this.qmoney = 6000;
      collection.where("money", ">=", this.qmoney).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
  }


  selectpeople(chpeople) {
    var db = firebase.firestore();
    var collection = db.collection('packages')
    this.packages = [];
    if(chpeople != null){
      this.place = null;
      this.money = null;
    }
    if (chpeople == "1") {
      this.qpeople = "2";
      collection.where("person", "<=", this.qpeople).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chpeople == "2") {
      this.qpeople = "3";
      this.qpeopleup = "5";
      collection.where("person", ">=", this.qpeople).where("person", "<", this.qpeopleup).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chpeople == "3") {
      this.qpeople = "5";
      this.qpeopleup = "8";
      collection.where("person", ">=", this.qpeople).where("person", "<", this.qpeopleup).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
    else if (chpeople == "4") {
      this.qpeople = "8";
      collection.where("person", ">=", this.qpeople).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.qplace.push(doc.data());
          if (this.qplace !== this.packages) {
            this.qplace.push(doc.data());
            this.packages.push(doc.data());
          }
        })
      })
    }
  }


  get(uid) {
    console.log(uid);
    this.router.navigate(['/join/' + uid])
  }


  search($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');

  }

  firequery(start, end) {
    return this.afs.collection('packages', ref => ref.limit(10).orderBy('title').endAt(end).startAt(start)).valueChanges();
  }

}
