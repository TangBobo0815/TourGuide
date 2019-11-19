import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PackageService } from '../services/package.service';
import { JoinService } from '../services/join.service';
import * as firebase from 'firebase';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

//--------------
import { Package } from '../../models/package'
import { Observable, of, from } from 'rxjs';
import { User } from "../../models/user";
import { AlertController , ToastController } from '@ionic/angular';
import { element } from '@angular/core/src/render3';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

//-----------------
@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
})
export class JoinPage implements OnInit {
  test=[];
  packages:Package[];
  array=[];
  array2=[];
  Array3;
  data: any;
  id:string;
  check=false;
  packagejoin =null;
  i:number;
  userId;
  packUserName:string;
  view:boolean=true;
  packId:string;
  packId2:string;
  //---------------
  packageId:string;
  title:string;
  startDate:string;
  endDate:string;
  place:string;
  detailsArray:Array<string>;
  context:string;
  money:string;
  userName:string;
  //---------------
  joinForm:any;
  loginUserName:string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    public alertCtrl :AlertController,
    public packDetail:PackageService,
    public joinService:JoinService,
    private toast: ToastController,
    private builder: FormBuilder,
    private photoViewer: PhotoViewer,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('uid');
    console.log(this.id);
    this.packDetail.getPackagesData(this.id);
    this.packDetail.getPjoin().subscribe(packages=>{
      console.log(packages);
      this.packagejoin=packages;
    })

    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      console.log(doc.data());
      this.loginUserName=doc.data().Name;
      console.log('userName:'+this.loginUserName);
    }).then(()=>{
      firebase.firestore().collection('packages').doc(this.id).get().then(doc=>{
        this.packUserName=doc.data().userName;
        console.log(doc.data().userName);

        // if(this.packUserName!=this.loginUserName){
        //   this.view=true;
        // }else{
        //   this.view=false;
        // }
        // console.log(this.packUserName);
      })
    }).then(()=>{
      firebase.firestore().collection('order').where('packageId','==',this.id).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.array.push(doc.id);
        })
      }).then(()=>{
        console.log(this.array);
        firebase.firestore().collection('order').where('userName','==',this.loginUserName).get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.data());
            this.array2.push(doc.id);
        })
        console.log(this.array2);
      }).then(()=>{
        for(var i=0;i<=this.array.length;i++){
          const packId=this.array.pop();
          console.log(packId);
          
          for(var i=0;i<=this.array2.length;i++){
            const packId2=this.array2.pop();
            console.log(packId2);
            if((packId==packId2)&&(packId!=null) || this.packUserName==this.loginUserName){
              this.view=false;
              break;
            }else{
              this.view=true;
            }
            continue;
          }
        }
      })
      })
    })

    firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
      if (querySnapshot.size==0){
        this.check = false;
      }else{
        this.check = true;
      }
    })
  }

  join(){
    this.joinService.joinOrder(this.id,this.packUserName);
    this.view=false;
    // this.joinService.getPackUser(this.id);
  }

  // get(){
  //   firebase.firestore().collection('packages').doc(this.id).get().then(doc=>{
  //     this.packUserName=doc.data().userName;
  //     console.log(doc.data().userName);
  //   })
  //   return this.packUserName;
  //}

  ViewCreater(){
    // this.userId = this.db.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref;
    // console.log(this.userId);
    // this.router.navigate(['/profile/'+ this.userId])
    console.log(this.packagejoin.userId);
    this.db.doc(this.packagejoin.userId).get().forEach(doc=>{
      console.log(doc.data());
      this.userId=doc.data().uid;
      this.router.navigate(['/profile/'+ this.userId])
    })
  }

  favorite(name,id,title,context,phonearray){
    let uid = this.db.createId();
    this.Array3 = phonearray[0].photo;
    
    const data={
      userId:this.db.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref,
      userName:this.loginUserName,
      package:[{
        packageId:id,
        title:title,
        context:context,
        photo:this.Array3
      }],
    }

    firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
      if (querySnapshot.size==0) {
        console.log('There is no document in this query')
        this.db.collection('favorite').doc(uid).set(data)
        .then(
        )
        console.log(data);
      }else{
        // querySnapshot.forEach(doc => {
        //   console.log(doc.id,doc.data());
        //   this.db.collection('favorite').doc(doc.id).delete().then(
        //   )
        // })
        querySnapshot.forEach(doc => {
          console.log(doc.id,doc.data());
          this.db.collection('favorite').doc(doc.id).update({
            package: firebase.firestore.FieldValue.arrayUnion({packageeId:id,title,context,photo:this.Array3})
          }
          ).then(
          )
        })

        console.log(data);
      }
    })
    this.check = !this.check;
  }

  getUserName(){
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      console.log(doc.data());
      this.userName=doc.data().Name;
      console.log('userName:'+this.userName);
    })
    return this.userName
  }

  zoomImage(img) {
    console.log(img);
    this.photoViewer.show(img,'圖片');
  }

  async Sucess(){
    const toast = await this.toast.create({
      message: '已經申請過了哦!',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

}
