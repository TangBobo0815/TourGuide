import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  
  showSplash = true;
  public appPages = [
    {
      title: '首頁',
      url: '/home',
      icon: 'home'
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
      title: '行事曆',
      url: '/calendar',
      icon: 'calendar'
    },
    {
      title: '推廣通知',
      url: '/notifications',
      icon: 'notifications'
    },
    {
      title: 'login',
      url: '/login',
      icon: 'log-in'
    },
    {
      title: 'setting',
      url: '/setting',
      icon: 'settings'
    }

  ];
  
  location:string='taiwan.taipei-City';
  username:string='user123';
  ngOnInit() {}

}
