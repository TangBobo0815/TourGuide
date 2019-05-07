import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PackagePage } from './package.page';
import { PackagesComponent } from '../packages/packages.component';

const routes: Routes = [
  {
    path: '',
    component: PackagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PackagePage,PackagesComponent]
})
export class PackagePageModule {}
