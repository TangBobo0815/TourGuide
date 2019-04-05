import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MatButtonModule, MatStepperModule } from '@angular/material';

const routes: Routes =[
  {
    path: '',
    component: SignupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatStepperModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {
  
}
