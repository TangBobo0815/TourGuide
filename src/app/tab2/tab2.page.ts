import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order} from '../../models/order';
import { Observable, of } from 'rxjs';
import { User } from "../../models/user";
import { UserDateService } from '../services/user-date.service';
import { switchMap } from 'rxjs/operators';

import { AngularFirestore} from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import {Router} from '@angular/router';
import * as firebase from 'firebase';





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
  Failorders=[];
  agreeorders=[];
  a;
  wait = true;
  icon = false;
  cancel = false;
  icon1 = true;
  agree = false;
  icon2 = true;
  isenabled:boolean=false;
  Date=new Date();
  userName:string;
  
  
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
        this.route.navigate(['/star/'+uid])
    }
    

  ngOnInit() {
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      this.userName=doc.data().Name;
    })
    this.orderService.selectAll().forEach(element=>{
      
      for(var i=element.length;i>=0;i--){
        if((element[i]) == null || element[i].status=='申請失敗' ||(element[i].status)=='申請中'){
          element.splice(i, 1);
        }
      }
      this.array=element;

      for(var i=0;i<element.length;i++){
        var isenable:boolean=false;
        console.log(this.array[i].packageId)
        firebase.firestore().collection('scoreStatus').where('packageId','==',this.array[i].packageId).get().then(doc=>{
          if(doc.size==0){console.log('no')}
          doc.forEach(data=>{
            console.log(data.data())
            for(var i=0;i<doc.size;i++){
              console.log(doc.size);
              if(data.data().user[i]['userId']==this.afAuth.auth.currentUser.uid){
                this.array[i]['isenable']=false;
              }
            }
          })
        })
        if(element[i].startDate!=null){
          var startDate=element[i].startDate;
          
          const Today2=this.Today.replace("-", "/").replace("-", "/");
          const Today3=Date.parse(Today2).valueOf();
  
          startDate=startDate.replace("-", "/").replace("-", "/");
          const statDate2=Date.parse(startDate).valueOf();
          if((statDate2<=Today3)&&(element[i].status=='申請成功')){
            isenable=true;
            this.array[i]['isenable']=true;
          }else{
            this.array[i]['isenable']=false;
          }
        }else{
          this.array[i]['isenable']=false;
        }
      }
      
      
      this.orders=this.array;
    })

    
  }


  changewait(id){
    if(id == 1){
      this.wait = !this.wait;
      this.icon = !this.icon;

    }
    else if(id == 2){

      this.orderService.selectAll().forEach(failpac=>{
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

      this.orderService.selectAll().forEach(argeepac=>{
        for(var i=argeepac.length;i>=0;i--){
          if((argeepac[i]) == null || (argeepac[i].status)=='申請失敗' || (argeepac[i].status)=='申請成功' ){
            argeepac.splice(i, 1);
          }
        }
        this.agreeorders=argeepac;
      })

      this.agree = !this.agree;
      this.icon2 = !this.icon2;
    }
    
  }


}
