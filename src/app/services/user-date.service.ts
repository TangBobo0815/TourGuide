import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//--------------

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController , ToastController } from '@ionic/angular';

export interface User {
   uid:string;
   Name:string;
   address?:string;
   date?:string;
   email?:string;
   gender?:string;
   phone?:string;
}
@Injectable({
  providedIn: 'root'
})

export class UserDateService {
  user: Observable<User>;
  
  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router)
    {
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user) {
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
        
    }

      
    //   this.usersCollection =db.collection<user>('users')
    //   this.users = this.usersCollection.snapshotChanges().pipe(
    //     map(Actions => {
    //       return Actions.map(a =>{
    //         const data = a.payload.doc.data();
    //         const id =a.payload.doc.id;
    //         return {id,...data};
    //       });
    //     })
    //   )
    // }
    // getusers(){
    //   return this.users;
    // }
    // getuser(id){
    //   return this.usersCollection.doc(id).valueChanges();
    // }

  


}

