import { Component, OnInit } from '@angular/core';
import { UserDateService } from '../services/user-date.service';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ReplaySubject } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, Reference } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
//import { userInfo } from 'os';
import { User } from "../../models/user";
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PackageService } from '../services/package.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-star-p',
  templateUrl: './star-p.page.html',
  styleUrls: ['./star-p.page.scss'],
})
export class StarPPage implements OnInit {
  user: Observable<User>;
  test: string = 'false';
  show: string = 'false';
  orderId;
  updataForm: any;
  view = true;
  pac = false;
  icon = true;
  userData;
  userId:DocumentReference;
  array=[];
  arrayP=[];
  joinpack=[];
  ownid;
  userName:string;

  constructor(
    private builder: FormBuilder,
    private authData: UserDateService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController,
    private pack: PackageService,
    private route: ActivatedRoute
  ) {

   

    
  }

  ngOnInit() {
    this.buildForm();
    this.orderId = this.route.snapshot.paramMap.get('uid');
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc => {
      this.ownid = doc.data().Name;
      console.log(this.ownid);
    }).then(()=>{
      firebase.firestore().collection('order').doc(this.orderId).get().then(doc=>{
        this.userId = doc.data().userId;
        console.log(this.userId)
      }).then(()=>{
        this.db.doc(this.userId).get().forEach(doc=>{
          this.array.push(doc.data())
          console.log(this.array);
        }).then(()=>{
          this.db.doc(this.userId).get().forEach(query=>{
              this.userName=query.data().Name;
              console.log(this.userName);
          }).then(()=>{
            firebase.firestore().collection('personScore').where('packUserName','==',this.userName).get().then(query=>{
              if(query.size==0){
                this.arrayP.push({scoreP:'此開團者尚未被評分'});
              }
              else{
                query.forEach(doc=>{
                  this.arrayP.push({scoreP:doc.data().total});
                })
              }
            })
            console.log(this.arrayP);
          })
        })
      })
    })
          
      

   }

  buildForm() {
    this.updataForm = this.builder.group({
      uid: ['',
        [Validators.required]
      ],
      email: ['',
        [Validators.required, Validators.email]
      ], Name: ['',
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]
      ],
      gender: ['',
        [Validators.required]
      ],
      date: ['',
        [Validators.required]
      ],
      address: ['',
        [Validators.required]
      ],
      phone: [,
        [Validators.required,
        Validators.min(10),
        Validators.maxLength(10),
        Validators.pattern('^([Z0-9]+)')]
      ]
    });

    this.updataForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.updataForm) { return; }

    const form = this.updataForm;
  }

  getj(uid) {
    this.router.navigate(['/join/' + uid])
  }

  joinpackage(name) {
    var db = firebase.firestore();
    var collection = db.collection('packages')

    collection.where("userName", "==", name).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.joinpack.push(doc.data());
      })
    })
    if (this.joinpack != []) {
      this.joinpack = [];
    }
    this.pac = !this.pac;
    this.icon = !this.icon;
  }


  

  
}
