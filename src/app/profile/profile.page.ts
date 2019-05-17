import { Component, OnInit } from '@angular/core';
import { UserDateService } from '../services/user-date.service';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ReplaySubject } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, Reference  } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{

  constructor(
    private authData:UserDateService,
    private storage:AngularFireStorage,
    private db : AngularFirestore,
    private auth:AuthService) {
  }

  ngOnInit() {
  }
  
  

}