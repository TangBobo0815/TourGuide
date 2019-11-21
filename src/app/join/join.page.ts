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
  favoritePack=[];
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

    firebase.firestore().collection('packageScore').where('packageId','==',this.id).get().then(query=>{
      if(query.size==0){this.packagejoin['score']='此行程尚未被評分';}
      else{
        query.forEach(doc=>{
          this.packagejoin['score']=doc.data().total
        })
      }
      console.log(this.packagejoin['score']);
    })

    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      this.loginUserName=doc.data().Name;
    }).then(()=>{
      firebase.firestore().collection('packages').doc(this.id).get().then(doc=>{
        this.packUserName=doc.data().userName;
      })
    }).then(()=>{
      firebase.firestore().collection('order').where('packageId','==',this.id).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.array.push(doc.id);
        })
      }).then(()=>{
        firebase.firestore().collection('order').where('userName','==',this.loginUserName).get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.array2.push(doc.id);
        })
      }).then(()=>{
        for(var i=0;i<=this.array.length;i++){
          const packId=this.array.pop();
          
          for(var i=0;i<=this.array2.length;i++){
            const packId2=this.array2.pop();
            if((packId==packId2)&&(packId!=null) || this.packUserName==this.loginUserName){
              this.view=false;
              break;
            }else{
              this.view=true;
            }
            continue;
          }
        }
      }).then(()=>{
        firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
          if (querySnapshot.size==0){
            this.check = false;
          }
          querySnapshot.forEach(doc => {
            console.log(doc.data());
            this.favoritePack=doc.data().package;
            console.log(this.favoritePack)
          })
          for(var i=0;i<this.favoritePack.length;i++){
            console.log(this.favoritePack[i]['packageId'])
            if(this.favoritePack[i]['packageId']==this.id){
              this.check = true;
            }
          }
         
        })
      })

    })
    })

    
  }

  join(){
    this.joinService.joinOrder(this.id,this.packUserName);
    this.view=false;
  }


  ViewCreater(){
    this.db.doc(this.packagejoin.userId).get().forEach(doc=>{
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
        this.db.collection('favorite').doc(uid).set(data)
        .then(i=>{
          this.favoriteSuccess()
        })
      }else{
        querySnapshot.forEach(doc => {
          this.db.collection('favorite').doc(doc.id).update({
            package: firebase.firestore.FieldValue.arrayUnion({packageId:id,title,context,photo:this.Array3})
          }).then(i=>{
            this.favoriteSuccess()
          })
        })

      }
    })
    this.check = !this.check;
  }

  getUserName(){
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      this.userName=doc.data().Name;
    })
    return this.userName
  }

  zoomImage(img) {
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

  async favoriteSuccess(){
    const toast = await this.toast.create({
      message: '已加入收藏!',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

}
