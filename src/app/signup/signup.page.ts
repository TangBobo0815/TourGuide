import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth'
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PasswordValidator } from '../../_validators/password.validator';
import { Router } from '@angular/router';
import { AngularFireStorageModule, AngularFireStorage , AngularFireStorageReference , AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
//-----------------
import { Pedometer } from '@ionic-native/pedometer/ngx';


@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})

export class SignupPage implements OnInit {
 
  user ={} as User;
  registerForm:any;
  touron:boolean;
  //-----------
  selectedFiles:FileList;
  uploadTask: AngularFireUploadTask;

  imgsrc: Observable<string>;
  snapshot:Observable<any>;
  
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
    // 'touron':'',
    // 'imgsrc':'',
  };

  validatorMessages = {
    'email': {
      'required': '必填欄位',
      'email': '請照電子郵件格式填入'
      /*'pattern':'電子郵件格式不符'*/
     },
     'Name': {
       'required': '必填欄位',
       'minlength': '長度至少為3',
       'maxlength': '長度最多為32'
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
     //'touron': {},
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

  
  constructor(private afAuth:AngularFireAuth,
              public navCtrl:NavController,
              private builder: FormBuilder,
              private auth: AuthService,
              private router : Router,
              //----------
              private storage: AngularFireStorage
              )
  { }

  ngOnInit() {
    this.buildForm();
  }
TextTrackCueList
  signUp() {
    let form = this.registerForm.value;
    const data = {
      email: form.email,
      password: form.passwordGroup.password,
      Name: form.Name,
      gender:form.gender,
      date:form.date,
      phone:form.phone,
      address:form.address,
      // touron:form.touron,
      // imgsrc:''
    };
    //this.imgsrc.subscribe(path=> data.imgsrc=path);
    this.auth.signUp(data).then(()=>{
      this.registerForm.reset();
    });
  }

  buildForm() {
    this.registerForm = this.builder.group({
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
        [Validators.required,Validators.minLength(3), Validators.maxLength(32)]
      ],
      gender:['',
        [Validators.required]
      ],
      date:['',
        [Validators.required]
      ],
      phone:['',
        [Validators.required,Validators.minLength(10),Validators.maxLength(10)]
      ],
      address:['',
        [Validators.required]
      ],
      // touron:['',
      //   [Validators.required]
      // ],
      // img:new FormGroup({
      //   imgsrc:new FormControl('',
      //   [Validators.required])
      // })
      
    });
    
    this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    // reset messages
    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      switch (field) {
        case 'email':
        case 'Name':
          var control = form.get(field);
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
          var group = form.get('passwordGroup');
          var control = group.get(field);

          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            } 
          }
          break;
        case 'matchPassword':
          var group = form.get('passwordGroup');
          if (group.get('password').dirty && group.get('confirmPassword').dirty
            && group.errors && group.errors.matchPassword) {
            this.formErrors[field] = this.validatorMessages[field];
          }
          break;
        case 'phone':
          var control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;
        case 'address':
          var control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validatorMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
          break;

        // case 'touron':
        //   var control = form.get(field);
        //   if(this.touron==true){
        //     const messages = this.validatorMessages[field];
        //   }else{
        //     const messages = this.validatorMessages[field];
        //   }
        //   break;          
      }
    }
  }

  
  //------------------------------------

}


