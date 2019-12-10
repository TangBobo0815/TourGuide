
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, DocumentReference} from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable , of, concat} from 'rxjs';
import {flatMap, map, toArray} from 'rxjs/operators';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { User } from 'src/models/user';
import { Attend } from "../../models/attend";
import { query } from '@angular/core/src/render3';

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
  loginUserName: string;
  uid:DocumentReference;

  Today:string;

  arrayPack=[];
  arrayAttend=[];
  
  //id:string=this.route.snapshot.paramMap.get('uid');
  id:string;
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

    this.buildForm();
  

    if((this.date).length!=2){
      this.Today=this.year+'-'+this.month+'-'+'0'+this.date;
    }else{
      this.Today=this.year+'-'+this.month+'-'+this.date;
    }


    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc => {
      this.loginUserName = doc.data().Name;
    })

      firebase.firestore().collection('packages').where('startDate', '==', this.Today).get().then(querySnapshot => {
        console.log(this.Today);
        console.log(querySnapshot.size);
  
        querySnapshot.forEach(docx => {
          console.log(docx.data())

          this.arrayPack.push(docx.data( ));
          console.log(this.arrayPack);
          console.log(this.arrayPack[0].packageId);
          console.log(this.arrayPack[0].userName);  
        })
      }).then(()=>{
        for(var i=0;i<this.arrayPack.length;i++){
          if(this.arrayPack[i].userName==this.loginUserName){
            console.log(this.arrayPack[i].userName);
            console.log(this.arrayPack[i].packageId);
            console.log(this.loginUserName);
            this.id=this.arrayPack[i].packageId;
            console.log(this.id)
          }
        }
      }).then(()=>{
        if(this.id==null){
          this.Null();
        }
        firebase.firestore().collection('attendStatus').where('packageId','==',this.id).get().then(query=>{
          if(query.size==1){
            console.log('您已點過名');
            this.Already();
          }
        })
        firebase.firestore().collection('packages').where('packageId','==',this.id).get().then(qtitle =>{
          qtitle.forEach(doc1 =>{
            this.pactitle = doc1.data().title;
            console.log(this.pactitle);
          })
        }).then(()=>{
          firebase.firestore().collection('order').where('packageId','==',this.id).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              if(doc.data().status=='申請成功'){
                this.arrays.push({userId:doc.data().userId,userName:doc.data().userName});
              }
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
        })
      })

    

    
    
    
    
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

   this.db.collection('attendStatus').add(data).then(()=>{
     this.Success();
   })

   

   .then(()=>{
     firebase.firestore().collection('attendStatus').where('packageId','==',this.id).get().then(query=>{
       query.forEach(doc=>{
         console.log(doc.data());
         this.arrayAttend=doc.data().attend;
         
         
         for(var i=0;i<this.arrayAttend.length;i++){
          if(this.arrayAttend[i].status==false){
            this.uid=this.arrayAttend[i].userId;
            this.db.doc(this.uid).get().forEach(data=>{
              console.log(data.data());
              this.db.doc(this.uid).update({
                score:(data.data().score)-5
              })
            })
           
          }
         }
        
       })
     })
   })
  }  

  checkChange(i,arr){
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

  async Null(){
    const alert = await this.alertCtrl.create({
      header: '您今天沒有行程',
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

  async Already(){
    const alert = await this.alertCtrl.create({
      header: '您已點名過了哦',
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
