import { Component, OnInit } from '@angular/core';

import { Platform, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from '../services/auth.service';

import { FormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subject, Observable, combineLatest  } from 'rxjs';
import * as _ from 'lodash';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  searchterm:string;

  startAt = new Subject();
  endAt = new Subject();

  packages;

  startobs = this.startAt.asObservable();
  ensobs = this.endAt.asObservable();

 

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private router: Router,
    public popoverController: PopoverController
    ) {this.initializeApp(); }

    initializeApp() {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }

  ngOnInit() {
    combineLatest(this.startobs, this.ensobs).subscribe((value) =>{
      this.firequery(value[0], value[1]).subscribe((packages)=>{
        this.packages = packages;
      })
    });
  }

  
  get(uid){
    /*  var db= firebase.firestore();   
      var collection = db.collection('packages')
      
      // var ref = db.collection('packages').where("title","==","title");
      
    
      collection.doc(id).get().then(doc => {
        console.log(doc.id, doc.data());
        //this.test.push(doc.data());
        this.packDetail.getPackagesData(doc.id);
      }).then(i=>this.router.navigate(['/join']))*/
      console.log(uid);
      this.router.navigate(['/join/'+uid])
    }


  search($event){
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');

  }

  firequery(start, end){
    return this.afs.collection('packages', ref => ref.limit(10).orderBy('title').endAt(end).startAt(start)).valueChanges();
  }

}
