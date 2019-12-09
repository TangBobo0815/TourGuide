import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order} from '../../models/order';
import { Observable, of } from 'rxjs';
import { User } from "../../models/user";
import { UserDateService } from '../services/user-date.service';
import { switchMap } from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import {  ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  orders:Order[];
  Failorders:Order[];
  agreeorders:Order[];
  user: Observable<User>;
  userId:string;
  show:boolean=true;
  userImg:string;
  array=[];
  array2=[];
  ownid;
  ownpack=[];
  wait = true;
  icon = false;
  cancel = false;
  icon1 = true;
  agree = false;
  icon2 = true;

  constructor(
    private orderService: OrderService,
    private authData: UserDateService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
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

      firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc => {
        this.ownid = doc.data().Name;
      })
    }

  ngOnInit() {
    this.orderService.selectAll2().forEach(element=>{
      for(var i=element.length;i>=0;i--){
        if((element[i]) == null || element[i].status=='申請成功' || element[i].status=='申請失敗'){
          element.splice(i, 1);
        }
      }
      this.orders=element;
      
    })
  }

  
  goProfile(uid){
    this.router.navigate(['/star-p/' + uid])
    console.log(uid) 
  }

  changewait(id){
    if(id == 1){
      this.wait = !this.wait;
      this.icon = !this.icon;
    }
    else if(id == 2){

      this.orderService.selectAll2().forEach(failpac=>{
        for(var i=failpac.length;i>=0;i--){
          if((failpac[i]) == null ||(failpac[i].status)=='申請成功' ||(failpac[i].status)=='申請中'){
            failpac.splice(i, 1);
          }
        }
        this.Failorders=failpac;
      })
      this.cancel = !this.cancel;
      this.icon1 = !this.icon1;
    }
    else if(id == 3){

      this.orderService.selectAll2().forEach(argeepac=>{
        for(var i=argeepac.length;i>=0;i--){
          if((argeepac[i]) == null || (argeepac[i].status)=='申請失敗' || (argeepac[i].status)=='申請中' ){
            argeepac.splice(i, 1);
          }
        }
        this.agreeorders=argeepac;
        console.log(this.agreeorders);
      })

      this.agree = !this.agree;
      this.icon2 = !this.icon2;
    }
    
  }

  ok(id){
    const data={
      status:'申請成功'
    }

    this.db.collection('order').doc(id).update(data)
      .then(()=>
        this.Sucess()
    )
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
