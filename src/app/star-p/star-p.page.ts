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
  userId;
  updataForm: any;
  view = true;
  pac = false;
  icon = true;

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

    if (this.userId == null || this.userId == '') {
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }));
    }
  }

  ngOnInit() {
    this.buildForm();
    this.userId = this.route.snapshot.paramMap.get('uid');
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

}
