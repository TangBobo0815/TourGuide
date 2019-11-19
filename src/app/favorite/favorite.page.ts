import { Component, OnInit} from '@angular/core';

import { Router, NavigationExtras } from '@angular/router';

import { UserDateService } from '../services/user-date.service';
import { PackageService } from '../services/package.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from "../../models/user";
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Package } from '../../models/package';


import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  loginUserName:string;
  user: Observable<User>;
  array=[];
  packages:Package[];

  constructor(
    public authData:UserDateService,
    private packDetail:PackageService,
    private auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private afAuth:AngularFireAuth) {
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user) {
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
      }))
    }

  ngOnInit() {
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      console.log(doc.data());
      this.loginUserName=doc.data().Name;
      console.log('userName:'+this.loginUserName);
    }).then(()=>{
      firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
        if(querySnapshot.size==0){
          console.log('No value')
        }
        querySnapshot.forEach(doc => {
          console.log(doc.id,doc.data());
          this.array=doc.data().package;
          console.log(this.array);
        })
      })
    })
    
    
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
      this.router.navigate(['/details/'+uid])
    }

}
