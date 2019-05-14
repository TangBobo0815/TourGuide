import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection  } from 'angularfire2/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable,of} from 'rxjs';

import { AngularFireStorage , AngularFireUploadTask } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

import { User } from "../../models/user";
import { stringify } from 'querystring';


@Component({
  selector: 'package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
})
export class PackagePage implements OnInit {
  
  packageForm:FormGroup;
  imgurl$:Observable<string>;
  imgurl:string;
  fileRef:string;
  imgsrc$: Observable<string>;
  snapshot:Observable<any>;
  uploadPercent$:Observable<number>;
  uploadTask: AngularFireUploadTask;

  user: Observable<User>;


  constructor(private builder: FormBuilder,
    private router: Router,
    private db : AngularFirestore,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private storage: AngularFireStorage,
    private afAuth:AngularFireAuth,)
  {
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

  ngOnInit() { 
    this.buildForm();
  }

  packageUp(){
    let form = this.packageForm.value;
    var array = [];
    //const budgets = this.detailsArray.map((obj)=> {return Object.assign({}, obj)});

    // for(let i=0;i<=(this.detailsArray.length)-1;i++){
    //   var obj=[];
    //   let detail=form.detailsGroup;

    //   this.imgsrc$.subscribe(path=>detail[i]['image']=path);
    //   console.log(detail[i]['image']);
    //   detail[i]['fileRef']=this.fileRef;
    //   console.log(detail[i]['fileRef'])
    //   array.push(detail[i].controls);
    // }
    // console.log(array); 
    // console.log(this.detailsArray.length);

    const data={
      title:form.title,
      place:form.place,
      month:form.month,
      days:form.days,
      price:form.price,
      detailsArray:form.detailsGroup
    }
    this.db.collection('packages').add(data);
    console.log(data);
    
    this.Sucess();

  }

  // public setFormArrayValue() {
  //   const controlArray = <FormArray> this.packageForm.get('detailsGroup');
  //   controlArray.controls[0].get('image').setValue(this.imgsrc$.subscribe(path=> imgsrc=path));
  //   controlArray.controls[0].get('role').setValue(2);
  // }


  buildForm() {
    this.packageForm = this.builder.group({
      title: ['',
        [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)]
      ],
      place:['基隆市',
        [Validators.required]
      ],
      month:['1',
        [Validators.required]
      ],
      days:['1',
        [Validators.required]
      ],
      price:['',
       [Validators.required,Validators.pattern('^([Z0-9]+)')]
      ],
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
      image:new FormControl(this.imgurl || null),
      context:new FormControl('',
      [Validators.required,
      Validators.minLength(20), 
      Validators.maxLength(500),
      ]),
      fileRef:new FormControl('')
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

  async Sucess(){
    const toast = await this.toast.create({
      message: '上傳成功',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok'
    })
    toast.present();
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
      case 'context':
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

  chooseFiles(i,event){
    const controlArray = <FormArray> this.packageForm.get('detailsGroup');
    const file:File=event.target.files[0];
    const filePath = `packages/${new Date().getTime()}_${file.name}`;
    const uploadTask = this.storage.upload(filePath,file);
    const ref = this.storage.ref(filePath);
  
    this.uploadPercent$ =uploadTask.percentageChanges();
    
    uploadTask.then().then(()=>{
      this.imgsrc$=ref.getDownloadURL();
      this.imgsrc$.subscribe(path=>{
        this.imgurl=path;
        console.log("this.imgurl-1: " + this.imgurl);
        console.log("filePath: " + filePath);
        this.fileRef=filePath;
        console.log(this.fileRef)
        controlArray.controls[i].get('image').patchValue({image:this.imgurl});
        controlArray.controls[i].get('fileRef').patchValue({fileRef:this.fileRef});
      })
      console.log("this.imgurl-2: " + this.imgurl);
      console.log('all file upload sucess');
    })
    .catch((err)=>{
      console.log(err);
    });
        //this.meta$=this.uploadTask.snapshotChanges().pipe(map(d=>d.state)) //map 將一個訂閱可以得到的資料轉成另一筆資料  
  }

}

