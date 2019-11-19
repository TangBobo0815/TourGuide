import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order} from '../../models/order';
import { Observable, of, empty, VirtualTimeScheduler } from 'rxjs';
import { User } from "../../models/user";
import { UserDateService } from '../services/user-date.service';
import { switchMap } from 'rxjs/operators';

import { AngularFirestore, DocumentReference, AngularFirestoreCollection, Reference } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { isUndefined, isNullOrUndefined, isNull } from 'util';
import {Router} from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  orders:Order[];
  user: Observable<User>;
  userId:string;
  show:'false';
  userImg:string;
  key:number;
  array=[];
  a;
  isenabled:boolean=false;

  Date=new Date();
  year=this.Date.getFullYear().toString();
  month=(this.Date.getMonth()+1).toString();
  date=this.Date.getDate().toString();
  
  Today=this.year+'-'+this.month+'-'+this.date;

  constructor(
    private orderService: OrderService,
    private authData: UserDateService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route: Router,
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

    get(uid){
        console.log(uid); 
        this.route.navigate(['/star/'+uid])
    }
    

  ngOnInit() {
    this.orderService.selectAll().forEach(element=>{
      for(var i=element.length;i>=0;i--){
        if((element[i]) == null){
          element.splice(i, 1);
        }
      }
      this.array=element;
      console.log(Date);

      for(var i=0;i<=element.length;i++){
        console.log(this.array[i].startDate);
        var startDate=this.array[i].startDate;

        startDate=startDate.replace("-", "/").replace("-", "/");
        new Date(startDate);
        console.log(startDate);
        if((startDate==null)){
          this.isenabled=false;
          continue;
        }else if(((startDate>=Date)==true)&&(this.array[i].status=='申請成功')){
          console.log(startDate>=Date);
          this.isenabled=true;
          break;
        }else{
          this.isenabled=false;
        }
      }
        
      this.orders=this.array;

      
      console.log(this.orders);
    })
      
  }
}
