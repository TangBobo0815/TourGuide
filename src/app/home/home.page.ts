import { Component} from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDateService } from '../services/user-date.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
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
  constructor(public popoverController: PopoverController , 
              private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private auth:UserDateService) {
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
