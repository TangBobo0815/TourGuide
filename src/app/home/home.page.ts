import { Component} from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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

  constructor(public popoverController: PopoverController , 
              private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
                this.initializeApp();
              }
            
              initializeApp() {
                this.platform.ready().then(() => {
                  this.statusBar.styleDefault();
                  this.splashScreen.hide();
                });
              }

  async popovers(ev: any) {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  
}
