import { Component, OnInit } from '@angular/core';
import { IonicRatingModule } from "ionic4-rating";
import { StarRatingModule } from 'ionic4-star-rating';
import { PackageService } from '../services/package.service';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import * as angular from '@ionic/angular';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-star',
  templateUrl: './star.page.html',
  styleUrls: ['./star.page.scss'],
})

export class StarPage implements OnInit {
  id:string;
  star:number;
  Total:number=0;
  Total2;
  array:[];

  constructor( 
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private rating: StarRatingModule,
    private packageservice: PackageService        
  ) { }

  logRatingChange(rating){
    this.star=rating;
    console.log("star: ",rating);
    console.log(typeof(rating));
  }
  
  setScore(){
    let uid=this.db.createId();
    let newscore = this.db.collection('packagaScore').doc(this.id);
    var db = firebase.firestore();
    
  
    firebase.firestore().collection('packageScore').where('packageId','==',this.id).get().then(querySnapshot => {
      if (querySnapshot.size==0) {
        console.log('There is no document in this query')
        this.db.collection('packageScore').doc(uid).set({
          packageId:this.id,
          score:[this.star],
          total:this.star
        }).then(() => {
          console.log('success1');
        });
      }else{
        querySnapshot.forEach(doc=>{
          console.log(doc.id,doc.data());
          this.array=doc.data().score;
          const totalFire=doc.data().total;
          console.log(this.array);
        
          this.db.collection('packageScore').doc(doc.id).update({
            score: firebase.firestore.FieldValue.arrayUnion(this.star),
            }).then(()=>{
              firebase.firestore().collection('packageScore').doc(doc.id).get().then(docx => {
                console.log(docx.data());
                
                
                console.log('this.array.length'+this.array.length);

                this.Total=totalFire+this.star;
                console.log(this.Total);
                
                this.Total2=Math.round((this.Total)/(this.array.length+1));
                console.log(this.Total2);
                this.db.collection('packageScore').doc(doc.id).update({
                  total:this.Total2,
                }).then(()=>{
                console.log('success2');
                })
              })
              
              
              
              
            
            
            
            })
            
            
        })
      }
    })
    }
  

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('uid');
    console.log(this.id);
  }
}


