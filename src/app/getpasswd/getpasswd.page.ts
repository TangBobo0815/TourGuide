import { Component , OnInit } from '@angular/core';
import { User } from "../../models/user";

import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-getpasswd',
  templateUrl: 'getpasswd.page.html',
  styleUrls: ['getpasswd.page.scss'],
})
export class GetpasswdPage implements OnInit {
  user = {} as User;
  getpassedForm:any;

  constructor(private auth: AuthService,
              private builder: FormBuilder,
              private router: Router,
              public alertCtrl: AlertController)
  {}

  ngOnInit() {
    this.buildForm();
  }

  resetPassword(){
    let form = this.getpassedForm.value;
    const data={
      email:form.email
    }
    this.auth.resetPassword(data).then((i)=>{
      if(i==0){
        this.resetemailSucess();
      }else{
        this.resetemailFail();
      }
    })
  }

  buildForm() {
    this.getpassedForm = this.builder.group({
      email: ['',
        [Validators.required, Validators.email]
      ]
      })
  }

  //---------------郵件傳送dialog
  async resetemailSucess(){
    const alert = await this.alertCtrl.create({
      header: '傳送成功!',
      message: '請至您的信箱確認',
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

  async resetemailFail(){
    const alert = await this.alertCtrl.create({
      header: '傳送失敗!',
      message: '請確認你是否確實有帳號',
      buttons: ['OK']
    });
    await alert.present();
  }
}
