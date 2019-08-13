import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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

  //---------------
  packageId:string;
  title:string;
  startDate:string;
  endDate:string;
  place:string;
 
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
  ) { }

  ngOnInit() {
    // this.packDetail.getData(this.array).forEach(packages=>{
    //   console.log(packages);
    //   this.packages=packages;
    //   console.log('data:'+this.packages);
    // })
    //this.buildForm()
    this.packDetail.getData().forEach(element=>{
      console.log(element);
      // this.packages=element;
      // console.log(this.packages);
      this.packageId=element.packageId;
      this.title=element.title;
      this.startDate=element.startDate;
      this.endDate=element.endDate;
      this.place=element.place;
    
    })
    
  }

  join(){
    this.joinService.joinOrder(this.packageId)
  }
}
