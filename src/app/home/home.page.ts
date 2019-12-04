import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router, } from '@angular/router';


import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDateService } from '../services/user-date.service';
import { PackageService } from '../services/package.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Package } from '../../models/package'
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from "../../models/user";
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  packages: Package[];
  user: Observable<User>;
  favoritePack=[];
  show = [];
  test = [];
  packagej=null;
  Array3=[];
  userName: string;
  isItemAvailable = false; // initialize the items with false
  unItemAvailable = true;
  join: any;
  i: number = 0;
  a: number = 0;
  check=false;
  have;
  loginUserName: string;

  Date = new Date();
  year = this.Date.getFullYear().toString();
  month = (this.Date.getMonth() + 1).toString();
  date = this.Date.getDate().toString();

  Today = this.year + '-' + this.month + '-' + this.date;
  packageId: string;

  public searchInput = '';

  segmentChanged(ev: any) {

  }


  showSplash = true;
  public appPages = [
    {
      title: '首頁',
      url: 'home',
      icon: 'home'
    },
    {
      title: '個人檔案',
      url: 'profile',
      icon: 'contact'
    },
    {
      title: '開團',
      url: 'package',
      icon: 'contacts'
    },
    {
      title: '入團管理',
      url: 'order',
      icon: 'clipboard'
    },
    {
      title: '出席點名',
      url: 'attend',
      icon: 'checkbox-outline'
    },
    {
      title: '收藏',
      url: 'favorite',
      icon: 'heart'
    }
  ];
  constructor(public popoverController: PopoverController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authData: UserDateService,
    private packDetail: PackageService,
    private auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private backgroundMode: BackgroundMode,
    private toast: ToastController,
    public loadingController: LoadingController,
    private afAuth: AngularFireAuth
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }))
    this.initializeApp();
    this.presentLoading();
    this.packDetail.getPackages().subscribe(packages => {
      this.packagej = packages;
    })
    this.backgroundMode.enable();
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc => {
      this.loginUserName = doc.data().Name;
    })
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
    setTimeout(() => {
      this.getreload();
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  signOut() {
    this.auth.signOut();
  }

  ngOnInit() {
  }


  getreload() {
    this.packDetail.getPackages().subscribe(packages => {
      this.packagej = packages;
    })
  }

  getItem(Item) {
    if (Item == "profile") {
      this.router.navigate(['/profile'])
    }
    else if (Item == "home") {
      this.router.navigate(['/home'])
    }
    else if (Item == "package") {
      this.router.navigate(['/package'])
    }
    else if (Item == "order") {
      this.router.navigate(['/order'])
    }
    else if (Item == "favorite") {
      this.router.navigate(['/favorite'])
    }
    else if (Item == "vip") {
      this.router.navigate(['/vip'])
    }
    else if (Item == "attend") {
      this.router.navigate(['/attend'])
    }
  }


  get(uid) {
    this.router.navigate(['/join/' + uid])
  }


  getDetail(uid) {
    this.router.navigate(['/join/' + uid])
  }

  getItems(ev: any) {
    this.packDetail.getPackages().subscribe(packages => {
      this.packages = packages;
    })
    const val = ev.target.value.toLowerCase();
    if (val && val.trim() != '') {
      this.packages = this.packages.filter(pak => {
        return (pak => pak.toLowerCase().indexOf(val) > -1);
      })
    }
  }

  favorite(id,title,context,phonearray){
    if(this.check==false){
      let uid = this.db.createId();
      this.Array3 = phonearray[0].photo;
      const data={
        userId:this.db.doc(`users/${this.afAuth.auth.currentUser.uid}`).ref,
        userName:this.loginUserName,
        package:[{
          packageId:id,
          title:title,
          context:context,
          photo:this.Array3
        }],
      }
  
      firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot => {
        if (querySnapshot.size==0) {
          this.db.collection('favorite').doc(uid).set(data)
          .then(i=>{
            this.favoriteSuccess()
          })
        }else{
          querySnapshot.forEach(doc => {
            this.db.collection('favorite').doc(doc.id).update({
              package: firebase.firestore.FieldValue.arrayUnion({packageId:id,title,context,photo:this.Array3})
            }).then(i=>{
              this.favoriteSuccess()
            })
          })
  
        }
      })
      this.check = !this.check;
    }else{
      firebase.firestore().collection('favorite').where('userName','==',this.loginUserName).get().then(querySnapshot=>{ 
        querySnapshot.forEach(doc => {
        if(querySnapshot.size==0){
        }else{
          this.db.collection('favorite').doc(doc.id).update({
            package:firebase.firestore.FieldValue.arrayRemove({context:context,packageId:id,photo:this.packagej.detailsArray[0]['photo'],title:title})
          }).then(i=>{
              this.delSucess()
          }) 
        }
          this.check = !this.check;
         })
         
      })
    }
    
  }
  
  async delSucess(){
    const toast = await this.toast.create({
      message: '已刪除收藏!',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  async favoriteSuccess(){
    const toast = await this.toast.create({
      message: '已加入收藏!',
      showCloseButton: true,
      duration: 3000,
      position: 'bottom',
      closeButtonText: 'Ok'
    })
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '載入行程中...',
      duration: 4000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  

}
