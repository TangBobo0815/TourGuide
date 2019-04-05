import { Component , OnInit } from '@angular/core';
import { User } from "../../models/user";

import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-getpasswd',
  templateUrl: 'getpasswd.page.html',
  styleUrls: ['getpasswd.page.scss'],
})
export class GetpasswdPage implements OnInit {
  user = {} as User;
  getpassedForm:any;

  constructor(private auth: AuthService,
              private builder: FormBuilder)
  {}

  ngOnInit() {
    this.buildForm();
  }

  resetPassword(){
    let form = this.getpassedForm.value;
    const data={
      email:form.email
    }
    this.auth.resetPassword(data).then(()=>{
    })
  }

  buildForm() {
    this.getpassedForm = this.builder.group({
      email: ['',
        [Validators.required, Validators.email]
      ]
      })
  }
}
