import { Component, OnInit } from '@angular/core';
import { IonicRatingModule } from "ionic4-rating";
import { StarRatingModule } from 'ionic4-star-rating';
import { PackageService } from '../services/package.service';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import * as angular from '@ionic/angular';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { AlertController , ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Reference } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'app-star',
  templateUrl: './star.page.html',
  styleUrls: ['./star.page.scss'],
})

export class StarPage implements OnInit {
  id:string;
  star:number=2;
  starP:number=2;
  Total:number=0;
  Total2;
  TotalP:number=0;
  Total2P;
  array:[];
  arrayP:[];
  packages;
  textForm:any;
  userName:string;
  packUser:string;
  packUserId:Reference;

  constructor( 
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private rating: StarRatingModule,
    private packageservice: PackageService,
    private router : Router,
    public packDetail:PackageService,
    private alertCtrl:AlertController,
    private builder: FormBuilder,
    private afAuth: AngularFireAuth,
  ) {
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc=>{
      this.userName=doc.data().Name;
    })
  }

  logRatingChange(rating){
    this.star=rating;
    console.log("star: ",rating);
    console.log(typeof(rating));
  }

  logRatingChangeP(rating){
    this.starP=rating;
    console.log("starP: ",rating);
  }
  
  setScore(){
    let uid=this.db.createId();
    let docId=this.db.createId();
    let pUID=this.db.createId();
    let newscore = this.db.collection('packagaScore').doc(this.id);
    var db = firebase.firestore();
    let form = this.textForm.value;

    firebase.firestore().collection('packageScore').where('packageId','==',this.id).get().then(querySnapshot => {
      if (querySnapshot.size==0) {
        console.log('There is no document in this query')
        this.db.collection('packageScore').doc(uid).set({
          packageId:this.id,
          score:[this.star],
          total:this.star,
          text:[form.text]
        }).then(()=>{
          this.db.collection('scoreStatus').doc(docId).set({
            packageId:this.id,
            user:[{userName:this.userName,userId:this.afAuth.auth.currentUser.uid}]
          })
        })
        
        
        .then(() => {
          console.log('success1');
          this.starSuccess();
        });
      }else{
        querySnapshot.forEach(doc=>{
          console.log(doc.id,doc.data());
          this.array=doc.data().score;
          const totalFire=doc.data().total;
          console.log(this.array);
        
          this.db.collection('packageScore').doc(doc.id).update({
            score: firebase.firestore.FieldValue.arrayUnion(this.star),
            text: firebase.firestore.FieldValue.arrayUnion(form.text)
          }).then(()=>{
              firebase.firestore().collection('packageScore').doc(doc.id).get().then(docx => {
                console.log(docx.data());
                
                console.log('this.array.length'+this.array.length);

                this.Total=totalFire+this.star;
                console.log(this.Total);
                
                this.Total2=Math.round((this.Total)/2);
                console.log(this.Total2);
                this.db.collection('packageScore').doc(doc.id).update({
                  total:this.Total2,
                })
                firebase.firestore().collection('scoreStatus').where('packageId','==',this.id).get().then(querySnapshot=>{
                  if(querySnapshot.size!=0){
                    querySnapshot.forEach(data=>{
                      this.db.collection('scoreStatus').doc(data.id).update({
                        user: firebase.firestore.FieldValue.arrayUnion({userName:this.userName,userId:this.afAuth.auth.currentUser.uid}),
                      })
                    })
                  }
                })
                
              })
            })
        })
      }
    })

    firebase.firestore().collection('personScore').where('packUserId','==',this.packUserId).get().then(query=>{
      if(query.size==0){
          this.db.collection('personScore').doc(pUID).set({
          packUserId:this.packUserId,
          packUserName:this.packUser,
          score:[this.starP],
          total:this.starP,
          //text:[form.text]
        })
      }else{
        query.forEach(doc=>{
          console.log(doc.id,doc.data());
          this.arrayP=doc.data().score;
          const totalFire=doc.data().total;
          console.log(this.arrayP);
        
          this.db.collection('personScore').doc(doc.id).update({
            score: firebase.firestore.FieldValue.arrayUnion(this.starP),
          }).then(()=>{
              firebase.firestore().collection('personScore').doc(doc.id).get().then(docx => {
                console.log(docx.data());
                
                console.log('this.array.length'+this.array.length);

                this.TotalP=totalFire+this.starP;
                console.log(this.Total);
                
                this.Total2P=Math.round((this.TotalP)/2);
                console.log(this.Total2P);
                this.db.collection('personScore').doc(doc.id).update({
                  total:this.Total2P,
                })
                
                .then(()=>{
                  this.starSuccess();
                })
              })
          })
        })
      }
    })

  }

  ngOnInit() {
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('uid');
    this.packDetail.getPackagesData(this.id);
    this.packDetail.getPjoin().subscribe(packages=>{
      this.packages=packages;
    })

    firebase.firestore().collection('packages').where('packageId','==',this.id).get().then(doc=>{
      doc.forEach(data=>{
        this.packUser=data.data().userName;
        this.packUserId=data.data().userId
        console.log(this.packUserId,this.packUser)
      })
    })
  }

  buildForm(){
    this.textForm = this.builder.group({
      text: ['']
    });
    this.textForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  private onValueChanged(data?: any) {
    if (!this.textForm) { return; }

  }
  

  async starSuccess(){
    const alert = await this.alertCtrl.create({
      header: '評分完成',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/order']);
          }
        }
      ]
    });

    await alert.present();
  }
}


