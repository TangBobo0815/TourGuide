import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  packages: Package[];
  user: Observable<User>;
  show = [];
  test = [];
  userName: string;
  isItemAvailable = false; // initialize the items with false
  unItemAvailable = true;
  join: any;
  i: number = 0;
  a: number = 0;
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
      title: '訂單管理',
      url: 'order',
      icon: 'clipboard'
    },
    {
      title: '收藏',
      url: 'favorite',
      icon: 'heart'
    },
    // {
    //   title: '',
    //   url: 'setting',
    //   icon: 'information-circle-outline'
    // },
    // {
    //   title: '升級VIP',
    //   url: 'vip',
    //   icon: 'star-outline'
    // }
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
    this.backgroundMode.enable();
    firebase.firestore().collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(doc => {
      this.loginUserName = doc.data().Name;
    }).then(() => {
      firebase.firestore().collection('packages').where('startDate', '==', this.Today).get().then(querySnapshot => {
        querySnapshot.forEach(docx => {
          this.packageId = docx.data().packageId;
          this.userName = docx.data().userName;

          firebase.firestore().collection('attendStatus').where('packageId', '==', docx.data().packageId).get().then(querySnapshot => {
            if (querySnapshot.size == 0) {
              this.a = -1;
            } else {
              this.a = 0;
            }
            querySnapshot.forEach(doc => {
            })

            if (this.loginUserName == docx.data().userName && querySnapshot.size == 0) {
              this.router.navigate(['/attend/' + this.packageId])
            }
          })
        })

      })



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
    this.packDetail.getPackages().subscribe(packages => {
      this.packages = packages;
    })
  }


  getreload() {
    this.packDetail.getPackages().subscribe(packages => {
      this.packages = packages;
      this.test.push(this.packages);
    })
  }

  getUser() {

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
  }


  get(uid) {
    console.log(uid);
    this.router.navigate(['/join/' + uid])
  }


  getDetail(uid) {

    console.log(uid);
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


}
