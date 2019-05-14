  
import { Component, OnInit } from '@angular/core';

import { user, UserDateService } from '../services/user-date.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  show=false;
  birthday:string="1999/05/10"
  email:string="aaa@yahoo.com.tw";

  users: user[];

  constructor(private userDareService:UserDateService) { }

  ngOnInit() {
    this.userDareService.getusers().subscribe(res =>{
      this.users=res;
    })
  }
  
}