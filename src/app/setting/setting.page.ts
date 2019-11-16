import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { PackageService } from '../services/package.service';
import { AlertController } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})

export class SettingPage implements OnInit { 
  
  i:number=0;
  z:number=this.i+1;
  imgurl:string;
  pacid;
  title;
  updataForm: any;
  ownpackage =null;
  packagejoin;
  packageForm:FormGroup;
  constructor(private afAuth: AngularFireAuth, 
              private route: ActivatedRoute,
              public packDetail:PackageService,
              private alertCtrl: AlertController,
              private router: Router,
              private builder: FormBuilder
             ) {
              this.pacid = this.route.snapshot.paramMap.get('uid');
              var db = firebase.firestore();
              var collection = db.collection('packages')

              this.packDetail.getPackagesData(this.pacid);
              this.packDetail.getPjoin().subscribe(packages=>{
                console.log(packages);
                this.ownpackage=packages;
              })

              }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.packageForm = this.builder.group({
      title: ['',
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)]
      ],
      place:['基隆市',
        [Validators.required]
      ],
      startDate:[
        [Validators.required]
      ],
      startTime:[null],
      endDate:[
        [Validators.required]
      ],
      endTime:[null],
      price:['',
       [Validators.required,Validators.pattern('^([Z0-9]+)')]
      ],
      population:['',
        [Validators.required]
      ],
      context:['',
        [Validators.required,
          Validators.minLength(20), 
          Validators.maxLength(500)]
      ],
      note:[''],
      detailsGroup:this.builder.array([
        this.addDetailsFormGroup()
      ])
    })  
    this.packageForm.valueChanges.subscribe(data => this.onValueChanged(data));
     // reset messages 
    this.onValueChanged();
  }

  addDetailsFormGroup(){
    return this.builder.group({
      photo:new FormControl(this.imgurl || null),
 
      photoRef:new FormControl('')
    })
  }

  formErrors = {
    'title': '',
    'context':''
  };

  validatorMessages={
    'title':{
      'required':'必填欄位',
      'minlength': '字數至少為5字',
      'maxlength': '字數最多為15字'
    },
    'context':{
      'required':'必填欄位',
      'minlength': '字數至少為20字',
      'maxlength': '字數最多為1000字'
    }
  }

  private onValueChanged(data?: any) {
    if (!this.packageForm) { return; }
    const form = this.packageForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      switch (field) {
        case 'title':
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

  Deletepackage(ownpackageID){
    var db = firebase.firestore();
    var dpack = db.collection('packages')
    var dorder = db.collection('order')
    dpack.doc(ownpackageID).delete();
    dorder.doc(ownpackageID).delete().then(
      this.Sucess
    );
      this.Sucessdel();
  }


  updataPackage(packageId) {
    let form = this.packageForm.value;
    const data: any = {
      context:form.context,
      title:form.title,
      place:form.place,
      startDate:form.startDate,
      startTime:form.startTime,
      endDate:form.endDate,
      endTime:form.endTime,
      other:form.note,
    };
    this.packDetail.updatepackage(packageId, data)
      .then(
        this.Sucess
      );
    this.Sucess();
  }

  async Sucess() {
    var self = this;
    const alert = await self.alertCtrl.create({
      header: '修改成功',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  async Sucessdel() {
    var self = this;
    const alert = await self.alertCtrl.create({
      header: '刪除成功',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

}
