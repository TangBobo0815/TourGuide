import { Component, OnInit} from '@angular/core';

import { Router, } from '@angular/router';

import { UserDateService } from '../services/user-date.service';

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
  array2=[];
  packages:Package[];

  constructor(
    public authData:UserDateService,
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
      this.loginUserName=doc.data().Name;
    }).then(()=>{
      firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
        if(querySnapshot.size==0){
        }
        querySnapshot.forEach(doc => {
          this.array=doc.data().package;
          this.array2=doc.data().package.packageId;
          console.log(this.array2)
        })
      })
    })
    
    
  }

  get(uid){
      this.router.navigate(['/join/'+uid])
    }

}
