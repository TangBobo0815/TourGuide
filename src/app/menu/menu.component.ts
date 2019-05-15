import { Component, OnInit } from '@angular/core';
import { UserDateService } from '../services/user-date.service'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private auth:UserDateService) {

  }
  
  showSplash = true;
  public appPages = [
    {
      title: '首頁',
      url: '/home',
      icon: 'home'
    },
    {
      title: '個人資訊',
      url: '/profile',
      icon: 'contact'
    },
    {
      title: '我的足跡',
      url: '/map',
      icon: 'map'
    },
    {
      title: '上傳行程',
      url: '/package',
      icon: 'clipboard'
    },
    {
      title: '自助規劃',
      url: '/notifications',
      icon: 'today'
    },
    {
      title: '備忘錄',
      url: '/notifications',
      icon: 'checkmark-circle-outline'
    },
    {
      title: '使用說明',
      url: '/setting',
      icon: 'information-circle-outline'
    }

  ];
  
  location:string='taiwan.taipei-City';
  username:string='user123';
  ngOnInit() {}

}
