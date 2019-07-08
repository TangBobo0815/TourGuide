import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PasswordValidator } from '../../_validators/password.validator';
import { IdValidator } from '../../_validators/id.validator';
import { Router } from '@angular/router';
import { AngularFireStorage , AngularFireStorageReference , AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { AlertController , ToastController } from '@ionic/angular';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { identifierModuleUrl } from '@angular/compiler';
import * as firebase from 'firebase';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})

export class SignupPage implements OnInit {

  show=false;
  user ={} as User;
  firstForm:any;
  secondForm:any;
  //----------
  touron:boolean;
  disabled:boolean=false;
  //-----------
  progress=0;
  imgurl:string;
  fileRef:string;
  imgsrc$: Observable<string>;
  snapshot:Observable<any>;
  meta$:Observable<any>;
  uploadPercent$:Observable<number>;
  uploadTask: AngularFireUploadTask;
  uploadState:Observable<string>;
  //------------
  windowRef:any;
  verificationCode:string;

  formErrors = {
    'email': '',
    'Name': '',
    'password': '',
    'confirmPassword': '',
    'matchPassword': '',
    'gender':'',
    'date':'',
    'phone':'',
    'address':'',
    'userid':''
  };

  validatorMessages = {
    'email': {
      'required': '必填欄位',
      'email': '請照電子郵件格式填入'
      /*'pattern':'電子郵件格式不符'*/
     },
     'Name': {
       'required': '必填欄位',
       'minlength': '長度至少為2',
       'maxlength': '長度最多為10'
     },
     'gender':{
       'required': '必填欄位',
     },
     'phone': {
      'required': '必填欄位',
      'pattern':'只能輸入數字',
      'minlength': '長度至少為10',
      'maxlength': '長度最多為10'
     },
     'date':{
      'required': '必填欄位'
     },
     'address': {
      'required': '必填欄位',
     },
     'userImg': {
      'required': '必填欄位',
     },
     'userid':{
      'required': '必填欄位',
      'pattern':'第一個字母需大寫',
      'minlength': '長度至少為10',
      'maxlength': '長度最多為10',
     },
     'password': {
       'required': '必填欄位',
       'pattern': '至少須包含一字母一數字',
       'minlength': '長度至少為6',
       'maxlength': '長度最多為15'
     },
     'confirmPassword': {
       'required': '必填欄位',
     },
     'matchPassword': '密碼不相符',
  }

  
  constructor(public navCtrl:NavController,
              private builder: FormBuilder,
              private auth: AuthService,
              private router : Router,
              //----------
              private storage: AngularFireStorage,
              private toast: ToastController,
              private alertCtrl:AlertController,
              private win:WindowService
              )
  { }

  ngOnInit() {
    this.buildForm();
  }
  
  //toggle開關
  notify(){
    this.disabled=!this.disabled
  }

  infoSignUp() {
    let form = this.firstForm.value;
    const data = {
      email: form.email,
      password: form.passwordGroup.password,
      Name: form.Name,
      gender:form.gender,
      date:form.date,
      phone:form.phone,
      address:form.address,
      userImg:form.userImg,
      userImgRef:this.fileRef
    };
    this.imgsrc$.subscribe(path=> data.userImg=path);
    this.auth.signUp(data).then(data=>{
      if(data== 0){
        this.register1Sucess();
        console.log(data.userImg);
      }else if (data==-9){
        this.alreadyFail();
      }else if (data==-8){
        this.useremailFail();
        this.firstForm.reset();
      }else{
        this.Fail();
        this.firstForm.reset();
      }
    });
  }

  imgSignUp(user) {
    let form = this.secondForm.value;

    const data = {
      touron:form.touron,
      // imgsrc:this.imgurl,
      // fileRef:this.fileRef ,
      // imgsrc:null,
      // fileRef:null,
      // userid:form.userImgInfoGroup.userid,
    };
    if (data.touron==false){
      // data.imgsrc =null;
      // data.fileRef = null;
      // data.userid=null;
    }
    else{
      //this.imgsrc$.subscribe(path=> data.imgsrc=path);
    }
    this.auth.imgsignUp(user,data).then(data=>{
      if(data== 0){
        this.register2Sucess();
      }
    });
    console.log(data);
  }

