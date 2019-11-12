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
import { AlertController , ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  orders:Order[];
  user: Observable<User>;
  userId:string;
  show:boolean=true;
  userImg:string;
  array=[];
  array2=[];

  constructor(
    private orderService: OrderService,
    private authData: UserDateService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
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
      for(var i=element.length;i>=0;i--){
        if((element[i]) == null || element[i].status=='申請成功' || element[i].status=='申請失敗'){
          element.splice(i, 1);
        }
      }
      console.log(element);
      this.orders=element;
    })
  }

  ok(id){
    const data={
      status:'申請成功'
    }

    this.db.collection('order').doc(id).update(data)
      .then(()=>
        this.Sucess()
    )
    console.log(data);
    this.show=false;
  }

  reject(id){
    const data={
      status:'申請失敗'
    }

    this.db.collection('order').doc(id).update(data)
      .then(()=>
        this.Fail()
    )
    console.log(data);
    this.show=false;
  }

  async Sucess(){
    const toast = await this.toast.create({
      message: '該名使用者已加入！',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  async Fail(){
    const toast = await this.toast.create({
      message: '該名使用者已被拒絕！',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }
}
