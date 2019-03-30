import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { User } from "../../models/user";
import { Router } from '@angular/router';
import { AuthService } from '.././services/auth.service';
import * as firebase from 'firebase';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  user = {} as User;
  loginForm:any;

  constructor(private auth: AuthService,
              private builder: FormBuilder,
              private router: Router,
              public alertCtrl: AlertController) {}

  ngOnInit() {
    this.buildForm();
  }

  login(){
    let form = this.loginForm.value;
    const data ={
      email:form.email,
      password:form.password
    };
    this.auth.emailLogin(data).then(()=>{
      this.loginForm.reset();
    });
  }

  resetPassword(){
    let form = this.loginForm.value;
    const data={
      email:form.email
    }
    this.auth.resetPassword(data).then(()=>{
    })
  }

  buildForm() {
    this.loginForm = this.builder.group({
      email: ['',
        [Validators.required, Validators.email]
      ],
        password: new FormControl('',
          [Validators.required,
          ]
        ),
      })
  }

}
