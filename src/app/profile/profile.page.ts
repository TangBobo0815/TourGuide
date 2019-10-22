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
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  updataForm: any;
  user: Observable<User>;
  test:string = 'false';
  show:string = 'false';
  
  constructor(
    private builder: FormBuilder,
    private authData: UserDateService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ); 
  }

  formErrors = {
    'phone':''
  };

  validatorMessages = {
     'phone': {
      'required': '必填欄位',
      'pattern':'只能輸入數字09開頭',
      'minlength': '長度為10',
      'maxlength': '長度為10'
     }
  }

  ngOnInit() {
    this.buildForm();
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
      phone:[,
        [Validators.required,
        Validators.min(10),
        Validators.maxLength(10),
        Validators.pattern('^([Z0-9]+)')]
      ]
    });

    this.updataForm.valueChanges.subscribe(data => this.onValueChanged(data)); 
    // reset messages
    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.updataForm) { return; }

    const form = this.updataForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      switch (field) {
        case 'phone':
          var control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;
      }    
    }
  }

  updataUser(user) {
    let form = this.updataForm.value;    
    const data:any = {
      phone: form.phone,
      address: form.address,
      date: form.date,
    };
    this.authData.updataUser(user,data)
    .then(
      this.Sucess
    );
    console.log(data);

    this.Sucess();
  }

   
  async Sucess(){
    var self = this;
    const alert = await self.alertCtrl.create({
      header: '修改成功',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/profile']);
            this.show = 'false';
          }
        }
      ]
    });

    await alert.present();
  }

}
