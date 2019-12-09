import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormBuilder, FormGroup, FormControl , FormArray } from '@angular/forms';
import { PackageService } from '../services/package.service';
import { AlertController } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable , of } from 'rxjs';
import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { DomSanitizer } from '@angular/platform-browser' ;

export interface User {
  uid:string;
  Name:string;
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})

export class SettingPage implements OnInit { 
  
  i:number=0;
  z:number=this.i+1;
  imgurl:string;
  imgUrl;
  pacid;
  title;
  updataForm: any;
  ownpackage =null;
  packagejoin;
  packageForm:FormGroup;
  loginUserName:string;
  array=[];
  //----
  photo:string;
  user: Observable<User>;

  imgurl$:Observable<string>;
  fileRef:string;
  userName:string;
  imgsrc$: Observable<string>;
  snapshot:Observable<any>;
  uploadPercent$:Observable<number>;
  uploadTask: AngularFireUploadTask;
  userRef:DocumentReference;

  constructor(private afAuth: AngularFireAuth, 
              private route: ActivatedRoute,
              public packDetail:PackageService,
              private alertCtrl: AlertController,
              private router: Router,
              private builder: FormBuilder,
              private storage: AngularFireStorage,
              private sanitizer: DomSanitizer
             ){
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

  addDetailsButtonClick(): void{
    (<FormArray>this.packageForm.get('detailsGroup')).push(this.addDetailsFormGroup()) 
  }

  removeDetailsButtonClick(detailsGroupIndex):void{
    (<FormArray>this.packageForm.get('detailsGroup')).removeAt(detailsGroupIndex)
  }

  get detailsArray():FormArray{
    return <FormArray> this.packageForm.get('detailsGroup');
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

  Deletepackage(ownpackageID,ownPackageTitle,context){
    var db = firebase.firestore();
    var dpack = db.collection('packages');
    var dorder = db.collection('order');
    var dattend =db.collection('attendStatus');
    var dpackScore = db.collection('packageScore');
    var dfavorite = db.collection('favorite');
    var dscoreStatus = db.collection('scoreStatus');

    dpack.doc(ownpackageID).delete();
    firebase.firestore().collection('order').where('packageId','==',ownpackageID).get().then(querySnapshot => {
      querySnapshot.forEach(data=>{
        console.log('order:'+data.id);
        dorder.doc(data.id).delete();
      })
    })
    dfavorite.where('package','array-contains',{context:context,packageId:ownpackageID,photo:this.ownpackage.detailsArray[0]['photo'],title:ownPackageTitle}).get().then(query=>{
      if(query.size==0) console.log('no');
      else{
        query.forEach(data=>{
          console.log(data.id,data.data())
          db.collection('favorite').doc(data.id).update({
            package: firebase.firestore.FieldValue.arrayRemove({context:context,packageId:ownpackageID,photo:this.ownpackage.detailsArray[0]['photo'],title:ownPackageTitle})
          })
        })
      }
    })
    firebase.firestore().collection('attendStatus').where('packageId','==',ownpackageID).get().then(querySnapshot => {
      querySnapshot.forEach(data=>{
        console.log('attendStatus:'+data.id);
         dattend.doc(data.id).delete();
      })
    })
    firebase.firestore().collection('packageScore').where('packageId','==',ownpackageID).get().then(querySnapshot => {
      querySnapshot.forEach(data=>{
        console.log('packageScore:'+data.id);
         dpackScore.doc(data.id).delete();
     })
    })
    firebase.firestore().collection('scoreStatus').where('packageId','==',ownpackageID).get().then(querySnapshot => {
      querySnapshot.forEach(data=>{
        console.log('scoreStatus:'+data.id);
         dscoreStatus.doc(data.id).delete();
     })
    })

    // dpack.doc(ownpackageID).delete();
    // dorder.doc(ownpackageID).delete().then(
    //   this.Sucess
    // );
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
      detailsArray:this.ownpackage.detailsArray,
    };
    this.packDetail.updatepackage(packageId, data)
      .then(
        this.Sucess
      );
    this.Sucess();
  }

  chooseFiles(i,s,event){
    console.log(i,s);
    const controlArray = <FormArray> this.packageForm.get('detailsGroup');
    const file:File=event.target.files[0];
    const filePath = `packages/${new Date().getTime()}_${file.name}`;
    const uploadTask = this.storage.upload(filePath,file);
    const ref = this.storage.ref(filePath);
  
    this.uploadPercent$ =uploadTask.percentageChanges();
    
    //預覽照片始
    let imgUrl = window.URL.createObjectURL(file);
    let sanitizerUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl); 
    this.imgUrl = sanitizerUrl;
    //預覽照片末

    uploadTask.then().then(()=>{
      this.imgsrc$=ref.getDownloadURL();
      this.imgsrc$.subscribe(path=>{
        this.imgurl=path;
        console.log("this.imgurl-1: " + this.imgurl);
        console.log("filePath: " + filePath);
        this.fileRef=filePath;
        console.log(this.fileRef);
        controlArray.controls[i].get('photo').patchValue(this.imgurl);
        controlArray.controls[i].get('photoRef').patchValue(this.fileRef);
        this.ownpackage.detailsArray[s]['photo']=this.imgurl;
        this.ownpackage.detailsArray[s]['photoRef']=this.fileRef;
        console.log(this.ownpackage.detailsArray);
      })
      console.log("this.imgurl-2: " + this.imgurl);
      console.log('all file upload sucess');
    
    })
    .catch((err)=>{
      console.log(err);
    });
        //this.meta$=this.uploadTask.snapshotChanges().pipe(map(d=>d.state)) //map 將一個訂閱可以得到的資料轉成另一筆資料
        
    
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
