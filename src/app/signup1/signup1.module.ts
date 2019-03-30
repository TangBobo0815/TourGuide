import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';

import { Signup1Page } from './signup1.page';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';

const routes: Routes = [
  {
    path: '',
    component: Signup1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Signup1Page]
})
export class Signup1PageModule {
  
}
