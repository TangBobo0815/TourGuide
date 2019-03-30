import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

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

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar) {this.initializeApp(); }

    initializeApp() {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }

  ngOnInit() {
  }

}
