import { Component, OnInit} from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router, NavigationExtras } from '@angular/router';


import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDateService } from '../services/user-date.service';
import { PackageService } from '../services/package.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Package } from '../../models/package'
import { getCurrentView } from '@angular/core/src/render3';
import { identifierModuleUrl, unescapeIdentifier } from '@angular/compiler';
import { FirestoreSettingsToken } from 'angularfire2/firestore';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  packages:Package[];
  show=[];
  test=[];
  userName:string;
  isItemAvailable = false; // initialize the items with false
  unItemAvailable = true;
  join:any;
  i:number=0;

  public searchInput='';

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
              
   popovers() {
    this.router.navigate(['/notifications'])
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.getreload();
      this.ngOnInit();
    //  this.i++;
    //  console.log(this.i);
      event.target.complete();
    }, 2000);
  }

  signOut(){
    this.auth.signOut();
  }

  ngOnInit(){
    // var db= firebase.firestore();   
    // var collection = db.collection('packages');

    this.packDetail.getPackages().subscribe(packages=>{
      console.log(packages);
      this.packages=packages;
      // this.packages.forEach(value=>{
      //   console.log(value);
      //   var userId=value.userId;
      //   console.log(userId);
      //   firebase.firestore().collection('users').doc(userId).get().then(doc=>{
      //     console.log(doc.data());
      //     this.userName=doc.data().Name;
      //     console.log('userName:'+this.userName);
      //   })
      // })
    })
  }


  getreload() {
    this.packDetail.getPackages().subscribe(packages=>{
      console.log(packages);
      this.packages=packages;
      this.test.push(this.packages);
    })
  }

  getUser(){

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


  get(uid){
  /*  var db= firebase.firestore();   
    var collection = db.collection('packages')
    
    // var ref = db.collection('packages').where("title","==","title");
    
  
    collection.doc(id).get().then(doc => {
      console.log(doc.id, doc.data());
      //this.test.push(doc.data());
      this.packDetail.getPackagesData(doc.id);
    }).then(i=>this.router.navigate(['/join']))*/
    console.log(uid);
    this.router.navigate(['/join/'+uid])
  }


getDetail(uid){

  console.log(uid);
  this.router.navigate(['/join/'+uid])

}

getItems(ev: any) {
  // Reset items back to all of the items
 this.packDetail.getPackages().subscribe(packages=>{
    console.log(packages);
    this.packages=packages;
  })
  // set val to the value of the searchbar
  const val = ev.target.value.toLowerCase();
  if (val && val.trim() != '') {
    this.packages = this.packages.filter(pak => {
      return ( pak=> pak.toLowerCase().indexOf(val) > -1);
    })


  }

  /*const db = firebase.firestore();
  db.settings({timestampsInSnapshots : true});
  const col = db.collection('packages');
  const query = col.where('title', '>=',ev);
  
  query.get().then(snapshot =>{
    snapshot.docs.forEach(doc => {
      console.log(doc.id,doc.data())
    })
  })*/

}


}
