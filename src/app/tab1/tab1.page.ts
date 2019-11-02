import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order} from '../../models/order';
import { Observable, of } from 'rxjs';
import { User } from "../../models/user";
import { UserDateService } from '../services/user-date.service';
import { switchMap } from 'rxjs/operators';

import { AngularFirestore, DocumentReference, AngularFirestoreCollection, Reference } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
//import undefined = require('firebase/empty-import');
 

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  orders:Order[];
  user: Observable<User>;
  userId:string;
  show:'false';
  userImg:string;

  constructor(
    private orderService: OrderService,
    private authData: UserDateService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    ) {
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

  ngOnInit() {
    this.orderService.selectAll2().forEach(element=>{
      for(var i=1;i<=element.length;i++){
        element.forEach(data=>{
          if(data == undefined){
            element.pop();
          }
        })
      }
      console.log(element);
      this.orders=element;
    })
  }
}
