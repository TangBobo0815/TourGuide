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
import { element, query } from '@angular/core/src/render3';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  id:string;
  array=[];
  packagejoin =null;
  userId:string;
  detailsArray:Array<string>;
  userName;
  b;

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
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('uid');
    this.packDetail.getPackagesData(this.id);
    this.packDetail.getPjoin().subscribe(packages=>{
      console.log(packages);
      this.packagejoin=packages;
    })
  }

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

   
  deleteFavorite(ownPackageId,ownPackageTitle,ownPackagecontext){
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      console.log(doc.data());
      this.userName=doc.data().Name;
      console.log('userName:'+this.userName);
    }).then(()=>{
    firebase.firestore().collection('favorite').where('userName','==',this.userName).get().then(querySnapshot=>{ 
      querySnapshot.forEach(doc => {
        console.log(doc.id,doc.data());
      if(querySnapshot.size==0){
        console.log('No Value')
      }else{
        this.db.collection('favorite').doc(doc.id).update({
          package:firebase.firestore.FieldValue.arrayRemove({context:ownPackagecontext,packageId:ownPackageId,photo:this.packagejoin.detailsArray[0]['photo'],title:ownPackageTitle})
        }).then(i=>{
            this.Sucess()
        }) 
      }
        console.log('success')
       })
    })

   

  

    })
    }
    async Sucess(){
      const toast = await this.toast.create({
        message: '刪除成功',
        showCloseButton: true,
        duration: 3000,
        position: 'bottom',
        closeButtonText: 'Ok'
      })
      toast.present();
    }
    
    
}
