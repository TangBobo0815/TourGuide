import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
//--------------

import { Observable, of, from } from 'rxjs';
import { User } from "../../models/user";
import { AlertController , ToastController } from '@ionic/angular';
//-----------------
@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
})
export class JoinPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    public alertCtrl :AlertController,
    private toast: ToastController,
  ) { }

  ngOnInit() {
  }


}
