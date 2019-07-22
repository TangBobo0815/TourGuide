import { Component, OnInit} from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDateService } from '../services/user-date.service';
import { PackageService } from '../services/package.service';
import { AuthService } from '../services/auth.service';

import { Package } from '../../models/package'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  packages:Package[];

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
      title: '開團',
      url: '/package',
      icon: 'contacts'
    },
    {
      title: '訂單管理',
      url: '/order',
      icon: 'clipboard'
    },
    {
      title: '使用說明',
      url: '/setting',
      icon: 'information-circle-outline'
    },
    {
      title: '升級VIP',
      url: '/vip',
      icon: 'star-outline'
    }
  ];
  constructor(public popoverController: PopoverController , 
              private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private authData:UserDateService,
              private packDetail:PackageService,
              private auth: AuthService,) {
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

  signOut(){
    this.auth.signOut();
  }

  ngOnInit(){
    this.packDetail.getPackages().subscribe(packages=>{
      console.log(packages);
      this.packages=packages;
    })
  }
}
