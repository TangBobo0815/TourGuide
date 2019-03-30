import { Component, OnInit } from '@angular/core';
//--------------------------------
import { User } from "../../models/user";
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-signup1',
  templateUrl: 'signup1.page.html',
  styleUrls: ['signup1.page.scss'],
})
export class Signup1Page implements OnInit {
  user ={} as User;
  tourForm:any;

  constructor(
    private auth: AuthService,
    private router : Router,
    private builder: FormBuilder,
  )
  { }

  
  tourUp() {
    // let form = this.tourForm.value;
    // const data = {
    //   touron:form.touron,
    // };
    // this.auth.tourUp(data).then(()=>{
    //   console.log('成功')
    //   this.router.navigate(['/signup2']);
    //   this.tourForm.reset();
    // });
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.tourForm = this.builder.group({
      tourGroup: new FormGroup({
        touron: new FormControl('',
          [Validators.required]
        )
      })
    });
    // reset messages
  }

}
