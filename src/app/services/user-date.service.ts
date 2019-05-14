import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { map } from 'rxjs/operators';

export interface user {
   id?:string;
   Name:string;
   address:string;
   date:string;
   email:string;
   gender:string;
   phone:string;
}
@Injectable({
  providedIn: 'root'
})
export class UserDateService {
private usersCollection: AngularFirestoreCollection<user>;
  
private users:Observable<user[]>;
  constructor(db: AngularFirestore) { 
    this.usersCollection =db.collection<user>('users')
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(Actions => {
        return Actions.map(a =>{
          const data = a.payload.doc.data();
          const id =a.payload.doc.id;
          return {id,...data};
        });
      })
    )
  }
  getusers(){
    return this.users;
  }
  getuser(id){
    return this.usersCollection.doc(id).valueChanges();
  }
}

