  
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  show=false;
  birthday:string="1999/05/10"
  email:string="aaa@yahoo.com.tw";

  constructor() { }

  ngOnInit() {
  }
  
}