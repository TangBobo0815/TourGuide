import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable , of, BehaviorSubject , combineLatest, Timestamp, from} from 'rxjs';
import {flatMap, map, toArray} from 'rxjs/operators';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { stringify } from '@angular/core/src/render3/util';
import { Title } from '@angular/platform-browser';
import { element, reference } from '@angular/core/src/render3';
import { toDate } from '@angular/common/src/i18n/format_date';
import { User } from 'src/models/user';
import { Attend } from "../../models/attend";

@Component({
  selector: 'app-attend',
  templateUrl: './attend.page.html',
  styleUrls: ['./attend.page.scss'],
})
export class AttendPage implements OnInit {
  user: Observable<User>;
  attend: Observable<Attend>;
  attendForm:FormGroup;
  Date=new Date();
  year=this.Date.getFullYear().toString();
  month=(this.Date.getMonth()+1).toString();
  date=this.Date.getDate().toString();
  
  Today=this.year+'-'+this.month+'-'+this.date;

  id:string=this.route.snapshot.paramMap.get('uid');;
  arrays=[];
  data=[];
  myBoolean = true;
  pactitle;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private db : AngularFirestore,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private storage: AngularFireStorage,
    private afAuth:AngularFireAuth,
    private route: ActivatedRoute
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
    console.log(this.id);
    firebase.firestore().collection('packages').where('packageId','==',this.id).get().then(qtitle =>{
      qtitle.forEach(doc1 =>{
        this.pactitle = doc1.data().title;
      })
    })
    firebase.firestore().collection('order').where('packageId','==',this.id).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.data());
        if(doc.data().status=='申請成功'){
          this.arrays.push({userId:doc.data().userId,userName:doc.data().userName});
        }
        console.log(this.arrays);
        console.log(this.arrays.length)
      })
    }).then(()=>{
      const controlArray = <FormArray> this.attendForm.get('detailsGroup');
      for(var i=0;i<=this.arrays.length-1;i++){
        controlArray.controls[i].get('userId').patchValue(this.arrays[i].userId);
        controlArray.controls[i].get('userName').patchValue(this.arrays[i].userName);
        controlArray.controls[i].get('status').patchValue(false);
        if(i!=this.arrays.length-1){
          this.addDetailsButtonClick();
        }else{
          break;
        }

        
      }
    })
    
    this.buildForm();
  }

  buildForm() {
    this.attendForm = this.builder.group({
      detailsGroup:this.builder.array([
        this.addDetailsFormGroup()
      ])
      
    })  
    this.attendForm.valueChanges.subscribe(data => this.onValueChanged(data));
     // reset messages
    this.onValueChanged();
  }

  addDetailsFormGroup(){
    return this.builder.group({
      userId:new FormControl(),
      userName:new FormControl(),
      status:new FormControl([false,Validators.required])
    })
  }

  addDetailsButtonClick(): void{
    (<FormArray>this.attendForm.get('detailsGroup')).push(this.addDetailsFormGroup()) 
  }

  get detailsArray():FormArray{
    return <FormArray> this.attendForm.get('detailsGroup');
  }

  private onValueChanged(data?: any) {
    if (!this.attendForm) { return; }
  }

  click(array){
    console.log(array); 
  }

  submitForm(){
    let form=this.attendForm.value;
    
    const data={
      packageId:this.id,
      attend:form.detailsGroup,
    }

   console.log(data)

   this.db.collection('attendStatus').add(data).then(()=>{
     this.Success();
   });
  }  

  checkChange(i,arr){
    console.log(i,arr)
  }

  async Success(){
    const alert = await this.alertCtrl.create({
      header: '完成',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}
