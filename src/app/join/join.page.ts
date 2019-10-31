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
   /*this.packDetail.getData().forEach(element=>{
      console.log(element);
      // this.packages=element;
      // console.log(this.packages);
      this.packageId=element.packageId;
      this.title=element.title;
      this.startDate=element.startDate;
      this.endDate=element.endDate;
      this.place=element.place;
      this.detailsArray=element.detailsArray;
      this.context=element.context;
      this.money=element.money;
    })*/
   this.id = this.route.snapshot.paramMap.get('uid');
   console.log(this.id);
   this.packDetail.getPackagesData(this.id);
   this.packDetail.getPjoin().subscribe(packages=>{
    console.log(packages);
    this.packagejoin=packages;
  })

  }

  join(){
    this.joinService.joinOrder(this.id)
  }

  ViewCreater(){
    this.userId = this.db.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref;
    console.log(this.userId);
    this.router.navigate(['/profile/'+ this.userId])
  }


  zoomImage(img) {
    console.log(img);
    this.photoViewer.show(img,'圖片');
}

}
