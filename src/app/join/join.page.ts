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
  array:[];
  data: any;
  id:string;
  packagejoin =null;
  i:number;
  userId;
  packUserName:string;
  view:boolean=true;
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

        if(this.packUserName==this.loginUserName){
          this.view=false;
        }else{
          this.view=true;
        }
        console.log(this.packUserName);
      })
    })
  }

  join(){
    this.joinService.joinOrder(this.id,this.packUserName);
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


  zoomImage(img) {
    console.log(img);
    this.photoViewer.show(img,'圖片');
  }

}
