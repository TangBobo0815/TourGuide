import { Component, OnInit} from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router } from '@angular/router';


import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDateService } from '../services/user-date.service';
import { PackageService } from '../services/package.service';
import { AuthService } from '../services/auth.service';

import * as firebase from 'firebase';

import { Package } from '../../models/package'
import { getCurrentView } from '@angular/core/src/render3';
import { identifierModuleUrl, unescapeIdentifier } from '@angular/compiler';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  packages:Package[];
  test=[];

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  showSplash = true;
  public appPages = [
    {
      title: '首頁',
      url: 'home',
      icon: 'home'
    },
    {
      title: '個人資訊',
      url: 'profile', 
      icon: 'contact'
    },
    {
      title: '開團',
      url: 'package',
      icon: 'contacts'
    },
    {
      title: '訂單管理',
      url: 'order',
      icon: 'clipboard'
    },
    {
      title: '使用說明',
      url: 'setting',
      icon: 'information-circle-outline'
    },
    {
      title: '升級VIP',
      url: 'vip',
      icon: 'star-outline'
    }
  ];
  constructor(public popoverController: PopoverController , 
              private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private authData:UserDateService,
              private packDetail:PackageService,
              private auth: AuthService,
              private router: Router,
              ) {
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
      this.getreload();
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

  ionViewWillEnter(){
    this.packDetail.getPackages().subscribe(packages=>{
      console.log(packages);
      this.packages=packages;
    })
  }

 getreload() {
  this.packDetail.getPackages().subscribe(packages=>{
    console.log(packages);
    this.packages=packages;})
}

getItem(Item)
{
  if(Item == "profile")
  {
    this.router.navigate(['/profile'])
  }
  else if (Item == "home") 
  {
    this.router.navigate(['/home'])
  } 
  else if(Item == "package")
  {
    this.router.navigate(['/package'])  
  }
  else if(Item == "order")
  {
    this.router.navigate(['/order'])  
  }
  else if(Item == "setting")
  {
    this.router.navigate(['/setting'])  
  }
  else if(Item == "vip")
  {
    this.router.navigate(['/vip'])  
  }
}


  get(id){
    var db= firebase.firestore();   
    var collection = db.collection('packages')
    
    // var ref = db.collection('packages').where("title","==","title");
    
  
    collection.doc(id).get().then(doc => {
      console.log(doc.id, doc.data());
      //this.test.push(doc.data());
      this.packDetail.getPackagesData(doc.id);
    }).then(i=>this.router.navigate(['/join']))
    

  }
}