  buildForm() {
    this.firstForm = this.builder.group({
      email: ['',
        [Validators.required, Validators.email]
      ],
      passwordGroup: new FormGroup({
        password: new FormControl('',
          [Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(15)]
        ),
        confirmPassword: new FormControl('',
          [Validators.required]
        )
      },
      { validators: PasswordValidator.MatchPassword }
      ),
      Name: ['',
        [Validators.required,Validators.minLength(2), Validators.maxLength(10)]
      ],
      gender:['',
        [Validators.required]
      ],
      date:['',
        [Validators.required]
      ],
      phone:['',
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^([Z0-9]+)')]
      ],
      address:['',
        [Validators.required]
      ],
      userImg:['',
        [Validators.required]
      ]
    });

    this.secondForm = this.builder.group({
      touron:['',
        [Validators.required]
      ],
      imgsrc:['',
        [Validators.required],
      ],
      userImgInfoGroup: new FormGroup({
        imgsrc: new FormControl('',
          [Validators.required]
        ),
        userid: new FormControl('',
          [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern('^([ZA-Z][Z1-2][Z0-9]+)$')
          ]
        )
      },
      )
     
    });
    
    this.firstForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.secondForm.valueChanges.subscribe(data=> this.onValueChanged(data));
    // reset messages
    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.firstForm || !this.secondForm) { return; }
    const form1 = this.firstForm;
    const form2 = this.secondForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      switch (field) {
        case 'email':
        case 'Name':
          var control = form1.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;
        case 'date':
        case 'password':
        case 'confirmPassword':
          var group = form1.get('passwordGroup');
          var control = group.get(field);

          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            } 
          }
          break;
        case 'matchPassword':
          var group = form1.get('passwordGroup');
          if (group.get('password').dirty && group.get('confirmPassword').dirty
            && group.errors && group.errors.matchPassword) {
            this.formErrors[field] = this.validatorMessages[field];
          }
          break;
        case 'phone':
          var control = form1.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;
        case 'address':
          var control = form1.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;
        case 'userid':
          var group = form2.get('userImgInfoGroup');
          var control = group.get(field);
          
          if (control && control.dirty && !control.valid) {            
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            } 
          }
      }    
    }
  }

  chooseuserImg(event){
    const file:File=event.target.files[0];
    const filePath = `profileImg/_${file.name}`;
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
      })
      console.log("this.imgurl-2: " + this.imgurl);
      this.meta$=ref.updateMetatdata({customMetadata:{cool:'very cool'}});
      console.log('all file upload sucess');
    })
    .catch((err)=>{
      console.log(err);
    });
    //this.meta$=this.uploadTask.snapshotChanges().pipe(map(d=>d.state)) //map 將一個訂閱可以得到的資料轉成另一筆資料  
  }

  chooseFiles(event){
    const file:File=event.target.files[0];
    const filePath = `users/${new Date().getTime()}_${file.name}`;
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
      })
      console.log("this.imgurl-2: " + this.imgurl);
      this.meta$=ref.updateMetatdata({customMetadata:{cool:'very cool'}});
      console.log('all file upload sucess');
    })
    .catch((err)=>{
      console.log(err);
    });
    //this.meta$=this.uploadTask.snapshotChanges().pipe(map(d=>d.state)) //map 將一個訂閱可以得到的資料轉成另一筆資料  
  }

  
  //------------------------------------
  //---------------註冊成功toast

  async register1Sucess(){
    const toast = await this.toast.create({
      message: '第一階段註冊成功',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  async register2Sucess(){
    const toast = await this.toast.create({
      message: '第二階段註冊成功',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  //---------------註冊失敗alert

  async alreadyFail(){
    const alert = await this.alertCtrl.create({
      header: '郵件地址已存在',
      message: '請使用帳號密碼登入',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  async useremailFail(){
    const alert = await this.alertCtrl.create({
      header: '郵件輸入有誤',
      message: '請回到上一步再試一次',
      buttons: [
        {
          text: '確定'
        }
      ]
    });

    await alert.present();
  }

  async Fail(){
    const alert = await this.alertCtrl.create({
      header: '錯誤',
      message: '請回到上一步再試一次',
      buttons: [
        {
          text: '確定'
        }
      ]
    });
    
    await alert.present();
  }
}


